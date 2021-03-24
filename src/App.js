import React, { useState, useEffect } from "react";
import "./App.css";
import Chat from "./Chat/Chat";
import Panel from "./Panel/Panel";
import Pusher from "pusher-js";
import axios from "./axios.js";
import Login from "./Login/Login.js";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { auth } from "./firebase";

function App() {
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [connecting, setConnecting] = useState(true);
  let props = {};
  if (!connecting) {
    props = { display: "none" };
  }

  useEffect(() => {
    axios.get("/api/v1/messages/sync").then((response) => {
      setMessages(response.data);

      setInterval(() => {
        setConnecting(false);
      }, 2000);
    });
  }, []);

  useEffect(() => {
    const pusher = new Pusher("f9c329d4fa5a70da9216", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", function (newMessages) {
      setMessages([...messages, newMessages]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      console.log(authUser);
      if (authUser) {
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, [dispatch]);
  return (
    <div className="App">
      {!user ? (
        <Login></Login>
      ) : (
        <div className="AppBody">
          <div className="loader" style={props}>
            <img
              className="loaderGif"
              src="https://www.wpfaster.org/wp-content/uploads/2013/06/loading-gif.gif"
              alt=""
            />
          </div>
          <BrowserRouter>
            <Panel />
            <Switch>
              <Route path="/api/v1/room/:roomId">
                <Chat messages={messages} />
              </Route>
              <Route path="/">{}</Route>
            </Switch>
          </BrowserRouter>
        </div>
      )}
    </div>
  );
}

export default App;
