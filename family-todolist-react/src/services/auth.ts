export function logout() {
  localStorage.removeItem('sessionToken');
  localStorage.removeItem('username');
  localStorage.removeItem('userId');
}