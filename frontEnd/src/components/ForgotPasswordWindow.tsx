import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../FireBase";

export default function ForgotPasswordWindow() {
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  const handleReset = async () => {
    setError("");
    setMessage("");
    if (!email) {
      setError("Please enter your email");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent");
    } catch {
      setError("Failed to send password reset email");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      {error && <Typography color="error">{error}</Typography>}
      {message && <Typography color="success.main">{message}</Typography>}
      <Button variant="contained" onClick={handleReset}>
        Send Reset Email
      </Button>
    </Box>
  );
}
