import LoadingScreen from '@/shared/LoadingScreen';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get('accessToken');
  const refreshToken = searchParams.get('refreshToken');
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken && refreshToken) {
      setToken(accessToken, refreshToken).then(() => {
        navigate('/main', { replace: true });
      });
    } else {
      navigate('/login', { replace: true });
    }
  }, [accessToken, refreshToken, setToken, navigate]);

  return <LoadingScreen />;
}
