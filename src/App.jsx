import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("https://facebook-c0wn.onrender.com");

function App() {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [imagen, setImagen] = useState(null);

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

  const enviarImagen = async () => {
    if (!imagen) return alert("Selecciona una imagen");

    const formData = new FormData();
    formData.append("image", imagen);

    const response = await fetch("https://facebook-c0wn.onrender.com/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.imageUrl) {
      socket.emit("mensaje", data.imageUrl);
    }

    setImagen(null);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Chat en Vivo</h2>
      <div
        style={{
          border: "1px solid gray",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
        }}
      >
        {mensajes.map((msg, index) =>
          msg.includes("http") ? (
            <img
              key={index}
              src={msg}
              alt="imagen"
              style={{ width: "200px", marginBottom: "10px" }}
            />
          ) : (
            <div
              key={index}
              style={{ padding: "5px", borderBottom: "1px solid lightgray" }}
            >
              {msg}
            </div>
          )
        )}
      </div>
      <input
        type="file"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        placeholder="Escribe un mensaje..."
        style={{ width: "80%", padding: "5px", marginTop: "10px" }}
      />
      <button onClick={enviarMensaje} style={{ marginLeft: "10px" }}>
        Enviar
      </button>

      <input
        type="file"
        onChange={(e) => setImagen(e.target.files[0])}
        accept="image/*"
        style={{ marginTop: "10px" }}
      />
      <button onClick={enviarImagen} style={{ marginLeft: "10px" }}>
        Enviar Imagen
      </button>
    </div>
  );
}

export default App;
