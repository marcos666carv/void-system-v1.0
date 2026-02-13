'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { VOID_LEVEL_CONFIG, xpToNextLevel, VoidLevel } from '@/domain/value-objects/VoidLevel';

interface UserProfile {
    fullName: string;
    email: string;
    phone: string;
    xp: number;
    level: VoidLevel;
    totalSessions: number;
    memberSince: string;
    preferences: {
        temperature?: number;
        lighting?: boolean;
        claustrophobiaNotes?: string;
        physicalPainNotes?: string;
    };
}

const mockProfile: UserProfile = {
    fullName: 'Ana Silva',
    email: 'ana.silva@example.com',
    phone: '(41) 99910-0001',
    xp: 3200,
    level: 'mestre',
    totalSessions: 32,
    memberSince: '2024-03-15',
    preferences: { temperature: 35.5, lighting: false, claustrophobiaNotes: '', physicalPainNotes: 'Dor lombar leve' },
};

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [editingPrefs, setEditingPrefs] = useState(false);
    const [prefs, setPrefs] = useState(mockProfile.preferences);

    useEffect(() => {
        const timer = setTimeout(() => setProfile(mockProfile), 200);
        return () => clearTimeout(timer);
    }, []);

    if (!profile) return <div style={{ padding: 'var(--space-7)' }}><p style={{ opacity: 0.5 }}>carregando perfil...</p></div>;

    const progress = xpToNextLevel(profile.xp);
    const config = VOID_LEVEL_CONFIG[profile.level];
    const initials = profile.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

    return (
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--space-7)' }}>
                <h1 style={{ fontSize: 'var(--font-size-3xl)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>meu perfil</h1>
            </div>

            {/* Avatar Section */}
            <Card padding="lg" style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
                <div style={{
                    width: '80px', height: '80px', borderRadius: 'var(--radius-full)',
                    backgroundColor: `${config.color}15`,
                    border: `2px solid ${config.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 'var(--font-size-2xl)', fontWeight: 600, color: config.color,
                    margin: '0 auto var(--space-4)',
                }}>
                    {initials}
                </div>
                <h2 style={{ fontWeight: 600, fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-2)' }}>{profile.fullName}</h2>

                {/* Level Badge */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                    padding: 'var(--space-2) var(--space-4)',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: `${config.color}12`,
                    border: `1px solid ${config.color}25`,
                    marginBottom: 'var(--space-5)',
                }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: 'var(--radius-full)', backgroundColor: config.color }} />
                    <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: config.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {config.label}
                    </span>
                </div>

                {/* XP Progress */}
                <div style={{ marginBottom: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontWeight: 600 }}>{profile.xp} xp</span>
                        {progress.next && (
                            <span style={{ opacity: 0.4 }}>{progress.remaining} xp para {VOID_LEVEL_CONFIG[progress.next].label.toLowerCase()}</span>
                        )}
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'var(--border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%', width: `${progress.progress}%`,
                            backgroundColor: config.color,
                            borderRadius: 'var(--radius-full)',
                            transition: 'width 0.6s var(--ease-antigravity)',
                        }} />
                    </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
                    <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, fontFamily: 'var(--font-display)' }}>{profile.totalSessions}</span>
                        <p style={{ fontSize: '0.65rem', opacity: 0.4, marginTop: '2px', textTransform: 'uppercase' }}>sessões</p>
                    </div>
                    <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                            {new Date(profile.memberSince).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                        </span>
                        <p style={{ fontSize: '0.65rem', opacity: 0.4, marginTop: '2px', textTransform: 'uppercase' }}>membro desde</p>
                    </div>
                </div>
            </Card>

            {/* Contact Info */}
            <Card padding="lg" style={{ marginBottom: 'var(--space-5)' }}>
                <h3 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-5)', opacity: 0.6 }}>
                    dados de contato
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label="nome" defaultValue={profile.fullName} />
                    <Input label="e-mail" defaultValue={profile.email} type="email" />
                    <Input label="telefone" defaultValue={profile.phone} type="tel" />
                </div>
            </Card>

            {/* Float Preferences */}
            <Card padding="lg" style={{ marginBottom: 'var(--space-5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
                    <h3 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6 }}>
                        preferências de flutuação
                    </h3>
                    <button
                        onClick={() => setEditingPrefs(!editingPrefs)}
                        style={{ fontSize: 'var(--font-size-xs)', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                    >
                        {editingPrefs ? 'cancelar' : 'editar'}
                    </button>
                </div>

                {!editingPrefs ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                            <span style={{ opacity: 0.6 }}>temperatura</span>
                            <span style={{ fontWeight: 600 }}>{prefs.temperature}°C</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                            <span style={{ opacity: 0.6 }}>iluminação</span>
                            <span style={{ fontWeight: 600 }}>{prefs.lighting ? 'ligada' : 'desligada'}</span>
                        </div>
                        {prefs.physicalPainNotes && (
                            <div style={{ fontSize: 'var(--font-size-sm)', padding: 'var(--space-3)', backgroundColor: 'rgba(239,68,68,0.06)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(239,68,68,0.12)' }}>
                                <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--void-error)', display: 'block', marginBottom: '4px' }}>observações de dor</span>
                                {prefs.physicalPainNotes}
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>temperatura (°C)</label>
                                <span style={{ fontSize: 'var(--font-size-sm)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>{prefs.temperature}</span>
                            </div>
                            <input
                                type="range" min={34} max={37} step={0.1}
                                value={prefs.temperature}
                                onChange={e => setPrefs({ ...prefs, temperature: Number(e.target.value) })}
                                style={{ width: '100%', accentColor: 'var(--primary)' }}
                            />
                        </div>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: 'var(--space-3) var(--space-4)',
                            backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
                        }}>
                            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>iluminação interna</span>
                            <button
                                onClick={() => setPrefs({ ...prefs, lighting: !prefs.lighting })}
                                style={{
                                    width: '48px', height: '26px', borderRadius: 'var(--radius-full)',
                                    backgroundColor: prefs.lighting ? 'var(--primary)' : 'var(--border)',
                                    position: 'relative', cursor: 'pointer',
                                    transition: 'background-color var(--duration-fast) var(--ease-antigravity)',
                                    border: 'none',
                                }}
                            >
                                <div style={{
                                    width: '20px', height: '20px', borderRadius: 'var(--radius-full)',
                                    backgroundColor: 'white', position: 'absolute', top: '3px',
                                    left: prefs.lighting ? '25px' : '3px',
                                    transition: 'left var(--duration-fast) var(--ease-antigravity)',
                                    boxShadow: 'var(--shadow-sm)',
                                }} />
                            </button>
                        </div>
                        <Input
                            label="notas de claustrofobia"
                            defaultValue={prefs.claustrophobiaNotes}
                            onChange={e => setPrefs({ ...prefs, claustrophobiaNotes: e.target.value })}
                        />
                        <Input
                            label="notas de dor física"
                            defaultValue={prefs.physicalPainNotes}
                            onChange={e => setPrefs({ ...prefs, physicalPainNotes: e.target.value })}
                        />
                        <Button color="primary" size="md" className="w-full" onClick={() => setEditingPrefs(false)}>
                            salvar preferências
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
}
