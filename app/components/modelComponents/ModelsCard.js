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
import { yellow } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VoteModal from "../Voting/VoteModal"; // Adjust path as needed
import { Button } from "@mui/material";
import { useState } from "react";

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

export default function ModelsCard({name, votes, pageantId, onVote} ) {
  const [expanded, setExpanded] = React.useState(false);
  const [openModal, setOpenModal] = useState(false);

const handleFreeVote = () => {
  setOpenModal(false);
  onVote(); // Call the free vote function
};

const handlePaidVote = () => {
  setOpenModal(false);
  // TODO: integrate with Stripe
  console.log("Redirecting to Stripe...");
};

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: ["#9c27b0"], boxShadow: 3, }} aria-label="recipe">
           {name[0]}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
     
        title={name}
        subheader={`Pageant: ${pageantId}`}
        
        slotProps={{
          subheader: {
            sx: {
              textAlign: 'left',
              fontStyle: 'italic',
              color: 'black',
              fontSize: '0.8rem',
            },
          },
          title:{
            sx: {
              textAlign: 'left',
              fontWeight: 'bold',
              color: 'slate.700',
              fontSize: '1.1rem',
            },

          }
        }}

      />
      <CardMedia
        component="img"
        height="194"
        image="https://www.missintercontinental.de/wp-content/uploads/2022/08/miss-intercontinental-2022-zimbabwe-yollanda-elizabeth-chimbarami-sedcard-600x900.jpg"
        alt={name}
        sx={{
            width: 200,
            height: 240,
            objectFit: 'cover',
            borderRadius: 2,
            mx: "auto" // center image horizontally
          }}
      />
     <CardContent>
     <Typography
    variant="body2"
    sx={{ color: 'text.secondary', textAlign: 'center', fontWeight: 'medium', mb: 1 }}
  >
    Votes: {votes}
  </Typography>
  <Button
    variant="contained"
    color="secondary"
    fullWidth
    sx={{ fontWeight: "bold", mt: 1 }}
    onClick={() => setOpenModal(true)}
  >
    VOTE NOW
  </Button>
  <VoteModal
  open={openModal}
  handleClose={() => setOpenModal(false)}
  onFreeVote={handleFreeVote}
  onPaidVote={handlePaidVote}
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
          <Typography sx={{ marginBottom: 2 }}>Method:</Typography>
          <Typography sx={{ marginBottom: 2 }}>
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
            aside for 10 minutes.
          </Typography>
          <Typography sx={{ marginBottom: 2 }}>
            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
            medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring
            occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a
            large plate and set aside, leaving chicken and chorizo in the pan. Add
            pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook,
            stirring often until thickened and fragrant, about 10 minutes. Add
            saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
          </Typography>
          <Typography sx={{ marginBottom: 2 }}>
            Add rice and stir very gently to distribute. Top with artichokes and
            peppers, and cook without stirring, until most of the liquid is absorbed,
            15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and
            mussels, tucking them down into the rice, and cook again without
            stirring, until mussels have opened and rice is just tender, 5 to 7
            minutes more. (Discard any mussels that don&apos;t open.)
          </Typography>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and then serve.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
