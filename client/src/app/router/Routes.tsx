import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import ServerError from "../errors/ServerError";
import BasketPage from "../../features/basket/BasketPage";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import NotFound from "../errors/NotFound";
import RequireAuth from "./RequireAuth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // private routes
      { element: <RequireAuth />, children: [{ path: "checkout", element: <CheckoutPage /> }] },

      // public routes
      { path: "", element: <HomePage /> },
      { path: "catalog", element: <Catalog /> },
      { path: "catalog/:id", element: <ProductDetails /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "basket", element: <BasketPage /> },

      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "not-found", element: <NotFound /> },
      { path: "*", element: <Navigate to="/not-found" replace /> },
      { path: "server-error", element: <ServerError /> },
    ],
  },
]);

// eslint-disable-next-line no-lone-blocks
{
  /* <Route exact path="/" component={HomePage} />
<Route exact path="/catalog" component={Catalog} />
<Route exact path="/catalog/:id" component={ProductDetails} />
<Route exact path="/about" component={AboutPage} />
<Route exact path="/contact" component={ContactPage} />
<Route exact path="/server-error" component={ServerError} />
<Route exact path="/basket" component={BasketPage} />
<RequireAuth exact path="/checkout" component={CheckoutPage} />
<Route exact path="/login" component={Login} />
<Route exact path="/register" component={Register} />
<Route component={NotFound} /> */
}
