'use client'
// VoteModal.jsx

import React from "react";
import { Modal, Box, Typography, Button, Divider } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 360,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  textAlign: "center",
};

export default function VoteModal({ open, handleClose, onFreeVote, onPaidVote }) {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Cast Your Vote
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Choose how you want to vote for your favorite contestant.
        </Typography>

        <Button
          onClick={onFreeVote}
          startIcon={<FavoriteIcon />}
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mb: 2, py: 1.5, fontWeight: "bold" }}
        >
          Free Vote (1/day)
        </Button>

        <Divider sx={{ my: 2 }}>or</Divider>

        <Button
          onClick={onPaidVote}
          startIcon={<MonetizationOnIcon />}
          fullWidth
          variant="outlined"
          color="success"
          sx={{ py: 1.5, fontWeight: "bold" }}
        >
          Paid Vote via Stripe
        </Button>

        <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.disabled' }}>
          Your support helps empower talent!
        </Typography>
      </Box>
    </Modal>
  );
}
