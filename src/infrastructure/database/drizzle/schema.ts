import { pgTable, text, timestamp, boolean, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const roleEnum = pgEnum('role', ['client', 'admin', 'staff']);
export const membershipTierEnum = pgEnum('membership_tier', ['standard', 'void_club', 'vip']);
export const voidLevelEnum = pgEnum('void_level', ['iniciado', 'explorador', 'habilidoso', 'especialista', 'mestre', 'voidwalker', 'transcendente']);

export const clients = pgTable('clients', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    fullName: text('full_name').notNull(),
    phone: text('phone'),
    cpf: text('cpf'),
    photoUrl: text('photo_url'),
    role: roleEnum('role').notNull().default('client'),
    membershipTier: membershipTierEnum('membership_tier').default('standard'),
    birthDate: text('birth_date'), // ISO string or Date
    addressNeighborhood: text('address_neighborhood'),
    addressCity: text('address_city'),
    profession: text('profession'),
    leadSource: text('lead_source'),
    notes: text('notes'),
    npsScore: integer('nps_score'),
    lastSurveyDate: timestamp('last_survey_date'),
    xp: integer('xp').notNull().default(0),
    level: voidLevelEnum('level').notNull().default('iniciado'),
    totalSpent: integer('total_spent').notNull().default(0),
    totalSessions: integer('total_sessions').notNull().default(0),
    firstVisit: timestamp('first_visit'),
    lastVisit: timestamp('last_visit'),
    preferences: jsonb('preferences').$type<{
        temperature?: number;
        lighting?: boolean;
        claustrophobiaNotes?: string;
        physicalPainNotes?: string;
    }>().default({}),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),

    // Arrays stored as JSONB for simplicity in MVP, could be separate tables
    visitHistory: jsonb('visit_history').$type<Date[]>(),
    purchaseHistory: jsonb('purchase_history').$type<any[]>(),
    interactionHistory: jsonb('interaction_history').$type<any[]>(),
    usageTags: jsonb('usage_tags').$type<string[]>(),
    preferredWeekDays: jsonb('preferred_week_days').$type<string[]>(),

    // Future utilization data
    sessionsFloat: integer('sessions_float').notNull().default(0),
    sessionsMassage: integer('sessions_massage').notNull().default(0),
    sessionsCombo: integer('sessions_combo').notNull().default(0),
    lifeCycleStage: text('life_cycle_stage').notNull().default('new'), // new, active, drifting, churned, loyal, vip
});

export const appointmentStatusEnum = pgEnum('appointment_status', ['pending', 'confirmed', 'completed', 'cancelled', 'no_show']);

export const appointments = pgTable('appointments', {
    id: text('id').primaryKey(),
    clientId: text('client_id').notNull().references(() => clients.id),
    serviceId: text('service_id').notNull(),
    locationId: text('location_id'),
    tankId: text('tank_id'),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time').notNull(),
    status: appointmentStatusEnum('status').notNull().default('pending'),
    notes: text('notes'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
