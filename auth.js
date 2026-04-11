const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDB4SDq9daolVzOzW9QAL7AjmSFyBTNMZM",
  authDomain: "mocify-ca.firebaseapp.com",
  projectId: "mocify-ca",
  storageBucket: "mocify-ca.firebasestorage.app",
  messagingSenderId: "161349983477",
  appId: "1:161349983477:web:3c9e8a2ec5b460f0f3f9bc"
};

const AUTH_STORAGE_KEY = "spom_auth";
const ATTEMPT_STORAGE_KEY = "spom_attempts";
const HOME_PAGE = "index.html";
const DASHBOARD_PAGE = "dashboard.html";

window.AUTH = window.AUTH || {
  user: null,
  initialized: false,
  onReady: null
};

function notifyAuthReady(user) {
  console.log("[AUTH] notifyAuthReady:", user);
  window.AUTH.user = user || null;
  window.AUTH.initialized = true;
  if (typeof window.AUTH.onReady === "function") {
    window.AUTH.onReady(window.AUTH.user);
  }
}

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getStoredAuth() {
  return safeParse(sessionStorage.getItem(AUTH_STORAGE_KEY));
}

function setStoredAuth(user) {
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

function clearStoredAuth() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

function createGuestUser() {
  return {
    uid: "guest_user",
    email: "",
    displayName: "Guest User",
    provider: "guest",
    isGuest: true
  };
}

function isGuestUser(user) {
  return !!(user && (user.isGuest || user.provider === "guest"));
}

function normalizeFirebaseUser(user) {
  return {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || user.email || "Student",
    provider: "firebase"
  };
}

function getCurrentUser() {
  return window.AUTH.user;
}

function redirectToHome() {
  window.location.href = HOME_PAGE;
}

function redirectToDashboard() {
  window.location.href = DASHBOARD_PAGE;
}

function getDisplayName(user) {
  if (!user) return "Student";
  return user.displayName || user.name || user.email || "Student";
}

function getFirstName(user) {
  return getDisplayName(user).trim().split(/\s+/)[0] || "Student";
}

function getAllAttempts() {
  const attempts = safeParse(localStorage.getItem(ATTEMPT_STORAGE_KEY));
  return Array.isArray(attempts) ? attempts : [];
}

function getAttempts() {
  const user = getCurrentUser();
  if (!user || isGuestUser(user) || !user.uid) return [];
  return getAllAttempts().filter((attempt) => attempt && attempt.userId === user.uid);
}

function saveAttempt(attempt) {
  const user = getCurrentUser();
  if (!user || isGuestUser(user) || !user.uid) return;
  const attempts = getAllAttempts();
  attempts.unshift({
    ...attempt,
    userId: user.uid,
    userEmail: user.email || "",
    userName: user.displayName || ""
  });
  localStorage.setItem(ATTEMPT_STORAGE_KEY, JSON.stringify(attempts.slice(0, 100)));
}

function ensureFirebase() {
  if (typeof firebase === "undefined") {
    const error = new Error("Firebase Authentication is not available.");
    error.code = "auth/configuration-missing";
    throw error;
  }
  if (!firebase.auth) {
    const error = new Error("Firebase Auth SDK is not available.");
    error.code = "auth/sdk-not-loaded";
    throw error;
  }
}

function showAuthError(message) {
  const errorBox = document.getElementById("auth-error");
  if (errorBox) {
    errorBox.classList.remove("success");
    errorBox.textContent = message;
    errorBox.style.display = "block";
    return;
  }
  console.error("[auth]", message);
}

function showAuthSuccess(message) {
  const errorBox = document.getElementById("auth-error");
  if (errorBox) {
    errorBox.classList.add("success");
    errorBox.textContent = message;
    errorBox.style.display = "block";
    return;
  }
  console.log("[auth]", message);
}

function clearAuthError() {
  const errorBox = document.getElementById("auth-error");
  if (errorBox) {
    errorBox.classList.remove("success");
    errorBox.textContent = "";
    errorBox.style.display = "none";
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function validatePasswordStrength(password) {
  var value = String(password || "");
  if (value.length < 6) {
    return "Password must be at least 6 characters.";
  }
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return "Password must include at least one letter and one number.";
  }
  return "";
}

function validateDisplayName(name) {
  var value = String(name || "").trim();
  if (value.length < 2) {
    return "Please enter your full name.";
  }
  return "";
}

function mapAuthError(error) {
  const messages = {
    "auth/user-not-found": "No account was found with that email address.",
    "auth/wrong-password": "That password is incorrect.",
    "auth/email-already-in-use": "An account with that email already exists.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/missing-email": "Please enter your email address.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/invalid-credential": "The email or password you entered is incorrect.",
    "auth/popup-closed-by-user": "The sign-in popup was closed before completing sign-in.",
    "auth/popup-blocked": "The sign-in popup was blocked by the browser. Allow popups and try again.",
    "auth/unauthorized-domain": "This domain is not authorized in Firebase Authentication.",
    "auth/network-request-failed": "Network error. Please check your connection and try again.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/configuration-missing": "Authentication is unavailable on this page right now.",
    "auth/sdk-not-loaded": "Firebase Auth SDK did not load correctly."
  };
  return messages[error.code] || error.message || "Authentication failed.";
}

function handleAuthError(error) {
  showAuthError(mapAuthError(error));
  throw error;
}

function initFirebaseAuth() {
  console.log("[AUTH] initFirebaseAuth start");
  console.log("[AUTH] protocol:", window.location.protocol);
  console.log("[AUTH] firebase loaded:", typeof firebase !== "undefined");

  if (window.location.protocol === "file:") {
    console.warn("[AUTH] Running on file:// can break Firebase Auth. Use http://localhost instead.");
  }

  if (typeof firebase === "undefined") {
    console.error("[AUTH] Firebase SDK not found. Check script loading order.");
    clearStoredAuth();
    notifyAuthReady(null);
    return;
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG);
    console.log("[AUTH] Firebase initialized");
  } else {
    console.log("[AUTH] Firebase already initialized");
  }

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      console.log("[AUTH] Persistence set to LOCAL");
      return firebase.auth().onAuthStateChanged((user) => {
        console.log("[AUTH] onAuthStateChanged:", user);
        if (user) {
          const normalized = normalizeFirebaseUser(user);
          setStoredAuth(normalized);
          notifyAuthReady(normalized);
          return;
        }

        const stored = getStoredAuth();
        if (isGuestUser(stored)) {
          notifyAuthReady(stored);
          return;
        }

        clearStoredAuth();
        notifyAuthReady(null);
      });
    })
    .catch((error) => {
      console.error("[AUTH] Failed to set persistence:", error);
      handleAuthError(error);
      clearStoredAuth();
      notifyAuthReady(null);
    });
}

async function signInWithGoogle() {
  clearAuthError();
  console.log("[AUTH] signInWithGoogle called");
  try {
    ensureFirebase();
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await firebase.auth().signInWithPopup(provider);
    console.log("[AUTH] signInWithGoogle success:", result.user);
    return normalizeFirebaseUser(result.user);
  } catch (error) {
    console.error("[AUTH] signInWithGoogle failed:", error);
    return handleAuthError(error);
  }
}

async function signInAsGuest() {
  clearAuthError();
  const guestUser = createGuestUser();
  setStoredAuth(guestUser);
  notifyAuthReady(guestUser);
  return guestUser;
}

async function signInWithEmail(email, password) {
  clearAuthError();
  console.log("[AUTH] signInWithEmail called:", email);
  try {
    ensureFirebase();
    const result = await firebase.auth().signInWithEmailAndPassword(email, password);
    console.log("[AUTH] signInWithEmail success:", result.user);
    return normalizeFirebaseUser(result.user);
  } catch (error) {
    console.error("[AUTH] signInWithEmail failed:", error);
    return handleAuthError(error);
  }
}

async function signUpWithEmail(email, password, displayName) {
  clearAuthError();
  console.log("[AUTH] signUpWithEmail called:", email);
  try {
    ensureFirebase();
    const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
    await result.user.updateProfile({ displayName });
    console.log("[AUTH] signUpWithEmail success:", result.user);
    return normalizeFirebaseUser(result.user);
  } catch (error) {
    console.error("[AUTH] signUpWithEmail failed:", error);
    return handleAuthError(error);
  }
}

async function sendPasswordResetLink(email) {
  clearAuthError();
  console.log("[AUTH] sendPasswordResetLink called:", email);
  try {
    ensureFirebase();
    await firebase.auth().sendPasswordResetEmail(email);
    console.log("[AUTH] sendPasswordResetLink success");
  } catch (error) {
    console.error("[AUTH] sendPasswordResetLink failed:", error);
    return handleAuthError(error);
  }
}

async function signOut() {
  console.log("[AUTH] signOut called");
  var wasGuest = isGuestUser(window.AUTH.user);
  clearStoredAuth();
  window.AUTH.user = null;

  if (wasGuest) {
    notifyAuthReady(null);
    return;
  }

  if (typeof firebase !== "undefined" && firebase.apps.length) {
    await firebase.auth().signOut();
    console.log("[AUTH] signOut success");
    return;
  }

  notifyAuthReady(null);
}

function bindAuthEnterSubmit() {
  document.addEventListener("keydown", function(event) {
    if (event.key !== "Enter") return;
    if (!event.target || !event.target.classList || !event.target.classList.contains("auth-input")) return;

    var modal = document.getElementById("auth-modal");
    if (!modal || !modal.classList.contains("open")) return;

    var activePane = modal.querySelector(".auth-pane.active");
    if (!activePane || !activePane.contains(event.target)) return;

    var primaryButton = activePane.querySelector(".auth-btn.btn-primary");
    if (!primaryButton || primaryButton.disabled) return;

    event.preventDefault();
    primaryButton.click();
  });
}

document.addEventListener("DOMContentLoaded", function() {
  initFirebaseAuth();
  bindAuthEnterSubmit();
});




