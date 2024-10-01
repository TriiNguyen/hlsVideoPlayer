"use client";

import Hls from "hls.js";
import { useEffect, useState } from "react";
import css from "./page.module.css";

export default function Home() {
  const [link, setLink] = useState("");

  useEffect(() => {
    const video = document.getElementById("video") as HTMLVideoElement;
    if (!video) return;

    let hls: Hls | null = null;

    const handleLoadedMetadata = () => {
      video.play().catch((error) => {
        console.error("Error attempting to play video:", error);
      });
    };

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(link);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, handleLoadedMetadata);
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = link;
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
    } else {
      alert("HLS is not supported on this browser.");
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [link]);

  return (
    <div className={css.Wrapper}>
      <video id="video" width="640" height="360" controls></video>
      <h3>Add link here</h3>
      <input
        className={css.Input}
        value={link}
        onChange={(e) => setLink(e.target.value)}
        aria-label="Video link input"
      />
    </div>
  );
}
