import { useState, useEffect } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  ExpansionPanel,
} from "@chatscope/chat-ui-kit-react";
import Cookies from "universal-cookie";
import styles from "./styles.module.css";
import "./App.css";
import "./index.css";


const Chat = ({ loggedIn }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm your virtual professor, how may I help you?",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [option, setOption] = useState("");

  const cookies = new Cookies();

  const handleSend = async (message) => {
    console.log(message);

    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const allMessages = [...messages, newMessage]; // old msgs + new

    setMessages(allMessages);
    setIsTyping(true);
    cookies.set("allMessages", allMessages, { path: "/chat" });
    await processMessageToChatGPT(allMessages);
  };

  const processMessageToChatGPT = async (chatMessages) => {
    const token = cookies.get("access_token");

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message, option };
    });

    const apiRequestBody = [...apiMessages];

    console.log(apiRequestBody);

    await fetch(
      "https://ec2-44-212-203-117.compute-1.amazonaws.com:5000/api/openai",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiRequestBody),
      }
    )
      .catch(console.error)
      .then((response) => response.json())
      .then((data) => {
        setMessages([
          ...chatMessages,
          {
            message: data[data.length - 1].content,
            sender: "ChatGPT",
          },
        ]);
        setIsTyping(false);
      });
  };
  const handleFocus = () => {
    setOption("Focus");
  };
  const handleExplore = () => {
    setOption("Explore");
  };

  return (
    <div>
      <p className={styles.notice}>In using the system,the student code of conduct apply, <br/>
      please do not abuse the system. Please always refer to you study material and textbook for <br/> 
      answer and verification of the correctness of the answer the system provides.</p>
      <div className={loggedIn ? styles.blackboard : null}>
        <div className={loggedIn ? styles.form : null}>
          <div className="chat_box">
            {loggedIn ? (
              <div className="layout">
                <MainContainer className="chat-main-container">
                  <ChatContainer className="chat-container">
                    <MessageList
                      scrollBehavior="smooth"
                      typingIndicator={
                        isTyping ? (
                          <TypingIndicator content="Professor is typing" />
                        ) : null
                      }
                    >
                      {messages.map((message, i) => {
                        return <Message key={i} model={message} />;
                      })}
                    </MessageList>
                    <MessageInput
                      placeholder="Type or select a method to get started"
                      onSend={handleSend}
                      attachButton={false}
                      sendButton={option ? true : false}
                    />
                  </ChatContainer>
                </MainContainer>
                <ExpansionPanel
                  className="expansion-panel"
                  title="Options"
                  open={false}
                >
                  <button onClick={handleFocus}>Focus</button>
                  <button onClick={handleExplore}>Explore</button>
                </ExpansionPanel>
              </div>
            ) : (
              <p>Welcome to my office. I am happy to answer you question. Please login first.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
