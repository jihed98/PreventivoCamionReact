import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User,
  UserCredential,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  updateProfile,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase';

// Definisco il tipo del contesto
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<any>; // Uso any per evitare problemi con UserCredential
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserEmail: (email: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
  updateUserProfile: (name: string) => Promise<void>;
}

// Creo il contesto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook per utilizzare il contesto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve essere usato all\'interno di un AuthProvider');
  }
  return context;
}

// Props per il provider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider che avvolge l'applicazione
export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Registrazione nuovo utente
  async function signup(email: string, password: string, name?: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Aggiorno il nome se fornito
    if (name && userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Forza un refresh dell'utente dopo l'aggiornamento del profilo
      setCurrentUser({ ...userCredential.user });
    }
  }

  // Login
  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout
  function logout() {
    return signOut(auth);
  }

  // Reset password
  function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  // Aggiorna email
  function updateUserEmail(email: string) {
    if (!currentUser) throw new Error('Nessun utente loggato');
    return updateEmail(currentUser, email);
  }

  // Aggiorna password
  function updateUserPassword(password: string) {
    if (!currentUser) throw new Error('Nessun utente loggato');
    return updatePassword(currentUser, password);
  }

  // Aggiorna profilo (nome)
  function updateUserProfile(name: string) {
    if (!currentUser) throw new Error('Nessun utente loggato');
    return updateProfile(currentUser, {
      displayName: name
    }).then(() => {
      // Forza un refresh dell'utente dopo l'aggiornamento del profilo
      setCurrentUser({ ...currentUser });
    });
  }

  // Ascolto i cambiamenti dello stato di autenticazione
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updateUserEmail,
    updateUserPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}