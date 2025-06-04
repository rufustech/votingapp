import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VoteModal from "../Voting/VoteModal";
import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { urls } from '../../constants';

// Initialize Stripe outside the component
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));

export default function ModelsCard({_id, name, votes, pageantId, pageantName, onVote, bio, images} ) {
  const [expanded, setExpanded] = React.useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

 const handleFreeVote = async () => {
  try {
    const voteData = JSON.parse(localStorage.getItem("voteData")) || { date: "", votes: 0 };
    const today = new Date().toISOString().split("T")[0];

    if (voteData.date !== today) {
      voteData.date = today;
      voteData.votes = 0;
    }

    if (voteData.votes >= 1) {
      alert("You've reached your free vote limit today.");
      return;
    }

    const res = await fetch(`${urls.url}/api/models/${_id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Vote failed");
    }

    voteData.votes += 1;
    localStorage.setItem("voteData", JSON.stringify(voteData));

    alert("✅ Vote successful!");
    setOpenModal(false);
  } catch (err) {
    console.error("Free vote error:", err.message);
    alert("❌ Vote failed: " + err.message);
  }
};


const handlePaidVote = async (amount, votes) => {
    setError(null);
    setIsLoading(true);
    try {
      // Validate inputs
      if (isNaN(amount) || isNaN(votes)) {
        throw new Error("Invalid amount or vote count");
      }

      // Get Stripe instance.log

      const stripe = await stripePromise;
      if (!stripe) {
        console.error("Stripe failed to initialize");
        alert("Stripe not configured. Contact support.");
        return;
      }

      // Create checkout session
      const response = await fetch(`${urls.url}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          modelId: _id,
          name,
          votes,
          amount,
          cancelUrl: window.location.href
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create checkout session");
      }

      const sessionData = await response.json();


      if (!sessionData || !sessionData.id) {
        throw new Error("Invalid session data received");
      }

      // Redirect to checkout
      const { error } = await stripe.redirectToCheckout({ 
        sessionId: sessionData.id  // Changed from data.id to sessionData.id
      });
      
      if (error) {
        throw error;
      }

    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message || "Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "#9c27b0", boxShadow: 3 , color: ""}} aria-label="model">
            {name[0]}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={name}
        subheader={` ${pageantName}`}
        slotProps={{
          subheader: {
            sx: {
              textAlign: 'left',
              fontStyle: 'italic',
              color: 'black',
              fontSize: '0.78rem',
            },
          },
          title: {
            sx: {
              textAlign: 'left',
              fontWeight: 'bold',
              color: 'slate.700',
              fontSize: '0.78rem',
            },
          }
        }}
      />

      <CardMedia
        component="img"
        height="180"
        image={images[0]}
        alt={name}
        sx={{
          width: 210,
          height: 260,
          objectFit: 'cover',
          borderRadius: 2,
          mx: "auto"
        }}
      />

      <CardContent>
        <Typography
          variant="body2"
          sx={{ 
            color: 'text.secondary', 
            textAlign: 'center', 
            fontWeight: 'medium', 
            mb: 1 
          }}
        >
          Votes: {votes}
        </Typography>

        {error && (
          <Typography 
            color="error" 
            sx={{ 
              textAlign: 'center', 
              mb: 2,
              fontSize: '0.875rem' 
            }}
          >
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ fontWeight: "bold", mt: 1 }}
          onClick={() => setOpenModal(true)}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'VOTE NOW'
          )}
        </Button>

        <VoteModal
          open={openModal}
          handleClose={() => {
            setOpenModal(false);
            setError(null);
          }}
          onFreeVote={handleFreeVote}
          onPaidVote={handlePaidVote}
          isLoading={isLoading}
        />
      </CardContent>

      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography 
            variant="h6" 
            sx={{ 
              marginBottom: 1,
              fontWeight: 'bold'
            }}
          >
            Biography
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              padding: '0.5rem',
              color: 'text.primary',
              lineHeight: 1.6
            }}
          >
            {bio}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
