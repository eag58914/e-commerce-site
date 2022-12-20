import React, { Component, useEffect, useState } from 'react'
import ResponsiveAppBar from '../components/NavBar'
import axios from 'axios'


const baseurl = "http://localhost:3000/products"


 function HomePage(){   
    //const [data, setData] = useState([{"id":"123245","title":"A Book","imageUrl":"https://www.publicdomainpictures.net/pictures/10000/velka/1-1210009435EGmE.jpg","description":"This is an awesome book!","price":"19"},{"id":"0.41607315815753076","title":"fasfd","imageUrl":"fdasfs","description":"fadsfads","price":"12"}])

        // useEffect(()=>{
        //     axios.get(baseurl).then((response)=>{
        //       setData(response.data)
        //     })
        //   })

       

        return(
            <div>
            <ResponsiveAppBar />     
      {/* <ul>
      {data.map((element, index)=>
        <li key={index}>{element.title} {element.price}{element.imageUrl} </li>)}
        </ul> */}

            </div>
        )
    
    
}

export default HomePage