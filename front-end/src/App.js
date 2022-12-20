import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import ProductPage from './pages/ProductPage';
import HomePage from './pages/HomePage';

function App() { 
  return(
  <div>
<header className="App-header"></header>
    <BrowserRouter>
        <Routes>
          <Route exact path='/home' element={<HomePage />}/>
          <Route  exact path="/products"  element={<ProductPage/>}/>
        </Routes>
</BrowserRouter>


     
      
    </div>
  );
}

export default App;
