import React, { useState, useEffect } from "react";
import { MessageCircle, Send, X, User, Reply, Clock } from "lucide-react";

// Comment API functions (updated to use same logic as UI)
const API_BASE_URL = "https://icbs.my.id/api";

// Helper to get token
const getAuthToken = () => {
  const possibleTokenKeys = ["token", "authToken", "accessToken"];
  for (const key of possibleTokenKeys) {
    const token = localStorage.getItem(key);
    if (token && token !== "null" && token !== "undefined" && token !== "") {
      return token.replace(/^"(.*)"$/, "$1");
    }
  }
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.token) return user.token;
      if (user?.accessToken) return user.accessToken;
    }
  } catch {
    // Ignore JSON parse errors
  }
  return null;
};

const commentApi = {
  // Helper function yang sama dengan UI component
  getUserData: () => {
    try {
      const possibleKeys = [
        "user",
        "userData",
        "currentUser",
        "auth",
        "authUser",
        "loginData",
      ];

      for (const key of possibleKeys) {
        const data = localStorage.getItem(key);
        if (data && data !== "{}" && data !== "null") {
          try {
            const parsed = JSON.parse(data);
            const userId =
              parsed._id ||
              parsed.id ||
              parsed.user ||
              parsed.userId ||
              parsed.username ||
              parsed.email;

            if (userId) {
              console.log(
                `API getUserData - Found userId: ${userId} from key: ${key}`
              );
              return { user: parsed, userId };
            }
          } catch (error) {
            console.warn(`Error parsing ${key}:`, error);
          }
        }
      }

      return { user: {}, userId: null };
    } catch (error) {
      console.error("Error in API getUserData:", error);
      return { user: {}, userId: null };
    }
  },

  getComments: async (articleIdentifier) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/articles/${encodeURIComponent(
          articleIdentifier
        )}/comments`
      );
      const data = await res.json();
      return { data: Array.isArray(data) ? data : data.comments || [] };
    } catch (error) {
      console.error("Error fetching comments:", error);
      return { data: [] };
    }
  },

  postComment: async (articleIdentifier, commentData) => {
    const { userId } = commentApi.getUserData();
    const token = getAuthToken();

    if (!userId) {
      throw new Error("User belum login. Tidak dapat mengirim komentar.");
    }

    const payload = {
      text: commentData.content,
      articleIdentifier,
      parentId: null,
      user: userId,
    };

    console.log("POST /comments payload:", payload);

    const res = await fetch(
      `${API_BASE_URL}/articles/${encodeURIComponent(
        articleIdentifier
      )}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("POST /comments error:", errorData);
      throw new Error(errorData.message || "Failed to post comment");
    }

    const data = await res.json();
    console.log("POST /comments response:", data);
    return { data };
  },

  postReply: async (parentCommentId, replyData) => {
    const { userId } = commentApi.getUserData();
    const token = getAuthToken();

    if (!userId) {
      throw new Error("User belum login. Tidak dapat mengirim balasan.");
    }

    const payload = {
      text: replyData.content,
      parentId: parentCommentId,
      user: userId,
    };

    const res = await fetch(
      `${API_BASE_URL}/comments/${parentCommentId}/replies`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to post reply");
    }

    const data = await res.json();
    return { data };
  },
};

// Individual Comment Component
const Comment = ({ comment, user, onReply, articleUrl }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) return;

    setLoading(true);
    try {
      await commentApi.postReply(comment._id, {
        content: replyText.trim(),
      });

      setReplyText("");
      setShowReplyForm(false);
      // Tidak perlu setReplies, reply akan diambil dari comment.replies
      if (onReply) {
        onReply(articleUrl);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Yakin ingin menghapus komentar ini?")) return;
    try {
      await fetch(`${API_BASE_URL}/comments/${comment._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(getAuthToken()
            ? { Authorization: `Bearer ${getAuthToken()}` }
            : {}),
        },
      });
      if (onReply) onReply(articleUrl); // Refresh komentar
    } catch (error) {
      alert("Gagal menghapus komentar");
    }
  };

  // ✅ FIXED: Improved formatDate function with better error handling
  const formatDate = (dateString) => {
    if (!dateString) return "Baru saja";
    
    try {
      // Handle different date formats that might come from the server
      let date;
      
      // If it's already a Date object
      if (dateString instanceof Date) {
        date = dateString;
      }
      // If it's a timestamp string or number
      else if (!isNaN(dateString) && !isNaN(parseFloat(dateString))) {
        date = new Date(parseInt(dateString));
      }
      // If it's an ISO string or other date string
      else {
        date = new Date(dateString);
      }
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date received:', dateString);
        return "Baru saja";
      }
      
      // Format the date
      return date.toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta" // Add timezone for consistency
      });
    } catch (error) {
      console.error('Error formatting date:', error, 'Date string:', dateString);
      return "Baru saja";
    }
  };

  return (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-b-0">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {comment.user?.photoUrl ? (
            <img
              src={comment.user.photoUrl}
              alt={comment.user?.username || comment.user?.email || "User"}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-gray-900 text-sm">
              {comment.user && (comment.user.displayName || comment.user.name || comment.user.username || comment.user.email) ?
                (comment.user.displayName || comment.user.name || comment.user.username || comment.user.email)
                : "Anonymous"}
            </span>
            <div className="flex items-center text-gray-500 text-xs">
              <Clock size={12} className="mr-1" />
              {formatDate(comment.createdAt || comment.timestamp)}
            </div>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed mb-2">
            {comment.text}
          </p>

          <div className="flex items-center space-x-4 text-xs">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Reply size={12} className="mr-1" />
              Balas
            </button>
            {comment.user?.email === user?.email && (
              <button
                onClick={handleDelete}
                className="flex items-center text-gray-500 hover:text-red-600 transition-colors"
              >
                Hapus
              </button>
            )}
          </div>

          {showReplyForm && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleReply();
              }}
              className="mt-3 bg-gray-50 rounded-lg p-3"
            >
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Tulis balasan..."
                className="w-full p-2 border border-gray-200 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowReplyForm(false)}
                  className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || !replyText.trim()}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent mr-1" />
                  ) : (
                    <Send size={10} className="mr-1" />
                  )}
                  Kirim
                </button>
              </div>
            </form>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 pl-4 border-l-2 border-gray-100 space-y-3">
              {comment.replies.map((reply) => (
                <Comment
                  key={reply._id}
                  comment={reply}
                  user={user}
                  onReply={() => onReply && onReply(articleUrl)}
                  articleUrl={articleUrl}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Comment Section Component
const CommentSection = ({ articleUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  // Tambahkan normalisasi replies di loadComments
  const normalizeReplies = (comments) =>
    comments.map((c) => ({
      ...c,
      replies: Array.isArray(c.replies) ? normalizeReplies(c.replies) : [],
    }));

  const loadComments = async () => {
    setLoading(true);
    try {
      const response = await commentApi.getComments(articleUrl);
      console.log("Comments response:", response.data); // Debug
      setComments(normalizeReplies(response.data || []));
    } catch (error) {
      console.error("Error loading comments:", error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is logged in
  useEffect(() => {
    try {
      // Debug: Log semua keys di localStorage untuk debugging
      console.log("LocalStorage keys:", Object.keys(localStorage));

      // Cek berbagai kemungkinan key untuk user data
      const possibleKeys = [
        "user",
        "userData",
        "currentUser",
        "auth",
        "authUser",
        "loginData",
      ];
      let userData = null;
      let usedKey = null;

      for (const key of possibleKeys) {
        const data = localStorage.getItem(key);
        if (data && data !== "{}" && data !== "null") {
          try {
            const parsed = JSON.parse(data);
            if (
              parsed &&
              (parsed._id || parsed.id || parsed.user || parsed.userId)
            ) {
              userData = parsed;
              usedKey = key;
              break;
            }
          } catch (e) {
            console.warn(`Failed to parse ${key}:`, e);
          }
        }
      }

      // Debug: Log hasil pencarian user data
      console.log("Found user data:", userData);
      console.log("Used key:", usedKey);

      if (userData) {
        setUser(userData);
      } else {
        // Fallback: coba ambil dari key 'user' secara langsung
        const fallbackUser = localStorage.getItem("user");
        console.log("Fallback user data:", fallbackUser);

        if (fallbackUser && fallbackUser !== "{}" && fallbackUser !== "null") {
          try {
            const parsed = JSON.parse(fallbackUser);
            console.log("Parsed fallback user:", parsed);
            setUser(parsed);
          } catch (e) {
            console.error("Error parsing fallback user data:", e);
          }
        }
      }
    } catch (error) {
      console.error("Error in user detection:", error);
    }
  }, []);

  // Load comments when panel opens
  useEffect(() => {
    if (isOpen && articleUrl) {
      loadComments();
    }
  }, [isOpen, articleUrl]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    if (!user) {
      alert("Silakan login terlebih dahulu untuk berkomentar.");
      return;
    }

    setSubmitting(true);
    try {
      await commentApi.postComment(articleUrl, {
        content: newComment.trim(),
      });

      // Refresh komentar dari server
      await loadComments();
      setNewComment("");
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <MessageCircle size={24} />
        </button>
      </div>

      {/* Comment Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <MessageCircle size={20} className="mr-2" />
                Komentar ({comments.length})
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-blue-700 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col h-full">
              {/* Comment Form */}
              <div className="p-4 border-b border-gray-200">
                {user &&
                (user._id ||
                  user.id ||
                  user.user ||
                  user.userId ||
                  user.username ||
                  user.email) ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <User size={12} className="text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {user.displayName ||
                          user.name ||
                          user.username ||
                          user.email ||
                          "User"}
                      </span>
                    </div>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Tulis komentar Anda..."
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                    <button
                      onClick={handleSubmitComment}
                      disabled={submitting || !newComment.trim()}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm font-medium"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border border-white border-t-transparent mr-2" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Send size={16} className="mr-2" />
                          Kirim Komentar
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-gray-500 mb-2">
                      <User size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Silakan login untuk berkomentar</p>
                    </div>
                    <button
                      onClick={() => {
                        // Debug: Force refresh user data
                        console.log("Refreshing user data...");
                        const userData = localStorage.getItem("user");
                        console.log("Current localStorage user:", userData);

                        // Try to detect user again
                        if (
                          userData &&
                          userData !== "{}" &&
                          userData !== "null"
                        ) {
                          try {
                            const parsed = JSON.parse(userData);
                            console.log("Parsed user data:", parsed);
                            setUser(parsed);
                          } catch (e) {
                            console.error("Parse error:", e);
                          }
                        }
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors mr-2"
                    >
                      Refresh User Data
                    </button>
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                      onClick={() => {
                        // Simpan lokasi asal (optional, jika ingin lebih dinamis bisa pakai window.location.pathname)
                        const redirectUrl = encodeURIComponent(
                          window.location.pathname +
                            window.location.search +
                            "#comments"
                        );
                        window.location.href = `/login?redirect=${redirectUrl}`;
                      }}
                    >
                      Login
                    </button>
                  </div>
                )}
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border border-blue-600 border-t-transparent" />
                    <span className="ml-2 text-gray-600">
                      Memuat komentar...
                    </span>
                  </div>
                ) : comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <Comment
                        key={comment._id}
                        comment={comment}
                        user={user}
                        onReply={() => loadComments(articleUrl)}
                        articleUrl={articleUrl}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle
                      size={32}
                      className="mx-auto mb-2 opacity-50"
                    />
                    <p className="text-sm">Belum ada komentar</p>
                    <p className="text-xs mt-1">
                      Jadilah yang pertama berkomentar!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommentSection;