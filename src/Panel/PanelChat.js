import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./PanelChat.css";
import axios from "../axios.js";
import { Link } from "react-router-dom";
import { useStateValue } from "../StateProvider";

const PanelChat = ({ room }) => {
  const [last, setLast] = useState("");
  const [img, setImg] = useState("");
  const [{ user }, dispatch] = useStateValue();
  useEffect(() => {
    if (room) {
      axios.get(`/api/v1/messages/${room.id}`).then((response) => {
        console.log(response.data);
        if (response.data.length > 0) {
          console.log(response.data);
          setLast(response.data[response.data.length - 1].message);
        } else {
          setLast("No chat yet.");
        }
      });
      axios
        .get(
          `/api/v1/login/${
            room.email[0] === user.email ? room.email[1] : room.email[0]
          }`
        )
        .then((response) => {
          setImg(response.data[0]?.img);
        });
    }
  }, [room, user]);

  return (
    <Link to={`/api/v1/room/${String(room.id)}`}>
      <div className="PanelChat">
        <Avatar src={img} />
        <div className="PanelChatInfo">
          <h2>
            {room.name[0] === user.displayName ? room.name[1] : room.name[0]}
          </h2>
          <p>{last}</p>
        </div>
      </div>
    </Link>
  );
};
export default PanelChat;
