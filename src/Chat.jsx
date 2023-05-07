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

const Chat = ({ loggedIn, setLoggedIn }) => {

  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm your professor",
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


  return  (
    <div className={styles.shade}>
      <div className={styles.blackboard}>
        <div className={styles.form}>
          <div className="layout">
            {loggedIn ? (
              <MainContainer className="chat-main-container">
                <ChatContainer className="chat-container">
                  <MessageList
                    scrollBehavior="smooth"
                    typingIndicator={
                      isTyping ? (
                        <TypingIndicator content="Virtual Professor is typing" />
                      ) : null
                    }
                  >
                    {messages.map((message, i) => {
                      return <Message key={i} model={message} />;
                    })}
                  </MessageList>
                  <MessageInput
                    placeholder="Please select an option first"
                    onSend={handleSend}
                    attachButton={false}
                    sendButton={option ? true : false}
                  />
                </ChatContainer>

                <ExpansionPanel
                  className="expansion-panel"
                  title="Options"
                  open={false}
                >
                  <button onClick={handleFocus}>Focus</button>
                  <button onClick={handleExplore}>Explore</button>
                </ExpansionPanel>
              </MainContainer>
            ) : (
              <div>please log in first</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );;
};

export default Chat;
