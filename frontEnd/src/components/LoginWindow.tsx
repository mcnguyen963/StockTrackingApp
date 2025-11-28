// src/components/LoginWindow.tsx
import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import type { UserData } from "../type";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../FireBase";
type Props = {
  onLogin: (user: UserData) => void;
};

export default function LoginWindow({ onLogin }: Props) {
  const CURRENT_USER_DATA_KEY = "currentUserDataKEY";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userData: UserData = {
        key: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        FavoriteStocks: [],
      };
      localStorage.setItem(CURRENT_USER_DATA_KEY, JSON.stringify(user));
      onLogin(userData);
    } catch (err: any) {
      setError("Invalid email or password");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        bgcolor: "#e0e0e0",
        padding: 4,
        borderRadius: 2,
        boxShadow: 3,
        width: 300,
      }}
    >
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <Box sx={{ color: "red" }}>{error}</Box>}
      <Button variant="contained" onClick={handleLogin}>
        Login
      </Button>
    </Box>
  );
}
