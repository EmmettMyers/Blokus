import "./Login.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import ProfileIcon from "../../assets/ProfileIcon.svg";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogIn = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        window.location.href = "/home";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <form id="login" onSubmit={handleLogIn}>
      Log In to your Account
      <div id="loginbox">
        <div id="loimagebox">
          <img alt="Profile" src={ProfileIcon} id="loprofilepic" />
        </div>
        <div id="loinfocontainer">
          <div id="loinfotext">
            <div id="loinfobox">Email:</div>
            <div id="loinfobox">Password:</div>
          </div>
          <div id="loinputtext">
            <input
              id="lotextbox"
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              id="lotextbox"
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div id="loginbutton" type="submit">
        Log In
      </div>
      <span id="rusignupmessage">
        Don't have an account?{" "}
        <Link id="rusignuplink" to={"/signup"}>
          Sign up!
        </Link>
      </span>
    </form>
  );
}

export default Login;
