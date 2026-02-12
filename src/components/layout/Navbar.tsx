'use client';

import Link from 'next/link';
import styles from './Navbar.module.css';
import { Button } from '@/components/ui';
import { Logo } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';
import { User } from 'lucide-react';

export const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Logo />

                <div className={styles.links}>
                    <Link href="/services" className={styles.link}>serviços</Link>
                    <Link href="/club" className={styles.link}>void club</Link>
                    {user && (
                        <Link href="/dashboard" className={styles.link}>meus créditos</Link>
                    )}
                </div>

                <div className={styles.actions}>
                    {user ? (
                        <>
                            <Link href="/profile" className={styles.profileLink}>
                                <User size={18} />
                                <span>perfil</span>
                            </Link>
                            <Button color="tertiary" size="sm" onClick={logout}>
                                sair
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button color="tertiary" size="sm">login</Button>
                            </Link>
                            <Link href="/signup">
                                <Button color="primary" size="sm">criar conta</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
