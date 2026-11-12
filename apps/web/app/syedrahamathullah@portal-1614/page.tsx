import type { Metadata } from 'next';
import AdminConsole from '@/components/AdminConsole';

export const metadata: Metadata = {
  title: 'SkyRay Management Portal',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function PrivatePortalPage() {
  return (
    <div className="admin-shell">
      <AdminConsole />
    </div>
  );
}
