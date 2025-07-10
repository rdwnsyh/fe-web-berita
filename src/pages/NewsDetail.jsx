import React, { useEffect, useState } from "react";
import { getNewsContent } from "../api/newsApi";
import { useLocation } from "react-router-dom";

export default function NewsDetail() {
  const [content, setContent] = useState("");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const url = params.get("url");

  useEffect(() => {
    if (url) {
      getNewsContent(url)
        .then((res) => {
          setContent(res.data.content); // HTML yang disiapkan Puppeteer
        })
        .catch((err) => {
          console.error("Gagal ambil konten:", err);
        });
    }
  }, [url]);

  if (!url) return <p>URL tidak valid</p>;

  return (
    <div>
      <h1>Konten Artikel</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
