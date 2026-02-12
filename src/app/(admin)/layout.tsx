import { Sidebar } from '@/components/layout/Sidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--void-obsidian)' }}>
            <Sidebar />
            <main style={{ flex: 1, marginLeft: '200px', padding: 'var(--space-4)', backgroundColor: 'var(--background)' }}>
                {children}
            </main>
        </div>
    );
}
