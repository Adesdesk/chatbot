import { useState } from "react";
import "./App.css";
import { Configuration, OpenAIApi } from "openai";
// import dotenv from "dotenv";

const configuration = new Configuration({
  organization: "org-hDLwSg4mxhinjecFIxoGbxcP",
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function Chatbot() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const chat = async (e, message) => {
    e.preventDefault();

    if (!message) return;
    setIsTyping(true);
    window.scrollTo(0, 100);

    let msgs = chats;
    msgs.push({ role: "user", content: message });
    setChats(msgs);

    setMessage("");

    await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "It's so interesting to interract here",
          },
          ...chats,
        ],
      })
      .then((res) => {
        msgs.push(res.data.choices[0].message);
        setChats(msgs);
        setIsTyping(false);
        window.scrollTo(0, 100);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <main>
      <h1>Chatbot-by-Ade</h1>

      <section>
        {chats && chats.length
          ? chats.map((chat, index) => (
              <p
                key={index}
                className={chat.role === "user" ? "user_msg" : ""}
              >
                <span>
                  <b>{chat.role.toUpperCase()}</b>
                </span>
                <span>:</span>
                <span>{chat.content}</span>
              </p>
            ))
          : ""}
      </section>

      <div className={isTyping ? "" : "hide"}>
        <p>
          <i>{isTyping ? "Typing" : ""}</i>
        </p>
      </div>

      <form action="" onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Type in your messages here and click Enter..."
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </main>
  );
}

export default Chatbot;
