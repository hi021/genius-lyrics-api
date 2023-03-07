import { searchSongs } from "./searchSongs";
import { Options } from "./types";
import { extractLyrics, validateOptions } from "./utils";

export default async function getLyrics(optionsOrUrl: string | Options) {
	try {
		//provided genius URL
		if (optionsOrUrl && typeof optionsOrUrl === "string") return await extractLyrics(optionsOrUrl);

		//provided song artist and title
		if (typeof optionsOrUrl === "object") {
			validateOptions(optionsOrUrl);
			const result = await searchSongs({ ...optionsOrUrl, topResultOnly: true });
			return result ? extractLyrics(result.url) : null;
		}

		throw new TypeError("Invalid argument type");
	} catch (e) {
		throw e;
	}
}
