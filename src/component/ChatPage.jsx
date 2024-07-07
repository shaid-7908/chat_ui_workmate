//import React from 'react'
import axios from "axios";
import { useEffect, useState ,useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Humanreply from "./Humanreply";
import Aichatreply from "./Aichatreply";
import { useSelector, useDispatch } from "react-redux";
import { create_session } from "../features/session/sessionSlice";
import { LuSendHorizonal } from "react-icons/lu";
import { MagnifyingGlass} from "react-loader-spinner";
const EXPIRATION_TIME = 2 * 60 * 60 * 1000;

function ChatPage() {
 
  
  const [humanquestion, setHumanquestion] = useState("");
  const [messageHistory, setMessageHistory] = useState([{}]);
  const [airesponse, setAiresponse] = useState("");
  const [preloading, setPreloading] = useState(false);
  const [loading, setLoading] = useState("stop");
  const [id, setId] = useState(null);


  const scrollRef = useRef(null);
  console.log(messageHistory,'messagehistory')
  const session_id = useSelector((state) => state.session_id);
  console.log(session_id, "new");
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setHumanquestion(e.target.value);
  };
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [airesponse, messageHistory]);

  useEffect(() => {
    const storedId = localStorage.getItem("session_id");
    const storedTimestamp = localStorage.getItem("session_timestamp");

    const isExpired =
      !storedTimestamp ||
      new Date().getTime() - storedTimestamp > EXPIRATION_TIME;

    let newId;
    if (storedId && !isExpired) {
      newId = storedId;
    } else {
      newId = uuidv4();
      localStorage.setItem("session_id", newId);
      localStorage.setItem("session_timestamp", new Date().getTime());
    }

    dispatch(create_session(newId));
    async function fetch_chat_history() {
      // await axios
      //   .get(
      //     `https://workmate-api-private.onrender.com/sql_chain/chats/${session_id}`
      //   )
      //   .then((res) => setMessageHistory(res.data));
      console.log('hello')
    }
    fetch_chat_history();
  }, [session_id]);


  const handleClick = async () => {
    if (!humanquestion.trim()) {
      alert("Please enter a question.");
      return;
    }
    if (session_id) {
      const humanmessage = {
        message: humanquestion,
        sender: "Human",
        session_id:session_id,
        sql_query: "",
      };
      setPreloading(true);
      setMessageHistory((prev) => [...prev, humanmessage]);
      try {
        setLoading("loading");
        const result = await axios.post(
          "https://workmate-api-private.onrender.com/sql_chain/gbq_v1/askQuestion",
          {
            question: humanquestion,
            uuid: session_id,
          }
        );
        setHumanquestion('')
        console.log(result.data);
        setLoading("stop");
        setPreloading(false);
        setMessageHistory((prev)=>[...prev,result.data])
        setAiresponse(result.data);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("no session id found");
    }
  };

  return (
    <div className="h-[100vh - 70px] bg-slate-100 flex-[80%] mt-[70px] text-cyan-950 p-4">
      <div className="h-[75vh] overflow-y-scroll w-full " ref={scrollRef}>
        {/*Component for human chat*/}
        {messageHistory.map((msg, index) => {
          if (msg.sender === "Human") {
            return (
              <div key={index} className="flex justify-end p-4">
                <Humanreply chatdata={msg} />
              </div>
            );
          }
          if (msg.sender === "Ai") {
            return (
              <div key={index}>
                <Aichatreply chatdata={msg} />
              </div>
            );
          }
        })}

        {/*Component for Ai chat */}

        <div className="">
          {/* {airesponse && airesponse.message && (
          <Markdown rehypePlugins={[remarkGfm]} components={renderers}>{`${airesponse.message}`}</Markdown>
        )} */}
          {/* {airesponse && <Aichatreply chatdata={airesponse} />} */}
          {preloading && loading === "loading" ? (
            <div
              className="border-[1px] w-[30%] bg-white rounded-md py-2 px-4 flex items-center my-2"
              style={{ boxShadow: "0 5px 5px rgba(0, 0, 0, 0.05)" }}
            >
              <div>
                <MagnifyingGlass
                  visible={true}
                  height="40"
                  width="40"
                  ariaLabel="magnifying-glass-loading"
                  wrapperStyle={{}}
                  wrapperClass="magnifying-glass-wrapper"
                  glassColor="#c0efff"
                  color="#e15b64"
                />
              </div>
              Analyzing response...
            </div>
          ) : (
            <span></span>
          )}
        </div>
      </div>

      {/*Input component */}
      <div
        className="w-full sticky p-4 bottom-0 flex justify-center"
        style={{
          background: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(0.5px)",
          WebkitBackdropFilter: "blur(0.5px)",
        }}
      >
        <div className="w-[70%] bg-white border-[1px] p-4  flex justify-between items-center rounded-md">
          <input
            className="border-none outline-none w-[80%]"
            placeholder="Type your message here"
            value={humanquestion}
            onChange={handleChange}
          />
          <div onClick={handleClick} className="cursor-pointer p-4">
            <div className="text-2xl">
              <LuSendHorizonal />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
