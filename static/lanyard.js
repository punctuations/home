(() => {
  const card = document.getElementById("lanyard");
  if (!card) return;

  const id = card.dataset.user;
  if (!id) return;

  const link = card.querySelector(".lanyard-art");
  const art = card.querySelectorAll(
    ".lanyard-art img:not(.lanyard-art-next)",
  );
  const next = card.querySelector(".lanyard-art-next");
  const copy = card.querySelector(".lanyard-copy");
  const song = card.querySelector(".lanyard-copy strong");
  const artist = card.querySelector(".lanyard-copy span");
  if (!link || !song || !artist) return;

  const still =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const wearArt = (cover) => {
    art.forEach((img) => img.setAttribute("src", cover));
  };

  const swapArt = (cover, gently) => {
    if (!cover) return;
    if (!gently || !next) {
      wearArt(cover);
      return;
    }

    let settled = false;
    const reveal = () => {
      if (settled) return;
      settled = true;

      next.src = cover;
      next.classList.add("is-in");
      setTimeout(() => {
        wearArt(cover);
        next.classList.remove("is-in");
      }, 340);
    };

    const warm = new Image();
    warm.addEventListener("load", reveal);
    warm.addEventListener("error", () => {
      if (settled) return;
      settled = true;
      wearArt(cover);
    });
    warm.src = cover;
    setTimeout(reveal, 1200);
  };

  const swapCopy = (apply, gently) => {
    if (!gently || !copy) {
      apply();
      return;
    }

    card.classList.add("is-swapping");
    setTimeout(() => {
      apply();
      card.classList.remove("is-swapping");
    }, 160);
  };

  const dot = document.querySelector(".polaroid-discord .discord-status-dot");
  const listening = document.querySelector(".polaroid-discord .discord-listening");

  const mirror = (data) => {
    if (!data) return;

    if (dot && data.discord_status) {
      dot.className = `discord-status-dot discord-status-${data.discord_status}`;
    }

    if (listening) {
      const tune = (data.activities || []).find((item) => item.type === 2);
      const state = tune && tune.state ? tune.state : "";
      listening.textContent = state ? `listening to ${state}` : "";
      listening.hidden = !state;
    }
  };

  let showing = "";

  const paint = (data) => {
    mirror(data);

    const playing = data && data.listening_to_spotify && data.spotify;
    if (!playing) {
      card.hidden = true;
      showing = "";
      return;
    }

    const { song: title, artist: by, album_art_url: cover } = data.spotify;
    const stamp = `${title}|${by}|${cover}`;
    if (stamp === showing) {
      card.hidden = false;
      return;
    }
    const gently = !still && showing !== "" && !card.hidden;
    showing = stamp;

    swapArt(cover, gently);
    swapCopy(() => {
      song.textContent = title || "";
      artist.textContent = by ? `by ${by}` : "";
    }, gently);

    link.href = `https://open.spotify.com/search/${encodeURIComponent(`${title} - ${by}`)}`;
    card.hidden = false;
  };

  let socket;
  let beat;
  let attempts = 0;

  const stopBeat = () => {
    clearInterval(beat);
    beat = undefined;
  };

  const resync = async () => {
    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${id}`, { cache: "no-store" });
      if (!res.ok) return;
      const { data } = await res.json();
      if (data) paint(data);
    } catch {}
  };

  const reconnect = () => {
    stopBeat();
    attempts += 1;
    setTimeout(connect, Math.min(20000, 500 * 2 ** Math.min(attempts, 5)));
  };

  function connect() {
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    socket = new WebSocket("wss://api.lanyard.rest/socket");

    socket.addEventListener("open", () => {
      attempts = 0;
    });

    socket.addEventListener("message", (event) => {
      let frame;
      try {
        frame = JSON.parse(event.data);
      } catch {
        return;
      }

      if (frame.op === 1) {
        socket.send(JSON.stringify({ op: 2, d: { subscribe_to_id: id } }));
        stopBeat();
        beat = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ op: 3 }));
        }, frame.d.heartbeat_interval);
        return;
      }

      if (frame.op !== 0) return;

      if (frame.t === "INIT_STATE") {
        paint(frame.d && frame.d.discord_user ? frame.d : frame.d && frame.d[id]);
        return;
      }

      if (frame.t === "PRESENCE_UPDATE") paint(frame.d);
    });

    socket.addEventListener("close", reconnect);
    socket.addEventListener("error", () => socket.close());
  }

  const wake = () => {
    if (document.visibilityState !== "visible") return;
    resync();
    if (!socket || socket.readyState === WebSocket.CLOSED) {
      attempts = 0;
      connect();
    }
  };

  connect();
  document.addEventListener("visibilitychange", wake);
  window.addEventListener("online", wake);
  setInterval(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN) resync();
  }, 30000);
})();
