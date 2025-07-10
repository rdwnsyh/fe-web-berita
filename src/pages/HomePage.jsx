import React, { useState } from 'react';
import NewsCard from '../components/NewsCard';
import { useFetchLocal } from '../hooks/useFetchLocal';
import { getArticles } from '../data/articles';

function HomePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const { data: articles, loading, error } = useFetchLocal(getArticles);

    const categories = ["All", "Sports", "Politics", "Business", "Health", "Travel", "Science"];

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading news...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>Error: {error.message}</p>
                <p>Please check console for more details.</p>
            </div>
        );
    }

    if (!articles || articles.length === 0) {
        return (
            <div className="no-news-container">
                <p>No news found.</p>
            </div>
        );
    }

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const trendingArticle = articles.find(article => article.isBreaking) || articles[0];
    const latestArticles = filteredArticles.filter(article => article.id !== trendingArticle?.id);

    return (
        <div
            className="main-content"
            style={{
                minHeight: '100vh',
                paddingBottom: '80px',
                boxSizing: 'border-box'
            }}
        >
            {/* Search Bar */}
            <div className="search-container" style={{ marginTop: '24px' }}>
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* Trending Section */}
            {trendingArticle && (
                <section className="trending-section">
                    <div className="section-header">
                        <h2>Trending</h2>
                        <button className="see-all-btn">See all</button>
                    </div>
                    <NewsCard article={trendingArticle} variant="trending" />
                </section>
            )}

            {/* Category Tabs */}
            <section className="categories-section">
                <div className="section-header">
                    <h2>Latest</h2>
                    <button className="see-all-btn">See all</button>
                </div>

                <div className="categories-tabs">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </section>

            {/* Latest Articles */}
            <section className="articles-section">
                {latestArticles.map((article) => (
                    <NewsCard key={article.id} article={article} variant="default" />
                ))}
            </section>
        </div>
    );
}

export default HomePage;
