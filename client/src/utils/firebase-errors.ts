export const firebaseErrors: Record<string, string> = {
  'auth/invalid-email': 'L\'indirizzo email non è valido.',
  'auth/user-disabled': 'Questo utente è stato disabilitato.',
  'auth/user-not-found': 'Non esiste un utente con questa email.',
  'auth/wrong-password': 'La password non è corretta.',
  'auth/email-already-in-use': 'Questa email è già in uso da un altro account.',
  'auth/weak-password': 'La password è troppo debole. Usa almeno 6 caratteri.',
  'auth/operation-not-allowed': 'Questa operazione non è consentita.',
  'auth/popup-closed-by-user': 'Il popup di autenticazione è stato chiuso prima di completare l\'operazione.',
  'auth/unauthorized-domain': 'Questo dominio non è autorizzato per le operazioni OAuth.',
  'auth/requires-recent-login': 'Questa operazione richiede un accesso recente. Effettua il logout e accedi nuovamente.',
  'auth/too-many-requests': 'Troppe richieste. Riprova più tardi.',
};

/**
 * Restituisce un messaggio di errore leggibile dato un codice di errore Firebase
 * @param errorCode Il codice di errore Firebase (es. 'auth/user-not-found')
 * @returns Un messaggio di errore leggibile
 */
export function getErrorMessage(errorCode: string): string {
  return firebaseErrors[errorCode] || 'Si è verificato un errore durante l\'autenticazione. Riprova più tardi.';
}

/**
 * Gestisce gli errori di Firebase e restituisce un messaggio leggibile
 * @param error L'errore catturato
 * @returns Un messaggio di errore leggibile
 */
export function handleFirebaseError(error: any): string {
  if (error.code) {
    return getErrorMessage(error.code);
  }
  
  return error.message || 'Si è verificato un errore inatteso. Riprova più tardi.';
}