export type TankStatus = 'ready' | 'in_use' | 'cleaning' | 'maintenance' | 'offline' | 'night_mode';

export interface TankProps {
    id: string;
    name: string;
    locationId: string;
    status: TankStatus;
    // Device Controls
    ledsOn: boolean;
    musicOn: boolean;
    heaterOn: boolean;
    pumpOn: boolean; // Renamed/Clarified filtrationOn if needed, but adding explicitly for toggle

    temperature?: number;
    saltConcentration?: number;
    phLevel?: number;
    uvLightOn?: boolean;
    filtrationOn?: boolean; // Keep for backend compat if needed, but pumpOn is the control
    maintenanceMode?: boolean;
    sessionTimeRemaining?: number;
    cleaningTimeRemaining?: number;

    // Extended Operational Data (Loveable Alignment)
    currentClient?: {
        name: string;
        photoUrl?: string; // e.g., regex for avatar
        cpf?: string;
        email?: string;
        phone?: string;
        isGift?: boolean;
        level?: 'iniciado' | 'explorador' | 'habitue' | 'mestre' | 'voidwalker';
    };
    parts?: TankPart[];
    sessionHistory?: {
        id: string;
        clientId?: string;
        clientName: string;
        clientPhotoUrl?: string;
        clientCpf?: string;
        date: Date;
        duration: number;
        isGift?: boolean;
    }[];

    // Aggregated Stats
    totalSessions?: number;
    totalUsageHours?: number;
    totalIdleHours?: number;
    energyConsumedKwh?: number;
    revenueGenerated?: number;

    installedAt?: Date; // Renamed from installedAt in plan, keeping consistent
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface TankPart {
    id: string;
    name: string;
    serialNumber: string;
    lastReplacedAt: Date;
    lifespanHours: number;
    currentHours: number;
    status: 'ok' | 'warning' | 'critical';
}

export class Tank {
    private constructor(private readonly props: TankProps) { }

    static create(props: TankProps): Tank {
        if (!props.name.trim()) throw new Error('Tank name is required');
        if (!props.locationId) throw new Error('Tank must belong to a location');
        return new Tank({ ...props });
    }

    get id() { return this.props.id; }
    get name() { return this.props.name; }
    get locationId() { return this.props.locationId; }
    get status() { return this.props.status; }
    get temperature() { return this.props.temperature; }
    get saltConcentration() { return this.props.saltConcentration; }
    get phLevel() { return this.props.phLevel; }
    get uvLightOn() { return this.props.uvLightOn; }
    get filtrationOn() { return this.props.filtrationOn; }
    get maintenanceMode() { return this.props.maintenanceMode; }
    get sessionTimeRemaining() { return this.props.sessionTimeRemaining; }
    get cleaningTimeRemaining() { return this.props.cleaningTimeRemaining; }

    get ledsOn() { return this.props.ledsOn; }
    get musicOn() { return this.props.musicOn; }
    get heaterOn() { return this.props.heaterOn; }
    get pumpOn() { return this.props.pumpOn; }

    get currentClient() { return this.props.currentClient; }
    get parts() { return this.props.parts ?? []; }
    get sessionHistory() { return this.props.sessionHistory ?? []; }

    get totalSessions() { return this.props.totalSessions ?? 0; }
    get totalUsageHours() { return this.props.totalUsageHours ?? 0; }
    get totalIdleHours() { return this.props.totalIdleHours ?? 0; }
    get energyConsumedKwh() { return this.props.energyConsumedKwh ?? 0; }
    get revenueGenerated() { return this.props.revenueGenerated ?? 0; }

    get installedAt() { return this.props.installedAt; }
    get active() { return this.props.active; }
    get createdAt() { return this.props.createdAt; }
    get updatedAt() { return this.props.updatedAt; }

    get isAvailable(): boolean {
        return this.props.status === 'ready' && this.props.active;
    }

    get isBusy(): boolean {
        return this.props.status === 'in_use';
    }

    get isCleaning(): boolean {
        return this.props.status === 'cleaning';
    }

    get statusLabel(): string {
        const labels: Record<TankStatus, string> = {
            ready: 'Livre',
            in_use: 'Em uso',
            cleaning: 'Limpeza',
            maintenance: 'Manutenção',
            offline: 'Offline',
            night_mode: 'Modo Noturno',
        };
        return labels[this.props.status];
    }

    get statusColor(): string {
        const colors: Record<TankStatus, string> = {
            ready: '#10B981',
            in_use: '#EF4444', // Red for busy/in-session based on design ref? Or keep brand? Let's use design ref logic if possible, defaulting to semantic.
            cleaning: '#F59E0B',
            maintenance: '#EF4444',
            offline: '#94A3B8',
            night_mode: '#8B5CF6', // Purple for night mode
        };
        return colors[this.props.status];
    }

    toJSON(): TankProps { return { ...this.props }; }
}
