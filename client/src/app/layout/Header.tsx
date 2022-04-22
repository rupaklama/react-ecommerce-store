import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Grid, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

interface Props {
  darkMode: boolean;
  handleThemeChange: () => void;
}

const midLinks = [
  { title: "catalog", path: "/catalog" },
  { title: "about", path: "/about" },
  { title: "contact", path: "/contact" },
];

const rightLinks = [
  { title: "login", path: "/login" },
  { title: "register", path: "/register" },
];

const Header: React.FC<Props> = ({ darkMode, handleThemeChange }) => {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography
              variant="h6"
              component={NavLink}
              to="/"
              sx={{ color: "inherit", textDecoration: "none" }}
            >
              My Store
            </Typography>
          </Grid>

          <List sx={{ display: "flex" }}>
            {midLinks.map(({ title, path }) => (
              <ListItem component={NavLink} to={path} key={path} sx={{ color: "inherit", typography: "h6" }}>
                {title.toUpperCase()}
              </ListItem>
            ))}
          </List>

          <IconButton size="large" sx={{ color: "inherit" }}>
            <Badge badgeContent={4} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          <List sx={{ display: "flex" }}>
            {rightLinks.map(({ title, path }) => (
              <ListItem component={NavLink} to={path} key={path} sx={{ color: "inherit", typography: "h6" }}>
                {title.toUpperCase()}
              </ListItem>
            ))}
          </List>

          <Grid item>
            <Switch checked={darkMode} onChange={handleThemeChange} />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
