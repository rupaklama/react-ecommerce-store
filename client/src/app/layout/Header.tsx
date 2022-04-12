import { AppBar, Grid, Switch, Toolbar, Typography } from "@mui/material";

interface Props {
  darkMode: boolean;
  handleThemeChange: () => void;
}

const Header: React.FC<Props> = ({ darkMode, handleThemeChange }) => {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="h6">My Store</Typography>
          </Grid>

          <Grid item>
            <Switch checked={darkMode} onChange={handleThemeChange} />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
