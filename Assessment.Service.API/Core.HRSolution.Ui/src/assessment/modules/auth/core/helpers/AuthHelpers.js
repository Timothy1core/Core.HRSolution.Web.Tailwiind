/* eslint-disable @typescript-eslint/no-explicit-any */

const AUTH_LOCAL_STORAGE_KEY = 'kt-auth-react-v';

// Function to get auth from local storage
const getAuth = () => {
  if (!localStorage) {
    return;
  }

  const lsValue = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);
  if (!lsValue) {
    return;
  }

  try {
    const auth = JSON.parse(lsValue);
    if (auth) {
      // You can easily check auth_token expiration also
      return auth;
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
  }
};

// Function to set auth in local storage
const setAuth = (auth) => {
  if (!localStorage) {
    return;
  }
  try {
    const lsValue = JSON.stringify(auth);
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, lsValue);
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error);
  }
};

// Function to remove auth from local storage
const removeAuth = () => {
  if (!localStorage) {
    return;
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error);
  }
};

// Function to setup Axios instance
export function setupAxios(axios) {
  axios.defaults.headers.Accept = 'application/json';
  axios.interceptors.request.use(
    (config) => {
      const auth = getAuth();
      if (auth && auth.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }

      return config;
    },
    (err) => Promise.reject(err)
  );
}

export { getAuth, setAuth, removeAuth, AUTH_LOCAL_STORAGE_KEY };
