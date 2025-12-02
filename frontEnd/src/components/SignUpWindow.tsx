// src/components/SignUpWindow.tsx
import React from "react";
import { Box, Button, TextField } from "@mui/material";
import type { UserData } from "../type";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../FireBase";

type Props = {
  onLogin: (user: UserData) => void;
};

export default function SignUpWindow({ onLogin }: Props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (displayName) {
        await updateProfile(user, { displayName });
      }

      const userData: UserData = {
        key: user.uid,
        email: user.email || "",
        displayName: user.displayName || displayName,
        FavoriteStocks: [],
      };

      onLogin(userData);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

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
        label="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        required
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <TextField
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={confirmPassword !== "" && password !== confirmPassword}
        helperText={
          confirmPassword !== "" && password !== confirmPassword
            ? "Passwords do not match"
            : ""
        }
      />
      {error && <Box sx={{ color: "red" }}>{error}</Box>}
      <Button
        variant="contained"
        onClick={handleSignUp}
        disabled={!passwordsMatch}
      >
        Sign Up
      </Button>
    </Box>
  );
}
