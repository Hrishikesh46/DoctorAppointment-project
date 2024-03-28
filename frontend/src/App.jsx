import "./App.css";
import Layout from "./layout/Layout";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Contact from "./pages/Contact";
import Doctors from "./pages/Doctors/Doctors";
import DoctorDetails from "./pages/Doctors/DoctorDetails";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MyAccount from "./Dashboard/user-account/MyAccount";
import Dashboard from "./Dashboard/doctor-account/Dashboard";
import ProtectedRoutes from "./routes/ProtectedRoutes";

const App = () => {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/home", element: <Home /> },
        { path: "/doctors", element: <Doctors /> },
        { path: "/doctors/:id", element: <DoctorDetails /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Signup /> },
        { path: "/contact", element: <Contact /> },
        { path: "/service", element: <Services /> },
        {
          path: "/users/profile/me",
          element: (
            <ProtectedRoutes allowedRoles={["patient"]}>
              <MyAccount />
            </ProtectedRoutes>
          ),
        },

        {
          path: "/doctors/profile/me",
          element: (
            <ProtectedRoutes allowedRoles={["doctor"]}>
              <Dashboard />
            </ProtectedRoutes>
          ),
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
