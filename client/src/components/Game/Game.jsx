import React from 'react';
import './Game.scss';
import { useContext,useState,useRef,useEffect } from 'react';
import { SocketContext } from '../../context/socket';
import ScrollToBottom from "react-scroll-to-bottom";
import axios from 'axios';

function Game() {
  
  const socket = useContext(SocketContext);
  const msgInputRef = useRef("");

  const [ScoreBoard, setScoreBoard] = useState(socket._userList);
  const [Chatbox, setChatbox] = useState([]);
  const [Ansbox, setAnsbox] = useState([]);
  const [AnsSet,setAnsSet] = useState([]); //acting as a set
  const [Letters, setLetters] = useState([' ',' ',' ',' ']);
  const [BtnTxt, setBtnTxt] = useState("Get Letters");
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
      if(timeLeft===0){
         console.log("TIME LEFT IS 0");
         setTimeLeft(null)
      }
      if (!timeLeft) return;
      const intervalId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }, [timeLeft]);

  //send msgs
  const sendMsg = async () => {
    const msgToSend = msgInputRef.current.value.toLowerCase();
    if (msgToSend.trim()===""){
      return;
    }
    //send to backend to check
    const check = await axios.post('http://localhost:3001/check',{msg:msgToSend});
    let flag = check.data.correct;

    // check if it contains arr;
    Letters.map((ch) => {
      if (msgToSend.indexOf(ch) === -1){
        flag = false;
      }
    })
    // //check if ists done
    if (AnsSet.indexOf(msgToSend) > -1) {
      msgToSend = "*this word was done already !*";
      flag = false;
  } 
    
    await socket.emit("req_sendMsg",{username :socket._username,
      msg: msgToSend,
      flag : flag});
    msgInputRef.current.value = "";
  }
  //send if enter is pressed
  const checkEnter = async (e) => {
    if (e.keyCode === 13){
      await sendMsg();
    }
  }

  const increaseScore = async (username) => {
    const arr = ScoreBoard.map((user) => {
      if (user.username === username) {
        user.score += 1;
      }
      return user;
    });
    setScoreBoard(arr);
    // setTimeout(function(){setScoreBoard(arr)},500) ;
    
  }

  useEffect(() => {
    socket.on("get_msg",({username,msg,flag}) => {
      const chat = {username : username, msg: msg,flag: flag};
      console.log({username,msg,flag});
      if(flag){ //if correct ans by username
        increaseScore(username);
        setAnsbox((Ansbox) => [...Ansbox,chat]);
        setAnsSet((AnsSet) => [...AnsSet,msg]);
      } else {
        
        setChatbox((Chatbox) => [...Chatbox,chat]);
      }

      
    });

    socket.on("get_letters",({arrLetters}) =>{
      setAnsbox([]);
      setAnsSet([]);
      setTimeLeft(3)
      setBtnTxt("Getting letters in ");
      setTimeout(function(){setLetters(arrLetters)},3000);
      setTimeout(function(){setBtnTxt("Get Letters")}, 3000);

      // setTimeout(setLetters(['X','X','X','X']),5000);
    })
  }, [socket]);

  // sub Components
  const Presentor = () => {
    return(
      <div className="presentor d-flex flex-column justify-content-around">
        {Letters.map((char,idx)=>{
          return(
            <div className="letter-box-container">
              <div className="letter-box">{char}</div>
            </div>
          )
        })}
      </div>
    )
  }

  const LetterGetter = () => {
    const getletters = () => {
      socket.emit("req_letters");
    }
    return(
      <>
      <button onClick={getletters} className="btn letter-getter-btn" disabled={!socket._role}>{BtnTxt} {timeLeft}</button>
      </>
    )
  }

  const Scores = () => {
    return (
      <ScrollToBottom className="score-container">
        {ScoreBoard.map((user,idx)=>{
          return(
            <div className="score-tile d-flex flex-row justify-content-between">
              <span >{user.username}</span>
              <span>{user.score}</span>
            </div>
          )
        })}
      </ScrollToBottom>
    )
  }
  const Chat = () => {
    return(
      <div className='chat-container'>
        
      <ScrollToBottom className="msg-container">
          {Chatbox.map((msg,idx)=>{
            return (
              <div className='chat-msg' key={idx}> {msg.username} : {msg.msg}</div>
            );
          })}
          <input ref={msgInputRef} type="text" className="type-here" autoFocus="autoFocus" onKeyDown={checkEnter}/>
        <button className="send-msg-btn" onClick={sendMsg}> &#10097;&#10097;&#10097;</button>
        
        </ScrollToBottom>
        
        
      </div>
    )
  }

  const Ans = () => {
    return(
      <div className='Ans-container'>
      <ScrollToBottom className="Ans-container-inside">
          {Ansbox.map((msg,idx)=>{
            return (
              <div className='ans-msg d-flex justify-content-between' key={idx}>
                <span>{msg.msg}</span>
                <span>{msg.username}</span>  
                </div>
            );
          })}
        </ScrollToBottom>
      </div>
    )
  }

  return (
    <div className="Game d-flex flex-column">
      <div className="main-title-3">WORD RUSH</div>

      <div className="d-flex flex-row">
        
      <div className="left-part d-flex">
        <Ans/>
      </div>
      
      <div className="mid-part d-flex flex-column">
        <Presentor/>
        <LetterGetter/>
      </div>

      <div className="right-part d-flex flex-column">
        <Chat/>
        <Scores/>
      </div>
      </div>
      

      
    </div>
  )

  
}



export default Game