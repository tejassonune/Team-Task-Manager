import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

export default function Login() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (email, password) => {
    await login(email, password);
    navigate('/dashboard');
  };

  return <AuthForm onSubmit={handleLogin} isRegister={false} />;
}
