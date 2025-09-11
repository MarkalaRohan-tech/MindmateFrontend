import { createBrowserRouter,RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import MoodCheck from "./components/MoodCheckin";
import PeerMessage from "./components/PeerMessages";
import SelfCare from "./components/SelfCareList";
import Profile from "./components/Profile";
import Layout from "./Layout";
import { ThemeProvider } from "./ThemeContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/peermessage", element: <PeerMessage /> },
      { path: "/selfcare", element: <SelfCare /> },
      { path: "/moodcheck", element: <MoodCheck /> },
      { path: "/profile", element: <Profile /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
