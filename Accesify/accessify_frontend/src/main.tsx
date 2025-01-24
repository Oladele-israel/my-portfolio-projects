import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import DashBoardLayout from "./Layouts/DashBoardLayout.tsx";
import DashBoard from "./pages/DashBoard.tsx";
import LandingPage from "./pages/LandingPage.tsx";

// Create the router
const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <LandingPage />,
  },
  {
    path: "/dashboard",
    element: <DashBoardLayout />,
    children: [
      {
        index: true,
        element: <DashBoard />,
      },
    ],
  },
]);

// Render the app
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>
);
