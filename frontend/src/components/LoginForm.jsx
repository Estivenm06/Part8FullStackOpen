import { useState, useEffect } from "react";
import { LOGIN } from "../queries.js";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

export const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  const [login, result] = useMutation(LOGIN);

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      localStorage.setItem('loginUser', token)
      setToken(token)
      navigate('/')
    }
  }, [result.data]);

  const submit = (event) => {
    event.preventDefault()
    login({ variables: { username, password } });
    setUsername("");
    setPassword("");
  };

  return (
    <>
      <form onSubmit={submit}>
        <div>
          name<input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password<input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
};
