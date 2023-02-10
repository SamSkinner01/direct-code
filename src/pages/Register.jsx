import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Firebase";
import { registerWithEmailAndPassword, signInWithGoogle } from "../userAuth";
import "../css/register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);

  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const register = () => {
    registerWithEmailAndPassword(email, password);
  };

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);

  return (
    <div className="register">
      <div className="register__container">
        <h1 id="title">Direct</h1>
        <h2>Create an Account</h2>
        <input
          type="email"
          className="register__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="register__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <div className="register__error">
            {err && <p>{err}</p>}
          </div>

        <button className="register__btn" onClick={() => {
          if (!email || !password) {
            setErr("Please enter an email and password");
            return;
          }
          if (!email.includes("@")) {
            setErr("Please enter a valid email");
            return;
          }
          if (password.length < 6) {
            setErr("Password must be at least 6 characters");
            return;
          }
          register()
          .then((user) => {
            if (!user) {
              setErr("Invalid email or password");
            }
          }
          )
        }}>
          Register
        </button>
        <button
          className="register__btn register__google"
          onClick={() => {
            signInWithGoogle()
              .then((user) => {
                if (!user) {
                  setErr("Something went wrong...Try signing up again.");
                }
              }
              )
              setErr(null);
          }}
        >
          Register with Google
        </button>
        <div>
          Already have an account? <Link class="link" to="/">Login</Link> now.
        </div>
      </div>
    </div>
  );
}
export default Register;
