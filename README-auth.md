# Modulo di Autenticazione React con Firebase

Questo modulo fornisce un sistema di autenticazione completo basato su React e Firebase Authentication, facilmente integrabile in qualsiasi applicazione React.

## Funzionalità

- ✅ **Registrazione utente** (email, password, nome)
- ✅ **Login** con email e password
- ✅ **Logout**
- ✅ **Reset password** via email
- ✅ **Modifica dati utente** (nome, email, password)
- ✅ **Protezione delle rotte** per utenti autenticati
- ✅ **Integrazione Firebase** semplificata

## Configurazione

1. Crea un progetto su [Firebase Console](https://console.firebase.google.com/)
2. Attiva l'autenticazione email/password nelle impostazioni Authentication
3. Copia le chiavi di configurazione dal progetto Firebase
4. Crea un file `.env` nella root del tuo progetto con i seguenti valori:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
```

## Integrazione nel tuo progetto

### Metodo 1: Integrazione completa

Importa `AuthApp` e usalo direttamente nella tua applicazione:

```jsx
import { AuthApp } from './auth-index';

function App() {
  return <AuthApp />;
}
```

### Metodo 2: Utilizzo dei singoli componenti

Usa i singoli componenti e il contesto di autenticazione:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, PrivateRoute, Login, Signup } from './auth-index';
import YourProtectedComponent from './your-component';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Rotte protette */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<YourProtectedComponent />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

### Metodo 3: Uso del contesto Auth

Accedi allo stato di autenticazione in qualsiasi componente:

```jsx
import { useAuth } from './auth-index';

function YourComponent() {
  const { currentUser, logout } = useAuth();
  
  return (
    <div>
      <p>Email utente: {currentUser?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Personalizzazione

Tutti i componenti possono essere facilmente personalizzati modificando i file corrispondenti nella directory `components/auth/`.

## Sicurezza

Il modulo utilizza le best practice di sicurezza di Firebase Authentication, inclusi:
- Password sicure
- Conferma dell'email
- Protezione contro attacchi brute force
- Sessioni sicure