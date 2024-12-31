const USER_LOCAL_STORAGE_KEY = "sektor-user";

const getUser = () => {
  const user = localStorage.getItem(USER_LOCAL_STORAGE_KEY);
  return user ? JSON.parse(user) : null;
};

const setUser = (user: unknown) => {
  localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user));
};

const removeUser = () => {
  localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
};

export { getUser, setUser, removeUser };
