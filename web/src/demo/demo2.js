import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'

const socket = io.connect('http://192.168.100.135:4000')

function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch('http://192.168.100.135:4000/getcount',
    )
      .then(function (response) {
        console.log(response)
        return response.json();
      })
      .then(function (myJson) {
        console.log(myJson);
        setData(myJson)
      });

  }, [])

  useEffect(() => {
    socket.on('addLike', (fetchedData) => {
      console.log("data: ",fetchedData)
      // console.log("State: ",data)
     
      // testFunction(fetchedData);
      let temp = [...data]

      let temp2 =  temp.findIndex(ind => ind.id === fetchedData.id);

      if(temp2 > -1){
       temp[temp2].likeCount = fetchedData.count;
       setData(temp)
      }

    })
  }, [data])

  const countIncrement = e => {
    console.log(e);
    let id = e.id;
    let count = e.likeCount+1
 
    socket.emit('addLike', {id, count} )
   }
  return (
    <div>
      hi
      {data.map((items, index) => {
        return (
          <div key={index}>
            <span> {items.text} </span>
            <span> {items.id} </span>
            <span> {items.likeCount} <button onClick={e => countIncrement(items)}>+</button></span>
          </div>
        )
      })}
    </div>
  )
}

export default App
