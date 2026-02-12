import Link from 'next/link';
import styles from './Footer.module.css';

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.column}>
                    <h3 className={styles.heading}>VOID</h3>
                    <p style={{ opacity: 0.7, maxWidth: '300px' }}>
                        O que a mente pensa, o corpo sente. Cuide dos dois.
                    </p>
                </div>

                <div className={styles.column}>
                    <h4 className={styles.heading}>Links</h4>
                    <Link href="/about" className={styles.link}>About</Link>
                    <Link href="/services" className={styles.link}>Services</Link>
                    <Link href="/club" className={styles.link}>Void Club</Link>
                </div>

                <div className={styles.column}>
                    <h4 className={styles.heading}>Contact</h4>
                    <a href="mailto:hello@voidfloat.com.br" className={styles.link}>hello@voidfloat.com.br</a>
                    <span className={styles.link}>São Paulo, SP</span>
                    <Link href="/admin" className={styles.link} style={{ marginTop: '1rem', color: 'var(--primary)', fontWeight: 600 }}>Acesso Admin</Link>
                </div>
            </div>

            <div className={styles.copyright}>
                © {new Date().getFullYear()} Void Float. All rights reserved.
            </div>
        </footer>
    );
};
