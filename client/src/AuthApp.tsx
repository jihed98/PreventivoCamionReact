import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import PrivateRoute from "./components/PrivateRoute";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import ResetPassword from "./components/auth/ResetPassword";
import UpdateProfile from "./components/auth/UpdateProfile";
import Home from "./components/Home";

function AuthApp() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/update-profile" element={<UpdateProfile />} />
          </Route>
          
          {/* Fallback route - redirect to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default AuthApp;