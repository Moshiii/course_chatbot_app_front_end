import { useState, useEffect } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import Cookies from 'universal-cookie';

const systemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
  "role": "system", "content": "Explain things like you're talking to a software professional with 2 years of experience."
};

// const base_url = process.env.REACT_APP_AWS;

const Chat =({ loggedIn, setLoggedIn }) => {

  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm your professor",     
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);

  const cookies = new Cookies();

  useEffect(() => {

    let allMessages = cookies.get('allMessages');
    const token = cookies.get('session');
    console.log("token1" + token)
    allMessages && setMessages(allMessages);

    let loggedIn = localStorage.getItem('loggedIn');

    if(loggedIn) {
      setLoggedIn(true);
    }
  },[]);

  const handleSend = async (message) => {
    console.log(message)
    
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const allMessages = [...messages, newMessage]; // old msgs + new
    
    setMessages(allMessages);
    setIsTyping(true);
    cookies.set('allMessages', allMessages, { path: '/chat' });
    // await processMessageToChatGPT(allMessages);
  };

  const processMessageToChatGPT = async (chatMessages) => {
    
    const token = cookies.get('session');
    console.log("token2" + token)
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
    });

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,  // The system message DEFINES the logic of our chatGPT
        ...apiMessages // The messages from our chat with ChatGPT
      ]
    }
    console.log(apiRequestBody);

    //  await fetch("https://ec2-44-212-203-117.compute-1.amazonaws.com:5000/api/openai", 
    // {
    //   method: "POST",
    //   headers: {
    //     "Authorization": "Bearer " + token,
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(apiRequestBody)
    // }).then((data) => {
    //   return data.json();
    // }).then((data) => {
    //   console.log(data);
    //   setMessages([...chatMessages, {
    //     message: data.choices[0].message.content,
    //     sender: "ChatGPT"
    //   }]);
    //   setIsTyping(false);
    // });
  };

  return (
    <div className="App">
      <div className="layout">
        {
          loggedIn ? <MainContainer>
            <ChatContainer>                
              <MessageList 
                scrollBehavior="smooth" 
                typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
              > 
                {messages.map((message, i) => {
                  return <Message key={i} model={message} />
                })}
              </MessageList>
              <MessageInput placeholder="Type message here" onSend={handleSend} />        
            </ChatContainer>
          </MainContainer> 
          : <div>please log in first</div>
        }
      </div>
    </div>
  );
};

export default Chat;