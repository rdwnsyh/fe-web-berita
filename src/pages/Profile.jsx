import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Button,
  Alert,
  Dialog,
  Input,
  Spinner,
  IconButton,
  Avatar,
  Chip,
  Progress,
} from "@material-tailwind/react";
import {
  KeyIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon,
  CameraIcon,
  StarIcon,
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  LinkIcon,
  EyeIcon,
  BellIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import {
  CheckBadgeIcon,
  ShieldCheckIcon as ShieldCheckSolid,
} from "@heroicons/react/24/solid";
import profileApi from "../api/profile";
import { Modal } from "../components/Modal/Modal";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "../components/Card/Card";

const Profile = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    displayName: "",
    isEmailVerified: false,
    photoUrl: "",
    bio: "",
    location: "",
    website: "",
    phone: "",
    joinDate: "",
    articlesCount: 0,
    followersCount: 0,
    followingCount: 0,
    profileCompleteness: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const navigate = useNavigate();

  // Calculate profile completeness
  const calculateProfileCompleteness = (user) => {
    const fields = [
      user.displayName,
      user.email,
      user.photoUrl,

      user.isEmailVerified,
    ];
    const completed = fields.filter((field) => field && field !== "").length;
    return Math.round((completed / fields.length) * 100);
  };

  // Fetch user profile data
  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await profileApi.getProfile(token);

      if (response.user) {
        const user = response.user;
        const userData = {
          username: user.username || user.email.split("@")[0],
          email: user.email,
          displayName: user.displayName || user.username,
          isEmailVerified: user.isEmailVerified || false,
          photoUrl: user.photoUrl || "",
          bio: user.bio || "",
          location: user.location || "",
          website: user.website || "",
          phone: user.phone || "",
          joinDate: user.createdAt || new Date().toISOString(),
          articlesCount: user.articlesCount || 0,
          followersCount: user.followersCount || 0,
          followingCount: user.followingCount || 0,
        };

        userData.profileCompleteness = calculateProfileCompleteness(userData);

        localStorage.setItem("user", JSON.stringify(userData));
        setUserData(userData);
      } else {
        setError("Format data dari server tidak valid");
      }
    } catch {
      setError("Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [navigate]);

  // Handle API errors
  const handleApiError = (error, defaultMessage) => {
    const message = error?.response?.data?.message || defaultMessage;
    setError(message);
    setTimeout(() => setError(""), 5000);
  };

  // Handle success messages
  const showSuccessMessage = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 5000);
  };

  // Handle password changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Change password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Password baru dan konfirmasi tidak cocok");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password baru minimal 6 karakter");
      return;
    }

    setPasswordLoading(true);

    try {
      const token = localStorage.getItem("token");
      // Ganti field currentPassword menjadi oldPassword
      const response = await profileApi.changePassword(token, {
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.success) {
        showSuccessMessage(response.message || "Password berhasil diubah!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordDialog(false);
      } else {
        setError(response.message || "Gagal mengubah password");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Gagal mengubah password. Pastikan password lama benar."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post(
        "/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      showSuccessMessage("Berhasil logout!");

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // Handle email verification resend
  const handleResendVerification = async () => {
    try {
      await axios.post(
        "/api/user/resend-verification",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      showSuccessMessage("Email verifikasi telah dikirim!");
    } catch (error) {
      handleApiError(error, "Gagal mengirim email verifikasi");
    }
  };

  // Update the onUpdateSuccess handler
  const handleUpdateSuccess = async () => {
    await fetchUserProfile(); // fetch ulang data user dari backend
    setShowEditModal(false);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Spinner className="h-16 w-16 text-blue-500 mx-auto mb-6" />
            <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-ping"></div>
          </div>
          <Typography variant="h6" color="gray" className="animate-pulse">
            Memuat profil...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header with Cover */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

          {/* Profile Header Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Profile Image */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white">
                  <img
                    src={
                      userData.photoUrl
                        ? userData.photoUrl.startsWith("http")
                          ? userData.photoUrl
                          : `https://icbs.my.id${userData.photoUrl}`
                        : "/img/default-avatar.jpg"
                    }
                    alt={userData.displayName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/img/default-avatar.jpg";
                    }}
                  />
                </div>
                <button
                  className="absolute bottom-2 right-2 bg-white text-blue-600 hover:bg-blue-100 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 border border-blue-300"
                  onClick={() => setShowEditModal(true)}
                  type="button"
                >
                  <CameraIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="text-center sm:text-left text-white">
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                  <Typography
                    variant="h3"
                    className="font-bold text-white drop-shadow"
                  >
                    {userData.displayName}
                  </Typography>
                  {userData.isEmailVerified && (
                    <CheckBadgeIcon className="h-8 w-8 text-blue-300" />
                  )}
                </div>
                <Typography variant="lead" className="opacity-90 mb-2">
                  @{userData.username}
                </Typography>
                {userData.bio && (
                  <Typography
                    variant="paragraph"
                    className="opacity-80 max-w-md"
                  >
                    {userData.bio}
                  </Typography>
                )}
                <div className="flex items-center gap-4 justify-center sm:justify-start mt-4 text-sm opacity-80">
                  {userData.location && (
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="h-4 w-4" />
                      <span>{userData.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Bergabung {formatDate(userData.joinDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8 relative z-20">
        {/* Alert Messages */}
        {error && (
          <Alert color="red" className="mb-6 shadow-lg animate-pulse">
            <div className="flex items-center gap-2">
              <XMarkIcon className="h-5 w-5" />
              {error}
            </div>
          </Alert>
        )}
        {success && (
          <Alert color="green" className="mb-6 shadow-lg animate-pulse">
            <div className="flex items-center gap-2">
              <CheckIcon className="h-5 w-5" />
              {success}
            </div>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}

            {/* Profile Completeness */}

            {/* Email Verification Alert */}
            {!userData.isEmailVerified && (
              <Card className="shadow-xl border-0 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500">
                <CardBody className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <ShieldCheckIcon className="h-6 w-6 text-yellow-600" />
                    </div>
                    <Typography variant="h6" className="text-yellow-800">
                      Verifikasi Email
                    </Typography>
                  </div>
                  <Typography variant="small" color="gray" className="mb-4">
                    Verifikasi email Anda untuk mengakses semua fitur dan
                    meningkatkan keamanan akun.
                  </Typography>
                  <Button
                    size="sm"
                    color="yellow"
                    variant="gradient"
                    fullWidth
                    onClick={handleResendVerification}
                    className="flex items-center justify-center gap-2"
                  >
                    <EnvelopeIcon className="h-4 w-4" />
                    Kirim Ulang Verifikasi
                  </Button>
                </CardBody>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardBody className="p-6">
                <Typography
                  variant="h6"
                  className="mb-4 text-gray-800 font-semibold"
                >
                  Aksi Cepat
                </Typography>
                <div className="space-y-3">
                  <Button
                    variant="gradient"
                    color="blue"
                    fullWidth
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center justify-center gap-2 !text-white !bg-blue-600 hover:!bg-blue-700"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span className="font-semibold">Edit Profil</span>
                  </Button>
                  <Button
                    variant="outlined"
                    color="blue"
                    fullWidth
                    onClick={() => setShowPasswordDialog(true)}
                    className="flex items-center justify-center gap-2"
                  >
                    <KeyIcon className="h-4 w-4" />
                    Ubah Password
                  </Button>
                  <Button
                    variant="outlined"
                    color="red"
                    fullWidth
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2"
                  >
                    <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Details Card */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardBody className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <Typography variant="h5" className="text-gray-900 font-bold">
                    Informasi Detail
                  </Typography>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <UserCircleIcon className="h-5 w-5 text-white" />
                        </div>
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-semibold"
                        >
                          Username
                        </Typography>
                      </div>
                      <Typography
                        variant="h6"
                        className="text-gray-900 font-medium"
                      >
                        @{userData.username}
                      </Typography>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500 rounded-lg">
                          <EnvelopeIcon className="h-5 w-5 text-white" />
                        </div>
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-semibold"
                        >
                          Email
                        </Typography>
                      </div>
                      <Typography
                        variant="h6"
                        className="text-gray-900 font-medium break-all"
                      >
                        {userData.email}
                      </Typography>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4">
                    {userData.phone && (
                      <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-green-500 rounded-lg">
                            <PhoneIcon className="h-5 w-5 text-white" />
                          </div>
                          <Typography
                            variant="small"
                            color="gray"
                            className="font-semibold"
                          >
                            Telepon
                          </Typography>
                        </div>
                        <Typography
                          variant="h6"
                          className="text-gray-900 font-medium"
                        >
                          {userData.phone}
                        </Typography>
                      </div>
                    )}

                    {userData.website && (
                      <div className="p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border border-pink-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-pink-500 rounded-lg">
                            <LinkIcon className="h-5 w-5 text-white" />
                          </div>
                          <Typography
                            variant="small"
                            color="gray"
                            className="font-semibold"
                          >
                            Website
                          </Typography>
                        </div>
                        <Typography
                          variant="h6"
                          className="text-gray-900 font-medium"
                        >
                          <a
                            href={userData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {userData.website}
                          </a>
                        </Typography>
                      </div>
                    )}

                    <div className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-500 rounded-lg">
                          <ShieldCheckSolid className="h-5 w-5 text-white" />
                        </div>
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-semibold"
                        >
                          Status Verifikasi
                        </Typography>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            userData.isEmailVerified
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <Chip
                          value={
                            userData.isEmailVerified
                              ? "Terverifikasi"
                              : "Belum Terverifikasi"
                          }
                          color={userData.isEmailVerified ? "green" : "red"}
                          size="sm"
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                {userData.bio && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <Typography
                      variant="h6"
                      className="text-gray-800 font-semibold mb-3"
                    >
                      Tentang Saya
                    </Typography>
                    <Typography
                      variant="paragraph"
                      className="text-gray-700 leading-relaxed"
                    >
                      {userData.bio}
                    </Typography>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Activity Card */}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        userData={userData}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdateSuccess={handleUpdateSuccess}
        onError={(message) => {
          setError(message);
          setShowEditModal(false);
        }}
        onSuccess={(message) => {
          showSuccessMessage(message);
          setShowEditModal(false);
        }}
      />

      {/* Enhanced Password Change Dialog */}
      <Dialog
        open={showPasswordDialog}
        handler={setShowPasswordDialog}
        size="md"
        className="bg-transparent shadow-none"
      >
        <div className="mx-auto w-full max-w-[28rem]">
          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <KeyIcon className="h-6 w-6" />
                  </div>
                  <Typography variant="h5" className="font-bold">
                    Ubah Password
                  </Typography>
                </div>
                <IconButton
                  variant="text"
                  className="text-white hover:bg-white/20"
                  size="sm"
                  onClick={() => setShowPasswordDialog(false)}
                  disabled={passwordLoading}
                >
                  <XMarkIcon className="h-5 w-5" />
                </IconButton>
              </div>
            </CardHeader>

            <form onSubmit={handlePasswordSubmit}>
              <CardBody className="p-6">
                <div className="space-y-6">
                  <div>
                    <Input
                      type="password"
                      size="lg"
                      variant="outlined"
                      label="Password Saat Ini"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      disabled={passwordLoading}
                      className="!border-gray-300 focus:!border-blue-500"
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      size="lg"
                      variant="outlined"
                      label="Password Baru"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      disabled={passwordLoading}
                      className="!border-gray-300 focus:!border-blue-500"
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      size="lg"
                      variant="outlined"
                      label="Konfirmasi Password Baru"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      disabled={passwordLoading}
                      className="!border-gray-300 focus:!border-blue-500"
                    />
                  </div>
                </div>
              </CardBody>

              <CardFooter className="flex justify-end gap-3 p-6 border-t border-gray-200">
                <Button
                  variant="outlined"
                  color="gray"
                  onClick={() => {
                    setShowPasswordDialog(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  disabled={passwordLoading}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  color="blue"
                  variant="filled"
                  disabled={passwordLoading}
                  className="flex items-center gap-2 min-w-[120px] !text-white !bg-blue-600 hover:!bg-blue-700 font-semibold"
                >
                  {passwordLoading ? (
                    <>
                      <Spinner className="h-4 w-4" />
                      <span>Mengubah...</span>
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-4 w-4" />
                      <span>Simpan</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </Dialog>
    </div>
  );
};
export default Profile;
