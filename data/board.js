// Contribution board on attributions.html (assets/board.js).
// api: the Apps Script web app URL (https://script.google.com/macros/s/…/exec) that serves the board's data.
// clientId: the Google OAuth web client ID (…apps.googleusercontent.com) used for "Sign in with Google".
// Both are filled in after the web app is deployed. Neither is a secret: the page needs them in the open to work,
// and the web app checks every sign-in itself. With api empty, the page says the board is not connected yet.
const BOARD = { api: "", clientId: "" };
