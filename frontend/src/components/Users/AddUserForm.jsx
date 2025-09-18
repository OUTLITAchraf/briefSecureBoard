import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createUser } from "../../features/UserSlice";

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required").min(3, "At least 3 characters"),
  email: yup.string().required("Email is required").email("Invalid email format"),
  password: yup.string().required("Password is required").min(6, "At least 6 characters"),
  role: yup.string().required("Role is required"),
});

const AddUserForm = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.users);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      let result = await dispatch(createUser(data));

      if (result.meta.requestStatus === "fulfilled") {
        toast.success("User Created Successfully.");
        handleClose();
        reset();
      } else {
        toast.error("Failed to create user !!!");
      }
    } catch (err) {
      console.error("Error while creating user:", err);
      toast.error("Unexpected error");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} classes={{ paper: "user-add-dialog-paper" }}>
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} id="add-user-form">
          <TextField
            fullWidth
            margin="dense"
            label="Name"
            variant="outlined"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Email"
            variant="outlined"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Password"
            type="password"
            variant="outlined"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              defaultValue=""
              {...register("role")}
              error={!!errors.role}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="manage">Manage</MenuItem>
            </Select>
            {errors.role && (
              <p style={{ color: "red", fontSize: "0.8rem" }}>{errors.role.message}</p>
            )}
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="add-user-form"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Add User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserForm;
