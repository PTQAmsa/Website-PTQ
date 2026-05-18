import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard — PTQ Amsa001',
  description: 'Dashboard admin pendaftaran santri baru PTQ Amsa001',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <link rel="icon" href="/Favicon Admin Website.webp" type="image/webp" />
      </head>
      {children}
    </>
  );
}
