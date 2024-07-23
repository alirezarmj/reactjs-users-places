import { createBrowserRouter, Navigate } from "react-router-dom";
import Users from "../users/pages/Users";
import NewPlace from "../places/pages/NewPlace";
import Layout from "../Layout";
import UserPlaces from "../places/pages/UserPlaces";
import UpdatePlace from "../places/pages/UpdatePlace";
import Auth from "../users/pages/Auth";
import { useContext } from "react";
import { AuthContext } from "../shared/components/context/auth-context";

// const { isLoggedIn } = useContext(AuthContext);
let router;
if (isLoggedIn) {
  router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Users />,
        },
        {
          path: "/places/new",
          element: <NewPlace />,
        },
        {
          path: "/places/:placeId",
          element: <UpdatePlace />,
        },
        {
          path: "/:userId/places",
          element: <UserPlaces />,
        },

        {
          path: "*",
          element: <Navigate to="/" replace />,
        },
      ],
    },
  ]);
} else {
  router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Users />,
        },

        {
          path: "/:userId/places",
          element: <UserPlaces />,
        },
        {
          path: "/auth",
          element: <Auth />,
        },
        {
          path: "*",
          element: <Navigate to="/auth" replace />,
        },
      ],
    },
  ]);
}

export default router;
