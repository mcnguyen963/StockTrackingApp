import * as React from "react";
import MuiListItemAvatar from "@mui/material/ListItemAvatar";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Select, { selectClasses } from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 0,
  marginRight: 12,
});

export default function SelectContent() {
  const [userMode, setUserMode] = React.useState(true);
  const [selectedView, setSelectedView] = React.useState("User View");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedView(event.target.value as string);
  };

  if (userMode)
    return (
      <Box sx={{ height: "50px", width: "200px" }}>
        <h3>Financial Web Logo</h3>
      </Box>
    );

  return (
    <Select
      labelId="company-select"
      id="company-simple-select"
      value={selectedView}
      onChange={handleChange}
      displayEmpty
      inputProps={{ "aria-label": "Select company" }}
      fullWidth
      sx={{
        maxHeight: 56,
        width: 215,
        "&.MuiList-root": {
          p: "8px",
        },
        [`& .${selectClasses.select}`]: {
          display: "flex",
          alignItems: "center",
          gap: "2px",
          pl: 1,
        },
      }}
    >
      <ListSubheader sx={{ pt: 0 }}>Production</ListSubheader>
      <MenuItem value={"User View"}>
        <ListItemAvatar />
        <ListItemText primary="User View" secondary="Web app" />
      </MenuItem>
      <ListSubheader sx={{ pt: 0 }}>Development</ListSubheader>
      <MenuItem value={"Development View"}>
        <ListItemAvatar />
        <ListItemText primary="Development View" secondary="Web app" />
      </MenuItem>
    </Select>
  );
}
