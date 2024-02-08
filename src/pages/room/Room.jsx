import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../../providers/Socket'
import { usePeer } from '../../providers/Peer';
import ReactPlayer from 'react-player'

const Room = () => {
  const { socket } = useSocket();
  const { peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream } = usePeer();

  const [myStream, setMyStream] = useState(null);
  const [remoteEmailId, setRemoteEmailId] = useState();


  const handleNewUserJoined = useCallback(async (data) => {
    const { emailId } = data
    console.log('new user joined', emailId)

    const offer = await createOffer();

    socket.emit('call-user', { emailId, offer })
    setRemoteEmailId(emailId)
  }, [createOffer, socket])

  const handleIncomingCall = useCallback( async(data) => {
    const { from, offer } = data;
    console.log('Incoming call from', from, offer);

    const answer = await  createAnswer(offer);

    socket.emit('call-accepted', {emailId: from, answer})
    setRemoteEmailId(from)
  }, [createAnswer, socket])

  const handleCallAccepted = useCallback(async(data)=> {
    const {answer} = data;
    console.log('call got accepted', answer)
    await setRemoteAns(answer)
    sendStream(myStream)
  }, [setRemoteAns])

  useEffect(() => {
    socket.on('user-joined', handleNewUserJoined)
    socket.on('incoming-call', handleIncomingCall);
    socket.on('call-accepted', handleCallAccepted)

    

    // return () => {
    //   socket.off('user-joined', handleNewUserJoined)
    //   socket.off('incoming-call', handleIncomingCall)
    // socket.off('call-accepted', handleCallAccepted)

    // }
  }, [socket])

//   const handleNegotiation = useCallback(()=>{
//     console.log('oops negotiation needed')
//     socket.emit('negotiation-init', )
// },[])

// useEffect(()=> {
//   peer.addEventListener('negotiationneeded', handleNegotiation)
//     return ()=> 
//     {
//       peer.addEventListener('negotiationneeded', handleNegotiation)

//     }
// },[])

  const getUSerMediaStream = useCallback(async()=>{
      const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true})
      setMyStream(stream)
  },[])

  useEffect(()=> {
      getUSerMediaStream();
  },[getUSerMediaStream])

  return (
    <div className='room-container'>
      <h1> Room page</h1>
      <h4>Your are connected to {remoteEmailId}</h4>
    <button onClick={(e)=> sendStream(myStream)}>Send my video</button>
      <ReactPlayer url={myStream} playing muted/>
      <ReactPlayer url={remoteStream} playing />
    </div>
  )
}

export default Room
