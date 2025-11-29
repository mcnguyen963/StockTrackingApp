import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import { Calculate } from "@mui/icons-material";
import type { Page } from "../type";

const mainListItems: { text: string; icon: React.ReactNode; page: Page }[] = [
  { text: "Home", icon: <HomeRoundedIcon />, page: "Home" },
  {
    text: "Compound Interest Calculator",
    icon: <Calculate />,
    page: "Compound Interest Calculator",
  },
  {
    text: "S&P 500 Simulator",
    icon: <AnalyticsRoundedIcon />,
    page: "S&P 500 Simulator",
  },
];

const secondaryListItems: {
  text: string;
  icon: React.ReactNode;
  page: Page;
}[] = [
  { text: "Settings", icon: <SettingsRoundedIcon />, page: "Settings" },
  { text: "About", icon: <InfoRoundedIcon />, page: "About" },
];
interface MenuContentProps {
  currentPage: Page;

  setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
}

export default function MenuContent({
  currentPage,
  setCurrentPage,
}: MenuContentProps) {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={currentPage === item.page}
              onClick={() => setCurrentPage(item.page)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={currentPage === item.page}
              onClick={() => setCurrentPage(item.page)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
