//import React from 'react'
import axios from "axios"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid";
import Humanreply from "./Humanreply";
import Aichatreply from "./Aichatreply";
import { useSelector ,useDispatch } from "react-redux";
import { create_session } from "../features/session/sessionSlice";



function ChatPage() {
  const [humanquestion,setHumanquestion] = useState('')
  const [messageHistory,setMessageHistory] = useState([{}])
  const [airesponse,setAiresponse] = useState('')
  const [id,setId]=useState(null)

 const session_id = useSelector((state) => state.session_id);
 console.log(session_id,'new')
 const dispatch = useDispatch()

  const handleChange =(e)=>{
   setHumanquestion(e.target.value)
  }

  useEffect(()=>{
    const newId = uuidv4();
    dispatch(create_session(newId))
    async function fetch_chat_history(){
      const session_id = '1234'
     await axios.get(`http://127.0.0.1:8000/sql_chain/chats/${session_id}`).then((res)=>
     setMessageHistory(res.data)
    );
    }
    fetch_chat_history()
  },[])
  const handleClick =async ()=>{
    if(id){
    try{
        const result = await axios.post(
          "http://127.0.0.1:8000/sql_chain/gbq_v1/askQuestion",
        {
        question: humanquestion,
        uuid:id
      });
      console.log(result.data)
      setAiresponse(result.data)
    }catch(e){
      console.log(e)
    }
  }else{
    alert('no session id found')
  }
  }
  console.log(humanquestion)

  const handleuniqueid = ()=>{
    const newId = uuidv4()
    setId(newId)
  }
  return (
    <div className="h-[100vh - 70px] bg-slate-100 flex-[80%] mt-[70px] text-cyan-950 p-4">

      <div className="h-[75vh] overflow-y-scroll w-full ">
        {/*Component for human chat*/}
        {messageHistory.map((msg,index)=>{
          if(msg.sender === 'Human'){
            return( 
              <div key={index} className="flex justify-end p-4">
                <Humanreply chatdata={msg}/>
              </div>)
            
          }
          if(msg.sender === 'Ai'){
            return <div key={index}><Aichatreply chatdata={msg}/></div>
          }
        })}
        
        {/*Component for Ai chat */}
        <div className="">
          {/* {airesponse && airesponse.message && (
          <Markdown rehypePlugins={[remarkGfm]} components={renderers}>{`${airesponse.message}`}</Markdown>
        )} */}
          {airesponse && <Aichatreply chatdata={airesponse} />}
        </div>
      </div>

      {/*Input component */}
      <div
        className="w-full sticky p-4 bottom-0 flex justify-center"
        style={{ background: "rgba(255, 255, 255, 0.5)",backdropFilter:"blur(0.5px)",WebkitBackdropFilter:'blur(0.5px)' }}
      >
        <div className="w-[70%] bg-white border-[1px] p-4  flex rounded-md">
          <input
            className="border-none outline-none w-[80%]"
            placeholder="Type your message here"
            value={humanquestion}
            onChange={handleChange}
          />
          <div onClick={handleClick}>Send</div>
        </div>
      </div>

      <div onClick={handleuniqueid}>Generateid</div>
    </div>
  );
}

export default ChatPage