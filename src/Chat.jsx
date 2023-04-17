import { useState, useEffect } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import Cookies from 'universal-cookie';

const Chat =() => {

  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm your professor",     
    }
  ]);
  const cookies = new Cookies();

  useEffect(() => {
    
    let allMessages = cookies.get('allMessages');
    allMessages && setMessages(allMessages);
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
    // await processMessageToChatGPT(allMessages);
  };

  // async function processMessageToChatGPT(chatMessages) { 
  //   console.log(chatMessages)
  //   // Get the request body set up with the model we plan to use
  //   // and the messages which we formatted above. We add a system message in the front to'
  //   // determine how we want chatGPT to act. 
  //   const apiRequestBody = {
  //     "model": "gpt-3.5-turbo",
  //     "messages": [
  //       systemMessage,  // The system message DEFINES the logic of our chatGPT
  //       ...apiMessages // The messages from our chat with ChatGPT
  //     ]
  //   }

  //   await fetch("https://127.0.0.1:5000/api/openai", 
  //   {
  //     method: "POST",
  //     body: JSON.stringify({
  //     response: 
  // }),
  //   }).then((data) => {
  //     return data.json();
  //   }).then((data) => {
  //     console.log(data);
  //     setMessages([...chatMessages, {
  //       message: data.choices[0].message.content,
  //       sender: "ChatGPT"
  //     }]);
  //     setIsTyping(false);
  //   });
  // }

  return (
    <div className="App">
      <div className="layout">
        <MainContainer>
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
      </div>
    </div>
  )
}

export default Chat;

// messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    // let apiMessages = chatMessages.map((messageObject) => {
    //   let role = "";
    //   if (messageObject.sender === "ChatGPT") {
    //     role = "assistant";
    //   } else {
    //     role = "user";
    //   }
    //   return { role: role, content: messageObject.message}
    // });