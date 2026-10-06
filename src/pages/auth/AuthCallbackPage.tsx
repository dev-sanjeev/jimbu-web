import LoadingScreen from '@/shared/LoadingScreen';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallbackPage() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const navigate = useNavigate();

  useEffect(() => {
    hydrate().then(() => {
      const { isAuthenticated } = useAuthStore.getState();
      navigate(isAuthenticated ? '/main' : '/login', { replace: true });
    });
  }, [hydrate, navigate]);

  return <LoadingScreen />;
}
