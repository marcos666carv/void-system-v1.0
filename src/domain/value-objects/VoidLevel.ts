export const VOID_LEVELS = ['iniciado', 'explorador', 'habitue', 'mestre', 'voidwalker'] as const;
export type VoidLevel = typeof VOID_LEVELS[number];

export interface VoidLevelConfig {
    label: string;
    minSessions: number;
    xpRequired: number;
    color: string;
    description: string;
}

export const VOID_LEVEL_CONFIG: Record<VoidLevel, VoidLevelConfig> = {
    iniciado: {
        label: 'Iniciado',
        minSessions: 0,
        xpRequired: 0,
        color: '#94A3B8',
        description: 'Primeira experiência na flutuação',
    },
    explorador: {
        label: 'Explorador',
        minSessions: 3,
        xpRequired: 300,
        color: '#0066FF',
        description: '3+ sessões ou compra de pacote',
    },
    habitue: {
        label: 'Habitué',
        minSessions: 10,
        xpRequired: 1000,
        color: '#10B981',
        description: 'Assinante do Void Club',
    },
    mestre: {
        label: 'Mestre',
        minSessions: 30,
        xpRequired: 3000,
        color: '#F59E0B',
        description: 'Embaixador da marca',
    },
    voidwalker: {
        label: 'Voidwalker',
        minSessions: 100,
        xpRequired: 10000,
        color: '#8B5CF6',
        description: 'Elite — top 1% dos flutuantes',
    },
};

export function calculateLevel(xp: number): VoidLevel {
    const levels = [...VOID_LEVELS].reverse();
    for (const level of levels) {
        if (xp >= VOID_LEVEL_CONFIG[level].xpRequired) return level;
    }
    return 'iniciado';
}

export function xpToNextLevel(xp: number): { current: VoidLevel; next: VoidLevel | null; remaining: number; progress: number } {
    const current = calculateLevel(xp);
    const currentIndex = VOID_LEVELS.indexOf(current);
    const next = currentIndex < VOID_LEVELS.length - 1 ? VOID_LEVELS[currentIndex + 1] : null;

    if (!next) return { current, next: null, remaining: 0, progress: 100 };

    const currentXp = VOID_LEVEL_CONFIG[current].xpRequired;
    const nextXp = VOID_LEVEL_CONFIG[next].xpRequired;
    const range = nextXp - currentXp;
    const progress = Math.round(((xp - currentXp) / range) * 100);

    return { current, next, remaining: nextXp - xp, progress };
}
