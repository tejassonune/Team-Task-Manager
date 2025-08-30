import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

export default function Register() {
  const { user, register } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleRegister = async (name, email, password) => {
    await register(name, email, password);
    navigate('/dashboard');
  };

  return <AuthForm onSubmit={handleRegister} isRegister={true} />;
}
