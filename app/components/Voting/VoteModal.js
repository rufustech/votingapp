'use client';

import React, { useState } from "react";
import { 
  Modal, 
  Box, 
  Typography, 
  Button, 
  Divider, 
  TextField,
  CircularProgress 
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';

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

export default function VoteModal({ open, handleClose, onFreeVote, onPaidVote, model, isLoading }) {
  const [amount, setAmount] = useState('');

  const parsedAmount = parseFloat(amount);
  const votes = !isNaN(parsedAmount) ? Math.floor(parsedAmount / 0.5) : 0;

  const handlePaidVoteClick = () => {
    if (votes <= 0 || isNaN(parsedAmount)) {
      alert("Please enter a valid amount (minimum $0.50)");
      return;
    }
    onPaidVote(parsedAmount, votes);
  };

  const handleEcoCashVote = async () => {
    if (votes <= 0 || isNaN(parsedAmount)) {
      alert("Please enter a valid amount (minimum $0.50)");
      return;
    }

    try {
      const res = await fetch('/api/paynow/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelId: model._id,
          amount: parsedAmount,
          userEmail: 'test@example.com',
        }),
      });

      const data = await res.json();
      if (data.redirectUrl) {
        localStorage.setItem("paynow_poll_url", data.pollUrl);
        window.location.href = data.redirectUrl;
      } else {
        alert("Failed to initiate EcoCash payment.");
      }
    } catch (err) {
      console.error("EcoCash Payment Error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <Modal 
      open={open} 
      onClose={handleClose}
      aria-labelledby="vote-modal-title"
      aria-describedby="vote-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography 
          id="vote-modal-title"
          variant="h6" 
          sx={{ mb: 2, fontWeight: "bold", color: "black" }}
        >
          Cast Your Vote
        </Typography>

        <Typography 
          id="vote-modal-description"
          variant="body2" 
          sx={{ color: "text.secondary", mb: 3 }}
        >
          Choose how you want to vote for your favorite contestant.
        </Typography>

        <Button
          onClick={onFreeVote}
          startIcon={<FavoriteIcon />}
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mb: 2, py: 1.5, fontWeight: "bold" }}
          disabled={isLoading}
        >
          Free Vote (1/day)
        </Button>

        <Divider sx={{ my: 2 }}>or</Divider>

        <TextField
          label="Enter amount (USD)"
          type="number"
          fullWidth
          variant="outlined"
          size="small"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{ mb: 2 }}
          inputProps={{ min: 0.5, step: 0.5 }}
          disabled={isLoading}
        />

        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          You will get <strong>{votes}</strong> vote{votes !== 1 ? 's' : ''}.
        </Typography>

        <Button
          onClick={handlePaidVoteClick}
          startIcon={isLoading ? null : <MonetizationOnIcon />}
          fullWidth
          variant="outlined"
          color="success"
          sx={{ 
            py: 1.5, 
            fontWeight: "bold",
            position: 'relative'
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <CircularProgress 
                size={24} 
                sx={{ 
                  position: 'absolute',
                  left: '50%',
                  marginLeft: '-12px'
                }} 
              />
              <span style={{ visibility: 'hidden' }}>Buy Votes via Stripe</span>
            </>
          ) : (
            'Buy Votes via Stripe'
          )}
        </Button>

        <Button
          onClick={handleEcoCashVote}
          startIcon={<MobileFriendlyIcon />}
          fullWidth
          variant="contained"
          color="warning"
          sx={{ mt: 2, py: 1.5, fontWeight: "bold" }}
          disabled={isLoading}
        >
          Buy Votes via EcoCash
        </Button>

        <Typography 
          variant="caption" 
          display="block" 
          sx={{ mt: 2, color: 'text.disabled' }}
        >
          Your support helps empower talent!
        </Typography>

        {isLoading && (
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 2, 
              color: 'primary.main',
              fontStyle: 'italic'
            }}
          >
            Processing your payment...
          </Typography>
        )}
      </Box>
    </Modal>
  );
}
