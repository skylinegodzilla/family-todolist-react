export function logout() {
  localStorage.removeItem('sessionToken');
  localStorage.removeItem('username');
  sessionStorage.removeItem("role");
}