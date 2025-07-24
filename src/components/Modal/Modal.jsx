import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Typography,
  Spinner,
  IconButton,
} from "@material-tailwind/react";
import {
  CheckIcon,
  XMarkIcon,
  UserCircleIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import profileApi from "../../api/profile"; // Import profile API service
import { Input } from "../../components/Form/Input";
import { Card, CardHeader, CardBody, CardFooter } from "../Card/Card";

export function Modal({
  userData,
  onUpdateSuccess,
  onError,
  onSuccess,
  isOpen,
  onClose,
}) {
  const [editData, setEditData] = useState({
    username: "",
    displayName: "",
  });
  const [updating, setUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Initialize edit data when modal opens or userData changes
  useEffect(() => {
    if (userData) {
      setEditData({
        username: userData.username || "",
        displayName: userData.displayName || "",
      });
    }
  }, [userData]);

  // Handle input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form data
  const validateForm = () => {
    if (!editData.username.trim()) {
      onError("Username tidak boleh kosong");
      return false;
    }
    if (!editData.displayName.trim()) {
      onError("Nama tampilan tidak boleh kosong");
      return false;
    }
    if (editData.username.length < 3) {
      onError("Username minimal 3 karakter");
      return false;
    }
    if (editData.displayName.length < 2) {
      onError("Nama tampilan minimal 2 karakter");
      return false;
    }
    return true;
  };

  // Submit profile updates
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setUpdating(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        onError("Token tidak ditemukan, silakan login kembali");
        return;
      }

      const profileData = {
        username: editData.username.trim(),
        displayName: editData.displayName.trim(),
      };

      const response = await profileApi.updateProfile(token, profileData);

      if (response.success) {
        // Update local storage with new user data
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = {
          ...currentUser,
          username: response.user.username || editData.username,
          displayName: response.user.displayName || editData.displayName,
          photoUrl: response.user.photoUrl || currentUser.photoUrl || "",
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Update parent component state
        onUpdateSuccess({
          ...userData,
          username: response.user.username || editData.username,
          displayName: response.user.displayName || editData.displayName,
          photoUrl: response.user.photoUrl || userData.photoUrl || "",
        });

        onSuccess(response.message || "Profil berhasil diperbarui!");
        onClose();
      } else {
        onError(response.message || "Gagal memperbarui profil");
      }
    } catch (error) {
      console.error("Profile update error:", error);

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        if (status === 401) {
          onError("Sesi telah berakhir, silakan login kembali");
        } else if (status === 400) {
          onError(message || "Data yang dikirim tidak valid");
        } else if (status === 409) {
          onError(message || "Username sudah digunakan");
        } else {
          onError(message || "Terjadi kesalahan pada server");
        }
      } else if (error.request) {
        onError("Tidak dapat terhubung ke server");
      } else {
        onError("Terjadi kesalahan tidak terduga");
      }
    } finally {
      setUpdating(false);
    }
  };

  // Simplified image handling function
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Only allow image types and max 2MB
    if (!file.type.startsWith("image/")) {
      onError("File harus berupa gambar (jpg, jpeg, png, gif, webp)");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      onError("Ukuran gambar maksimal 2MB");
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;
    setUploadingImage(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        onError("Token tidak ditemukan");
        return;
      }
      const response = await profileApi.updateProfileImage(
        token,
        selectedImage
      );
      if (response.success) {
        await onUpdateSuccess();
        onSuccess("Foto profil berhasil diperbarui!");
        setSelectedImage(null);
        setImagePreview(null);
      }
    } catch {
      onError("Gagal mengupload gambar");
    } finally {
      setUploadingImage(false);
    }
  };

  // Cleanup image preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Reset form when closing modal
  const handleClose = () => {
    if (!updating && !uploadingImage) {
      setEditData({
        username: userData?.username || "",
        displayName: userData?.displayName || "",
      });
      setSelectedImage(null);
      setImagePreview(null);
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      handler={handleClose}
      size="sm"
      className="bg-transparent shadow-none"
      dismiss={{ enabled: !updating }}
    >
      <Card className="mx-auto w-full max-w-[32rem]">
        <CardHeader className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center">
                <UserCircleIcon className="h-6 w-6 text-blue-500 mr-2" />
                <Typography variant="h6">Edit Profil</Typography>
              </div>
              <Typography variant="small" color="gray" className="mt-1">
                Perbarui informasi profil Anda
              </Typography>
            </div>
            <IconButton
              variant="text"
              color="gray"
              size="sm"
              onClick={handleClose}
              disabled={updating}
            >
              <XMarkIcon className="h-5 w-5" />
            </IconButton>
          </div>
        </CardHeader>

        <form onSubmit={handleProfileUpdate}>
          <CardBody className="p-6">
            <div className="flex flex-col gap-6">
              {/* Add image upload section at the top */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-24 h-24 overflow-hidden">
                  <img
                    src={
                      imagePreview
                        ? imagePreview
                        : userData?.photoUrl
                        ? userData.photoUrl.startsWith("http")
                          ? userData.photoUrl
                          : `https://icbs.my.id${userData.photoUrl}`
                        : "/img/default-avatar.jpg"
                    }
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/img/default-avatar.jpg";
                    }}
                  />
                  <label className="absolute bottom-0 right-0 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      disabled={updating || uploadingImage}
                    />
                    <div className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600">
                      <PhotoIcon className="h-4 w-4" />
                    </div>
                  </label>
                </div>
                {selectedImage && (
                  <Button
                    size="sm"
                    color="blue"
                    onClick={handleImageUpload}
                    disabled={updating || uploadingImage}
                    className="flex items-center gap-2"
                  >
                    {uploadingImage ? (
                      <>
                        <Spinner className="h-4 w-4" />
                        <span>Mengupload...</span>
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-4 w-4" />
                        <span>Upload Foto</span>
                      </>
                    )}
                  </Button>
                )}
              </div>

              <Input
                size="lg"
                // label="Username"
                name="username"
                value={editData.username}
                onChange={handleEditChange}
                containerClassName="!border-t-blue-gray-200 focus:!border-t-gray-900"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <Typography
                variant="small"
                color="gray"
                className="-mt-4 text-xs"
              >
                Username minimal 3 karakter
              </Typography>

              <Input
                size="lg"
                // label="Nama Tampilan"
                name="displayName"
                value={editData.displayName}
                onChange={handleEditChange}
                containerClassName="!border-t-blue-gray-200 focus:!border-t-gray-900"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <Typography
                variant="small"
                color="gray"
                className="-mt-4 text-xs"
              >
                Nama yang akan ditampilkan di profil
              </Typography>

              <Input
                size="lg"
                // label="Email"
                value={userData?.email || ""}
                disabled
                readOnly
                containerClassName="!border-t-blue-gray-200 bg-gray-50"
                className="!border-t-blue-gray-200 bg-gray-50"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <Typography
                variant="small"
                color="gray"
                className="-mt-4 text-xs"
              >
                Email tidak dapat diubah
              </Typography>
            </div>
          </CardBody>

          <CardFooter className="flex justify-end gap-2 p-4 border-t border-gray-200">
            <Button
              variant="text"
              color="gray"
              onClick={handleClose}
              disabled={updating}
              size="sm"
            >
              Batal
            </Button>
            <Button
              type="submit"
              color="blue"
              disabled={updating}
              size="sm"
              className="flex items-center gap-2"
            >
              {updating ? (
                <>
                  <Spinner className="h-4 w-4" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Dialog>
  );
}
