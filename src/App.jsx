import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("https://facebook-c0wn.onrender.com");

function App() {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    socket.on("mensaje", (data) => {
      setMensajes((prevMensajes) => [...prevMensajes, data]);
    });

    return () => {
      socket.off("mensaje");
    };
  }, []);

  const enviarMensaje = () => {
    if (mensaje.trim()) {
      socket.emit("mensaje", mensaje);
      setMensaje("");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Chat en Vivo</h2>
      <div style={{ border: "1px solid gray", padding: "10px", height: "300px", overflowY: "scroll" }}>
        {mensajes.map((msg, index) => (
          <div key={index} style={{ padding: "5px", borderBottom: "1px solid lightgray" }}>
            {msg}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        placeholder="Escribe un mensaje..."
        style={{ width: "80%", padding: "5px", marginTop: "10px" }}
      />
      <button onClick={enviarMensaje} style={{ marginLeft: "10px" }}>
        Enviar
      </button>
    </div>
  );
}

export default App;
