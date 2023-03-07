import fetch from "cross-fetch";
import * as cheerio from "cheerio";
import { Options } from "./types";

export const API_SEARCH = "https://api.genius.com/search?q=";
export const API_SONG = "https://api.genius.com/songs/";

export const validateOptions = (options: Options) => {
	if (!options.apiKey) throw new TypeError("No API key was provided");
	if (!options.query) throw new TypeError("No search query was provided");
};

//remove (), [], feat., ft., and mutliple whitespace
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
		const res = await fetch(url);
		const resTxt = await res.text();
		const $ = cheerio.load(resTxt);

		let lyrics = $('div[class="lyrics"]').text().trim();
		console.log(lyrics);
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
