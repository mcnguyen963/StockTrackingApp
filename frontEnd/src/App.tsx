import "./App.css";
import { Box, Container } from "@mui/material";

import SideMenu from "./components/SideMenu";
import React from "react";
import type { UserData } from "./type";
import Authentication from "./Authentication";
import CompoundCalculator from "./pages/CompoundCalculator";
import HomePage from "./pages/HomePage";
import InvestmentSimulator from "./pages/InvestmentSimulator";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import { Calculate } from "@mui/icons-material";
import type { PageItem } from "./type";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./FireBase";

export const mainPages: Record<string, PageItem> = {
  Home: {
    name: "Home",
    element: <HomePage />,
    icon: <HomeRoundedIcon />,
  },
  Calculator: {
    name: "Compound Interest Calculator",
    element: <CompoundCalculator />,
    icon: <Calculate />,
  },
  Simulator: {
    name: " Stock Investment Simulator",
    element: <InvestmentSimulator />,
    icon: <AnalyticsRoundedIcon />,
  },
};

function App() {
  // const CURRENT_USER_DATA_KEY = "currentUserDataKEY";

  const [currentUserData, setCurrentUserData] = React.useState<UserData | null>(
    null
  );
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState<string>("Home");
  // React.useEffect(() => {
  //   const stored = localStorage.getItem(CURRENT_USER_DATA_KEY);
  //   if (stored) {
  //     const user: UserData = JSON.parse(stored);
  //     setCurrentUserData(user);
  //   }

  //   setLoading(false);
  // }, []);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserData({
          key: user.uid,
          email: user.email ?? "",
          displayName: user.displayName ?? "User",
          FavoriteStocks: [],
        });
      } else {
        setCurrentUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
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
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            mainPages={mainPages}
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
                {
                  Object.values(mainPages).find(
                    (page) => page.name === currentPage
                  )?.name
                }
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
              {
                Object.values(mainPages).find(
                  (page) => page.name === currentPage
                )?.element
              }
            </Box>
          </Box>
        </Container>
      )}
    </>
  );
}

export default App;
