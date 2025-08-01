import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // Update later if deployed

function App() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [inRoom, setInRoom] = useState(false);
  const [hand, setHand] = useState([]);
  const [tableCards, setTableCards] = useState([]);
  const [isHost, setIsHost] = useState(false);

  // On connection, listen for updates
  useEffect(() => {
    socket.on("yourHand", (cards) => setHand(cards));
    socket.on("tableUpdate", (cards) => setTableCards(cards));
  }, []);

  const createRoom = () => {
    socket.emit("createRoom", username, (id) => {
      setRoomId(id);
      setInRoom(true);
      setIsHost(true);
    });
  };

  const joinRoom = () => {
    socket.emit("joinRoom", roomId, username, (success) => {
      if (success) setInRoom(true);
    });
  };

  const dealCards = () => {
    socket.emit("dealCards", roomId);
  };

  const playCard = (card) => {
    socket.emit("playCard", roomId, card);
    setHand((prev) => prev.filter((c) => c !== card));
  };

  if (!inRoom) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Table of Fun 🎴</h1>
        <input
          placeholder="Your Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <button onClick={createRoom} disabled={!username}>Create Room</button>
        <hr />
        <input
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <br />
        <button onClick={joinRoom} disabled={!roomId || !username}>Join Room</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Room: {roomId}</h2>
      <h3>Welcome, {username}!</h3>

      {isHost && (
        <button onClick={dealCards}>Deal Cards</button>
      )}

      <h4>Your Hand</h4>
      <div style={{ display: "flex", gap: "10px", marginBottom: "2rem" }}>
        {hand.map((card, index) => (
          <div
            key={index}
            onClick={() => playCard(card)}
            style={{
              border: "1px solid black",
              padding: "10px",
              cursor: "pointer",
              background: "#fff"
            }}
          >
            {card}
          </div>
        ))}
      </div>

      <h4>Cards on the Table</h4>
      <div style={{ display: "flex", gap: "10px" }}>
        {tableCards.map((card, index) => (
          <div
            key={index}
            style={{
              border: "1px solid gray",
              padding: "10px",
              background: "#eee"
            }}
          >
            {card}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
