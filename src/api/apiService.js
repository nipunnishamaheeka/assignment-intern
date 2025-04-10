import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Adjust the port if necessary

export const fetchRecipes = async () => {
  try {
    const response = await axios.get(`${API_URL}/recipes`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching recipes: ' + error.message);
  }
};

export const fetchRecipeById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/recipes/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching recipe: ' + error.message);
  }
};