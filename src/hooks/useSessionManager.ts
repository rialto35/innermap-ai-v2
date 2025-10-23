import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SessionManagerOptions {
  redirectOnUnauth?: boolean;
  checkSessionOnMount?: boolean;
}

export function useSessionManager(options: SessionManagerOptions = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSessionValid, setIsSessionValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const { redirectOnUnauth = true, checkSessionOnMount = true } = options;

  const checkSession = useCallback(async () => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      setIsSessionValid(false);
      setLoading(false);
      if (redirectOnUnauth) {
        router.push('/login');
      }
      return;
    }

    if (status === 'authenticated') {
      try {
        // 세션 유효성 확인을 위한 API 호출
        const response = await fetch('/api/imcore/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          setIsSessionValid(false);
          setLoading(false);
          if (redirectOnUnauth) {
            router.push('/login');
          }
          return;
        }

        if (response.ok) {
          setIsSessionValid(true);
        } else {
          setIsSessionValid(false);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setIsSessionValid(false);
      } finally {
        setLoading(false);
      }
    }
  }, [status, router, redirectOnUnauth]);

  useEffect(() => {
    if (checkSessionOnMount) {
      checkSession();
    } else {
      setLoading(false);
    }
  }, [checkSessionOnMount, checkSession]);

  return {
    session,
    status,
    isSessionValid,
    loading,
    checkSession,
  };
}
