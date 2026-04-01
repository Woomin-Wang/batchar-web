import { createBrowserRouter } from "react-router";
import { HomePage } from "../pages/home-page";
import { ProductDetailPage } from "../pages/product-detail-page";
import { ProductRegistrationPage } from "../pages/product-registration-page";
import { ProfilePage } from "../pages/profile-page";
import { MessagesPage } from "../pages/messages-page";
import { LoginPage } from "../pages/login-page";
import { SignUpPage } from "../pages/signup-page";
import { RootLayout } from "../components/layout/root-layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "product/:id", Component: ProductDetailPage },
      { path: "products/:id", Component: ProductDetailPage },
      { path: "register-product", Component: ProductRegistrationPage },
      { path: "profile", Component: ProfilePage },
      { path: "messages", Component: MessagesPage },
      { path: "login", Component: LoginPage },
      { path: "signup", Component: SignUpPage },
    ],
  },
]);
