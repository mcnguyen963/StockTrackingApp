import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import { Calculate } from "@mui/icons-material";
import type { Page, PageItem } from "../type";

const secondaryListItems: {
  text: string;
  icon: React.ReactNode;
  page: Page;
}[] = [
  { text: "Settings", icon: <SettingsRoundedIcon />, page: "Settings" },
  { text: "About", icon: <InfoRoundedIcon />, page: "About" },
];
interface MenuContentProps {
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  mainPages: Record<string, PageItem>;
}

export default function MenuContent({
  currentPage,
  setCurrentPage,
  mainPages,
}: MenuContentProps) {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {Object.entries(mainPages).map(([key, item], index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={currentPage === item.name}
              onClick={() => setCurrentPage(item.name)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
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
