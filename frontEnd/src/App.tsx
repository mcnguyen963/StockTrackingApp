import "./App.css";
import { Box, Container, Grid, Stack } from "@mui/material";

import SideMenu from "./components/SideMenu";
import CssBaseline from "@mui/material/CssBaseline";
import { alpha, withTheme } from "@mui/material/styles";
import AppNavbar from "./components/AppNavBar";
import React from "react";
import { DisplaySettings, Favorite } from "@mui/icons-material";
import type { UserData } from "./type";
import Authentication from "./Authentication";
const drawerWidth = 240;
function App() {
  const CURRENT_USER_DATA_KEY = "currentUserDataKEY";

  const [currentUserData, setCurrentUserData] = React.useState<UserData | null>(
    null
  );
  const [loading, setLoading] = React.useState(true);
  cuuju;

  React.useEffect(() => {
    const stored = localStorage.getItem(CURRENT_USER_DATA_KEY);
    if (stored) {
      const user: UserData = JSON.parse(stored);
      setCurrentUserData(user);
    }

    setLoading(false);
  }, []);
  if (loading) {
    return null;
  }

  return (
    <>
      {!currentUserData ? (
        <Authentication onLogin={(user) => setCurrentUserData(user)} />
      ) : (
        <Container
          sx={{
            display: "flex",
            padding: 0,
            margin: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "white",
          }}
          maxWidth={false}
        >
          <SideMenu userData={currentUserData} />
          <Box>
            <Box
              sx={{
                width: "85vw",
                color: "black",
                alignItems: "left",
                bgcolor: "gray",
              }}
            >
              <h5 style={{ textAlign: "left", fontSize: "20px" }}>
                AppNavbar{" "}
              </h5>
            </Box>
            <>as</>
          </Box>
        </Container>
      )}
    </>
  );
}

export default App;
