import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../../providers/Socket'
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const {socket} =    useSocket();
    const [email, setEmail] = useState();
    const [roomId, setRoomId] = useState();

    const handledJoinedRoom = useCallback(({roomId}) => {
      navigate(`/room/${roomId}`)
    },[navigate])


    useEffect(()=> {
      socket.on('joined-room', handledJoinedRoom)

      return () => {
        socket.off('joined-room', handledJoinedRoom)
      }
    }, [socket, handledJoinedRoom])

    const handleJoinRoom = () => {
        socket.emit('join-room', {emailId: email, roomId} )
    }

  return (
    <div className='home-container'>

        <input value={email} type='email' placeholder='enter your email' onChange={(e)=> setEmail(e.target.value)}/>
        <input value={roomId} type='text' placeholder='enter room code' onChange={(e)=> setRoomId(e.target.value)}/>

        <button onClick={handleJoinRoom}>Enter Room</button>
    </div>
  )
}

export default Home
