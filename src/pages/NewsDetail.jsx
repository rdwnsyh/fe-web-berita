import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

// Comment Components
const CommentBubble = ({ comment, onReply }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (replyText.trim()) {
      onReply(comment._id, replyText);
      setReplyText("");
      setShowReplyForm(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {comment.author?.charAt(0)?.toUpperCase() || "A"}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-semibold text-gray-900 text-sm">
              {comment.author || "Anonim"}
            </h4>
            <span className="text-xs text-gray-500">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            {comment.content}
          </p>
          <div className="flex items-center space-x-4 text-xs">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Balas
            </button>
            <span className="text-gray-400">•</span>
            <button className="text-gray-500 hover:text-red-600 transition-colors">
              Laporkan
            </button>
          </div>

          {showReplyForm && (
            <form
              onSubmit={handleSubmitReply}
              className="mt-3 bg-gray-50 rounded-lg p-3"
            >
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Tulis balasan..."
                className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="2"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowReplyForm(false)}
                  className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Kirim
                </button>
              </div>
            </form>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 ml-4 border-l-2 border-gray-100 pl-4">
              {comment.replies.map((reply) => (
                <div key={reply._id} className="mb-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {reply.author?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-medium text-gray-900 text-xs">
                          {reply.author || "Anonim"}
                        </h5>
                        <span className="text-xs text-gray-500">
                          {formatDate(reply.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 text-xs leading-relaxed">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentModal = ({ isOpen, onClose, onSubmit, articleUrl }) => {
  const [commentText, setCommentText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim() && authorName.trim()) {
      setIsSubmitting(true);
      await onSubmit({
        content: commentText,
        author: authorName,
        articleUrl: articleUrl,
      });
      setCommentText("");
      setAuthorName("");
      setIsSubmitting(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Tulis Komentar
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Masukkan nama Anda"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Komentar
              </label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Bagikan pendapat Anda tentang artikel ini..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="4"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Mengirim..." : "Kirim Komentar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const FloatingCommentButton = ({ onClick, commentCount }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onClick}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 group"
      >
        <div className="relative">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          {commentCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
              {commentCount > 99 ? "99+" : commentCount}
            </span>
          )}
        </div>
      </button>

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-gray-800 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap">
          {commentCount > 0 ? `${commentCount} Komentar` : "Tulis Komentar"}
        </div>
      </div>
    </div>
  );
};

const CommentsSection = ({ comments, onReply, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 animate-pulse rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Belum ada komentar
        </h3>
        <p className="text-gray-500">
          Jadilah yang pertama memberikan komentar untuk artikel ini
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentBubble key={comment._id} comment={comment} onReply={onReply} />
      ))}
    </div>
  );
};

export default function NewsDetail() {
  const { search } = useLocation();
  const url = new URLSearchParams(search).get("url");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Comment state
  const [comments, setComments] = useState([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showCommentsSection, setShowCommentsSection] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const fetchContent = async (retryAttempt = 0) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`Attempting to fetch content (attempt ${retryAttempt + 1})`);

      const res = await axios.get(
        `https://icbs.my.id/api/news/content?url=${encodeURIComponent(url)}`,
        {
          timeout: 45000,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        }
      );

      console.log("API DETAIL RESPONSE:", res.data);

      if (res.data.content) {
        setContent(res.data.content);
        setMeta(res.data.meta);

        if (res.data.meta?.contentLength < 500 && retryAttempt < 2) {
          console.log("Content seems short, retrying...");
          setTimeout(() => fetchContent(retryAttempt + 1), 2000);
          return;
        }
      } else {
        setError("Konten artikel tidak dapat dimuat");
      }
    } catch (err) {
      console.error("Gagal memuat berita:", err);

      let errorMessage;
      if (err.code === "ECONNABORTED") {
        errorMessage =
          "Timeout - Halaman membutuhkan waktu terlalu lama untuk dimuat";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error - Coba beberapa saat lagi";
      } else if (err.response?.status === 429) {
        errorMessage =
          "Terlalu banyak permintaan - Tunggu sebentar dan coba lagi";
      } else {
        errorMessage = "Gagal memuat berita. Silakan coba lagi.";
      }

      setError(errorMessage);

      if (retryAttempt < 2 && (err.code === "ECONNABORTED" || !err.response)) {
        console.log(
          `Network error, retrying in 3 seconds... (attempt ${
            retryAttempt + 1
          })`
        );
        setTimeout(() => {
          setRetryCount(retryAttempt + 1);
          fetchContent(retryAttempt + 1);
        }, 3000);
        return;
      }

      setContent(`
        <div class="fallback-content">
          <div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <p class="text-red-800 font-semibold mb-3">⚠️ Gagal memuat berita dari server</p>
            <div class="text-red-700 text-sm space-y-2">
              <p><strong>Kemungkinan penyebab:</strong></p>
              <ul class="list-disc list-inside space-y-1 ml-4">
                <li>Struktur halaman website telah berubah</li>
                <li>Website memblokir akses otomatis</li>
                <li>Koneksi internet tidak stabil</li>
              </ul>
            </div>
            <div class="mt-4 pt-4 border-t border-red-200">
              <a href="${url}" target="_blank" rel="noopener noreferrer" 
                 class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                Baca di Situs Asli CNN Indonesia
              </a>
            </div>
          </div>
        </div>
      `);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      // Ganti dengan endpoint API komentar Anda
      const res = await axios.get(
        `https://icbs.my.id/api/comments?articleUrl=${encodeURIComponent(url)}`
      );
      setComments(res.data.comments || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      // Set sample comments for demo
      setComments([
        {
          _id: "1",
          author: "Ahmad Rizki",
          content:
            "Artikel yang sangat informatif! Terima kasih atas informasinya.",
          createdAt: new Date().toISOString(),
          replies: [
            {
              _id: "1-1",
              author: "Sarah Putri",
              content:
                "Setuju! Sangat membantu untuk memahami situasi terkini.",
              createdAt: new Date().toISOString(),
            },
          ],
        },
        {
          _id: "2",
          author: "Diana Sari",
          content:
            "Semoga situasi ini segera membaik. Kita semua harus saling mendukung dalam masa sulit ini.",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          replies: [],
        },
      ]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleSubmitComment = async (commentData) => {
    try {
      // Ganti dengan endpoint API untuk submit komentar
      const res = await axios.post(
        "https://icbs.my.id/api/comments",
        commentData
      );

      // Add new comment to the beginning of the array
      const newComment = {
        _id: Date.now().toString(),
        ...commentData,
        createdAt: new Date().toISOString(),
        replies: [],
      };

      setComments((prev) => [newComment, ...prev]);
    } catch (err) {
      console.error("Failed to submit comment:", err);
      // For demo, add comment anyway
      const newComment = {
        _id: Date.now().toString(),
        ...commentData,
        createdAt: new Date().toISOString(),
        replies: [],
      };
      setComments((prev) => [newComment, ...prev]);
    }
  };

  const handleReply = async (commentId, replyContent) => {
    try {
      // Ganti dengan endpoint API untuk reply
      const replyData = {
        parentId: commentId,
        content: replyContent,
        author: "User", // You might want to get this from user context
        articleUrl: url,
      };

      const res = await axios.post(
        "https://icbs.my.id/api/comments/reply",
        replyData
      );

      // Update the comment with new reply
      const newReply = {
        _id: Date.now().toString(),
        author: "User",
        content: replyContent,
        createdAt: new Date().toISOString(),
      };

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: [...(comment.replies || []), newReply] }
            : comment
        )
      );
    } catch (err) {
      console.error("Failed to submit reply:", err);
      // For demo, add reply anyway
      const newReply = {
        _id: Date.now().toString(),
        author: "User",
        content: replyContent,
        createdAt: new Date().toISOString(),
      };

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: [...(comment.replies || []), newReply] }
            : comment
        )
      );
    }
  };

  const handleFloatingButtonClick = () => {
    if (!showCommentsSection) {
      setShowCommentsSection(true);
      fetchComments();
    } else {
      setShowCommentModal(true);
    }
  };

  useEffect(() => {
    if (url) {
      fetchContent();
    } else {
      setError("URL artikel tidak valid");
      setLoading(false);
    }
  }, [url]);

  const handleRetry = () => {
    setRetryCount(0);
    fetchContent();
  };

  const getTotalCommentCount = () => {
    return comments.reduce((total, comment) => {
      return total + 1 + (comment.replies ? comment.replies.length : 0);
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center">
            {/* Enhanced loading spinner */}
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0 left-0"></div>
            </div>

            <div className="mt-8 text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Memuat artikel...
              </h2>
              {retryCount > 0 && (
                <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Percobaan ke-{retryCount + 1} dari 3
                </div>
              )}
            </div>

            <div className="mt-6 max-w-md text-center">
              <p className="text-gray-600 text-sm leading-relaxed">
                Sedang mengekstrak konten dari halaman. Proses ini membutuhkan
                waktu beberapa detik untuk memastikan kualitas artikel terbaik.
              </p>
            </div>

            {/* Loading progress indicator */}
            <div className="mt-8 w-64">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full animate-pulse"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-red-500 px-6 py-4">
              <div className="flex items-center text-white">
                <svg
                  className="h-6 w-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <h3 className="text-lg font-semibold">Gagal Memuat Artikel</h3>
              </div>
            </div>

            <div className="p-8">
              <div className="text-gray-700 mb-6">
                <p className="text-lg mb-4">{error}</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Tips untuk mengatasi masalah ini:</strong>
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Periksa koneksi internet Anda</li>
                    <li>Refresh halaman dan coba lagi</li>
                    <li>Buka artikel langsung di situs CNN Indonesia</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Coba Lagi
                </button>

                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Baca di Situs Asli
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Enhanced debug info for development */}
        {meta && import.meta.env.NODE_ENV === "development" && (
          <div className="mb-8 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gray-800 px-6 py-3">
              <h4 className="text-white font-semibold text-sm">
                🔧 Debug Information
              </h4>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold text-gray-700">
                      Selector:
                    </span>{" "}
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {meta.selector}
                    </code>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Content Length:
                    </span>{" "}
                    <span className="text-blue-600 font-mono">
                      {meta.contentLength} chars
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Fallback Mode:
                    </span>{" "}
                    <span
                      className={
                        meta.fallback ? "text-amber-600" : "text-green-600"
                      }
                    >
                      {meta.fallback ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold text-gray-700">Title:</span>{" "}
                    <span className="text-gray-600">{meta.title || "N/A"}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Description:
                    </span>{" "}
                    <span className="text-gray-600">
                      {meta.description
                        ? meta.description.substring(0, 60) + "..."
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced article header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {meta?.title && (
            <div className="px-8 py-10 bg-gradient-to-r from-blue-600 to-indigo-700">
              <div className="flex items-center mb-4">
                <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
                  <span className="text-white text-sm font-medium">
                    CNN Indonesia
                  </span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                {meta.title}
              </h1>
              {meta.description && (
                <p className="text-blue-100 text-lg leading-relaxed max-w-3xl">
                  {meta.description}
                </p>
              )}
            </div>
          )}

          {/* Content quality indicator */}
          {meta && meta.contentLength < 500 && (
            <div className="mx-8 mt-6 mb-2">
              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-amber-400 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-800">
                      <strong>Konten Terbatas:</strong> Hanya{" "}
                      {meta.contentLength} karakter yang berhasil diekstrak.
                      Artikel mungkin tidak lengkap.{" "}
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold underline hover:no-underline"
                      >
                        Baca artikel lengkap di sumber asli
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced main content */}
          <article className="px-8 py-8">
            <div className="prose prose-lg prose-gray max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: content }}
                className="article-content"
                style={{
                  lineHeight: "1.8",
                  fontSize: "1.125rem",
                  color: "#374151",
                }}
              />
            </div>
          </article>
        </div>

        {/* Comments Section */}
        {showCommentsSection && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <h3 className="font-semibold">
                    Komentar ({getTotalCommentCount()})
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowCommentModal(true)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                  >
                    Tulis Komentar
                  </button>
                  <button
                    onClick={() => setShowCommentsSection(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <CommentsSection
                comments={comments}
                onReply={handleReply}
                isLoading={commentsLoading}
              />
            </div>
          </div>
        )}

        {/* Enhanced footer with source link */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <div className="flex items-center text-white">
              <svg
                className="h-5 w-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              <h3 className="font-semibold">Sumber Artikel</h3>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CNN</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 font-semibold mb-2">
                  CNN Indonesia
                </p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm break-words hover:underline transition-colors"
                >
                  {url}
                </a>
                <div className="mt-4">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Baca Artikel Lengkap
                  </a>
                </div>
              </div>
            </div>

            {meta?.fallback && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg
                      className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <p className="text-yellow-800 text-sm">
                      <strong>Peringatan:</strong> Konten mungkin tidak lengkap
                      karena struktur halaman. Untuk mendapatkan informasi yang
                      lengkap dan akurat, silakan
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold underline hover:no-underline ml-1"
                      >
                        baca artikel lengkap di sumber asli
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Comment Button */}
      <FloatingCommentButton
        onClick={handleFloatingButtonClick}
        commentCount={getTotalCommentCount()}
      />

      {/* Comment Modal */}
      <CommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        onSubmit={handleSubmitComment}
        articleUrl={url}
      />
    </div>
  );
}
