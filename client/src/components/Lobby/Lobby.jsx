import React from 'react';
import { useState,useContext,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './Lobby.scss';

import { SocketContext } from '../../context/socket';

function Lobby() {

  const [UserList, setUserList] = useState([]);
  const [Leader, setLeader] = useState(false);
  const [BtnTxt, setBtnTxt] = useState("Wait for room owner");
  

  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  const goToGame = async () => {
    navigate(`/Game/${socket._roomKey}`,{replace:true})
  }
  const reqToJoin = async () => {
    socket.emit("req_join");
  }

  useEffect(() => {
    socket.on("update_list", incomingList => {
      setUserList(incomingList);
      socket._userList = incomingList;
    })
    socket.on("get_role", incomingRole => {
      setLeader(incomingRole);
      socket._role = incomingRole;
    })
    socket.on("all_join", () => {
      goToGame();
    })
    
  }, [socket]);

  const User = (props) => {
    const emoArr = [ '👑.','o2.','o3.','o4.','o5.','o6.','o7.','o8.','o9.','1o.'];
    
    return (
      <div className="user-container-lobby">
        <div> <span className="list-num">{emoArr[props.emo]}</span>  {props.name}</div>
      </div>
      // <li key={props.id}>{emoArr[props.emo]} {props.name}</li>
    );
  }
  

  return (
    <div>
      <div className="Lobby">
      <div className='main-title-2'>   WORD RUSH  </div>

      <div className="lobby-list">
        <div className="lobby-title">LOBBY</div>
        
        {UserList.map(function(user, idx){
          
          return (<User name={user.username} key={idx} emo={idx}/>)
        })}
        <button className="btn start-btn" disabled={!Leader} onClick={reqToJoin} > {Leader ? "START GAME" : "WAIT FOR OWNER"} </button>
      </div>
      

      

      </div>
    </div>
  )
}





export default Lobby