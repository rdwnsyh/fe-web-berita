// src/components/NewsCard.jsx
import React from "react";
import PropTypes from "prop-types";

function NewsCard({ article, variant = "default" }) {
  if (!article) {
    return null;
  }

  // Trending card variant (larger, different layout)
  if (variant === "trending") {
    return (
      <div className="trending-card">
        <div className="trending-image-container">
          <img 
            src={article.image || article.urlToImage} 
            alt={article.title}
            className="trending-image"
          />
          <div className="trending-category">
            <span>{article.category || 'Breaking'}</span>
          </div>
        </div>
        <div className="trending-content">
          <h3 className="trending-title">{article.title}</h3>
          <p className="trending-description">{article.description}</p>
          <div className="trending-meta">
            <div className="source-info">
              <div className="source-dot"></div>
              <span>{article.source?.name || article.author || 'News Source'}</span>
            </div>
            <div className="time-info">
              <span className="clock-icon">🕐</span>
              <span>{article.publishedAt || '1h ago'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default article card variant (matches homepage's article-card)
  return (
    <div className="article-card">
      <div className="article-image-container">
        <img 
          src={article.image || article.urlToImage} 
          alt={article.title}
          className="article-image"
        />
      </div>
      <div className="article-content">
        <div className="article-category">
          <span>{article.category || 'News'}</span>
        </div>
        <h3 className="article-title">{article.title}</h3>
        <p className="article-description">{article.description}</p>
        <div className="article-meta">
          <div className="source-info">
            <div className="source-dot"></div>
            <span>{article.source?.name || article.author || 'News Source'}</span>
          </div>
          <div className="time-info">
            <span className="clock-icon">🕐</span>
            <span>{article.publishedAt || '1h ago'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

NewsCard.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string,
    description: PropTypes.string,
    url: PropTypes.string.isRequired,
    urlToImage: PropTypes.string,
    image: PropTypes.string,
    category: PropTypes.string,
    publishedAt: PropTypes.string,
    source: PropTypes.shape({
      name: PropTypes.string,
    }),
    isBreaking: PropTypes.bool,
  }).isRequired,
  variant: PropTypes.oneOf(["default", "trending"]),
};

export default NewsCard;