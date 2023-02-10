import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginWithEmailAndPassword, signInWithGoogle } from "../userAuth.js";
import { auth } from "../Firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import "../css/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  
  const [err, setErr] = useState(null);

  // if the user is logged in, route them to the dashboard
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);

  
  return (
    <>
      <div className="login">
        <div className="login__container">
          <h1 id="title">Direct</h1>
          <h2>Login</h2>
          <input
            type="text"
            className="login__textBox"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
          />
          <input
            type="password"
            className="login__textBox"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <div className="login__error">
            {err && <p>{err}</p>}
          </div>
          <button
            className="login__btn"
            onClick={() =>{
              if (!email || !password) {
                setErr("Please enter an email and password");
                return;
              }
              if (!email.includes("@")) {
                setErr("Please enter a valid email");
                return;
              }
              loginWithEmailAndPassword(email, password)
              .then((user) => {
                if (!user) {
                  setErr("Invalid email or password");
                }
              })
              setErr(null);
              
            }
            }
          >
            Login
          </button>
          <button
            className="login__btn login__google"
            onClick={()=>{
              signInWithGoogle()
              .then((user) => {
                if (!user) {
                  setErr("Something went wrong...Try logging in again.");
                  return
                }
              }
              
              )
              setErr(null);
            }
            }
          >
            Login with Google
          </button>
          <div>
            <Link  class ="link" to="/reset">Forgot Password</Link>
          </div>
          <div>
            Don't have an account? <Link class ="link" to="/register">Register</Link> now.
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
