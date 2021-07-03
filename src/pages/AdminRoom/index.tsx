import { useHistory, useParams } from "react-router-dom";

import { RoomCode } from "../../components/RoomCode";
import { Question } from "../../components/Question";
import { Button } from "../../components/Button";

import LogoImg from "../../assets/images/logo.svg";
import deleteImg from "../../assets/images/delete.svg";
import answerImg from "../../assets/images/answer.svg";
import checkImg from "../../assets/images/check.svg";

import { useRoom } from "../../hooks/useRoom";
import { database } from "../../services/firebase";

import "../../styles/room.scss";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const history = useHistory();

  const { id: roomID } = useParams<RoomParams>();

  const { questions, title } = useRoom(roomID);

  async function hanldeEndRoom() {
    await database.ref(`rooms/${roomID}`).update({
      endedAt: new Date(),
    });

    history.push("/");
  }

  async function handleDeleteQuestion(questionID: string) {
    if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
      await database.ref(`rooms/${roomID}/questions/${questionID}`).remove();
    }
  }

  async function handleCheckQuestionAsAnswered(questionID: string) {
    await database.ref(`rooms/${roomID}/questions/${questionID}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionID: string) {
    await database.ref(`rooms/${roomID}/questions/${questionID}`).update({
      isHighlighted: true,
    });
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={LogoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomID} />
            <Button isOutlined onClick={hanldeEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => (
            <Question
              key={question.id}
              author={question.author}
              content={question.content}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
            >
              {!question.isAnswered && (
                <>
                  <button
                    type="button"
                    onClick={() => handleHighlightQuestion(question.id)}
                  >
                    <img src={checkImg} alt="Dar destaque à pergunta" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCheckQuestionAsAnswered(question.id)}
                  >
                    <img
                      src={answerImg}
                      alt="Marcar pergunta como respondida"
                    />
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="remover pergunta" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}
