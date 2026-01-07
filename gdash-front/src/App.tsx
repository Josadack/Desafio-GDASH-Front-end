import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/footer/Footer'
import Navbar from './components/navbar/Navbar'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/register/Register'
import Dashboard from './pages/dashboard/Dashboard'
import Explorer from './pages/explorer/Explorer'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './contexts/AuthContext'
import Insights from './pages/insights/Insights'
import { RotaProtegida } from './routes/RotaProtegida'
import Profile from './pages/Users/Profile'
import "./index.css";

function AppContent() {
  const location = useLocation()
  const showNavFooter = ['/dashboard', '/profile', '/insights', '/explorer'].includes(location.pathname)

  return (
    <>
      {showNavFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/explorer" element={<Explorer />} />

        <Route
          path="/perfil"
          element={
            <RotaProtegida>
              <Profile />
            </RotaProtegida>
          }
        />

        <Route
          path="/dashboard"
          element={
            <RotaProtegida>
              <Dashboard />
            </RotaProtegida>
          }
        />


        <Route
          path="/insights"
          element={
            <RotaProtegida>
              <Insights />
            </RotaProtegida>
          }
        />
      </Routes>



      {showNavFooter && <Footer />}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
