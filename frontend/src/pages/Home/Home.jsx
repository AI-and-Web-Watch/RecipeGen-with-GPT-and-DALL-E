import * as React from "react";
import axios from "axios";
import AccessTime from "@mui/icons-material/AccessTime";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";

import AIawwBG from "../../static/images/AIawwBG.png";
import DalleSwitch from "../../components/DalleSwitch";
import RecipeCard from "../../components/RecipeCard";
import IngredientChips from "../../components/IngredientChips";
import InstructionList from "../../components/InstructionList";
import RecipeForm from "../../components/RecipeForm";

// Initialize dummy data for a recipe
const recipeDummyData = {
  ingredients: [
    { name: "Ingredient 1", amount: 0, unit: "grams" },
    { name: "Ingredient 2", amount: 0, unit: "grams" },
    { name: "Ingredient 3", amount: 0, unit: "grams" },
    { name: "Ingredient 4", amount: 0, unit: "grams" },
  ],
  instructions: [
    "Step 1: Do something",
    "Step 2: Do something else",
    "Step 3: Continue doing things",
    "Step 4: Almost there",
    "Step 5: Finished",
  ],
  time_to_cook: "0", // minutes
};

function Home() {
  // Initialize all state variables
  const [recipeNameInput, setRecipeNameInput] = React.useState("");
  const [recipeName, setRecipeName] = React.useState(null);
  const [loadingImage, setLoadingImage] = React.useState(false);
  const [loadingRecipe, setLoadingRecipe] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [generatedRecipe, setGeneratedRecipe] = React.useState(null);
  const [generatedImage, setGeneratedImage] = React.useState(null);
  const [dalleAPIEnabled, setDalleAPIEnabled] = React.useState(true);
  const [promptSentToDalle, setPromptSentToDalle] = React.useState("");
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  // Handle input change in the form field
  const handleInputChange = (event) => {
    setRecipeNameInput(event.target.value);
  };

  // Handle switch change for enabling or disabling the DALLE API
  const handleSwitchChange = (event) => {
    setDalleAPIEnabled(event.target.checked);
  };

  // Generate a new recipe when the form is submitted
  const onGenerateRecipe = () => {
    // Check if a recipe name has been entered
    if (recipeNameInput.trim() !== "") {
      setOpenSnackbar(false);
      setRecipeName(recipeNameInput);
      setLoadingRecipe(true);

      // Reset the generated recipe and generated image
      setGeneratedRecipe(null);
      setGeneratedImage(null);

      // Make a request to the GPT-3 API to generate a recipe
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}api/gpt/generate-recipe`, {
          prompt: recipeNameInput,
        })
        .then((response) => {
          // Store the generated recipe and set loadingRecipe to false
          let recipe = response.data.recipe;
          setGeneratedRecipe(recipe);
          setLoadingRecipe(false);

          // Pass the visual description generated by the GPT-3 API as a prompt for DALL-E to create an image
          const dallePrompt = recipe.visual_discription_of_image;
          setPromptSentToDalle(dallePrompt);

          // If the DALLE API is enabled, make a request to generate an image
          if (dalleAPIEnabled) {
            setLoadingImage(true);

            axios
              .post(
                `${process.env.REACT_APP_API_BASE_URL}api/dalle/generate-image`,
                {
                  prompt: dallePrompt,
                }
              )
              .then((response) => {
                // Store the generated image and set loadingImage to false
                setGeneratedImage(response.data.image);
                setLoadingImage(false);
              })
              .catch((error) => {
                // Handle any errors that occur while generating the image
                console.error(error);
                setLoadingImage(false);
                setSnackbarMessage("There was a problem loading the Image");
                setOpenSnackbar(true); // Show the notification
                console.log("Image Error", error);
              });
          }
        })
        .catch((error) => {
          // Handle any errors that occur while generating the recipe
          setLoadingRecipe(false);
          setSnackbarMessage(
            "There was a problem loading the Recipe, please try another name"
          );
          setOpenSnackbar(true); // Show the notification
          console.log("Recipe Error", error);
        });
    } else {
      // Handle case where no recipe name was entered
      setSnackbarMessage("Please enter a recipe name.");
      setOpenSnackbar(true); // Show the notification
    }
  };

  // Close the snackbar when it's clicked
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  // Use the generated recipe if one exists, otherwise use the dummy data
  let displayRecipe = generatedRecipe ? generatedRecipe : recipeDummyData;

  // Render the home page
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
      <RecipeForm
        onGenerateRecipe={onGenerateRecipe}
        recipeNameInput={recipeNameInput}
        handleInputChange={handleInputChange}
      />

      <DalleSwitch
        dalleAPIEnabled={dalleAPIEnabled}
        handleSwitchChange={handleSwitchChange}
      />

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
      <Typography
        variant="h4"
        component="h2"
        color="var(--secondary-color)"
        sx={{ marginTop: 2 }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minwidth: 600, // adjust this value for more/less space
          }}
        >
          <Box>{recipeName || "Recipe Name"}</Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AccessTime sx={{ marginRight: 2, marginLeft: 4 }} />
            <Typography color="var(--secondary-color)">{displayRecipe.time_to_cook} min</Typography>
          </Box>
        </Box>
      </Typography>
      <RecipeCard
        loadingRecipe={loadingRecipe}
        loadingImage={loadingImage}
        generatedImage={generatedImage}
        recipeNameInput={recipeNameInput}
        promptSentToDalle={promptSentToDalle}
        dalleAPIEnabled={dalleAPIEnabled}
        displayRecipe={displayRecipe}
      />
      <IngredientChips ingredients={displayRecipe.ingredients} />
      <Typography
        variant="h5"
        component="h2"
        color="var(--secondary-color)"
        sx={{ marginTop: 2 }}
      >
        Instructions
      </Typography>
      <InstructionList instructions={displayRecipe.instructions} />
    </Box>
  );
}

export default Home;
