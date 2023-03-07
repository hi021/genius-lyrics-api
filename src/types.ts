//
export declare interface Options {
	apiKey: string; //genius' API key
	query: string; //search query (artist & title)
	optimizeQuery?: boolean; //whether to run optimizeQuery() (no clue if it actually helps :d)
}
export declare type SongOptions = Options & { showLyrics?: boolean };
export declare type SongSearchOptions = Options & { topResultOnly?: boolean };

//
export declare interface Song {
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
export declare type SongApi = Record<string, any>; //genius API response
