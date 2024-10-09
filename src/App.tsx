import { useState, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";
import styled from "@emotion/styled";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface Recipe {
  id: number;
  name: string;
  ingredients: Ingredient[];
  instructions: string;
  servings: number;
}

const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const StyledButton = styled(Button)`
  margin-top: 1rem;
`;

const RecipeCard = styled.div`
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const RecipeTitle = styled(Typography)`
  margin-bottom: 0.5rem;
`;

const RecipeDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const App = () => {
  const [recipes, setRecipes] = useLocalStorageState<Recipe[]>("recipes", {
    defaultValue: [],
  });
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [servingsMultiplier, setServingsMultiplier] = useState(1);

  useEffect(() => {
    if (recipes.length === 0) {
      const defaultRecipes: Recipe[] = [
        {
          id: 1,
          name: "Борщ",
          ingredients: [
            { name: "Свекла", amount: 500, unit: "г" },
            { name: "Капуста", amount: 300, unit: "г" },
            { name: "Картофель", amount: 400, unit: "г" },
            { name: "Морковь", amount: 200, unit: "г" },
            { name: "Лук", amount: 150, unit: "г" },
          ],
          instructions: "1. Нарежьте овощи. 2. Варите бульон. 3. Добавьте овощи...",
          servings: 4,
        },
        {
          id: 2,
          name: "Оливье",
          ingredients: [
            { name: "Картофель", amount: 400, unit: "г" },
            { name: "Морковь", amount: 200, unit: "г" },
            { name: "Яйца", amount: 4, unit: "шт" },
            { name: "Колбаса", amount: 300, unit: "г" },
            { name: "Горошек", amount: 200, unit: "г" },
          ],
          instructions: "1. Отварите овощи и яйца. 2. Нарежьте ингредиенты...",
          servings: 6,
        },
        {
          id: 3,
          name: "Блины",
          ingredients: [
            { name: "Мука", amount: 200, unit: "г" },
            { name: "Молоко", amount: 500, unit: "мл" },
            { name: "Яйца", amount: 2, unit: "шт" },
            { name: "Сахар", amount: 2, unit: "ст.л." },
            { name: "Соль", amount: 0.5, unit: "ч.л." },
          ],
          instructions: "1. Смешайте ингредиенты. 2. Жарьте на сковороде...",
          servings: 4,
        },
        {
          id: 4,
          name: "Цезарь с курицей",
          ingredients: [
            { name: "Куриная грудка", amount: 300, unit: "г" },
            { name: "Салат романо", amount: 200, unit: "г" },
            { name: "Сухарики", amount: 100, unit: "г" },
            { name: "Пармезан", amount: 50, unit: "г" },
            { name: "Соус Цезарь", amount: 100, unit: "мл" },
          ],
          instructions: "1. Приготовьте курицу. 2. Нарежьте салат. 3. Смешайте ингредиенты...",
          servings: 2,
        },
        {
          id: 5,
          name: "Паста Карбонара",
          ingredients: [
            { name: "Спагетти", amount: 400, unit: "г" },
            { name: "Бекон", amount: 200, unit: "г" },
            { name: "Яйца", amount: 4, unit: "шт" },
            { name: "Пармезан", amount: 100, unit: "г" },
            { name: "Черный перец", amount: 1, unit: "ч.л." },
          ],
          instructions: "1. Отварите пасту. 2. Обжарьте бекон. 3. Смешайте яйца и сыр...",
          servings: 4,
        },
      ];
      setRecipes(defaultRecipes);
    }
  }, [recipes, setRecipes]);

  const handleAddRecipe = () => {
    const newRecipe: Recipe = {
      id: Date.now(),
      name: "",
      ingredients: [],
      instructions: "",
      servings: 1,
    };
    setEditingRecipe(newRecipe);
    setIsDialogOpen(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe({ ...recipe });
    setIsDialogOpen(true);
  };

  const handleDeleteRecipe = (id: number) => {
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  };

  const handleSaveRecipe = () => {
    if (editingRecipe) {
      setRecipes(
        recipes.map((recipe) =>
          recipe.id === editingRecipe.id ? editingRecipe : recipe
        )
      );
      setIsDialogOpen(false);
      setEditingRecipe(null);
    }
  };

  const handleServingsChange = (recipe: Recipe, newServings: number) => {
    const multiplier = newServings / recipe.servings;
    const updatedIngredients = recipe.ingredients.map((ingredient) => ({
      ...ingredient,
      amount: ingredient.amount * multiplier,
    }));
    setRecipes(
      recipes.map((r) =>
        r.id === recipe.id
          ? { ...r, servings: newServings, ingredients: updatedIngredients }
          : r
      )
    );
  };

  return (
    <AppContainer>
      <Typography variant="h4" component="h1" gutterBottom>
        Книга рецептов
      </Typography>
      <StyledButton
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddRecipe}
      >
        Добавить рецепт
      </StyledButton>
      <List>
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id}>
            <RecipeTitle variant="h6">{recipe.name}</RecipeTitle>
            <RecipeDetails>
              <Typography variant="body2">
                Порции: {recipe.servings}
              </Typography>
              <div>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEditRecipe(recipe)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteRecipe(recipe.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </RecipeDetails>
            <Typography variant="body2" gutterBottom>
              Ингредиенты:
            </Typography>
            <List dense>
              {recipe.ingredients.map((ingredient, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${ingredient.name}: ${ingredient.amount} ${ingredient.unit}`}
                  />
                </ListItem>
              ))}
            </List>
            <Typography variant="body2" gutterBottom>
              Инструкции:
            </Typography>
            <Typography variant="body2">{recipe.instructions}</Typography>
            <Typography variant="body2" gutterBottom>
              Изменить количество порций:
            </Typography>
            <Slider
              value={recipe.servings}
              min={1}
              max={10}
              step={1}
              marks
              valueLabelDisplay="auto"
              onChange={(_, value) =>
                handleServingsChange(recipe, value as number)
              }
            />
          </RecipeCard>
        ))}
      </List>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>
          {editingRecipe?.id ? "Редактировать рецепт" : "Добавить рецепт"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название рецепта"
            fullWidth
            value={editingRecipe?.name || ""}
            onChange={(e) =>
              setEditingRecipe(
                (prev) => prev && { ...prev, name: e.target.value }
              )
            }
          />
          {/* Добавьте поля для ингредиентов и инструкций здесь */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleSaveRecipe} color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </AppContainer>
  );
};

export default App;