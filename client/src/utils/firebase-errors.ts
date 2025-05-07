// Mappatura dei codici di errore di Firebase in messaggi più leggibili
export const firebaseErrors: Record<string, string> = {
  // Errori generici
  'auth/app-deleted': 'L\'istanza di Firebase è stata eliminata.',
  'auth/app-not-authorized': 'L\'applicazione non è autorizzata.',
  'auth/argument-error': 'Errore nei parametri della richiesta.',
  'auth/invalid-api-key': 'La chiave API di Firebase non è valida.',
  'auth/invalid-user-token': 'Il token utente non è più valido. Effettua nuovamente l\'accesso.',
  'auth/network-request-failed': 'Si è verificato un errore di rete.',
  'auth/operation-not-allowed': 'Operazione non consentita.',
  'auth/requires-recent-login': 'Questa operazione è sensibile e richiede un\'autenticazione recente. Effettua nuovamente il login.',
  'auth/too-many-requests': 'Troppe richieste. Riprova più tardi.',
  'auth/unauthorized-domain': 'Il dominio non è autorizzato.',
  'auth/user-disabled': 'Questo account è stato disattivato.',
  'auth/user-token-expired': 'La sessione è scaduta. Effettua nuovamente l\'accesso.',
  
  // Errori di login
  'auth/invalid-email': 'L\'indirizzo email non è valido.',
  'auth/user-not-found': 'Credenziali non valide.',
  'auth/wrong-password': 'Credenziali non valide.',
  
  // Errori di creazione account
  'auth/email-already-in-use': 'Questo indirizzo email è già in uso.',
  'auth/weak-password': 'La password è troppo debole. Usa almeno 6 caratteri.',
  
  // Errori di aggiornamento profilo
  'auth/invalid-credential': 'Le credenziali fornite non sono valide.',
  'auth/invalid-verification-code': 'Il codice di verifica non è valido.',
  'auth/invalid-verification-id': 'L\'ID di verifica non è valido.'
};

/**
 * Restituisce un messaggio di errore leggibile dato un codice di errore Firebase
 * @param errorCode Il codice di errore Firebase (es. 'auth/user-not-found')
 * @returns Un messaggio di errore leggibile
 */
export function getErrorMessage(errorCode: string): string {
  return firebaseErrors[errorCode] || 'Si è verificato un errore. Riprova più tardi.';
}

/**
 * Gestisce gli errori di Firebase e restituisce un messaggio leggibile
 * @param error L'errore catturato
 * @returns Un messaggio di errore leggibile
 */
export function handleFirebaseError(error: any): string {
  if (error && error.code) {
    return getErrorMessage(error.code);
  }
  return 'Si è verificato un errore. Riprova più tardi.';
}