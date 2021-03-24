import React, { useState, useEffect } from "react";
import "./Panel.css";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Avatar, IconButton } from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";
import PanelChat from "./PanelChat";
import axios from "../axios.js";
import Pusher from "pusher-js";
import { useStateValue } from "../StateProvider";
import { v4 as uuid } from "uuid";
import { auth } from "../firebase";
import Tooltip from "@material-ui/core/Tooltip";

const Panel = () => {
  const [Chat, setChat] = useState([]);
  const [search, setSearch] = useState("");
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    axios.get("/api/v1/room/sync").then((response) => {
      setChat(response.data);
    });
  }, []);

  useEffect(() => {
    const pusher = new Pusher("f9c329d4fa5a70da9216", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("chats");
    channel.bind("inserted", function (newChat) {
      setChat([...Chat, newChat]);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [Chat]);

  const findUser = async (e) => {
    e.preventDefault();
    if (search) {
      axios.get(`/api/v1/login/${search}`).then((response) => {
        if (response.data.length > 0) {
          createChat(response.data[0]);
        } else {
          alert(
            "User not found!, Enter a registered email to search user. \n (Use vinaymatta63@gmail.com for testing)"
          );
        }
      });
      setSearch("");
    }
  };
  const createChat = async (data) => {
    if (data) {
      await axios.post("/api/v1/room/new", {
        id: uuid(),
        name: [user.displayName, data.name],
        email: [user.email, data.email],
      });
    }
  };
  const loginHandler = () => {
    if (user) {
      auth.signOut();
      dispatch({
        type: "REMOVE_USER",
        user: null,
        cart: [],
      });
    }
  };
  return (
    <div className="Panel">
      <div className="PanelHeader">
        <div className="PanelPic">
          <Avatar src={user?.photoURL} />
        </div>
        <div className="PanelIcons">
          <Tooltip title="Log Out" arrow={true}>
            <IconButton onClick={loginHandler}>
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className="PanelSearch">
        <div className="PanelSearchContainer">
          <SearchOutlined />
          <form>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search or Start new chat"
              type="text"
            />
            <button onClick={findUser} type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
      <div className="PanelChats">
        {Chat.map((room) => {
          // if (room.email.includes(user.email)) {
          return <PanelChat room={room} />;
          // }
        })}
      </div>
    </div>
  );
};

export default Panel;
