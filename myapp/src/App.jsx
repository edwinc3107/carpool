import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Landing from './LandingPage'
import { title } from 'framer-motion/client'
import Profile from './Profile'
import axios from 'axios'
import { Toaster } from 'react-hot-toast';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Login from './Login'; 
import Register from './Register'; 
import Header from './Header'; 
import { UserContextProvider } from './context/UserContext'
import Dashboard from './Dashboard'
import HostRide from './HostRide'
import FindRide from './FindRide'
import ChatRoom from './ChatRoom'

axios.defaults.baseURL= "http://localhost:4000"
axios.defaults.withCredentials = true

function App() {
  
  return (
    <UserContextProvider>
    < div className="bg-black">
      <title>Envo</title>
    <Toaster/>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Landing></Landing>} />
      <Route path='/login' element={<Login></Login>} />
      <Route path='/register' element={<Register></Register>} />
      <Route path='/h' element={<Header></Header>} />
      <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
      <Route path='/hostride' element={<HostRide></HostRide>}></Route>
      <Route path='/findride' element={<FindRide></FindRide>}></Route>
      <Route path='/chat' element={<ChatRoom></ChatRoom>}></Route>
    </Routes>
    </BrowserRouter>
    </div>
    </UserContextProvider>
  )
}

export default App
