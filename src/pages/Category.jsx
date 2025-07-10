import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNewsByCategory } from "../api/newsApi";

export default function Category() {
  const { slug } = useParams();
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    getNewsByCategory(slug)
      .then((res) => setNewsList(res.data.data))
      .catch((err) => console.error(err));
  }, [slug]);

  return (
    <div>
      <h1>Kategori: {slug}</h1>
      <ul>
        {newsList.map((item, idx) => (
          <li key={idx}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}
