# Configurazione Firebase

Questa guida ti mostrerà come configurare Firebase per il modulo di autenticazione.

## Passo 1: Crea un progetto Firebase

1. Vai alla [Firebase Console](https://console.firebase.google.com/)
2. Clicca su "Aggiungi progetto"
3. Inserisci un nome per il tuo progetto
4. Scegli se vuoi abilitare Google Analytics (opzionale)
5. Clicca su "Crea progetto"

## Passo 2: Configura l'autenticazione

1. Nel menu laterale della console Firebase, clicca su "Authentication"
2. Vai alla scheda "Sign-in method"
3. Clicca su "Email/Password" e abilita questo provider
4. Opzionalmente, puoi abilitare "Email link (passwordless sign-in)" se desideri
5. Salva le modifiche

## Passo 3: Aggiungi un'app web al tuo progetto

1. Nella homepage del progetto, clicca sull'icona web (</>) per aggiungere una nuova app web
2. Dai un nome alla tua app web (es. "Web Auth App")
3. (Opzionale) Spunta "Configura anche Firebase Hosting"
4. Clicca su "Registra app"

## Passo 4: Ottieni le credenziali

Dopo la registrazione dell'app, apparirà una schermata con la configurazione Firebase. Ti serviranno i seguenti valori:

```javascript
const firebaseConfig = {
  apiKey: "XXX-XXXXXXXXXXXX-XXXXXXXXXXX",     // VITE_FIREBASE_API_KEY
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",              // VITE_FIREBASE_PROJECT_ID
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",         // VITE_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789012:web:abc123def456"   // VITE_FIREBASE_APP_ID
};
```

## Passo 5: Configura le variabili di ambiente

1. Crea o modifica il file `.env` nella radice del tuo progetto
2. Aggiungi le seguenti variabili con i valori ottenuti al passo precedente:

```
VITE_FIREBASE_API_KEY=XXX-XXXXXXXXXXXX-XXXXXXXXXXX
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
```

## Passo 6: Configura i domini autorizzati

Se stai utilizzando l'autenticazione in un ambiente di produzione, dovrai aggiungere i domini da cui gli utenti possono accedere all'autenticazione:

1. Nella sezione Authentication, vai alla scheda "Settings"
2. Scorri fino a "Domini autorizzati"
3. Aggiungi il dominio della tua app (es. "myapp.com")
4. Per lo sviluppo locale, "localhost" dovrebbe essere già autorizzato

## Passo 7: (Opzionale) Personalizza le email di autenticazione

1. Nella sezione Authentication, vai alla scheda "Templates"
2. Qui puoi personalizzare le email per:
   - Verifica email
   - Reimpostazione password
   - Modifica email

## Nota sulla sicurezza

Le credenziali Firebase per applicazioni web sono considerate "pubbliche" poiché sono accessibili nel codice frontend. La sicurezza si basa sulle regole di Firebase e sui domini autorizzati. Per operazioni sensibili, considera l'uso di Firebase Functions o un backend dedicato.