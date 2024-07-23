import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import "./App.css";
// import router from "./routes/routes";
import Layout from "./Layout";
import Users from "./users/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UpdatePlace from "./places/pages/UpdatePlace";
import UserPlaces from "./places/pages/UserPlaces";
import Auth from "./users/pages/Auth";
import { AuthContext } from "./shared/components/context/auth-context";
import { useCallback, useEffect, useState } from "react";

let logoutTimer;

function App() {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  let router;
  if (token) {
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

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, token, login: login, userId, logout: logout }}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

export default App;
