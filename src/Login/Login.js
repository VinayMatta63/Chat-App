import { Button } from "@material-ui/core";
import React from "react";
import "./Login.css";
import { auth, provider } from "../firebase";
import { useStateValue } from "../StateProvider";
import { actionTypes } from "../reducer";
import axios from "../axios";
const Login = () => {
  const [{}, dispatch] = useStateValue();
  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
        axios.get(`/api/v1/login/${result.user.email}`).then((response) => {
          if (response.data.length === 0) {
            axios.post("/api/v1/login", {
              name: result.user.displayName,
              email: result.user.email,
              img: result.user.photoURL,
            });
          }
        });
      })
      .catch((error) => alert(error.message));
  };
  return (
    <div className="Login">
      <div className="LoginContainer">
        <img
          alt=""
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/150px-WhatsApp.svg.png"
        />
        <div className="LoginText">
          <h1>Sign into WhatsClone</h1>
        </div>
        <Button type="Submit" onClick={signIn}>
          Sign In With Google
        </Button>
      </div>
    </div>
  );
};

export default Login;
