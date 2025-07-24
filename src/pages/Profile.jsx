import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Typography,
  Input,
  Button,
  Alert,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Avatar,
  Spinner,
  IconButton,
} from "@material-tailwind/react";
import {
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  KeyIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import profileApi from "../api/profile"; // Pastikan path sesuai strukturmu

const Profile = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    displayName: "",
    isEmailVerified: false,
  });
  const [editData, setEditData] = useState({
    username: "",
    displayName: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true); // Changed to true initially
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch user profile data
  useEffect(() => {
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

          setUserData({
            username: user.username || user.email.split("@")[0],
            email: user.email,
            displayName: user.displayName || user.username,
            isEmailVerified: user.isEmailVerified || false,
          });
        } else {
          setError("Format data dari server tidak valid");
        }
      } catch (err) {
        setError("Gagal memuat profil");
      } finally {
        setLoading(false);
      }
    };

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

  // Handle edit data changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Start edit mode
  const startEdit = () => {
    setEditData({
      username: userData.username,
      displayName: userData.displayName,
    });
    setEditMode(true);
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditMode(false);
    setEditData({
      username: userData.username,
      displayName: userData.displayName,
    });
  };

  // Submit profile updates
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        "/api/user/edit-profile",
        {
          displayName: editData.displayName,
          // password: ... // jika ingin update password
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUserData((prev) => ({
          ...prev,
          displayName: response.data.user.displayName,
        }));
        showSuccessMessage(response.data.message);
        setEditMode(false);
      }
    } catch (error) {
      // handle error
    } finally {
      setUpdating(false);
    }
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
      await axios.post(
        "/api/user/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      showSuccessMessage("Password berhasil diubah!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordDialog(false);
    } catch (err) {
      handleApiError(err, "Gagal mengubah password");
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

      // Clear local storage and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      // Still clear storage and redirect even if API fails
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <Typography variant="h6" color="gray">
            Memuat profil...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Typography variant="h3" className="text-gray-900 font-bold mb-2">
            Profil Saya
          </Typography>
          <Typography variant="lead" color="gray" className="max-w-2xl mx-auto">
            Kelola informasi profil dan pengaturan akun Anda
          </Typography>
        </div>

        {/* Alert Messages */}
        {error && (
          <Alert color="red" className="mb-6 max-w-2xl mx-auto">
            {error}
          </Alert>
        )}
        {success && (
          <Alert color="green" className="mb-6 max-w-2xl mx-auto">
            {success}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <Typography
                  variant="h5"
                  className="text-gray-900 font-semibold"
                >
                  Informasi Profil
                </Typography>
                {!editMode && (
                  <IconButton
                    variant="text"
                    color="blue"
                    onClick={startEdit}
                    className="rounded-full"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </IconButton>
                )}
              </div>

              {!editMode ? (
                // View Mode
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                    {/* <Avatar
                      size="xl"
                      className="bg-blue-500 text-white"
                      alt={userData.displayName}
                    >
                      {userData.displayName.charAt(0).toUpperCase()}
                    </Avatar> */}
                    <div>
                      <Typography variant="h6" className="text-gray-900">
                        {userData.displayName}
                      </Typography>
                      <Typography variant="small" color="gray">
                        @{userData.username}
                      </Typography>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <UserCircleIcon className="h-5 w-5 text-gray-500" />
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-medium"
                        >
                          Username
                        </Typography>
                      </div>
                      <Typography variant="h6" className="text-gray-900">
                        @{userData.username}
                      </Typography>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-medium"
                        >
                          Email
                        </Typography>
                      </div>
                      <Typography
                        variant="h6"
                        className="text-gray-900 break-all"
                      >
                        {userData.email}
                      </Typography>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <ShieldCheckIcon className="h-5 w-5 text-gray-500" />
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-medium"
                        >
                          Status Email
                        </Typography>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            userData.isEmailVerified
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <Typography
                          variant="small"
                          className={
                            userData.isEmailVerified
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {userData.isEmailVerified
                            ? "Terverifikasi"
                            : "Belum Terverifikasi"}
                        </Typography>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-medium"
                        >
                          Nama Tampilan
                        </Typography>
                      </div>
                      <Typography variant="h6" className="text-gray-900">
                        {userData.displayName}
                      </Typography>
                    </div>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <div className="space-y-4">
                  <div>
                    <Typography variant="h6" className="mb-2 text-gray-700">
                      Username
                    </Typography>
                    <Input
                      name="username"
                      value={editData.username}
                      onChange={handleEditChange}
                      placeholder="Masukkan username"
                      required
                      disabled={updating}
                      className="!border-gray-300 focus:!border-blue-500"
                    />
                  </div>

                  <div>
                    <Typography variant="h6" className="mb-2 text-gray-700">
                      Nama Tampilan
                    </Typography>
                    <Input
                      name="displayName"
                      value={editData.displayName}
                      onChange={handleEditChange}
                      placeholder="Masukkan nama tampilan"
                      required
                      disabled={updating}
                      className="!border-gray-300 focus:!border-blue-500"
                    />
                  </div>

                  <div>
                    <Typography variant="h6" className="mb-2 text-gray-700">
                      Email
                    </Typography>
                    <Input
                      value={userData.email}
                      disabled
                      className="!bg-gray-100 !border-gray-300"
                    />
                    <Typography variant="small" color="gray" className="mt-1">
                      Email tidak dapat diubah
                    </Typography>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      onClick={handleProfileUpdate}
                      color="blue"
                      disabled={updating}
                      className="flex items-center space-x-2"
                    >
                      {updating ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        <CheckIcon className="h-4 w-4" />
                      )}
                      <span>{updating ? "Menyimpan..." : "Simpan"}</span>
                    </Button>
                    <Button
                      variant="outlined"
                      color="gray"
                      onClick={cancelEdit}
                      disabled={updating}
                      className="flex items-center space-x-2"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      <span>Batal</span>
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Actions Card */}
          <div className="space-y-6">
            <Card className="p-6 shadow-lg">
              <Typography
                variant="h6"
                className="mb-4 text-gray-900 font-semibold"
              >
                Pengaturan Akun
              </Typography>
              <div className="space-y-3">
                <Button
                  variant="outlined"
                  color="blue"
                  fullWidth
                  onClick={() => setShowPasswordDialog(true)}
                  className="flex items-center justify-center space-x-2"
                >
                  <KeyIcon className="h-4 w-4" />
                  <span>Ubah Password</span>
                </Button>
                <Button
                  variant="outlined"
                  color="red"
                  fullWidth
                  onClick={handleLogout}
                  className="flex items-center justify-center space-x-2"
                >
                  <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </Card>

            {!userData.isEmailVerified && (
              <Card className="p-6 shadow-lg border-l-4 border-yellow-500">
                <Typography variant="h6" className="text-yellow-800 mb-2">
                  Email Belum Terverifikasi
                </Typography>
                <Typography variant="small" color="gray" className="mb-3">
                  Silakan verifikasi email Anda untuk mengakses semua fitur.
                </Typography>
                <Button
                  size="sm"
                  color="yellow"
                  variant="outlined"
                  fullWidth
                  onClick={handleResendVerification}
                >
                  Kirim Ulang Verifikasi
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Dialog */}
      <Dialog
        open={showPasswordDialog}
        handler={setShowPasswordDialog}
        size="sm"
      >
        <DialogHeader className="flex items-center space-x-2">
          <KeyIcon className="h-6 w-6 text-blue-500" />
          <span>Ubah Password</span>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div>
            <Typography variant="h6" className="mb-2 text-gray-700">
              Password Saat Ini
            </Typography>
            <Input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
              disabled={passwordLoading}
              className="!border-gray-300 focus:!border-blue-500"
            />
          </div>
          <div>
            <Typography variant="h6" className="mb-2 text-gray-700">
              Password Baru
            </Typography>
            <Input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              disabled={passwordLoading}
              className="!border-gray-300 focus:!border-blue-500"
            />
          </div>
          <div>
            <Typography variant="h6" className="mb-2 text-gray-700">
              Konfirmasi Password Baru
            </Typography>
            <Input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
              disabled={passwordLoading}
              className="!border-gray-300 focus:!border-blue-500"
            />
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button
            variant="text"
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
            onClick={handlePasswordSubmit}
            color="blue"
            disabled={passwordLoading}
            className="flex items-center space-x-2"
          >
            {passwordLoading ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <CheckIcon className="h-4 w-4" />
            )}
            <span>{passwordLoading ? "Mengubah..." : "Simpan"}</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Profile;
