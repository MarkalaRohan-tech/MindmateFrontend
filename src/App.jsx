import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import MoodCheck from "./Pages/MoodCheckin";
import PeerMessage from "./Pages/PeerMessages";
import SelfCare from "./Pages/SelfCareList";
import Profile from "./Pages/Profile";
import Layout from "./Layout";
import { ThemeProvider } from "./Context/ThemeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./Utils/ProtectedRoute";
import JournalPage from "./components/JournalPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> }, // public
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/peermessage",
        element: (
          <ProtectedRoute>
            <PeerMessage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/selfcare",
        element: (
          <ProtectedRoute>
            <SelfCare />
          </ProtectedRoute>
        ),
      },
      {
        path: "/moodcheck",
        element: (
          <ProtectedRoute>
            <MoodCheck />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/journal",
        element: (
          <ProtectedRoute>
            <JournalPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "/login", element: <Login /> }, // public
  { path: "/register", element: <Register /> }, // public
]);

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        closeButton={false}
      />
    </ThemeProvider>
  );
}

export default App;
