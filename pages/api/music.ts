import { NextApiRequest, NextApiResponse } from "next";

import { LAST_FM_API_KEY } from "../../lib/types/constants";
import { URLSearchParams } from "url";
import { SpotifyResponse } from "../../lib/types/SpotifyResponse";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const limit = 20;

  const last = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=atmattt&period=7day&limit=${limit}&api_key=${LAST_FM_API_KEY}&format=json`
  );
  const data = await last.json();

  const songs: string[] = [];
  const artists: string[] = [];

  data.toptracks.track.forEach(
    (song: { name: string; artist: { name: string } }) => {
      songs.push(song.name);
      artists.push(song.artist.name);
    }
  );

  // console.log(songs);

  const track_obj: { [key: string]: string }[] = [];

  let map = songs.map(async (song_name, i) => {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const request = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      body: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    });

    const token = await request.json();

    if (!token.access_token) {
      return res.status(500).json({ data: "SPOTIFY ERROR" });
    }

    const track_info: SpotifyResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURI(
        song_name
      )}%20${encodeURI(artists[i])}&type=track&market=CA&limit=1`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token.access_token}`,
        },
      }
    ).then((r) => r.json());

    let obj: { [key: string]: string } = {};

    obj["id"] = `${i}`;
    obj["name"] = song_name;
    obj["artist"] = artists[i];
    obj["image"] = track_info.tracks.items[0].album.images[0].url;
    obj["link"] = track_info.tracks.items[0].external_urls.spotify;

    track_obj.push(obj);
  });

  if (last.status != 200) {
    return res.status(500).json({ data: "LAST_FM ERROR" });
  }

  await Promise.all(map);

  const tracks = track_obj.sort((a, b) => {
    return parseInt(<string>a.id) - parseInt(<string>b.id);
  });
  return res.status(200).json({
    tracks: tracks,
  });
}
