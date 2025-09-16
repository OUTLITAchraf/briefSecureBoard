import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import LoginPage from './pages/login/LoginPage'
import RegisterPage from './pages/register/RegisterPage'
import { fetchUser } from './features/AuthSlice'
import MainLayout from './layouts/main/MainLayouts'
import Profile from './components/Profile/Profile'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(fetchUser())
  }, [])

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path='/home' element={<MainLayout />} >
            <Route path='/home/profile' element={<Profile />} />
            <Route path='/home/test' element={<h1>test page</h1>} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
