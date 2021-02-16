import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import TextField from '@material-ui/core/TextField'
import './App.css'

const socket = io.connect('http://localhost:4000')

function App() {
  const [state, setStaet] = useState({ message: '', name: '' ,lastInserId:''})
  const [chat, setChat] = useState([])

  useEffect(() => {
    socket.on('message', ({ name, message,lastInserId }) => {
      console.log(lastInserId);
      setChat([...chat, { name, message, lastInserId }])
    })
  })

  const onTextChange = e => {
    setStaet({ ...state, [e.target.name]: e.target.value })
  }

  const onMessageSubmit = e => {
    e.preventDefault()
    const { name, message, lastInserId } = state
    socket.emit('message', { name, message , lastInserId})
    setStaet({ message: '', name, lastInserId:'' })
  }

  const countIncrement = e => {
   console.log(e);
   socket.emit(`message/${e}`, {e})
   

  }

  const renderChat = () => {
    return chat.map(({ name, message, lastInserId }, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span> {lastInserId}
          <button onClick={e => countIncrement(lastInserId)}>Count +</button>
        </h3>
      </div>
    ))
  }

  return (
    <div className="card">
      <form onSubmit={onMessageSubmit}>
        <h1>Messanger</h1>
        <div className="name-field">
          <TextField
            name="name"
            onChange={e => onTextChange(e)}
            value={state.name}
            label="Name"
          />
        </div>
        <div>
          <TextField
            name="message"
            onChange={e => onTextChange(e)}
            value={state.message}
            id="outlined-multiline-static"
            variant="outlined"
            label="Message"
          />
        </div>
        <button>Send Message</button>
      </form>
      <div className="render-chat">
        <h1>Chat Log</h1>
        {renderChat()}
      </div>
    </div>
  )
}

export default App
