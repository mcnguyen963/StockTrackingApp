import "./App.css";
import { Box, Container } from "@mui/material";

import SideMenu from "./components/SideMenu";
import React from "react";
import type { UserData } from "./type";
import Authentication from "./Authentication";
import CompoundCalculator from "./pages/CompoundCalculator";
import HomePage from "./pages/HomePage";
import SPSimulator from "./pages/SPSimulator";
import type { Page } from "./type";

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
    "S&P 500 Simulator": <SPSimulator />,
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
            minHeight: "100vh",
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
                minHeight: "80vh",
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
