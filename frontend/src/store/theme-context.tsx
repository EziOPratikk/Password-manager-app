import {
  createContext,
  useState,
  useMemo,
  useContext,
  type ReactNode,
} from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { PaletteMode } from '@mui/material';

type ThemeState = {
  mode: PaletteMode;
};

type ThemeContextValue = {
  toggleTheme: () => void;
} & ThemeState;

type ThemeContextProviderProps = {
  children: ReactNode;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useThemeContext() {
  const themeContext = useContext(ThemeContext);

  if (themeContext === null) {
    throw new Error(
      'useThemeContext must be used within an ThemeContextProvider'
    );
  }

  return themeContext;
}

export default function ThemeContextProvider(props: ThemeContextProviderProps) {
  const [mode, setMode] = useState<PaletteMode>('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  const ctx: ThemeContextValue = {
    mode: mode,
    toggleTheme: () => {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    },
  };

  return (
    <ThemeContext.Provider value={ctx}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {props.children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}