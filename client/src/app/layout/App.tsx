import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";

import Header from "./Header";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from "../util/util";
import agent from "../api/agent";
import Loader from "./Loader";
import { useAppDispatch } from "../store/configureStore";
import { setBasket } from "../../features/basket/basketSlice";

import { fetchCurrentUser } from "../../features/account/accountSlice";

const App = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch auth user if any on App mount or page refresh with Axios Interceptor
    // Only make this request if we have auth token in our local storage
    if (localStorage.getItem("user")) {
      dispatch(fetchCurrentUser());
    }

    const buyerId = getCookie("buyerId");

    if (buyerId) {
      agent.Basket.get()
        .then(basket => dispatch(setBasket(basket)))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch]);

  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? "dark" : "light";

  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === "light" ? "#eaeaea" : "#121212",
      },
    },
  });

  const handleThemeChange = () => setDarkMode(!darkMode);

  if (loading) return <Loader message="Initializing app..." />;

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="top-center" />
      <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
};

export default App;
