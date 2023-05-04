import { useState, useEffect } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import Cookies from 'universal-cookie';

// const base_url = process.env.REACT_APP_AWS;

const Chat =({ loggedIn, setLoggedIn }) => {

  const welcomeMsg = [
    {
      message: "Hello, I'm your professor",     
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ];
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState(welcomeMsg);

  const cookies = new Cookies();

  useEffect(() => {

    let loggedIn = localStorage.getItem('loggedIn');

    if(loggedIn) {     
      let allMessages = cookies.get('allMessages');
      if(allMessages) {
        setMessages(allMessages);
      }

      setLoggedIn(true);
    } 
  },[]);

  const handleSend = async (message) => {

    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const allMessages = [...messages, newMessage]; // old msgs + new
    
    setMessages(allMessages);
    setIsTyping(true);
    cookies.set('allMessages', allMessages, { path: '/chat' });
    await processMessageToChatGPT(allMessages);
  };

  const processMessageToChatGPT = async (chatMessages) => {
    
    const token = cookies.get('access_token');
  
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
    });

    const apiRequestBody = [...apiMessages];

    await fetch("https://ec2-44-212-203-117.compute-1.amazonaws.com:5000/api/openai", 
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,       
      },
      body: JSON.stringify(apiRequestBody)})
        .catch(console.error)
        .then(response => (response.json()))
        .then((data) => {
          setMessages([...chatMessages, {
            message: data[data.length - 1].content,
            sender: "ChatGPT"
          }]);
          setIsTyping(false);
    });
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
              <MessageInput attachButton={false} placeholder="Type message here" onSend={handleSend} />        
            </ChatContainer>
          </MainContainer> 
          : <div>please log in first</div>
        }
      </div>
    </div>
  );
};

export default Chat;