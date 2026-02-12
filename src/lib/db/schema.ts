export type UserRole = 'client' | 'admin' | 'staff';

export interface User {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    role: UserRole;
    created_at: Date;
    updated_at: Date;
    // External clients might have membership status
    membership_tier?: 'standard' | 'void_club' | 'vip';

    // New fields from Google Sheet import
    cpf?: string;
    birth_date?: string; // Storing as ISO Date string YYYY-MM-DD
    address_neighborhood?: string;
    address_city?: string;
    profession?: string;
    lead_source?: string;
    notes?: string;

    // Feedback
    nps_score?: number; // Latest or Average NPS
    last_survey_date?: Date;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
    id: string;
    client_id: string;
    service_id: string;
    start_time: Date;
    end_time: Date;
    status: AppointmentStatus;
    notes?: string;
    created_at: Date;
    updated_at: Date;
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    category: 'therapy' | 'merchandise' | 'gift_card';
    duration_minutes?: number; // For therapies
    active: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface Sale {
    id: string;
    client_id: string;
    items: SaleItem[];
    total_amount: number;
    payment_method: 'credit_card' | 'debit_card' | 'pix' | 'cash';
    status: 'pending' | 'completed' | 'refunded';
    created_at: Date;
}

export interface SaleItem {
    product_id: string;
    quantity: number;
    unit_price: number;
}

export interface SurveyResponse {
    id: string;
    client_id: string;
    appointment_id: string;
    nps_score: number; // 0-10
    water_temp_rating: 'too_cold' | 'perfect' | 'too_hot';
    after_feeling: string; // e.g., "Relaxed", "Energized"
    comments?: string;
    created_at: Date;
}
