import "./Profile.css";
import { useEffect, useState } from "react";
import ProfileIcon from "../assets/ProfileIcon.svg";
import database, { auth } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  signOut,
  sendPasswordResetEmail,
  updateEmail,
  sendEmailVerification,
} from "firebase/auth";
import { useAuth } from "./Auth/AuthContext";

function Profile() {
  const { authUser, setAuthUser } = useAuth();
  const [userData, setUserData] = useState("");
  const [nickname, setNickname] = useState("Loading ...");
  const [firstname, setFirstname] = useState("Loading ...");
  const [lastname, setLastname] = useState("Loading ...");
  const [email, setEmail] = useState("Loading ...");
  const [editMode, setEditMode] = useState(false);
  const [isNicknameDirty, setIsNicknameDirty] = useState(false);
  const [isFirstnameDirty, setIsFirstnameDirty] = useState(false);
  const [isLastnameDirty, setIsLastnameDirty] = useState(false);
  const [isEmailDirty, setIsEmailDirty] = useState(false);
  const [message, setMessage] = useState("");

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
    setIsNicknameDirty(true);
  };

  const handleFirstnameChange = (e) => {
    setFirstname(e.target.value);
    setIsFirstnameDirty(true);
  };

  const handleLastnameChange = (e) => {
    setLastname(e.target.value);
    setIsLastnameDirty(true);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsEmailDirty(true);
  };

  const handleSave = async () => {
    try {
      let emailUpdated = false;

      // only update the email if the user has changed something
      if (isEmailDirty && email !== authUser.email) {
        await updateEmail(authUser, email);
        setMessage("Email address updated successfully.");
        setEmail(email);
        emailUpdated = true;

        await sendEmailVerification(authUser);
      }

      // only update the nickname if the user has changed something
      if (isNicknameDirty) {
        // identify the user info we want to change
        const docRef = doc(database, "users", authUser.uid);
        // set the fields we want to change
        const payload = {
          nickname: nickname,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImage: userData.profileImage,
          gamesPlayed: userData.gamesPlayed,
          gamesWon: userData.gamesWon,
          totalPieces: userData.totalPieces,
        };
        // actually update in the database
        await setDoc(docRef, payload);
      }

      if (isFirstnameDirty) {
        // identify the user info we want to change
        const docRef = doc(database, "users", authUser.uid);
        // set the fields we want to change
        const payload = {
          nickname: userData.nickname,
          firstName: firstname,
          lastName: userData.lastName,
          profileImage: userData.profileImage,
          gamesPlayed: userData.gamesPlayed,
          gamesWon: userData.gamesWon,
          totalPieces: userData.totalPieces,
        };
        // actually update in the database
        await setDoc(docRef, payload);
      }

      if (isLastnameDirty) {
        // identify the user info we want to change
        const docRef = doc(database, "users", authUser.uid);
        // set the fields we want to change
        const payload = {
          nickname: userData.nickname,
          firstName: userData.firstName,
          lastName: lastname,
          profileImage: userData.profileImage,
          gamesPlayed: userData.gamesPlayed,
          gamesWon: userData.gamesWon,
          totalPieces: userData.totalPieces,
        };
        // actually update in the database
        await setDoc(docRef, payload);
      }

      setEditMode(false);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setAuthUser(null);
        console.log("signout successful");
        window.location.href = "/";
      })
      .catch((error) => console.log(error));
  };

  // get all the firestore info for the current logged in user
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userDocRef = doc(database, "users", authUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          console.log(userData);
          setUserData(userData);
          // get the nickname from firestore and set it in the frontend state
          setNickname(userData.nickname);

          // get the email from firebase auth and set it in the frontend state
          setEmail(authUser.email);

          // get first and last names and set them in the frontend state
          setFirstname(userData.firstName);
          setLastname(userData.lastName);
        } else {
          console.log("User document does not exist");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (authUser) {
      getUserData();
    }
  }, [authUser]);

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
            <div class="infobox">First Name:</div>
            <div class="infobox">Last Name:</div>
          </div>
          <div id="inputtext">
            {editMode ? (
              <>
                <input
                  class="editbox"
                  type="text"
                  placeholder="Enter Nickname"
                  value={nickname}
                  onChange={handleNicknameChange}
                />
                <input
                  class="editbox"
                  type="text"
                  placeholder="Enter New Email"
                  value={email}
                  onChange={handleEmailChange}
                />
                <input
                  class="editbox"
                  type="text"
                  placeholder="Enter First Name"
                  value={firstname}
                  onChange={handleFirstnameChange}
                />
                <input
                  class="editbox"
                  type="text"
                  placeholder="Enter Last Name"
                  value={lastname}
                  onChange={handleLastnameChange}
                />
              </>
            ) : (
              <>
                <div className="textbox">{nickname}</div>
                <div className="textbox">{email}</div>
                <div className="textbox">{firstname}</div>
                <div className="textbox">{lastname}</div>
              </>
            )}
          </div>
        </div>
      </div>
      <div id="profilebuttonscontainer">
        <div
          id="editprofilebutton"
          onClick={editMode ? handleSave : handleEdit}
        >
          {editMode ? "Save" : "Edit"}
        </div>
        <div id="logoutbutton" onClick={handleSignOut}>
          Log Out
        </div>
      </div>
      <button id="cpbutton" onClick={handleResetPassword}>
        Change Password
      </button>
      <p>{message}</p>
    </div>
  );
}

export default Profile;
