// Layout.js
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <Navbar pos="w-full fixed top-0 z-5" />
      <Outlet />
    </div>
  );
}
