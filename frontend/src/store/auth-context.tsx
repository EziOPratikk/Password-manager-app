import { type ReactNode, createContext, useContext, useReducer } from 'react';

type AuthState = {
  isAuthenticated: boolean;
};

type AuthContextValue = {
  login: (userEmail: string, userToken: string) => void;
  logout: () => void;
} & AuthState;

const AuthContext = createContext<AuthContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
  const authContext = useContext(AuthContext);

  if (authContext === null) {
    throw new Error(
      'useAuthContext must be used within an AuthContextProvider'
    );
  }

  return authContext;
}

const initialState: AuthState = {
  isAuthenticated: false,
};

type AuthContextProviderProps = {
  children: ReactNode;
};

type AuthAction = {
  type: 'LOGIN_USER' | 'LOGOUT_USER';
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  if (action.type === 'LOGIN_USER') {
    return {
      isAuthenticated: true,
    };
  }

  if (action.type === 'LOGOUT_USER') {
    return {
      isAuthenticated: false,
    };
  }

  return state;
}

export default function AuthContextProvider(props: AuthContextProviderProps) {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  const ctx: AuthContextValue = {
    isAuthenticated: authState.isAuthenticated,
    login: (userEmail, userToken) => {
      dispatch({ type: 'LOGIN_USER' });
      localStorage.setItem('email', JSON.stringify(userEmail));
      localStorage.setItem('token', JSON.stringify(userToken));
    },
    logout: () => {
      dispatch({ type: 'LOGOUT_USER' });

      localStorage.removeItem('email');
      localStorage.removeItem('token');
    },
  };

  return (
    <AuthContext.Provider value={ctx}>{props.children}</AuthContext.Provider>
  );
}