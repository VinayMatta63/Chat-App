import { Avatar, IconButton, Modal, Tooltip } from "@material-ui/core";
import {
  AttachFile,
  InsertEmoticon,
  MicOutlined,
  Cancel,
  SearchOutlined,
} from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./Chat.css";
import axios from "../axios.js";
import { useStateValue } from "../StateProvider";
import Picker from "emoji-picker-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Chat = ({ messages }) => {
  const [inputState, setInput] = useState("");
  const [img, setImg] = useState("");
  const [roomName, setRoomName] = useState("");
  const [{ user }] = useStateValue();
  const { roomId } = useParams();
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject.emoji);
    inputState ? setInput(inputState + chosenEmoji) : setInput(chosenEmoji);
  };

  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (roomId) {
      axios.get(`/api/v1/room/${roomId}`).then((response) => {
        if (response.data) {
          setRoomName(
            response.data[0].name[0] === user.displayName
              ? response.data[0].name[1]
              : response.data[0].name[0]
          );
          axios
            .get(
              `/api/v1/login/${
                response.data[0].email[0] === user.email
                  ? response.data[0].email[1]
                  : response.data[0].email[0]
              }`
            )
            .then((response) => {
              setImg(response.data[0]?.img);
            });
        }
      });
    }
    // return () => {
    //     cleanup
    // }
  }, [roomId, user]);
  useEffect(() => {
    setInput(transcript);
  }, [transcript]);

  const sendMessage = async (e) => {
    e.preventDefault();
    resetTranscript();
    if (inputState) {
      await axios.post("/api/v1/messages/new", {
        message: inputState,
        name: user.displayName,
        timestamp: Date(new Date().getTime()).toString(),
        received: false,
        roomid: roomId,
        googleid: user.uid,
      });
      setInput("");
    }
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  return (
    <div className="Chat">
      <div className="ChatHeader">
        <Avatar src={img} />
        <div className="ChatHeaderInfo">
          <h3>{roomName}</h3>
          <p>
            last seen {messages[messages.length - 1]?.timestamp.slice(0, 25)}
          </p>
        </div>
        <div className="ChatHeaderIcons">
          <Tooltip title="Search" arrow={true}>
            <IconButton>
              <SearchOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Attach" arrow={true}>
            <IconButton>
              <AttachFile />
            </IconButton>
          </Tooltip>
          <Link to={"/"}>
            <Tooltip title="Close Window" arrow={true}>
              <IconButton>
                <Cancel />
              </IconButton>
            </Tooltip>
          </Link>
        </div>
      </div>
      <div className="ChatBody">
        {messages.map((message) => {
          if (message.roomid === roomId) {
            return (
              <p
                className={`ChatMessage ${
                  message.googleid === user.uid && "ChatReceiver"
                }`}
              >
                <span className="ChatName">{message.name}</span>
                {message.message}
                <span className="ChatTimestamp">
                  {message.timestamp.slice(0, 25)}
                </span>
              </p>
            );
          }
        })}
      </div>
      <div className="ChatFooter">
        <Tooltip title="Emoji" arrow={true}>
          <IconButton onClick={handleOpen}>
            <InsertEmoticon />
          </IconButton>
        </Tooltip>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {<Picker onEmojiClick={onEmojiClick} />}
        </Modal>
        <form>
          <input
            value={inputState}
            onInput={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage} type="submit">
            Send
          </button>
        </form>
        <Tooltip title="Speech to Text" arrow={true}>
          <IconButton
            onClick={SpeechRecognition.startListening}
            onMouseOut={SpeechRecognition.stopListening}
          >
            <MicOutlined />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default Chat;
