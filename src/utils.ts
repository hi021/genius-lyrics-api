import fetch from "cross-fetch";
import * as cheerio from "cheerio";

export const API_SEARCH = "https://api.genius.com/search?q=";
export const API_SONG = "https://api.genius.com/songs/";

export const validateOptions = (options: Options) => {
	if (!options.apiKey) throw new TypeError("No API key was provided");
	if (!options.query) throw new TypeError("No search query was provided");
};

//remove content between () and [], remove feat./ft. and flatten whitespace
export const queryOptimize = (query: string) => {
	return query
		.toLowerCase()
		.replace(/ *\([^)]*\) */g, " ")
		.replace(/ *\[[^\]]*\]/, "")
		.replace(/feat\.|ft\./g, "")
		.replace(/\s+/g, " ")
		.trim();
};

//extract lyrics from the song's genius page (e.g. https://genius.com/Sia-chandelier-lyrics)
export async function extractLyrics(url: string) {
	try {
		const result = await fetch(url);
		const resultTxt = await result.text();
		const $ = cheerio.load(resultTxt);

		let lyrics = $('div[class="lyrics"]').text().trim();
		if (!lyrics) {
			lyrics = "";

			$('div[class^="Lyrics__Container"]').each((i, elem) => {
				const node = $(elem);

				if (node && node.text().length) {
					const snippet = node
						.html()!
						.replace(/<br>/g, "\n")
						.replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "");

					lyrics += $("<textarea/>").html(snippet).text().trim() + "\n\n";
				}
			});
		}

		return lyrics ? lyrics.trim() : null;
	} catch (e) {
		throw e;
	}
}

/////
//  TYPES
/////
export interface Options {
	readonly apiKey: string; //Genius' API key (https://docs.genius.com)
	query: string; //search query (artist & title)
	optimizeQuery?: boolean; //whether to run optimizeQuery() (no clue if it actually helps :d)
}
export type SongOptions = Options & { showLyrics?: boolean };
export type SongSearchOptions = Options & { maxResults?: number /* defaults to Infinity */ };

//song data as parsed in parseSongInfo()
export interface Song {
	id: number;
	artist: string; //primary_artist.name OR artist_names if null
	title: string; //title_with_featured
	albumName: string; //album.name
	url: string; //full URL to the song's genius page
	releaseDate?: string; //release date, Month DD, YYYY format (e.g. August 13, 2020)
	thumbnail?: string; //cover art image URL (song_art_image_thumbnail_url)
	views?: number; //genius page views (stats.pageviews)
	lyrics?: string;
}
//song data as received from Genius API that I didn't bother typing (https://docs.genius.com/#songs-h2)
export type SongApi = Record<string, any>;