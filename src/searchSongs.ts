import fetch from "cross-fetch";
import { validateOptions, queryOptimize, API_SEARCH } from "./utils";
import { SongApi, SongSearchOptions } from "./types.js";

//returns the result of a genius search query in an array or just the top result
export async function searchSongs(options: SongSearchOptions) {
	try {
		validateOptions(options);
		const { apiKey, query, optimizeQuery = true, topResultOnly = false } = options;
		const queryOptimized = optimizeQuery ? queryOptimize(query) : query;
		const reqUrl = `${API_SEARCH}${encodeURIComponent(queryOptimized)}`;

		const res = await fetch(reqUrl, {
			method: "GET",
			headers: {
				Authorization: "Bearer " + apiKey
			}
		});
		if (!res.ok) throw new Error(`API responded with ${res.status}:\n${res.statusText}`);

		const resJson = await res.json();
		if (!resJson?.response?.hits?.length) return null;

		//assuming the top result is a song
		if (topResultOnly) return resJson.response.hits[0].result as SongApi;

		const resParsed: Array<SongApi> = [];
		for (let i = 0; i < resJson.response.hits.length; i++) {
			if (resJson.response.hits[i].type !== "song") continue;
			resParsed.push(resJson.response.hits[i].result);
		}

		return resParsed;
	} catch (e) {
		throw e;
	}
}
