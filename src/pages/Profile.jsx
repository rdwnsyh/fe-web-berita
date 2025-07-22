import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Alert,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Avatar,
  Spinner,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  IconButton,
  Badge,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input, Textarea, PasswordInput } from "../components/Form/Input";

const Profile = () => {
  // State untuk data user
  const [userData, setUserData] = useState({
    displayName: "",
    email: "",
    bio: "",
    photoUrl: "",
  });

  // State untuk form edit
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
  });

  // State untuk UI
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State untuk dialog dan modal
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // State untuk password
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // State untuk avatar
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef();

  const navigate = useNavigate();

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = response.data;
      setUserData(data);
      setFormData({
        displayName: data.displayName || "",
        bio: data.bio || "",
      });
    } catch (err) {
      handleApiError(err, "Gagal memuat profil");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Handle API errors
  const handleApiError = (error, defaultMessage) => {
    const message = error.response?.data?.message || defaultMessage;
    setError(message);
    setTimeout(() => setError(""), 5000);
  };

  // Handle success messages
  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 5000);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("File harus berupa gambar");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB");
        return;
      }

      setAvatarFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected avatar
  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit profile updates
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.displayName.trim()) {
      setError("Nama tampilan tidak boleh kosong");
      return;
    }

    if (formData.displayName.length < 2) {
      setError("Nama tampilan minimal 2 karakter");
      return;
    }

    if (formData.displayName.length > 50) {
      setError("Nama tampilan maksimal 50 karakter");
      return;
    }

    if (formData.bio.length > 500) {
      setError("Bio maksimal 500 karakter");
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const updateData = new FormData();
      updateData.append("displayName", formData.displayName.trim());
      updateData.append("bio", formData.bio.trim());

      if (avatarFile) {
        updateData.append("photo", avatarFile);
      }

      const response = await axios.patch("/api/auth/profile", updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Update state with new data
      const updatedData = response.data;
      setUserData(updatedData);

      // Clear avatar selection
      setAvatarFile(null);
      setAvatarPreview("");

      // Update localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          displayName: updatedData.displayName,
          photoUrl: updatedData.photoUrl,
        })
      );

      showSuccess("Profil berhasil diperbarui!");
      setActiveTab("profile"); // Switch back to view mode
    } catch (err) {
      handleApiError(err, "Gagal memperbarui profil");
    } finally {
      setUpdating(false);
    }
  };

  // Change password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!passwordData.currentPassword) {
      setError("Password saat ini tidak boleh kosong");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password baru minimal 6 karakter");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Password baru dan konfirmasi tidak cocok");
      return;
    }

    try {
      setPasswordLoading(true);
      setError("");

      await axios.post(
        "/api/auth/change-password",
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

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswords({
        current: false,
        new: false,
        confirm: false,
      });

      setShowPasswordForm(false);
      showSuccess("Password berhasil diubah!");
    } catch (err) {
      handleApiError(err, "Gagal mengubah password");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    try {
      await axios.delete("/api/auth/account", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Clear storage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      navigate("/", { replace: true });
    } catch (err) {
      handleApiError(err, "Gagal menghapus akun");
    }
  };

  // Logout
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
    } catch (err) {
      console.warn("Logout request failed:", err);
    } finally {
      // Clear storage regardless of API response
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Spinner className="h-8 w-8 text-blue-500 mx-auto mb-4" />
          <Typography variant="h6" color="gray" className="animate-pulse">
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
          <Typography variant="h3" color="blue-gray" className="font-bold">
            Profil Pengguna
          </Typography>
          <Typography variant="lead" color="gray" className="mt-2">
            Kelola informasi profil dan pengaturan akun Anda
          </Typography>
        </div>

        {/* Alert Messages */}
        {error && (
          <Alert
            color="red"
            className="mb-6 shadow-md"
            dismissible
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            color="green"
            className="mb-6 shadow-md"
            dismissible
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}

        {/* Main Content */}
        <Card className="shadow-2xl border-0">
          <CardBody className="p-0">
            <Tabs value={activeTab} className="w-full">
              {/* Tabs Header */}
              <TabsHeader className="grid w-full grid-cols-3 rounded-none bg-gray-100 p-1">
                <Tab
                  value="profile"
                  onClick={() => setActiveTab("profile")}
                  className={`py-3 px-6 font-medium text-sm transition-all ${
                    activeTab === "profile"
                      ? "bg-white text-blue-600 shadow-md"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Lihat Profil
                </Tab>
                <Tab
                  value="edit"
                  onClick={() => setActiveTab("edit")}
                  className={`py-3 px-6 font-medium text-sm transition-all ${
                    activeTab === "edit"
                      ? "bg-white text-blue-600 shadow-md"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Edit Profil
                </Tab>
                <Tab
                  value="settings"
                  onClick={() => setActiveTab("settings")}
                  className={`py-3 px-6 font-medium text-sm transition-all ${
                    activeTab === "settings"
                      ? "bg-white text-blue-600 shadow-md"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Pengaturan
                </Tab>
              </TabsHeader>

              {/* Tabs Body */}
              <TabsBody className="p-8">
                {/* Profile View Tab */}
                <TabPanel value="profile" className="p-0">
                  <div className="text-center space-y-6">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        <Avatar
                          src={userData.photoUrl || ""}
                          alt="Profile"
                          size="xxl"
                          className="ring-4 ring-blue-500/20 shadow-xl"
                        />
                        <Badge
                          content=""
                          className="bg-green-500 min-w-[12px] min-h-[12px] w-3 h-3"
                          placement="bottom-end"
                          containerProps={{ className: "ring-2 ring-white" }}
                        />
                      </div>

                      <div className="text-center space-y-2">
                        <Typography
                          variant="h4"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {userData.displayName || "Nama tidak tersedia"}
                        </Typography>
                        <Typography
                          variant="lead"
                          color="gray"
                          className="flex items-center justify-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          {userData.email}
                        </Typography>
                      </div>
                    </div>

                    {/* Bio Section */}
                    {userData.bio && (
                      <div className="bg-gray-50 rounded-xl p-6 max-w-2xl mx-auto">
                        <Typography
                          variant="h6"
                          color="blue-gray"
                          className="mb-3 font-semibold"
                        >
                          Tentang Saya
                        </Typography>
                        <Typography
                          color="gray"
                          className="leading-relaxed text-justify"
                        >
                          {userData.bio}
                        </Typography>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto pt-6">
                      <Button
                        color="blue"
                        onClick={() => setActiveTab("edit")}
                        className="flex items-center justify-center gap-2 py-3"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit Profil
                      </Button>
                      <Button
                        color="red"
                        variant="outlined"
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 py-3"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Logout
                      </Button>
                    </div>
                  </div>
                </TabPanel>

                {/* Edit Profile Tab */}
                <TabPanel value="edit" className="p-0">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Upload Section */}
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        <Avatar
                          src={avatarPreview || userData.photoUrl || ""}
                          alt="Profile Preview"
                          size="xxl"
                          className="ring-4 ring-blue-500/20 shadow-xl"
                        />
                        {(avatarPreview || avatarFile) && (
                          <IconButton
                            color="red"
                            size="sm"
                            className="absolute -top-2 -right-2 rounded-full"
                            onClick={removeAvatar}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </IconButton>
                        )}
                      </div>

                      <div className="text-center space-y-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          id="avatar-upload"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                        <label htmlFor="avatar-upload">
                          <Button
                            as="span"
                            variant="outlined"
                            color="blue"
                            className="cursor-pointer flex items-center gap-2"
                            disabled={avatarLoading}
                          >
                            {avatarLoading ? (
                              <Spinner className="h-4 w-4" />
                            ) : (
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            {avatarFile ? "Ganti Foto" : "Pilih Foto Profil"}
                          </Button>
                        </label>
                        {avatarFile && (
                          <Typography
                            variant="small"
                            color="gray"
                            className="font-medium"
                          >
                            {avatarFile.name}
                          </Typography>
                        )}
                        <Typography variant="small" color="gray">
                          JPG, PNG, WebP. Maksimal 5MB.
                        </Typography>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        name="displayName"
                        label="Nama Tampilan"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        required
                        helperText={`${formData.displayName.length}/50 karakter`}
                        disabled={updating}
                      />

                      <Input
                        name="email"
                        label="Email"
                        value={userData.email}
                        disabled
                        helperText="Email tidak dapat diubah"
                      />
                    </div>

                    <Textarea
                      name="bio"
                      label="Bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      helperText={`${formData.bio.length}/500 karakter`}
                      disabled={updating}
                    />

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button
                        type="submit"
                        color="blue"
                        className="flex items-center justify-center gap-2 py-3"
                        disabled={updating}
                        fullWidth
                      >
                        {updating ? (
                          <>
                            <Spinner className="h-4 w-4" />
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Simpan Perubahan
                          </>
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="outlined"
                        color="gray"
                        onClick={() => {
                          setActiveTab("profile");
                          // Reset form to original data
                          setFormData({
                            displayName: userData.displayName || "",
                            bio: userData.bio || "",
                          });
                          removeAvatar();
                        }}
                        disabled={updating}
                        fullWidth
                      >
                        Batal
                      </Button>
                    </div>
                  </form>
                </TabPanel>

                {/* Settings Tab */}
                <TabPanel value="settings" className="p-0">
                  <div className="space-y-8">
                    {/* Security Section */}
                    <div className="bg-blue-50 rounded-xl p-6">
                      <Typography
                        variant="h6"
                        color="blue-gray"
                        className="mb-4 font-semibold"
                      >
                        Keamanan Akun
                      </Typography>
                      <div className="space-y-4">
                        <Button
                          color="blue"
                          variant="outlined"
                          onClick={() => setShowPasswordForm(true)}
                          className="flex items-center gap-2 w-full sm:w-auto"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Ubah Password
                        </Button>
                        <Typography variant="small" color="gray">
                          Disarankan untuk menggunakan password yang kuat dan
                          unik.
                        </Typography>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                      <Typography
                        variant="h6"
                        color="red"
                        className="mb-4 font-semibold"
                      >
                        Zona Berbahaya
                      </Typography>
                      <div className="space-y-4">
                        <Typography color="gray" className="text-sm">
                          Tindakan di bawah ini tidak dapat dibatalkan. Harap
                          berhati-hati.
                        </Typography>
                        <Button
                          color="red"
                          variant="outlined"
                          onClick={() => setOpenDeleteDialog(true)}
                          className="flex items-center gap-2 w-full sm:w-auto"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                              clipRule="evenodd"
                            />
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Hapus Akun Permanen
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabsBody>
            </Tabs>
          </CardBody>
        </Card>

        {/* Password Change Dialog */}
        <Dialog
          open={showPasswordForm}
          handler={setShowPasswordForm}
          size="md"
          className="bg-white"
        >
          <DialogHeader className="bg-blue-50 text-blue-900 rounded-t-lg">
            <Typography variant="h5" className="font-semibold">
              Ubah Password
            </Typography>
          </DialogHeader>

          <form onSubmit={handlePasswordSubmit}>
            <DialogBody className="space-y-6 p-6">
              <PasswordInput
                name="currentPassword"
                label="Password Saat Ini"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                showPassword={showPasswords.current}
                onTogglePassword={() => togglePasswordVisibility("current")}
                required
                disabled={passwordLoading}
              />

              <PasswordInput
                name="newPassword"
                label="Password Baru"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                showPassword={showPasswords.new}
                onTogglePassword={() => togglePasswordVisibility("new")}
                helperText="Minimal 6 karakter"
                required
                disabled={passwordLoading}
              />

              <PasswordInput
                name="confirmPassword"
                label="Konfirmasi Password Baru"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                showPassword={showPasswords.confirm}
                onTogglePassword={() => togglePasswordVisibility("confirm")}
                error={
                  passwordData.confirmPassword &&
                  passwordData.newPassword !== passwordData.confirmPassword
                    ? "Password tidak cocok"
                    : ""
                }
                required
                disabled={passwordLoading}
              />
            </DialogBody>

            <DialogFooter className="bg-gray-50 rounded-b-lg space-x-4">
              <Button
                variant="outlined"
                color="gray"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  setShowPasswords({
                    current: false,
                    new: false,
                    confirm: false,
                  });
                }}
                disabled={passwordLoading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                color="blue"
                disabled={passwordLoading}
                className="flex items-center gap-2"
              >
                {passwordLoading ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Password"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog open={openDeleteDialog} handler={setOpenDeleteDialog} size="md">
          <DialogHeader className="bg-red-50 text-red-900 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <Typography variant="h5" className="font-semibold">
                Konfirmasi Penghapusan Akun
              </Typography>
            </div>
          </DialogHeader>

          <DialogBody className="p-6">
            <div className="space-y-4">
              <Typography color="gray" className="leading-relaxed">
                Apakah Anda yakin ingin menghapus akun Anda? Tindakan ini akan:
              </Typography>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>Menghapus semua data profil Anda secara permanen</li>
                <li>Menghapus semua konten yang pernah Anda buat</li>
                <li>Tidak dapat dibatalkan atau dikembalikan</li>
              </ul>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <Typography
                  variant="small"
                  color="red"
                  className="font-semibold"
                >
                  Peringatan: Tindakan ini tidak dapat dibatalkan!
                </Typography>
              </div>
            </div>
          </DialogBody>

          <DialogFooter className="bg-gray-50 rounded-b-lg space-x-4">
            <Button
              variant="outlined"
              color="gray"
              onClick={() => setOpenDeleteDialog(false)}
            >
              Batal
            </Button>
            <Button
              color="red"
              onClick={handleDeleteAccount}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              Ya, Hapus Akun
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </div>
  );
};

export default Profile;
