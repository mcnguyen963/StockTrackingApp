import * as React from "react";
import MuiListItemAvatar from "@mui/material/ListItemAvatar";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Select, { selectClasses } from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/material/styles";

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 0,
  marginRight: 12,
});

export default function SelectContent() {
  const [useMode, setUseMode] = React.useState("User View");

  const handleChange = (event: SelectChangeEvent) => {
    setUseMode(event.target.value as string);
  };

  return (
    <Select
      labelId="company-select"
      id="company-simple-select"
      value={useMode}
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
        <ListItemAvatar></ListItemAvatar>
        <ListItemText primary="User View" secondary="Web app" />
      </MenuItem>
      <ListSubheader sx={{ pt: 0 }}>Development</ListSubheader>
      <MenuItem value={"Development View"}>
        <ListItemAvatar></ListItemAvatar>
        <ListItemText primary="Development View" secondary="Web app" />
      </MenuItem>
    </Select>
  );
}
