// Authentication.tsx
import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import type { UserData } from "./type";
import LoginWindow from "./components/LoginWindow";
import SignUpWindow from "./components/SignUpWindow";
import ForgotPasswordWindow from "./components/ForgotPasswordWindow";
type Props = {
  onLogin: (user: UserData) => void;
};

export default function Authentication({ onLogin }: Props) {
  const [tabIndex, setTabIndex] = useState(0); // 0 = login, 1 = signup, 2=forgot password
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box
      sx={{
        width: 400,
        margin: "auto",
        mt: 10,
        bgcolor: "#e0e0e0",
        borderRadius: 2,
        p: 3,
      }}
    >
      <h2 style={{ color: "black", marginBottom: 16 }}>Authentication</h2>
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="Login" style={{ borderLeft: "1px solid gray" }} />
        <Tab
          label="Sign Up"
          style={{
            borderRight: "1px solid gray",
            borderLeft: "1px solid gray",
          }}
        />
      </Tabs>
      <Box
        sx={{
          mt: 3,
          padding: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          px: 2,
        }}
      >
        {tabIndex === 0 && <LoginWindow onLogin={onLogin} />}
        {tabIndex === 1 && <SignUpWindow onLogin={onLogin} />}
        {tabIndex === 2 && <ForgotPasswordWindow />}
      </Box>
    </Box>
  );
}
