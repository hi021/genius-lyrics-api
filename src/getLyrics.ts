import { searchSongs } from "./searchSongs";
import { Options, extractLyrics, validateOptions } from "./utils";

export default async function getLyrics(optionsOrUrl: string | Options) {
	try {
		//provided genius URL
		if (optionsOrUrl && typeof optionsOrUrl === "string") return await extractLyrics(optionsOrUrl);

		//provided song artist and title - look up the song first
		if (typeof optionsOrUrl === "object") {
			validateOptions(optionsOrUrl);

			const result = await searchSongs({ ...optionsOrUrl, maxResults: 1 });
			return result?.length ? extractLyrics(result[0].url) : null;
		}

		throw new TypeError("Invalid argument type");
	} catch (e) {
		throw e;
	}
}
