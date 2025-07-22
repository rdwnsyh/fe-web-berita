import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

// Komponen Form Login - Hapus alert dari sini karena akan ditangani di page level
export function LoginForm({
  onSubmit,
  loading,
  email,
  setEmail,
  password,
  setPassword,
}) {
  return (
    <Card color="transparent" shadow={false} className="p-6">
      <Typography variant="h4" color="blue-gray" className="mb-2">
        Masuk ke Akun Anda
      </Typography>
      <form className="mt-4 space-y-6" onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email<span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size="lg"
              className="!border !border-gray-300 !rounded-md focus:!border-blue-500"
              labelProps={{ className: "hidden" }}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password<span className="text-red-500">*</span>
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              size="lg"
              className="!border !border-gray-300 !rounded-md focus:!border-blue-500"
              labelProps={{ className: "hidden" }}
              disabled={loading}
            />
          </div>
        </div>
        <Button
          type="submit"
          color="blue"
          fullWidth
          disabled={loading}
          className="mt-6"
        >
          {loading ? "Memproses..." : "Masuk"}
        </Button>
      </form>
      <Typography color="gray" className="mt-4 text-center font-normal">
        Belum punya akun?{" "}
        <Link
          to="/register"
          className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
        >
          Daftar sekarang
        </Link>
      </Typography>
    </Card>
  );
}

// Komponen Form Register - Hapus alert dari sini karena akan ditangani di page level
export function RegisterForm({ onSubmit, loading, formData, handleChange }) {
  return (
    <Card color="transparent" shadow={false} className="p-6">
      <Typography variant="h4" color="blue-gray" className="mb-2">
        Buat Akun Baru
      </Typography>
      <form className="mt-4 space-y-6" onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Username<span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              size="lg"
              className="!border !border-gray-300 !rounded-md focus:!border-blue-500"
              labelProps={{ className: "hidden" }}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email<span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              size="lg"
              className="!border !border-gray-300 !rounded-md focus:!border-blue-500"
              labelProps={{ className: "hidden" }}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password (minimal 8 karakter)
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              size="lg"
              className="!border !border-gray-300 !rounded-md focus:!border-blue-500"
              labelProps={{ className: "hidden" }}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Konfirmasi Password<span className="text-red-500">*</span>
            </label>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={8}
              size="lg"
              className="!border !border-gray-300 !rounded-md focus:!border-blue-500"
              labelProps={{ className: "hidden" }}
              disabled={loading}
            />
          </div>
        </div>
        <Button
          type="submit"
          color="blue"
          fullWidth
          disabled={loading}
          className="mt-6"
        >
          {loading ? "Memproses..." : "Daftar"}
        </Button>
      </form>
      <Typography color="gray" className="mt-4 text-center font-normal">
        Sudah punya akun?{" "}
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
        >
          Masuk disini
        </Link>
      </Typography>
    </Card>
  );
}
