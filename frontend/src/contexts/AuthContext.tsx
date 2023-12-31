import { createContext, ReactNode, useEffect, useReducer } from 'react';
// utils
import axios from '../utils/axios';
import { getUser, isValidToken, refreshAccessToken, setSession } from '../utils/jwt';
// @types
import { ActionMap, AuthState, AuthUser, JWTContextType } from '../@types/auth';
import { MAIN_API } from '../config';

// ----------------------------------------------------------------------

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.Login]: {
    user: AuthUser;
  };
  [Types.Logout]: undefined;
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode;
};
type initializeProps = {
  access?: string;
  refresh?: string;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);

  useEffect(() => {
    const initialize = async ({ access, refresh }: initializeProps) => {
      try {
        const accessToken = access?.length ? access : window.localStorage.getItem('accessToken');
        const refreshToken = refresh?.length ? refresh : window.localStorage.getItem('refreshToken');

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken, refreshToken);
          const user = await getUser(accessToken);

          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          if (refreshToken && isValidToken(refreshToken)) {
            const { access, refresh } = await refreshAccessToken(refreshToken);
            if (access && refresh && isValidToken(access) && isValidToken(refresh)) {
              initialize({ access, refresh });
            } else {
              dispatch({
                type: Types.Initial,
                payload: {
                  isAuthenticated: false,
                  user: null,
                },
              });
            }
          } else {
            dispatch({
              type: Types.Initial,
              payload: {
                isAuthenticated: false,
                user: null,
              },
            });
          }
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize({ access: '', refresh: '' });
  }, []);

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
            const user = await getUser(access);
            dispatch({
              type: Types.Login,
              payload: {
                user,
              },
            });
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

  const logout = async () => {
    window.sessionStorage.clear();
    window.localStorage.clear();
    setSession(null, null);
    dispatch({ type: Types.Logout });
  };
  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
