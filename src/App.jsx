import { useState, useRef, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [image, setImage] = useState(null);


  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);




  const sendMessage = async (cameraImage = null) => {
    if (!message && !image && !cameraImage) return;

    const formData = new FormData();
    formData.append("message", message);

    if (cameraImage) {
      formData.append("image", cameraImage, "camera.png");
    } else if (image) {
      formData.append("image", image);
    }

    const newChat = [
      ...chat,
      { user: message || "📸 Image sent", bot: "Typing..." },
    ];

    setChat(newChat);
    setMessage("");
    setImage(null);

    try {
      const res = await fetch("http://localhost:8080/chat", {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("image")) {
        const blob = await res.blob();
        const imageUrl = URL.createObjectURL(blob);

        newChat[newChat.length - 1].bot = (
          <img src={imageUrl} width="200" style={{ borderRadius: "10px" }} />
        );
      } else {
        const text = await res.text();
        newChat[newChat.length - 1].bot = text;
      }

      setChat([...newChat]);
    } catch (error) {
      newChat[newChat.length - 1].bot = "⚠️ Error, try again!";
      setChat([...newChat]);
    }
  };

  return (
    <div className="container">
      <h2>Chatbot 🤖</h2>

      <div className="chat-box">
        {chat.map((c, i) => (
          <div key={i}>
            <div className="message user">{c.user}</div>
            <div className="message bot">{c.bot}</div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      

      <div className="input-box">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
        />

      

        

        <button className="icon-btn send" onClick={() => sendMessage()}>
          <FaPaperPlane />
        </button>
      </div>

    
    </div>
  );
}

export default App;