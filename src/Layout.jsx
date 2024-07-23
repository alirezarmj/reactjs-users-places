import { Outlet } from "react-router-dom";

import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { Suspense } from "react";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

const Layout = () => {
  return (
    <div>
      <MainNavigation />
      <main>
        <Suspense
          fallback={
            <div className="center">
              <LoadingSpinner />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

export default Layout;
