import "./SignUp.css";
import { useState } from "react";
import ProfileIcon from "../../assets/ProfileIcon.svg";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import database, { auth } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

function SignUp() {
  const [nickname, setNickname] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState(" ");

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential); // Check the structure of userCredential to ensure it contains the user property

      // Access the UID of the newly created user
      const uid = userCredential.user.uid;
      console.log(uid);

      // Now you can use this UID to add the user to Firestore
      const docRef = doc(database, "users", uid);
      const payload = {
        nickname: nickname,
        firstName: firstName,
        lastName: lastName,
        profileImage: "example.jpg",
        gamesPlayed: 0,
        gamesWon: 0,
        totalPieces: 0,
      };
      await setDoc(docRef, payload);

      window.location.href = "/home";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form id="signup" onSubmit={handleSignUp}>
      Create an Account to Play
      <div id="signupbox">
        <div id="suimagebox">
          <img alt="Profile" src={ProfileIcon} id="suprofilepic" />
        </div>
        <div id="suinfocontainer">
          <div id="suinfotext">
            <div class="suinfobox">Nickname:</div>
            <div class="suinfobox">First Name:</div>
            <div class="suinfobox">Last Name:</div>
            <div class="suinfobox">Email:</div>
            <div class="suinfobox">Password:</div>
            <div class="suinfobox">Confirm Password:</div>
          </div>
          <div id="suinputtext">
            <input
              class="sutextbox"
              type="text"
              placeholder="Enter Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <input
              class="sutextbox"
              type="text"
              placeholder="Enter First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              class="sutextbox"
              type="text"
              placeholder="Enter Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              class="sutextbox"
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              class="sutextbox"
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              class="sutextbox"
              type="password"
              placeholder="Re-type Password"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
      </div>
      <button id="signupbutton" type="submit">
        Sign Up
      </button>
      <span id="suloginmessage">
        Already have an account?{" "}
        <Link id="suloginlink" to={"/login"}>
          Log in here!
        </Link>
      </span>
    </form>
  );
}

export default SignUp;
