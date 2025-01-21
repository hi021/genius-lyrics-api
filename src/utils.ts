import fetch from "cross-fetch";
import { load } from "cheerio";

export const API_SEARCH = "https://api.genius.com/search?q=";
export const API_SONG = "https://api.genius.com/songs/";

export const validateOptions = (options: Options) => {
	if (!options.apiKey) throw new TypeError("No API key was provided");
	if (!options.query) throw new TypeError("No search query was provided");
};

// removes feat./ft. and content between () and [], flattens whitespace (I don't use this)
export const queryOptimize = (query: string) => {
	return query
		.toLowerCase()
		.replace(/ *\([^)]*\) */g, " ")
		.replace(/ *\[[^\]]*\]/, "")
		.replace(/feat\.|ft\./g, "")
		.replace(/\s+/g, " ")
		.trim();
};

// extracts lyrics from the song's genius page (e.g. https://genius.com/Sia-chandelier-lyrics)
export async function extractLyrics(url: string) {
	try {
		const result = await fetch(url);
		const resultTxt = await result.text();
		const $ = load(resultTxt);

        let lyrics = "";
        $("div[data-lyrics-container]").each((_, elem) => {
            if(!elem) return false;

            const snippet = $(elem)
              .html()
              .replace(/<br\s*\/?>/g, "\n")
              .replace(/<[^>]+>/g, "");

            lyrics += snippet.trim() + "\n\n";
          });

		return lyrics ? lyrics.trim() : null;
	} catch (e) {
        console.error(`Failed to scrape lyrics for ${url}:`, e);
		return null;
	}
}

/////
//  TYPES
/////
export interface Options {
	readonly apiKey: string;        // Genius' API key (https://docs.genius.com)
	query: string;                  // search query (usually artist + title)
	optimizeQuery?: boolean;        // whether to run optimizeQuery() (no clue if it actually helps :d)
}
export type SongOptions = Options & { showLyrics?: boolean };
export type SongSearchOptions = Options & { maxResults?: number /* defaults to Infinity */ };

// song data as parsed in parseSongInfo()
export interface Song {
	id: number;
	artist: string;                 // primary_artist.name OR artist_names if null
	title: string;                  // title_with_featured
	albumName: string;              // album.name
	url: string;                    // full URL to the song's genius page
	releaseDate?: string;           // release date in Month DD, YYYY format (e.g. August 13, 2020)
	thumbnail?: string;             // cover art image URL (song_art_image_thumbnail_url)
	views?: number;                 // genius page views (stats.pageviews)
	lyrics?: string;                // as extracted by extractLyrics() if showLyrics is true
}
// song data as received from Genius API that I didn't bother typing (https://docs.genius.com/#songs-h2)
export type SongApi = Record<string, any>;
