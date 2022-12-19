import axios from 'axios'

import React, { useState, useEffect } from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import ProductPage from './components/ProductPage';
import ResponsiveAppBar from './components/NavBar';

const baseurl = "http://localhost:3000/products"

function App() {
  const [data, setData] = useState([{"id":"123245","title":"A Book","imageUrl":"https://www.publicdomainpictures.net/pictures/10000/velka/1-1210009435EGmE.jpg","description":"This is an awesome book!","price":"19"},{"id":"0.41607315815753076","title":"fasfd","imageUrl":"fdasfs","description":"fadsfads","price":"12"}])


  useEffect(()=>{
    axios.get(baseurl).then((response)=>{
      setData(response.data)
    })
  })


  return(
  <div>
    <header className="App-header"></header>
    <ResponsiveAppBar />     
      <ul>
      {data.map((element, index)=>
        <li key={index}>{element.title} {element.price}{element.imageUrl} </li>)}
        </ul>
<BrowserRouter>
<Routes>
  <Route  exact path="/products"  element={<ProductPage/>}/>
</Routes>
</BrowserRouter>


     
      
    </div>
  );
}

export default App;
