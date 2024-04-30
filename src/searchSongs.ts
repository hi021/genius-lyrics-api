import fetch from "cross-fetch";
import { validateOptions, queryOptimize, API_SEARCH, SongApi, SongSearchOptions } from "./utils";

//return an array of results from a genius search query to be parsed by parseSongInfo()
export async function searchSongs(options: SongSearchOptions) {
	try {
		validateOptions(options);
		const { apiKey, query, optimizeQuery = false, maxResults = Infinity } = options;
		const queryOptimized = optimizeQuery ? queryOptimize(query) : query;
		const reqUrl = `${API_SEARCH}${encodeURIComponent(queryOptimized)}`;

		const result = await fetch(reqUrl, {
			method: "GET",
			headers: {
				Authorization: "Bearer " + apiKey
			}
		});
		if (!result.ok) throw new Error(`Genius responded with ${result.status}:\n${result.statusText}`);

		const resJson = await result.json();
		if (!resJson?.response?.hits?.length) return null; //nothing found

		const limit = Math.min(resJson.response.hits.length, maxResults);
		const resParsed: Array<SongApi> = [];
		for (let i = 0; i < limit; i++) {
			if (resJson.response.hits[i].type !== "song") continue;
			resParsed.push(resJson.response.hits[i].result);
		}

		return resParsed;
	} catch (e) {
		throw e;
	}
}
