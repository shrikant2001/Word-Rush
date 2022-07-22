import React from "react";
import "./Home.scss";
import { useContext, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { SocketContext } from "../../context/socket";

function Home() {
  const [username, setusername] = useState("");
  const [room, setroom] = useState("");

  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  const joinRoom = async () => {
    socket._username = username;
    socket._roomKey = room;
    await socket.emit("get_room", { username, room });
    navigate(`/Lobby/${room}`);
  };

  return (
    <div className="Home">
      <div className='main-container'>
      

      <div className='main-title'>   WORD RUSH  </div>

      <div className='content-container'>
        {/* INPUT HERE */}
        <div className="d-flex flex-column align-items-center" >
          <input
            className='inp userName-input'
            type='text'
            placeholder='Enter username here...'
            onChange={(event) => setusername(event.target.value.toUpperCase())}
          />
          <input
            className='inp userName-input'
            type='text'
            placeholder='Enter Room ID here...'
            onChange={(event) => setroom(event.target.value)}
          />
        </div>
        {/*  */}

        <button className='join-btn btn btn-lg' onClick={joinRoom}>
          ENTER ROOM
        </button>
        

      </div>
    </div>
    </div>
    
  );
}

export default Home;
