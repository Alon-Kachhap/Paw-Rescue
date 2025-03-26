export const redirectToLogin = (type: "volunteer" | "organization") => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferredLoginType', type);
    window.location.href = '/login';
  }
};