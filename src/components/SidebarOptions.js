import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import "./SidebarOptions.css";

const SidebarOptions = ({ Icon, text, onChange, active }) => {
  return (
    <div className="sidebarOptions">
      <div className={`sidebarOptions__options ${active ? "active" : ""}`}>
        <ListItem button onClick={onChange}>
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      </div>
    </div>
  );
};

export default SidebarOptions;
