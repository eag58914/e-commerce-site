import axios from 'axios'

import React, { useState, useEffect } from 'react'
import './App.css';

const baseurl = "http://localhost:3000/products"

function App() {
  const [data, setData] = useState()


  useEffect(()=>{
    axios.get(baseurl).then((response)=>{
      setData(response.data)
    })
  })


  return (
    <div className="App">
      <header className="App-header">
  <ul>
{data.map((element, index)=>{
return(
  <li key={index}>{element.title} </li>
)
})}
</ul>
     
      </header>
    </div>
  );
}

export default App;
