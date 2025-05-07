// Export Firebase config
export { default as firebase, auth } from './firebase';

// Export contexts
export { AuthProvider, useAuth } from './context/AuthContext';

// Export components
export { default as PrivateRoute } from './components/PrivateRoute';
export { default as Login } from './components/auth/Login';
export { default as Signup } from './components/auth/Signup';
export { default as ResetPassword } from './components/auth/ResetPassword';
export { default as UpdateProfile } from './components/auth/UpdateProfile';

// Export the full authentication app
export { default as AuthApp } from './AuthApp';