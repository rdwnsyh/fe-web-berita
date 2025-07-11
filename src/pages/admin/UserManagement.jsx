import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Avatar,
  Select,
  Option,
} from "@material-tailwind/react";
import api from "../../api/api";

const UserManagement = () => {
  const [state, setState] = useState({
    users: [],
    loading: true,
    error: null,
    openDialog: false,
    currentUser: null,
  });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    displayName: "",
    role: "user",
    isActive: true,
  });

  const fetchUsers = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const users = await api.get("/users");
      setState((prev) => ({ ...prev, users, loading: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error.toString(),
        loading: false,
      }));
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fixed handleSubmit function
  const handleSubmit = async () => {
    try {
      setState((prev) => ({
        ...prev,
        error: null,
        fieldErrors: {},
        submitting: true,
      }));

      // 1. Prepare payload with validation
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        ...(formData.name && { name: formData.name.trim() }),
        ...(formData.displayName && {
          displayName: formData.displayName.trim(),
        }),
        role: formData.role,
        isActive: formData.isActive,
      };

      // 2. Client-side validation
      const fieldErrors = {};
      if (!payload.username) fieldErrors.username = "Username is required";
      if (!payload.email) fieldErrors.email = "Email is required";

      if (Object.keys(fieldErrors).length > 0) {
        setState((prev) => ({ ...prev, fieldErrors }));
        throw new Error("Please fix the validation errors");
      }

      // 3. Debug before sending
      console.debug("Submitting:", {
        mode: state.currentUser ? "UPDATE" : "CREATE",
        id: state.currentUser?._id,
        payload,
      });

      let response;
      if (state.currentUser) {
        if (!state.currentUser._id) {
          throw new Error("Invalid user ID for update");
        }

        response = await api.put(`/users/${state.currentUser._id}`, payload);
      } else {
        response = await api.post("/users", payload);
      }

      // 4. Handle response
      if (!response?.success) {
        throw new Error(response?.message || "Operation failed without error");
      }

      // 5. Success handling
      await fetchUsers();
      setState((prev) => ({
        ...prev,
        openDialog: false,
        submitting: false,
        success: "User saved successfully",
      }));

      // Auto-clear success message
      setTimeout(() => {
        setState((prev) => ({ ...prev, success: null }));
      }, 3000);
    } catch (error) {
      console.error("Submission Failed:", {
        error: error.message,
        stack: error.stack,
        response: error.response?.data,
      });

      // 6. Error handling
      setState((prev) => ({
        ...prev,
        error: error.response?.data?.message || error.message,
        fieldErrors: error.response?.data?.fields || {},
        submitting: false,
      }));
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      await fetchUsers();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete user",
      }));
    }
  };

  const handleEdit = (user) => {
    if (!user?._id) {
      console.error("User object missing ID:", user);
      setState((prev) => ({ ...prev, error: "Invalid user data" }));
      return;
    }

    setState((prev) => ({ ...prev, currentUser: user, openDialog: true }));
    setFormData({
      username: user.username,
      email: user.email,
      name: user.name || "",
      displayName: user.displayName || "",
      role: user.role || "user",
      isActive: user.isActive !== undefined ? user.isActive : true,
    });
  };

  const handleCreate = () => {
    setState((prev) => ({ ...prev, currentUser: null, openDialog: true }));
    setFormData({
      username: "",
      email: "",
      name: "",
      displayName: "",
      role: "user",
      isActive: true,
    });
  };

  if (state.loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h5">Loading users...</Typography>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <Typography color="red" variant="h6">
          Error: {state.error}
        </Typography>
        <Button color="blue" className="mt-4" onClick={fetchUsers}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4">User Management</Typography>
          <Button color="blue" onClick={handleCreate}>
            Add New User
          </Button>
        </div>

        {state.error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            {state.error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-4">Username</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.users.length > 0 ? (
                state.users.map((user) => (
                  <tr
                    key={user._id || user.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-4 flex items-center">
                      <Avatar
                        src={
                          user.photoUrl ||
                          `https://i.pravatar.cc/150?u=${user.email}`
                        }
                        className="mr-3"
                      />
                      {user.username}
                    </td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.name || "-"}</td>
                    <td className="p-4 capitalize">{user.role}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button
                        size="sm"
                        color="blue"
                        className="mr-2"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        color="red"
                        onClick={() => handleDelete(user._id || user.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog
        open={state.openDialog}
        handler={() => setState((prev) => ({ ...prev, openDialog: false }))}
        size="lg"
      >
        <DialogHeader>
          {state.currentUser ? "Edit User" : "Create New User"}
        </DialogHeader>
        <DialogBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <Input
              label="Display Name"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
            />
            <Select
              label="Role"
              name="role"
              value={formData.role}
              onChange={(value) => handleSelectChange("role", value)}
            >
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
            <Select
              label="Status"
              name="isActive"
              value={formData.isActive ? "active" : "inactive"}
              onChange={(value) =>
                handleSelectChange("isActive", value === "active")
              }
            >
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setState((prev) => ({ ...prev, openDialog: false }))}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button color="blue" onClick={handleSubmit}>
            {state.currentUser ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default UserManagement;
