import React from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Password from './components/Password'
import OtpVerify from './components/OtpVerify'
import ProfileUpdate from './components/ProfileUpdate'
import PageNotFound from './components/PageNotFound'
import Reset from './components/Reset'

//auth middleware
import { AuthorizeUser, ProtectRoute } from './middleware/auth'

const router = createBrowserRouter([
    {
        path: '/',
        element:<Login/>
    },
    {
        path: '/register',
        element:<Register/>
    },
    {
        path: '/password',
        element:<ProtectRoute><Password/></ProtectRoute>
    },
    {
        path: '/otpRecovery',
        element:<ProtectRoute><OtpVerify/></ProtectRoute>
    },
    {
        path: '/reset',
        element:<Reset/>
    },
    {
        path: '/profile',
        element:<AuthorizeUser><ProfileUpdate/></AuthorizeUser>
    },
    {
        path: '/*',
        element:<PageNotFound/>
    },
    
])

function App() {
  return (
    <main>
        <RouterProvider router={router}>
        </RouterProvider>
    </main>
  )
}

export default App
