import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import SelectContent from "./SelectContent";
import MenuContent from "./MenuContent";
import type { UserData } from "../type";
import type { Page } from "../type";
import type { PageItem } from "../type";
import { signOut } from "firebase/auth";
import { auth } from "../FireBase";
interface SideMenuProps {
  userData: UserData;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  currentPage: string;
  mainPages: Record<string, PageItem>;
}

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
    backgroundColor: "#ffffffff",
    color: "#070707ff",
  },
});

export default function SideMenu({
  userData,
  setCurrentPage,
  currentPage,
  mainPages,
}: SideMenuProps) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          mt: "calc(var(--template-frame-height, 0px) + 4px)",
          p: 1.5,
        }}
      >
        <SelectContent />
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MenuContent
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          mainPages={mainPages}
        />
        {/* <>CardAlert</> */}
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
          width: "100%",
          height: 80,
          padding: 0,
        }}
      >
        <Avatar
          sizes="small"
          alt={userData.displayName}
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <Box
          sx={{
            mr: "auto",
            overflow: "hidden",
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: "16px" }}
          >
            {userData.displayName}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
            }}
          >
            {userData.email}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          <LogoutRoundedIcon
            sx={{ mr: 0.5 }}
            onClick={() => {
              signOut(auth);
            }}
          />
        </Box>
      </Stack>
    </Drawer>
  );
}
