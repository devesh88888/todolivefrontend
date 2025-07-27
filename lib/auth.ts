export const isLoggedIn = () => {
  return typeof window !== 'undefined' && !!localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
