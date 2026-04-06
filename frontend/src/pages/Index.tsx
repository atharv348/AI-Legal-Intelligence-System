import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '@/lib/auth';

export default function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(isAuthenticated() ? '/dashboard' : '/auth', { replace: true });
  }, [navigate]);
  return null;
}
