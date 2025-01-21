import { searchSongs } from "./searchSongs";
import { Options, extractLyrics, validateOptions } from "./utils";

export default async function getLyrics(optionsOrUrl: string | Options) {
    // provided genius URL
    if (optionsOrUrl && typeof optionsOrUrl === "string") return await extractLyrics(optionsOrUrl);

    if (typeof optionsOrUrl !== "object") throw new TypeError("Invalid argument type");

    // provided song artist and title - look up the song first
    validateOptions(optionsOrUrl);
    const result = await searchSongs({ ...optionsOrUrl, maxResults: 1 });
    return result?.length ? extractLyrics(result[0].url) : null;
}
