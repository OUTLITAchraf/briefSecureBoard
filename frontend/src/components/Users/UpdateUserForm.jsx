// src/components/Users/UpdateUser.jsx
import React, { useEffect } from "react";
import {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../features/UserSlice";
import { toast } from "react-toastify";

function UpdateUser({ handleCloseUpdate, user }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.users);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "user",
    },
  });

  // Pre-fill form when user prop changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.roles[0]?.name || "user",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      // Send payload exactly how backend expects
      const payload = {
        name: data.name,
        email: data.email,
        role: data.role, // "user" or "admin"
      };

      const result = await dispatch(updateUser({ id: user.id, data: payload }));

      if (result.meta.requestStatus === "fulfilled") {
        toast.success("User updated successfully.");
        handleCloseUpdate();
      } else {
        toast.error("Failed to update user!");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Unexpected error");
    }
  };

  return (
    <>
      <DialogTitle>Update User</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Update the details of the user below.
        </DialogContentText>

        {/* Form */}
        <form id="update-user-form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <TextField {...field} label="Name" fullWidth margin="dense" />
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <TextField {...field} label="Email" fullWidth margin="dense" />
            )}
          />

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">Role</InputLabel>
                <Select labelId="role-label" {...field}>
                  <MenuItem value="manage">Manage</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </form>
      </DialogContent>

      <DialogActions className="update-dialog-actions">
        <Button onClick={handleCloseUpdate}>Cancel</Button>
        <Button
          type="submit"
          form="update-user-form"
          color="primary"
          autoFocus
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>

    </>
  );
}

export default UpdateUser;
