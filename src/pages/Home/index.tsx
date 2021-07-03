import { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";

import illustration from "../../assets/images/illustration.svg";
import logo from "../../assets/images/logo.svg";
import googleIcon from "../../assets/images/google-icon.svg";

import { database } from "../../services/firebase";

import { useAuth } from "../../hooks/useAuth";

import { Button } from "../../components/Button";

import "../../styles/auth.scss";

export function Home() {
  const { user, SingInWithGoogle } = useAuth();

  const [roomCode, setRoomCode] = useState("");

  const history = useHistory();

  async function handleCreateRoom() {
    if (!user) {
      await SingInWithGoogle();
    }

    history.push("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert("Sala não existe");
      return;
    }

    if (roomRef.val().endedAt) {
      alert("Room already closed.");
      return;
    }

    history.push(`/admin/rooms/${roomCode}`);
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
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIcon} alt="logo google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">
            <span></span>
            <p>ou entre em uma sala</p>
            <span></span>
          </div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(e) => setRoomCode(e.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
