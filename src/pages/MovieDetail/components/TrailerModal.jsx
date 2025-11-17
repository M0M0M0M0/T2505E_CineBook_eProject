import React, { useEffect } from "react";
import "./../MovieDetail.css";

export default function TrailerModal({ videoUrl, onClose }) {
  // Allow closing with Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose && onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Accept both YouTube link or raw embed url. If youtube, convert to embed.
  function toEmbed(url) {
    if (!url) return "";
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      // simple transform
      const idMatch = url.match(/(youtube\.com.*v=|youtu\.be\/)([A-Za-z0-9_-]+)/);
      const id = idMatch ? idMatch[2] : null;
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    return url;
  }

  const embed = toEmbed(videoUrl);

  return (
    <div className="trailer-modal-overlay" onClick={onClose}>
      <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
        <iframe
          title="Trailer"
          src={embed}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    </div>
  );
}
