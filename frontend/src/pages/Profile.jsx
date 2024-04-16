import "./Profile.css";
import { useState } from "react";
import ProfileIcon from "../assets/ProfileIcon.svg";
import { auth } from "../firebase";
import {
  signOut,
  sendPasswordResetEmail,
  updateEmail,
  sendEmailVerification,
} from "firebase/auth";
import { useAuth } from "./Auth/AuthContext";

function Profile() {
  const { authUser, setIsLoggedIn, setAuthUser } = useAuth();
  const [nickname, setNickname] = useState("TODO");
  const [email, setEmail] = useState(authUser.email);
  const [newEmail, setNewEmail] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleSave = async () => {
    try {
      await updateEmail(authUser, newEmail);
      await sendEmailVerification(authUser);
      console.log("Hello?");
      setMessage("Email address updated successfully.");
      setEmail(newEmail);
      setEditMode(false);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setAuthUser(null);
        setIsLoggedIn(false);
        console.log("signout successful");
        window.location.href = "/";
      })
      .catch((error) => console.log(error));
  };

  const handleEdit = () => {
    setEditMode(true);
    console.log("hello");
  };

  return (
    <div id="profile">
      <div id="profilebox">
        <div id="imagebox">
          <img alt="Profile" src={ProfileIcon} id="profilepic" />
        </div>
        <div id="infocontainer">
          <div id="infotext">
            <div class="infobox">Nickname:</div>
            <div class="infobox">Email:</div>
            {/* <div class="infobox">Password:</div> */}
          </div>
          <div id="inputtext">
            {editMode ? (
              <>
                <input
                  class="editbox"
                  type="text"
                  placeholder="Enter Nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
                <input
                  class="editbox"
                  type="text"
                  placeholder="Enter New Email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </>
            ) : (
              <>
                <div className="textbox">{nickname}</div>
                <div className="textbox">{email}</div>
              </>
            )}
          </div>
        </div>
      </div>
      <div id="profilebuttonscontainer">
        <button
          id="editprofilebutton"
          onClick={editMode ? handleSave : handleEdit}
        >
          {editMode ? "Save" : "Edit"}
        </button>
        <button id="logoutbutton" onClick={handleSignOut}>
          Log Out
        </button>
      </div>
      <button id="cpbutton" onClick={handleResetPassword}>
        Change Password
      </button>
      <p>{message}</p>
    </div>
  );
}

export default Profile;
