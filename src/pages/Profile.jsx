import React, { useState, useEffect } from "react";
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
  Textarea,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [userData, setUserData] = useState({
    displayName: "",
    email: "",
    bio: "",
    avatar: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUserData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Gagal memuat profil. Silakan coba lagi.");
      setLoading(false);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        "/api/auth/profile",
        {
          displayName: userData.displayName,
          bio: userData.bio,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUserData(response.data);
      setEditMode(false);
      setSuccess("Profil berhasil diperbarui!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Gagal memperbarui profil. Silakan coba lagi.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Password baru dan konfirmasi password tidak cocok");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
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
      setSuccess("Password berhasil diubah!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Gagal mengubah password. Silakan coba lagi."
      );
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete("/api/auth/account", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      setError("Gagal menghapus akun. Silakan coba lagi.");
      setTimeout(() => setError(""), 3000);
    }
  };

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
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      setError("Gagal logout. Silakan coba lagi.");
      setTimeout(() => setError(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Typography variant="h5">Memuat profil...</Typography>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 max-w-3xl mx-auto">
        <Typography variant="h4" className="mb-6 text-center">
          Profil Pengguna
        </Typography>

        {error && (
          <Alert color="red" className="mb-4">
            {error}
          </Alert>
        )}

        {success && (
          <Alert color="green" className="mb-4">
            {success}
          </Alert>
        )}

        {!editMode ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4">
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Typography variant="h3" className="text-gray-600">
                    {userData.displayName?.charAt(0)?.toUpperCase() || "U"}
                  </Typography>
                )}
              </div>
              <Typography variant="h5">{userData.displayName}</Typography>
              <Typography color="gray" className="mt-1">
                {userData.email}
              </Typography>
            </div>

            {userData.bio && (
              <div>
                <Typography variant="h6" className="mb-2">
                  Bio
                </Typography>
                <Typography>{userData.bio}</Typography>
              </div>
            )}

            <div className="flex space-x-4 pt-6">
              <Button color="blue" onClick={() => setEditMode(true)} fullWidth>
                Edit Profil
              </Button>
              <Button
                color="gray"
                onClick={() => setShowPasswordForm(true)}
                fullWidth
              >
                Ubah Password
              </Button>
              <Button color="red" onClick={handleLogout} fullWidth>
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4">
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Typography variant="h3" className="text-gray-600">
                    {userData.displayName?.charAt(0)?.toUpperCase() || "U"}
                  </Typography>
                )}
              </div>
              <Button variant="outlined" size="sm" className="mb-4">
                Ubah Foto Profil
              </Button>
            </div>

            <div>
              <Typography variant="h6" className="mb-2">
                Nama Tampilan
              </Typography>
              <Input
                name="displayName"
                value={userData.displayName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Typography variant="h6" className="mb-2">
                Email
              </Typography>
              <Input
                name="email"
                value={userData.email}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div>
              <Typography variant="h6" className="mb-2">
                Bio
              </Typography>
              <Textarea
                name="bio"
                value={userData.bio || ""}
                onChange={handleInputChange}
                rows={4}
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <Button type="submit" color="blue" fullWidth>
                Simpan Perubahan
              </Button>
              <Button
                color="red"
                variant="outlined"
                onClick={() => setEditMode(false)}
                fullWidth
              >
                Batal
              </Button>
            </div>
          </form>
        )}

        {!editMode && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Typography variant="h6" className="mb-4">
              Zona Berbahaya
            </Typography>
            <Button
              color="red"
              variant="outlined"
              onClick={() => setOpenDeleteDialog(true)}
              fullWidth
            >
              Hapus Akun
            </Button>
          </div>
        )}
      </Card>

      {/* Password Change Form Dialog */}
      <Dialog
        open={showPasswordForm}
        handler={() => setShowPasswordForm(!showPasswordForm)}
      >
        <DialogHeader>Ubah Password</DialogHeader>
        <form onSubmit={handlePasswordSubmit}>
          <DialogBody>
            <div className="space-y-4">
              <Input
                type="password"
                name="currentPassword"
                label="Password Saat Ini"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
              <Input
                type="password"
                name="newPassword"
                label="Password Baru"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
              <Input
                type="password"
                name="confirmPassword"
                label="Konfirmasi Password Baru"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={() => setShowPasswordForm(false)}
              className="mr-2"
            >
              Batal
            </Button>
            <Button type="submit" color="blue">
              Simpan Password Baru
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog
        open={openDeleteDialog}
        handler={() => setOpenDeleteDialog(!openDeleteDialog)}
      >
        <DialogHeader>Konfirmasi Penghapusan Akun</DialogHeader>
        <DialogBody>
          <Typography>
            Apakah Anda yakin ingin menghapus akun Anda? Semua data akan dihapus
            secara permanen dan tidak dapat dikembalikan.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setOpenDeleteDialog(false)}
            className="mr-2"
          >
            Batal
          </Button>
          <Button color="red" onClick={handleDeleteAccount}>
            Hapus Akun
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Profile;
