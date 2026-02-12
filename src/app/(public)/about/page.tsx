'use client';

import { Gravity } from '@/components/ui-legacy/Gravity';

export default function AboutPage() {
    return (
        <div style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <Gravity strength={0.2} radius={300}>
                <h1 style={{
                    fontSize: '3rem',
                    fontWeight: 800,
                    marginBottom: '2rem',
                    background: 'linear-gradient(to right, #E3E3D9, #CCB0F0)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Sobre a VOID
                </h1>
            </Gravity>

            <div style={{ fontSize: '1.25rem', lineHeight: 1.8, opacity: 0.9, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <p>
                    A VOID nasceu do desejo de criar um santuário de silêncio em meio ao caos urbano.
                    Somos o pimeiro centro de flutuação do Brasil focado não apenas no relaxamento,
                    mas na expansão da consciência através da privação sensorial.
                </p>
                <p>
                    Nossos tanques de flutuação contem 600kg de Sal de Epsom dissolvidos em água
                    na temperatura exata da pele (35.5°C), permitindo que seu corpo perca a noção
                    de onde termina e onde começa a água.
                </p>
                <p>
                    O resultado é uma experiência de Gravidade Zero que libera a coluna,
                    relaxa os músculos e permite que a mente entre em estados profundos de meditação.
                </p>
            </div>
        </div>
    );
}
