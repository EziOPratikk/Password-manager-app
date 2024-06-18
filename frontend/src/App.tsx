import { Routes, Route } from 'react-router-dom';

import Layout from './components/layout/Layout.tsx';
import Register from './pages/Register.tsx';
import Login from './pages/Login.tsx';
import Home from './pages/Home.tsx';
import Platform from './pages/Platform.tsx';
import ForgotPassword from './pages/ForgotPassword.tsx';
import ResetPassword from './pages/ResetPassword.tsx';
import NotFound from './pages/NotFound.tsx';
import AuthContextProvider from './store/auth-context.tsx';
import ThemeContextProvider from './store/theme-context.tsx';
import AuthPrivateRoute from './components/auth/AuthPrivateRoute.tsx';
import PwdResetRoute from './components/PwdResetRoute.tsx';
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
                <AuthPrivateRoute>
                  <Home />
                </AuthPrivateRoute>
              }
            ></Route>
            {PLATFORMS.map((platform) => {
              return (
                <Route
                  key={platform.id}
                  path={`/${platform.id}`}
                  element={
                    <AuthPrivateRoute>
                      <Platform />
                    </AuthPrivateRoute>
                  }
                ></Route>
              );
            })}
            <Route path='/forgot-password' element={<ForgotPassword />}></Route>
            <Route
              path='/reset-password'
              element={
                <PwdResetRoute>
                  <ResetPassword />
                </PwdResetRoute>
              }
            ></Route>
            <Route path='*' element={<NotFound />}></Route>
          </Routes>
        </Layout>
      </ThemeContextProvider>
    </AuthContextProvider>
  );
}

export default App;