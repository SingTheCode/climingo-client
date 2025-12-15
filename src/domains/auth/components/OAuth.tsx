'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useRunOnce } from '@/hooks/common';
import { useAuth } from '@/domains/auth/hooks/useAuth';

export function OAuth() {
  const router = useRouter();
  const { signIn } = useAuth();

  const code = useSearchParams().get('code') ?? '';

  useRunOnce(() => {
    const fetch = async () => {
      signIn(code, 'kakao').catch((err) => {
        if (err instanceof Error) {
          if (err.message) {
            alert(err.message);
          }
          router.replace('/signIn');
        }
      });
    };

    fetch();
  });

  return <div></div>;
}
