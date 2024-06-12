import { Routes, Route } from 'react-router-dom';

import Layout from './components/layout/Layout.tsx';
import Register from './pages/Register.tsx';
import Login from './pages/Login.tsx';
import Home from './pages/Home.tsx';
import Platform from './pages/Platform.tsx';
import NotFound from './pages/NotFound.tsx';
import AuthContextProvider from './store/auth-context.tsx';
import ThemeContextProvider from './store/theme-context.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';
import { PLATFORMS } from './data/platforms.ts';

function App() {
  return (
    <AuthContextProvider>
      <ThemeContextProvider>
        <Layout>
          <Routes>
            <Route path='/register' element={<Register />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route
              path='/'
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            ></Route>
            {PLATFORMS.map((platform) => {
              return (
                <Route
                  key={platform.id}
                  path={`/${platform.id}`}
                  element={
                    <PrivateRoute>
                      <Platform />
                    </PrivateRoute>
                  }
                ></Route>
              );
            })}
            <Route path='*' element={<NotFound />}></Route>
          </Routes>
        </Layout>
      </ThemeContextProvider>
    </AuthContextProvider>
  );
}

export default App;