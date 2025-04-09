import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from './components/features/ThemeProvider';
import Layout from './components/common/Layout';

// Pages
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import CreateRecipe from './pages/CreateRecipe';
import EditRecipe from './pages/EditRecipe';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import NotFound from './pages/NotFound';

// Store (mock implementation - you'll need to create your actual store)
import store from './store/store';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/recipes/:id" element={<Layout><RecipeDetail /></Layout>} />
            <Route path="/recipes/create" element={<Layout><CreateRecipe /></Layout>} />
            <Route path="/recipes/edit/:id" element={<Layout><EditRecipe /></Layout>} />
            <Route path="/favorites" element={<Layout><Favorites /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;