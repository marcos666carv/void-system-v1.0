'use client';

import Link from 'next/link';
import styles from './Sidebar.module.css';
import { Logo } from '@/components/ui';
import { usePathname } from 'next/navigation';

export const Sidebar = () => {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path ? styles.active : '';

    return (
        <aside className={styles.sidebar}>
            <Logo />
            <nav className={styles.nav}>
                <Link href="/admin" className={`${styles.link} ${isActive('/admin')}`}>Dashboard</Link>
                <Link href="/admin/services" className={`${styles.link} ${isActive('/admin/services')}`}>Serviços</Link>
                <Link href="/admin/calendar" className={`${styles.link} ${isActive('/admin/calendar')}`}>Calendário</Link>
                <Link href="/admin/tanks" className={`${styles.link} ${isActive('/admin/tanks')}`}>Tanques</Link>
                <Link href="/admin/locations" className={`${styles.link} ${isActive('/admin/locations')}`}>Locais</Link>
                <Link href="/admin/customers" className={`${styles.link} ${isActive('/admin/customers')}`}>Clientes</Link>
                <Link href="/admin/lifecycle" className={`${styles.link} ${isActive('/admin/lifecycle')}`}>Lifecycle</Link>
                <Link href="/sales/new" className={`${styles.link} ${isActive('/sales/new')}`}>Nova Venda</Link>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />
                <Link href="/admin/system-map" className={`${styles.link} ${isActive('/admin/system-map')}`}>System Map</Link>
            </nav>
        </aside>
    );
};

