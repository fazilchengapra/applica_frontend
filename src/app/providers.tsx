// app/providers.tsx
'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </GoogleOAuthProvider>
  );
}