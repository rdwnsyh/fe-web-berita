import React, { useState, useEffect } from "react";
import {
  getComments,
  postComment,
  getReplies,
  postReply,
} from "../../api/commentApi";

const CommentSection = ({ articleUrl }) => {
  // Ambil user dari localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.displayName || user.username || user.email || "User";

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // Hapus email dari state komentar baru
  const [newComment, setNewComment] = useState({
    content: "",
  });
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const [replyForms, setReplyForms] = useState({});
  const [errors, setErrors] = useState({});

  // Generate article identifier from URL
  const getArticleIdentifier = (url) => {
    try {
      return btoa(url).replace(/[+/=]/g, "");
    } catch {
      return url.replace(/[^a-zA-Z0-9]/g, "");
    }
  };

  const articleIdentifier = getArticleIdentifier(articleUrl);

  useEffect(() => {
    fetchComments();
  }, [articleIdentifier]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await getComments(articleIdentifier);
      // Perbaiki: response.data adalah array, bukan {comments: [...]}
      setComments(response.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  // Ubah validasi form agar hanya cek content
  const validateForm = (data) => {
    const newErrors = {};
    if (!data.content.trim()) newErrors.content = "Komentar harus diisi";
    return newErrors;
  };

  // Perbaiki agar textarea tidak error merah setelah berhasil submit
  const handleSubmitComment = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const validationErrors = validateForm(newComment);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      setErrors({}); // reset error sebelum submit

      await postComment(articleIdentifier, {
        name: userName,
        content: newComment.content.trim(),
      });

      setNewComment({ content: "" });
      setErrors({}); // reset error setelah sukses submit
      await fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
      setErrors({ submit: "Gagal mengirim komentar. Silakan coba lagi." });
    } finally {
      setSubmitting(false);
    }
  };

  // Reply form juga otomatis nama user login
  const handleReplySubmit = async (parentId, replyData) => {
    const validationErrors = validateForm(replyData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors({ [`reply_${parentId}`]: validationErrors });
      return;
    }

    try {
      await postReply(parentId, {
        name: userName,
        content: replyData.content.trim(),
      });

      setReplyForms((prev) => ({
        ...prev,
        [parentId]: { content: "" },
      }));
      setErrors((prev) => ({ ...prev, [`reply_${parentId}`]: {} }));
      await fetchComments();
    } catch (error) {
      console.error("Error posting reply:", error);
      setErrors((prev) => ({
        ...prev,
        [`reply_${parentId}`]: {
          submit: "Gagal mengirim balasan. Silakan coba lagi.",
        },
      }));
    }
  };

  // Perbaiki toggleReplies agar response.data adalah array
  const toggleReplies = async (commentId) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
      // Load replies if not already loaded
      try {
        const response = await getReplies(commentId);
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId
              ? { ...comment, replies: response.data || [] }
              : comment
          )
        );
      } catch (error) {
        console.error("Error fetching replies:", error);
      }
    }
    setExpandedReplies(newExpanded);
  };

  const toggleReplyForm = (commentId) => {
    setReplyForms((prev) => ({
      ...prev,
      [commentId]: prev[commentId]
        ? null
        : { name: "", email: "", content: "" },
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Ubah CommentForm agar handleSubmit hanya dipanggil dari onSubmit form
  const CommentForm = ({
    onSubmit,
    initialData = { content: "" },
    errors = {},
    isReply = false,
    onCancel = null,
  }) => {
    const [formData, setFormData] = useState(initialData);

    // Reset error jika user mengetik setelah submit
    const handleChange = (e) => {
      setFormData((prev) => ({ ...prev, content: e.target.value }));
      if (errors.content)
        setErrors((prev) => ({ ...prev, content: undefined }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    // Jika tidak ada error, pastikan textarea tidak merah
    const isError = !!errors.content && formData.content.trim() === "";

    return (
      <form
        onSubmit={handleSubmit}
        className={`space-y-4 ${
          isReply ? "ml-8 mt-4 p-4 bg-gray-50 rounded-lg" : ""
        }`}
      >
        {/* Nama user login */}
        <div className="mb-1 text-xs text-gray-500">
          Komentar sebagai:{" "}
          <span className="font-semibold text-gray-700">{userName}</span>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Komentar <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.content}
            onChange={handleChange}
            rows="4"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
              isError ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            placeholder={
              isReply
                ? "Tulis balasan Anda..."
                : "Bagikan pendapat Anda tentang artikel ini..."
            }
          />
          {isError && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
        </div>
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Mengirim...
              </>
            ) : (
              <>
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
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                {isReply ? "Kirim Balasan" : "Kirim Komentar"}
              </>
            )}
          </button>
          {isReply && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all font-medium"
            >
              Batal
            </button>
          )}
        </div>
      </form>
    );
  };

  const CommentItem = ({ comment, isReply = false }) => (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${
        isReply ? "ml-8 mt-4" : ""
      }`}
    >
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {comment.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 flex-wrap">
              <h4 className="text-lg font-semibold text-gray-900">
                {comment.name || "Anonymous"}
              </h4>
              <span className="text-gray-400">•</span>
              <time className="text-sm text-gray-500">
                {formatDate(comment.createdAt)}
              </time>
            </div>

            <div className="mt-3">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>

            {!isReply && (
              <div className="mt-4 flex items-center space-x-6">
                <button
                  onClick={() => toggleReplyForm(comment._id)}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    />
                  </svg>
                  Balas
                </button>

                {comment.replyCount > 0 && (
                  <button
                    onClick={() => toggleReplies(comment._id)}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  >
                    <svg
                      className={`w-4 h-4 mr-1 transform transition-transform ${
                        expandedReplies.has(comment._id) ? "rotate-90" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    {expandedReplies.has(comment._id)
                      ? "Sembunyikan"
                      : "Tampilkan"}{" "}
                    {comment.replyCount} balasan
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reply Form */}
      {replyForms[comment._id] && (
        <div className="border-t border-gray-100 bg-gray-50 p-6">
          <CommentForm
            onSubmit={(data) => handleReplySubmit(comment._id, data)}
            initialData={replyForms[comment._id]}
            errors={errors[`reply_${comment._id}`] || {}}
            isReply={true}
            onCancel={() => toggleReplyForm(comment._id)}
          />
        </div>
      )}

      {/* Replies */}
      {expandedReplies.has(comment._id) &&
        comment.replies &&
        comment.replies.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50 p-6 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem key={reply._id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
        <div className="flex items-center text-white">
          <svg
            className="w-6 h-6 mr-3"
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
          <h3 className="text-xl font-semibold">
            Diskusi & Komentar
            {comments.length > 0 && (
              <span className="ml-2 bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                {comments.length} komentar
              </span>
            )}
          </h3>
        </div>
      </div>

      <div className="p-8">
        {/* Comment Form */}
        <div className="mb-10">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">
            Berikan Komentar Anda
          </h4>
          <CommentForm
            onSubmit={handleSubmitComment}
            initialData={newComment}
            errors={errors}
          />
        </div>

        {/* Comments List */}
        <div>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600 mr-3"></div>
                <span className="text-gray-600">Memuat komentar...</span>
              </div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-gray-400"
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
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Belum Ada Komentar
              </h4>
              <p className="text-gray-600">
                Jadilah yang pertama berkomentar pada artikel ini!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-6">
                Semua Komentar ({comments.length})
              </h4>
              {comments.map((comment) => (
                <CommentItem key={comment._id} comment={comment} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
