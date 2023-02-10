import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth,db } from "../Firebase";
import { sendPasswordReset } from "../userAuth";
import "../css/reset.css";
import {
  query,
  getDocs,
  collection,
  where,
} from "firebase/firestore";

function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const [err, setErr] = useState(null);
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);



  return (
    <div className="reset">
      <div className="reset__container">
        <h1 id = "title">Direct</h1>
        <h2>Reset Password</h2>
        <input
          type="text"
          className="reset__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <div className="register__error">
            {err && <p>{err}</p>}
          </div>
        <button className="reset__btn" onClick={() => {
          // check if email is valid email
          if(!email.includes("@")){
            setErr("Please enter a valid email address");
            return;
          }   
          sendPasswordReset(email)
          .then(() => {
            setErr("Password reset email sent.");
          })
          setErr(null)
        }}
  
          >
          Send password reset email
        </button>
        <div>
          Don't have an account? <Link class ="link" to="/register">Register</Link> now.
        </div>

        <div class ="email_help">
          <p>If you do not recieve an email, re-enter it and try again.</p>
        </div>
      </div>
    </div>
  );
}
export default Reset;
