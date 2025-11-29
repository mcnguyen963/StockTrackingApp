import "./App.css";
import {
  autocompleteClasses,
  Box,
  Container,
  Grid,
  Stack,
} from "@mui/material";

import SideMenu from "./components/SideMenu";
import CssBaseline from "@mui/material/CssBaseline";
import { alpha, withTheme } from "@mui/material/styles";
import AppNavbar from "./components/AppNavBar";
import React from "react";
import { CrueltyFree, DisplaySettings, Favorite } from "@mui/icons-material";
import type { UserData } from "./type";
import Authentication from "./Authentication";
import CompoundCalculator from "./pages/CompoundCalculator";
import HomePage from "./pages/HomePage";
import type { Page } from "./type";
import { auth } from "./FireBase";

const drawerWidth = 240;

function App() {
  const CURRENT_USER_DATA_KEY = "currentUserDataKEY";

  const [currentUserData, setCurrentUserData] = React.useState<UserData | null>(
    null
  );
  const [loading, setLoading] = React.useState(true);
  const [currentSite, setCurrentSite] = React.useState<Page>("Home");

  const pages: Record<Page, React.ReactNode> = {
    Home: <HomePage />,
    "Compound Interest Calculator": <CompoundCalculator />,
    "S&P 500 Simulator": <div>S&P 500 Simulator Page</div>,
    Settings: <div>Settings Page</div>,
    About: <div>About Page</div>,
  };
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
          <SideMenu
            userData={currentUserData}
            setCurrentPage={setCurrentSite}
            currentPage={currentSite}
          />
          <Box />
          <Box>
            <Box
              sx={{
                width: { xs: "100vw", md: "85vw" },
                color: "black",
                alignItems: "left",
                borderBottom: "1px solid #ccc",
              }}
            >
              <h5 style={{ textAlign: "left", fontSize: "20px" }}>
                {currentSite}
              </h5>
            </Box>

            <Box
              sx={{
                height: "80vh",
                color: "black",
                alignItems: "left",
                border: "1px solid #ccc",
                marginRight: { xs: "0px", md: "30px" },
              }}
            >
              {pages[currentSite]}
            </Box>
          </Box>
        </Container>
      )}
    </>
  );
}

export default App;
