import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { MAIN_API } from 'src/config';

// ----------------------------------------------------------------------

const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode<{ exp: number }>(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

const setSession = (accessToken: string | null, refresh: string | null) => {
  if (accessToken && refresh) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refresh);
    axios.defaults.headers.common.Authorization = `JWT ${accessToken}`;
    // This function below will handle when token is expired
    // const { exp } = jwtDecode(accessToken);
    // handleTokenExpired(exp);
  } else if (refresh) {
    localStorage.setItem('refreshToken', refresh);
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  } else {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

const refreshAccessToken = async (refreshToken: string | null) => {
  let credentials = { access: '', refresh: refreshToken };
  await axios.post(`${MAIN_API.base_url}token_refresh/`, { refresh: refreshToken }).then((response) => {
    const { access, refresh } = response.data;
    setSession(access, refresh);
    credentials = { access: access, refresh: refresh };
  }).catch(err => {
    console.error(err);
    logout();
  });
  return { ...credentials };
}

const getUser = async (token: string) => {
  const response = await axios.get(MAIN_API.base_url + 'current_user/', { headers: { Authorization: `JWT ${token}` } });
  let role = response.data.group_names;
  let fullName = response.data.full_name;
  return { displayName: fullName, handle: fullName, role, ...(response?.data || {}) };
}

const reValidateToken = async (refreshToken: string | null) => {
  const { access, refresh } = await refreshAccessToken(refreshToken);
  return { access, refresh };
}

const logout = async () => {
  setSession(null, null);
  window.location.href = '/auth/login';
};

const login = async (username: string, password: string) => {
  const res =  await new Promise(async (resolve, reject) => {
    try {
      await axios.post(MAIN_API.base_url + 'token_obtain/', {
        username,
        password,
      }).then(async (response) => {
        if (response.status === 200) {
          const { access, refresh } = response.data;
          setSession(access, refresh);
          resolve(response.data);
        } else {
          reject({ description: JSON.stringify(response.data) });
        }
      })
    } catch (err) {
      if (JSON.stringify(err).includes('Unable to log in with provided credentials')) {
        reject('Invalid username or password');
      } else {
        reject(JSON.stringify(err));
      }
    }
  });
  return res;
};

const checkTokenStatus = () => {
  let token = localStorage.getItem('accessToken') ?? '';
  let refreshToken = localStorage.getItem('refreshToken') ?? '';
  if (token && isValidToken(token)) {
    return true;
  } else if (refreshToken && isValidToken(refreshToken)) {
    return true;
  } else { return false };
}

const processTokens = async (functions: Function, arg1?: any, arg2?: any, arg3?: any) => {
  let token = localStorage.getItem('accessToken') ?? '';
  let refreshToken = localStorage.getItem('refreshToken') ?? '';

  if (token && isValidToken(token)) {
    await functions(arg1, arg2, arg3);
  } else {
    reValidateToken(refreshToken).then(({ access, refresh }) => {
      const reprocessTokens = async () => {
        if (access && isValidToken(access) && refresh && isValidToken(refresh)) {
          localStorage.setItem('accessToken', access);
          await functions(arg1, arg2, arg3);
        } else {
          logout();
        }
      }
      reprocessTokens();
    }).catch(() => {
      logout();
    });
  }
}

export {
  login,
  logout,
  getUser,
  setSession,
  isValidToken,
  processTokens,
  reValidateToken,
  checkTokenStatus,
  refreshAccessToken,
};