import React, { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  Message,
  MessageInput,
  ChatContainer,
  MessageList,
  TypingIndicator,
  Avatar
} from '@chatscope/chat-ui-kit-react';
import './App.css';
import img1 from './images/bot_image1.png';
import img2 from './images/bot_image2.png';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

// System message to define how Chatbot_by_Ade explains things
const systemMessage = {
  role: 'system',
  content: "Explain things like you're talking to a software professional with 2 years of experience."
};

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      message: "Hi! I'm Chatbot_by_Ade, \n I am powered by the Adesdesk AI Companion to Adeola David A. \n Kindly input a message to ask me any question!",
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
    await processMessageToChatbotByAde(newMessages);
  };

  async function processMessageToChatbotByAde(chatMessages) {
    // Format messages to conform to the API expectations
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === "Chatbot_by_Ade" ? "AI" : "user";
      return { role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage,
        ...apiMessages
      ]
    };

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      });

      if (!response.ok) {
        setIsTyping(false);
        throw new Error('Failed to get a response. Please check your plan');
      }

      const data = await response.json();
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "Chatbot_by_Ade"
      }]);
      setIsTyping(false);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  return (
    <div className="App">
      <div className='chatInterface'>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="Chatbot_by_Ade is typing" /> : null}
            >
              {messages.map((message, i) => {
                console.log(message);
                const isChatbot = message.sender === 'Chatbot_by_Ade';
                const avatarSrc = isChatbot ? img1 : img2;
                const avatarName = isChatbot ? 'Chatbot_by_Ade' : 'User';
                return (
                  <Message key={i} model={message}>
                    <Avatar src={avatarSrc} name={avatarName} />
                  </Message>
                );
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSendButtonClick} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default Chatbot;