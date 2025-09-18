// src/components/Users/DeleteUser.jsx
import React from "react";
import { DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "../../features/UserSlice";
import { toast } from "react-toastify";

function DeleteUser({ handleCloseDelete, userId }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.users);

  const handleDelete = async () => {
    try {
      let result = await dispatch(deleteUser(userId));

      if (result.meta.requestStatus === "fulfilled") {
        toast.success("User Deleted Successfully.");
        handleCloseDelete();
      } else {
        toast.error("Failed to delete user !!!");
      }
    } catch (err) {
      console.error("Error while deleting user:", err);
      toast.error("Unexpected error");
    }
  };

  return (
    <>
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this user? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDelete}>Cancel</Button>
        <Button onClick={handleDelete} color="error" autoFocus>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </>
  );
}

export default DeleteUser;
