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
import Dashboard from './pages/Dahboard'
import UserDashboard from './pages/UserDashboard'
import AllProjects from './pages/projects/AllProjects'
import AllTasks from './pages/tasks/AllTasks'
import UserAllProjects from './pages/userProjects/UserAllProjects'
import UserTasksList from './components/userTasks/UserTaksList'
import UnauthorizedPage from './pages/UnauthorizedPage'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/unauthorized' element={<UnauthorizedPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path='/home' element={<MainLayout />} >
            <Route index element={<Dashboard />} />
            <Route path='/home/profile' element={<Profile />} />
            {/* Add more protected routes here */}
            <Route path='/home/dashboard-users' element={<UserDashboard />} />
            <Route path='/home/projects' element={<AllProjects />} />
            <Route path='/home/my-projects' element={<UserAllProjects />} />
            <Route path='/home/my-tasks' element={<UserTasksList />} />
            <Route path='/home/tasks' element={<AllTasks />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
