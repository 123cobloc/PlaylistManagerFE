import { Album } from "./album.model";
import { Artist } from "./artist.model";

export interface Track {
    url: string;
    id: string;
    title: string;
    artists: Array<Artist>;
    album: Album;
    timestamp: number | null;
    isFromQueue: boolean | null;
}