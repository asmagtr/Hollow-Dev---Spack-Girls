
import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'

const routes=(
  <BrowserRouter>
  <Routes>
    <Route path='/dashboard' element={<Home />} />
    <Route path='/login' element={<Login/>}></Route>
    <Route path='/signup' element={<Signup/>}></Route>
  </Routes>
  
  </BrowserRouter>
);


const App = () => {
  return (
    <div>
    {routes}

    </div>
  )
}

export default App