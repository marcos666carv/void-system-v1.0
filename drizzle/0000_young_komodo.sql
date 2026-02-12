CREATE TYPE "public"."appointment_status" AS ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show');--> statement-breakpoint
CREATE TYPE "public"."membership_tier" AS ENUM('standard', 'void_club', 'vip');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('client', 'admin', 'staff');--> statement-breakpoint
CREATE TYPE "public"."void_level" AS ENUM('iniciado', 'explorador', 'habilidoso', 'especialista', 'mestre', 'voidwalker', 'transcendente');--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"service_id" text NOT NULL,
	"location_id" text,
	"tank_id" text,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"status" "appointment_status" DEFAULT 'pending' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"full_name" text NOT NULL,
	"phone" text,
	"cpf" text,
	"photo_url" text,
	"role" "role" DEFAULT 'client' NOT NULL,
	"membership_tier" "membership_tier" DEFAULT 'standard',
	"birth_date" text,
	"address_neighborhood" text,
	"address_city" text,
	"profession" text,
	"lead_source" text,
	"notes" text,
	"nps_score" integer,
	"last_survey_date" timestamp,
	"xp" integer DEFAULT 0 NOT NULL,
	"level" "void_level" DEFAULT 'iniciado' NOT NULL,
	"total_spent" integer DEFAULT 0 NOT NULL,
	"total_sessions" integer DEFAULT 0 NOT NULL,
	"first_visit" timestamp,
	"last_visit" timestamp,
	"preferences" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"visit_history" jsonb,
	"purchase_history" jsonb,
	"interaction_history" jsonb,
	"usage_tags" jsonb,
	"preferred_week_days" jsonb,
	CONSTRAINT "clients_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;