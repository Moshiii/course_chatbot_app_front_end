import { useState, useEffect } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import Cookies from 'universal-cookie';

// const base_url = process.env.REACT_APP_AWS;

const Chat = ({ loggedIn, setLoggedIn }) => {

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

    allMessages && setMessages(allMessages);

    let loggedIn = localStorage.getItem('loggedIn');

    if (loggedIn) {
      setLoggedIn(true);
    }
  }, []);

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
      return { role: role, content: messageObject.message }
    });

    const apiRequestBody = [...apiMessages];
    console.log(apiRequestBody);

    await fetch("https://ec2-44-212-203-117.compute-1.amazonaws.com:5000/api/openai",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(apiRequestBody)
      }).then((data) => {
        return data.json();
      }).then((data) => {
        console.log(data);
        setMessages([...chatMessages, {
          message: data.choices[0].message.content,
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
                typingIndicator={isTyping ? <TypingIndicator content="Virtual Professor is typing" /> : null}
              >
                {messages.map((message, i) => {
                  return <Message key={i} model={message} />
                })}
              </MessageList>
              {/* <MessageInput placeholder="Type message here" onSend={handleSend} />         */}
              <MessageInput
                placeholder="Type message here"
                onSend={handleSend}
                buttons={[
                  {
                    key: 'button1',
                    icon: <YourFirstButtonIcon />,
                    onClick: () => console.log('First button clicked'),
                  },
                  {
                    key: 'button2',
                    icon: <YourSecondButtonIcon />,
                    onClick: () => console.log('Second button clicked'),
                  }
                ]}
              />
            </ChatContainer>
          </MainContainer>
            : <div>please log in first</div>
        }
      </div>
    </div>
  );
};

export default Chat;