export interface MusicResponse {
  tracks: Track[];
}

export interface Track {
  name: string;
  artist: string;
  image: string;
  link: string;
  id: string;
}
