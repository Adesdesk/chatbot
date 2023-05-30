import React, { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { useNavigate } from 'react-router-dom';
import {
  MainContainer,
  Message,
  MessageInput,
  ChatContainer,
  MessageList,
  TypingIndicator,
  Avatar
} from '@chatscope/chat-ui-kit-react';
import './Chatbot.css';
import img1 from './images/bot_image1.png';
import img2 from './images/bot_image2.png';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

// botMessages define how Chatbot_by_Ade explains things
const botMessages = {
  role: "system",
  content: "Explain like you would do to an intermediate experienced software professional"
};

function Chatbot() {
  const navigate = useNavigate();

  const handleBlogButtonClick = () => {
    navigate('/blog');
  };
  const [messages, setMessages] = useState([
    {
      message: "Hi! I'm Chatbot_by_Ade, the amazing software developer for business management. \nI am powered by the Adesdesk AI Companion to Adeola David A. \nClick the white space below to input a message asking me any question!",
      sentTime: "Just now",
      sender: "Chatbot_by_Ade"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendButtonClick = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Send message to Chatbot_by_Ade and get the response
    setIsTyping(true);
    await processMessageToChatbot_by_Ade(newMessages);
  };

  async function processMessageToChatbot_by_Ade(chatMessages) {
    // Format messages to conform to the API expectations

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "Chatbot_by_Ade") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    // Define choice model to use

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        botMessages,
        ...apiMessages
      ]
    };

    await fetch("https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      }).then((data) => {
        return data.json();
      }).then((data) => {
        console.log(data);
        setMessages([...chatMessages, {
          message: data.choices[0].message.content,
          sender: "Chatbot_by_Ade"
        }]);
        setIsTyping(false);
      });
  }

  return (
    <div className="App">
      <button className="blogButton" onClick={handleBlogButtonClick}>
          Visit my blog
            </button>

      <div className='chatInterface'>
        <MainContainer>
          <ChatContainer>
            <MessageList style={{ color: "white" }} 
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="Chatbot_by_Ade is typing" /> : null}
            >
              {messages.map((message, i) => {
                console.log(message);

                const isChatbot = message.sender === "Chatbot_by_Ade";
                const avatarSrc = isChatbot ? img1 : img2;
                const avatarName = isChatbot ? "Chatbot_by_Ade" : "User";

                return (
                  <Message key={i} model={message}>
                    <Avatar src={avatarSrc} name={avatarName} />
                  </Message>
                );
              })}
            </MessageList>
            <MessageInput style={{ color: "#073f05", backgroundColor:"white" }} placeholder="Type your message here" onSend={handleSendButtonClick} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default Chatbot;
