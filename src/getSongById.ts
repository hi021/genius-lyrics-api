import fetch from "cross-fetch";
import { parseSongInfo } from "./parseSongInfo";
import { API_SONG } from "./utils";

export async function getSongById(id: number | string, apiKey: string) {
	if (!id) throw new TypeError("No song id was provided");
	if (!apiKey) throw new TypeError("No API key was provided");

	try {
		const result = await fetch(`${API_SONG}${encodeURIComponent(id)}`, {
			method: "GET",
			headers: {
				Authorization: "Bearer " + apiKey
			}
		});
		const resJson = await result.json();

		return resJson?.response?.song ? parseSongInfo(resJson.response.song, true) : null;
	} catch (e) {
		throw e;
	}
}
