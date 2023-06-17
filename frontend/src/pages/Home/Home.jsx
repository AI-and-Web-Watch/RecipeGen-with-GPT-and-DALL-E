import * as React from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import AIawwBG from "../../static/images/AIawwBG.png";
import LoadingImage from "../../components/Loading/LoadingImage";

// temp dummy data
// let recipeImage = null;
const ingredients = [
  "First Ingredient",
  "Second Ingredient",
  "Third Ingredient",
  "etc.",
];

const instructions = [
  "Step 1: Do something",
  "Step 2: Do something else",
  "Step 3: Continue doing things",
  "Step 4: Almost there",
  "Step 5: Finished",
];
// end temp dummy data

function Home() {
  const [recipeNameInput, setRecipeNameInput] = React.useState(null);
  const [recipeImage, setRecipeImage] = React.useState(null);
  const [recipeName, setRecipeName] = React.useState(null);
  const [loadingImage, setLoadingImage] = React.useState(false);

  const handleInputChange = (event) => {
    setRecipeNameInput(event.target.value);
  };

  const handleButtonClick = () => {
    setRecipeName(recipeNameInput);
    setLoadingImage(true);
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}api/dalle/generate-image`, {
        prompt: `An nice image of a delicious meal that is called ${recipeNameInput}`,
      })
      .then((response) => {
        setRecipeImage(response.data.image);
        setLoadingImage(false);
      })
      .catch((error) => {
        console.error(error);
        setLoadingImage(false);
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh", // Ensures it fills at least the viewport
        backgroundImage: `url(${AIawwBG})`,
        backgroundSize: "cover",
        opacity: 1,
        overflowY: "auto", // Enables scrolling
        paddingTop: "90px",
      }}
    >
      <TextField
        label="Enter recipe name"
        value={recipeNameInput || ""}
        onChange={handleInputChange}
        onKeyUp={(event) => {
          if (event.key === "Enter") {
            handleButtonClick();
          }
        }}
        variant="outlined"
        color="secondary"
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" color="secondary" onClick={handleButtonClick}>
        Enter
      </Button>
      <Typography
        variant="h4"
        component="h2"
        color="var(--secondary-color)"
        sx={{ marginTop: 2 }}
      >
        {recipeName || "Recipe Name"}
      </Typography>
      <Card sx={{ maxWidth: 600, margin: 2 }}>
        {loadingImage ? (
          <LoadingImage />
        ) : recipeImage ? (
          <CardMedia
            component="img"
            image={recipeImage}
            alt="recipe dish image"
          />
        ) : (
          <CardContent
            sx={{
              backgroundColor: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 200,
              minWidth: 400,
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="text.secondary">
              Image that will be Generated By DALL-E
            </Typography>
          </CardContent>
        )}
      </Card>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          listStyle: "none",
          padding: 1,
          margin: 0,
        }}
      >
        {ingredients.map((ingredient, index) => {
          return (
            <Box key={index} sx={{ margin: 1 }}>
              <Chip
                label={ingredient}
                sx={{
                  fontWeight: "bold",
                  fontFamily: "Arial",
                }}
              />
            </Box>
          );
        })}
      </Box>
      <Typography
        variant="h5"
        component="h2"
        color="var(--secondary-color)"
        sx={{ marginTop: 2 }}
      >
        Instructions
      </Typography>
      <List>
        <Box
          sx={{
            width: "500px",
            margin: "0 auto",
            backgroundColor: "var(--secondary-color)",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <List>
            {instructions.map((instruction, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <RadioButtonCheckedIcon />
                </ListItemIcon>
                <ListItemText primary={instruction} />
              </ListItem>
            ))}
          </List>
        </Box>
      </List>
    </Box>
  );
}

export default Home;
