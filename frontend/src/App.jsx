import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import LoginPage from './pages/login/LoginPage'
import RegisterPage from './pages/register/RegisterPage'
import { fetchUser } from './features/AuthSlice'
import MainLayout from './layouts/main/MainLayouts'
import Profile from './components/Profile/Profile'

function App() {
  let { test } = useSelector((state) => state.auth)
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchUser())
  }, [])
  return (
    <>

      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/home' element={<MainLayout />} >
          <Route path='/home/profile' element={<Profile />} />
          <Route path='/home/test' element={<h1>test page</h1>} />
        </Route>

      </Routes>
    </>
  )
}

export default App
