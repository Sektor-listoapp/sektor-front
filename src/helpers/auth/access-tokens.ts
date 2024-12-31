const ACCESS_TOKEN_LOCAL_STORAGE_KEY = "sektor-access-token";

const getAccessToken = () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
  return accessToken ? JSON.parse(accessToken) : null;
};

const setAccessToken = (accessToken: string) => {
  localStorage.setItem(
    ACCESS_TOKEN_LOCAL_STORAGE_KEY,
    JSON.stringify(accessToken)
  );
};

const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
};

export { getAccessToken, setAccessToken, removeAccessToken };
