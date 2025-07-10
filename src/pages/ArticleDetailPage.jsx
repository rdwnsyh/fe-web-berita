// src/pages/ArticleDetailPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetchLocal } from '../hooks/useFetchLocal';
import { getArticleById } from "../data/articles"; // <-- Baris yang ditunjuk error
// ... (sisa kode file ini)
function ArticleDetailPage() {
    const { id } = useParams(); // Ambil ID dari URL

    // Menggunakan useFetchLocal dengan parameter ID
    const { data: article, loading, error } = useFetchLocal(getArticleById, id);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>Loading article details...</div>;
    }

    if (error) {
        console.error("Failed to fetch article details:", error);
        return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Error loading article: {error.message}. <Link to="/">Go back to Home</Link></div>;
    }

    if (!article) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>Article not found. <Link to="/">Go back to Home</Link></div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6', fontSize: '1.1em' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
                &larr; Back to all News
            </Link>
            <h1 style={{ marginBottom: '10px', fontSize: '2.2em' }}>{article.title}</h1>
            <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '20px' }}>
                By: {article.author || 'Unknown'} | Published: {new Date(article.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            {article.urlToImage && (
                <img
                    src={article.urlToImage}
                    alt={article.title}
                    style={{
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: '8px',
                        marginBottom: '30px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                />
            )}
            <p style={{ fontWeight: 'bold', marginBottom: '20px' }}>{article.description}</p>
            <hr style={{ margin: '30px 0', borderColor: '#eee' }} />
            <p style={{ whiteSpace: 'pre-wrap' }}>{article.content}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: '30px', color: '#007bff', fontSize: '1em' }}>
                Read Full Article on Original Source
            </a>
        </div>
    );
}

export default ArticleDetailPage;