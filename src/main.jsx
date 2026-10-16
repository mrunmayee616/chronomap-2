import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { FavouritesProvider } from './context/FavouritesContext.jsx'
import { PlacesProvider } from './context/PlacesContext.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import RequireAdmin from './components/RequireAdmin.jsx'
import Home from './pages/Home.jsx'
import SignIn from './pages/SignIn.jsx'
import Register from './pages/Register.jsx'
import OAuthCallback from './pages/OAuthCallback.jsx'
import Explore from './pages/Explore.jsx'
import Profile from './pages/Profile.jsx'
import Place from './pages/Place.jsx'
import Quiz from './pages/Quiz.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
<<<<<<< HEAD
=======
import Explorers from './pages/Explorers.jsx'
import UserProfile from './pages/UserProfile.jsx'
>>>>>>> 3450fa5 (feat: Fixes for admin user and loading accurate images for locations)
import About from './pages/About.jsx'
import HowItWorks from './pages/HowItWorks.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <FavouritesProvider>
        <PlacesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/oauth/callback" element={<OAuthCallback />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/place/:placeId" element={<Place />} />
              <Route
                path="/quiz"
                element={
                  <RequireAuth>
                    <Quiz />
                  </RequireAuth>
                }
              />
              <Route
                path="/quiz/:placeId"
                element={
                  <RequireAuth>
                    <Quiz />
                  </RequireAuth>
                }
              />
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <RequireAuth>
                    <Leaderboard />
                  </RequireAuth>
                }
              />
              <Route
<<<<<<< HEAD
=======
                path="/explorers"
                element={
                  <RequireAuth>
                    <Explorers />
                  </RequireAuth>
                }
              />
              <Route
                path="/u/:username"
                element={
                  <RequireAuth>
                    <UserProfile />
                  </RequireAuth>
                }
              />
              <Route
>>>>>>> 3450fa5 (feat: Fixes for admin user and loading accurate images for locations)
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminDashboard />
                  </RequireAdmin>
                }
              />
            </Routes>
          </BrowserRouter>
        </PlacesProvider>
      </FavouritesProvider>
    </AuthProvider>
  </React.StrictMode>,
)
