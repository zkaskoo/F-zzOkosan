import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/common/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RecipeListPage from './pages/RecipeListPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import CreateRecipePage from './pages/CreateRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import ProfilePage from './pages/ProfilePage';
import ShoppingListsPage from './pages/ShoppingListsPage';
import ShoppingListDetailPage from './pages/ShoppingListDetailPage';
import CreateShoppingListPage from './pages/CreateShoppingListPage';
import MenuPlansPage from './pages/MenuPlansPage';
import MenuPlanDetailPage from './pages/MenuPlanDetailPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bejelentkezes" element={<LoginPage />} />
          <Route path="/regisztracio" element={<RegisterPage />} />
          <Route path="/receptek" element={<RecipeListPage />} />

          {/* Protected routes - static paths before dynamic */}
          <Route element={<PrivateRoute />}>
            <Route path="/receptek/uj" element={<CreateRecipePage />} />
            <Route path="/receptek/:id/szerkesztes" element={<EditRecipePage />} />
            <Route path="/bevasarlolista" element={<ShoppingListsPage />} />
            <Route path="/bevasarlolista/uj" element={<CreateShoppingListPage />} />
            <Route path="/bevasarlolista/:id" element={<ShoppingListDetailPage />} />
            <Route path="/etlapterv" element={<MenuPlansPage />} />
            <Route path="/etlapterv/:id" element={<MenuPlanDetailPage />} />
          </Route>

          <Route path="/receptek/:id" element={<RecipeDetailPage />} />
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/profil/:id" element={<ProfilePage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
