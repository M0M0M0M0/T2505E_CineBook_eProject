import React from "react";
import "./../MovieDetail.css";

export default function SynopsisSection({ text }) {
  return (
    <section className="synopsis-section" aria-labelledby="synopsis-heading">
      <h3 id="synopsis-heading">Synopsis</h3>
      <p>{text || "No synopsis available."}</p>
    </section>
  );
}
