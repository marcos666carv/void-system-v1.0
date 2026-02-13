import { VoidLevel } from '../value-objects/VoidLevel';

export type UserRole = 'client' | 'admin' | 'staff';
export type MembershipTier = 'standard' | 'void_club' | 'vip';

export interface ClientPreferences {
    temperature?: number;
    lighting?: boolean;
    claustrophobiaNotes?: string;
    physicalPainNotes?: string;
}

export interface ClientInteraction {
    id: string;
    date: Date;
    type: 'message' | 'call' | 'visit' | 'email' | 'system';
    notes: string;
}

export interface ClientPurchase {
    id: string;
    date: Date;
    itemName: string;
    value: number;
}

export interface ClientProps {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    cpf?: string;
    photoUrl?: string;
    role: UserRole;
    membershipTier?: MembershipTier;
    birthDate?: string;
    addressNeighborhood?: string;
    addressCity?: string;
    profession?: string;
    leadSource?: string;
    notes?: string;
    npsScore?: number;
    lastSurveyDate?: Date;
    xp: number;
    level: VoidLevel;
    totalSpent: number;
    totalSessions: number;
    firstVisit?: Date;
    lastVisit?: Date;
    preferences: ClientPreferences;
    createdAt: Date;
    updatedAt: Date;
    // Enhanced Data
    visitHistory?: Date[];
    purchaseHistory?: ClientPurchase[];
    interactionHistory?: ClientInteraction[];
    usageTags?: string[];
    preferredWeekDays?: string[];



    // V2 Fields
    lifeCycleStage?: 'new' | 'active' | 'churned' | 'vip';
    // totalSessions is already defined above at line 47, removing duplicate if present or ensuring it matches
    // totalSessions: number; // Already present
    // lastVisit is already defined above at line 49

    // Stats
    sessionsFloat?: number;
    sessionsMassage?: number;
    sessionsCombo?: number;
}

export class Client {
    private constructor(private readonly props: ClientProps) { }

    static create(props: ClientProps): Client {
        return new Client({ ...props, preferences: { ...props.preferences } });
    }

    static new(props: Pick<ClientProps, 'id' | 'email' | 'fullName' | 'role' | 'photoUrl' | 'phone'>): Client {
        return new Client({
            ...props,
            xp: 0,
            level: 'iniciado',
            totalSpent: 0,
            totalSessions: 0,
            preferences: {},
            createdAt: new Date(),
            updatedAt: new Date(),
            visitHistory: [],
            purchaseHistory: [],
            interactionHistory: [],
            usageTags: [],
            preferredWeekDays: []
        });
    }

    get id() { return this.props.id; }
    get email() { return this.props.email; }
    get fullName() { return this.props.fullName; }
    get phone() { return this.props.phone; }
    get cpf() { return this.props.cpf; }
    get photoUrl() { return this.props.photoUrl; }
    get role() { return this.props.role; }
    get membershipTier() { return this.props.membershipTier; }
    get birthDate() { return this.props.birthDate; }
    get addressNeighborhood() { return this.props.addressNeighborhood; }
    get addressCity() { return this.props.addressCity; }
    get profession() { return this.props.profession; }
    get leadSource() { return this.props.leadSource; }
    get notes() { return this.props.notes; }
    get npsScore() { return this.props.npsScore; }
    get lastSurveyDate() { return this.props.lastSurveyDate; }
    get xp() { return this.props.xp; }
    get level() { return this.props.level; }
    get totalSpent() { return this.props.totalSpent; }
    get totalSessions() { return this.props.totalSessions; }
    get firstVisit() { return this.props.firstVisit; }
    get lastVisit() { return this.props.lastVisit; }
    get preferences() { return { ...this.props.preferences }; }
    get createdAt() { return this.props.createdAt; }
    get updatedAt() { return this.props.updatedAt; }
    get visitHistory() { return this.props.visitHistory; }
    get purchaseHistory() { return this.props.purchaseHistory; }
    get interactionHistory() { return this.props.interactionHistory; }
    get usageTags() { return this.props.usageTags; }
    get preferredWeekDays() { return this.props.preferredWeekDays; }

    get isVoidClub(): boolean {
        return this.props.membershipTier === 'void_club' || this.props.membershipTier === 'vip';
    }

    get initials(): string {
        return this.props.fullName
            .split(' ')
            .map(n => n.charAt(0))
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }

    get isInactive(): boolean {
        if (!this.props.lastVisit) return false;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return this.props.lastVisit < thirtyDaysAgo;
    }

    toJSON(): ClientProps {
        return { ...this.props, preferences: { ...this.props.preferences } };
    }
}
