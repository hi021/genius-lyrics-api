import { Song, SongApi, extractLyrics } from "./utils";

//turns Genius' API response into a Song object
export async function parseSongInfo(song: SongApi, showLyrics?: boolean) {
	const { title_with_featured, primary_artist, album, song_art_image_thumbnail_url, release_date_for_display, id, url, stats } = song;

	const parsed: Song = {
		id,
		artist: primary_artist?.name || song.artist_names,
		title: title_with_featured || song.title,
		albumName: album?.name ?? "",
		releaseDate: release_date_for_display || song.release_date,
		thumbnail: song_art_image_thumbnail_url || song.song_art_image_url,
		url,
		views: stats?.pageviews,
		lyrics: showLyrics ? (await extractLyrics(url)) ?? undefined : undefined
	};
	return parsed;
}
