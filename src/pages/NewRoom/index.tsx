import { FormEvent, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import illustration from "../../assets/images/illustration.svg";
import logo from "../../assets/images/logo.svg";

import { Button } from "../../components/Button";

import { database } from "../../services/firebase";
import { useAuth } from "../../hooks/useAuth";

import "../../styles/auth.scss";

export function NewRoom() {
  const history = useHistory();

  const [roomName, setRoomName] = useState("");

  const { user } = useAuth();

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (roomName.trim() === "") return;

    const roomRef = database.ref("rooms");

    const firebaseRoom = await roomRef.push({
      authorID: user?.id,
      title: roomName,
    });

    history.push(`/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustration}
          alt="Ilustração simbolizando perguntas erespostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logo} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={(e) => setRoomName(e.target.value)}
              value={roomName}
            />
            <Button type="submit">Criar na sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">Click aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
