import { useState, useEffect } from 'react'
import './App.css'
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import Home from './pages/home/Home'
import Room from './pages/room/Room'

function App() {
  
  return (
   <div className='App'>
   <h1>Video call</h1>
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/room/:roomId' element={<Room />} />
      </Routes> 
   </div>
  )
}

export default App
