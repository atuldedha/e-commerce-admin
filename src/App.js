import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import HomePage from "./components/HomePage";
import { auth } from "./firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Authenticated from "./components/Authenticated";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
  }, [user]);

  const logout = () => {
    signOut(auth).then(() => {
      console.log("Logout");
      setUser(null);
    });
  };

  return (
    <Routes>
      <Route element={<Authenticated user={user} />}>
        <Route path="/" element={<HomePage logout={logout} />} />
      </Route>

      <Route element={<Authenticated user={user} notAuthenticated={true} />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route path="*" render={() => "404 NOT FOUND"} />
    </Routes>
  );
}

export default App;
