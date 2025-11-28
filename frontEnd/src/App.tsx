import "./App.css";
import { Box, Container, Grid, Stack } from "@mui/material";
import SideMenu from "./components/SideMenu";
import CssBaseline from "@mui/material/CssBaseline";
import { alpha, withTheme } from "@mui/material/styles";
import AppNavbar from "./components/AppNavBar";
import React from "react";
import { Favorite } from "@mui/icons-material";
import type { UserData } from "./type";
import Authentication from "./Authentication";

function App() {
  const CURRENT_USER_DATA_KEY = "currentUserDataKEY";

  const [currentUserData, setCurrentUserData] = React.useState<UserData | null>(
    null
  );
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const stored = localStorage.getItem(CURRENT_USER_DATA_KEY);
    console.log("Stored user data:", stored);
    if (stored) {
      const user: UserData = JSON.parse(stored);
      setCurrentUserData(user);
    }

    setLoading(false);
  }, []);

  return (
    <>
      {/* Conditional rendering */}
      {!currentUserData ? (
        <Authentication onLogin={(user) => setCurrentUserData(user)} />
      ) : (
        <Box
          sx={{
            height: "100vh",
            backgroundColor: "red",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Welcome {currentUserData.displayName}!
        </Box>
      )}
    </>
  );
}

export default App;
