
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import {
    Globe, ShoppingBag, Calendar, Users,
    Settings, Database, Server, Shield, Activity,
    ChevronRight, ArrowRight, Box, CreditCard,
    LifeBuoy, MapPin, Droplets, UserPlus, LogIn
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type SystemNodeType = 'public' | 'client' | 'admin' | 'api';

interface SystemNode {
    id: string;
    title: string;
    path: string;
    type: SystemNodeType;
    icon: React.ReactNode;
    description: string;
    features: string[];
}

// Grouped by User Flows
const flows = [
    {
        id: 'new-client',
        title: 'New Client Journey',
        description: 'From discovery to first booking.',
        nodes: ['pub-landing', 'pub-services', 'pub-book', 'pub-club']
    },
    {
        id: 'client-retention',
        title: 'Client Retention',
        description: 'Ongoing engagement and account management.',
        nodes: ['cli-dashboard', 'cli-profile']
    },
    {
        id: 'admin-operations',
        title: 'Daily Operations',
        description: 'Managing the float center floor.',
        nodes: ['adm-dashboard', 'adm-calendar', 'adm-tanks', 'adm-sales']
    },
    {
        id: 'admin-management',
        title: 'Business Management',
        description: 'High-level control and configuration.',
        nodes: ['adm-customers', 'adm-loc']
    },
    {
        id: 'technical-foundation',
        title: 'Technical Foundation',
        description: 'Underlying API and infrastructure.',
        nodes: ['api-clients', 'api-products', 'api-sales', 'api-calendar', 'api-locations']
    }
];

const systemMapData: Record<string, SystemNode> = {
    'pub-landing': {
        id: 'pub-landing',
        title: 'Landing Page',
        path: '/',
        type: 'public',
        icon: <Globe size={20} />,
        description: 'Main entry point. Showcases experience.',
        features: ['Hero Video', 'Benefits', 'Social Proof', 'Locations']
    },
    'pub-book': {
        id: 'pub-book',
        title: 'Booking Engine',
        path: '/book',
        type: 'public',
        icon: <Calendar size={20} />,
        description: 'Public scheduling interface.',
        features: ['Service Selection', 'Time Picker', 'Identity', 'Payment']
    },
    'pub-club': {
        id: 'pub-club',
        title: 'Void Club',
        path: '/club',
        type: 'public',
        icon: <Users size={20} />,
        description: 'Membership signup.',
        features: ['Plans', 'Registration', 'Benefits']
    },
    'pub-services': {
        id: 'pub-services',
        title: 'Services Catalog',
        path: '/services',
        type: 'public',
        icon: <Droplets size={20} />,
        description: 'Treatment listings.',
        features: ['Float Details', 'Massage', 'Pricing']
    },
    'cli-dashboard': {
        id: 'cli-dashboard',
        title: 'Client Dashboard',
        path: '/dashboard',
        type: 'client',
        icon: <Layout size={20} />,
        description: 'Member hub.',
        features: ['Appointments', 'Credits', 'Status']
    },
    'cli-profile': {
        id: 'cli-profile',
        title: 'Profile Settings',
        path: '/profile',
        type: 'client',
        icon: <Settings size={20} />,
        description: 'Account management.',
        features: ['Details', 'Payment Methods', 'History']
    },
    'adm-dashboard': {
        id: 'adm-dashboard',
        title: 'Admin Dashboard',
        path: '/admin',
        type: 'admin',
        icon: <Activity size={20} />,
        description: 'Command center.',
        features: ['KPIs', 'Schedule', 'Revenue']
    },
    'adm-customers': {
        id: 'adm-customers',
        title: 'CRM / Customers',
        path: '/admin/customers',
        type: 'admin',
        icon: <Users size={20} />,
        description: 'Relationship management.',
        features: ['Directory', 'Profiles', 'History']
    },
    'adm-calendar': {
        id: 'adm-calendar',
        title: 'Master Calendar',
        path: '/admin/calendar',
        type: 'admin',
        icon: <Calendar size={20} />,
        description: 'Global schedule.',
        features: ['Drag-and-Drop', 'Resources', 'Blockouts']
    },
    'adm-tanks': {
        id: 'adm-tanks',
        title: 'Tank Management',
        path: '/admin/tanks',
        type: 'admin',
        icon: <Box size={20} />,
        description: 'Hardware control.',
        features: ['Status', 'Maintenance', 'Session Controls']
    },
    'adm-sales': {
        id: 'adm-sales',
        title: 'Point of Sale',
        path: '/admin/sales/new',
        type: 'admin',
        icon: <CreditCard size={20} />,
        description: 'Manual transactions.',
        features: ['Products', 'Custom Amounts', 'Checkout']
    },
    'adm-loc': {
        id: 'adm-loc',
        title: 'Locations',
        path: '/admin/locations',
        type: 'admin',
        icon: <MapPin size={20} />,
        description: 'Site management.',
        features: ['Hours', 'Rooms', 'Address']
    },
    'api-clients': {
        id: 'api-clients',
        title: 'Clients API',
        path: '/api/clients',
        type: 'api',
        icon: <Users size={20} />,
        description: 'Customer data management.',
        features: ['GET List', 'POST Create', 'GET/PUT Details']
    },
    'api-products': {
        id: 'api-products',
        title: 'Products API',
        path: '/api/products',
        type: 'api',
        icon: <ShoppingBag size={20} />,
        description: 'Service catalog.',
        features: ['GET List', 'GET Details', 'DELETE Item']
    },
    'api-sales': {
        id: 'api-sales',
        title: 'Sales API',
        path: '/api/sales',
        type: 'api',
        icon: <CreditCard size={20} />,
        description: 'Transaction processing.',
        features: ['POST Purchase', 'Validation']
    },
    'api-calendar': {
        id: 'api-calendar',
        title: 'Calendar API',
        path: '/api/calendar',
        type: 'api',
        icon: <Calendar size={20} />,
        description: 'Scheduling logic.',
        features: ['GET Slots', 'POST Appt', 'DELETE Slot']
    },
    'api-locations': {
        id: 'api-locations',
        title: 'Locations API',
        path: '/api/locations',
        type: 'api',
        icon: <MapPin size={20} />,
        description: 'Physical sites.',
        features: ['GET List', 'DELETE Site']
    }
};

import { Layout } from 'lucide-react';

export default function SystemMapPage() {
    return (
        <div className="min-h-screen bg-void-obsidian p-8 text-white space-y-12">
            <div className="space-y-2">
                <h1 className="text-3xl font-display font-bold">System Map</h1>
                <p className="text-white/60">Interactive flow visualization of the Void System architecture.</p>
            </div>

            <div className="grid gap-12">
                {flows.map(flow => (
                    <section key={flow.id} className="relative">
                        <div className="mb-6 border-b border-white/10 pb-2">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                {flow.title}
                                <span className="text-sm font-normal text-white/40 ml-2">— {flow.description}</span>
                            </h2>
                        </div>

                        <div className="flex flex-wrap gap-6 items-start">
                            {flow.nodes.map((nodeId, index) => {
                                const node = systemMapData[nodeId];
                                if (!node) return null;

                                return (
                                    <React.Fragment key={nodeId}>
                                        <Card className="w-64 bg-surface/50 border-white/10 text-card-foreground hover:bg-surface/80 transition-colors">
                                            <CardHeader className="pb-3">
                                                <div className="flex justify-between items-start">
                                                    <div className="p-2 bg-primary/10 rounded-md text-primary mb-2">
                                                        {node.icon}
                                                    </div>
                                                    <span className={cn(
                                                        "text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full",
                                                        node.type === 'public' && "bg-blue-500/10 text-blue-400",
                                                        node.type === 'client' && "bg-purple-500/10 text-purple-400",
                                                        node.type === 'admin' && "bg-amber-500/10 text-amber-400",
                                                        node.type === 'api' && "bg-emerald-500/10 text-emerald-400",
                                                    )}>
                                                        {node.type}
                                                    </span>
                                                </div>
                                                <CardTitle className="text-base">{node.title}</CardTitle>
                                                <CardDescription className="text-xs text-secondary font-mono">{node.path}</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                                    {node.description}
                                                </p>
                                                <ul className="space-y-1">
                                                    {node.features.slice(0, 3).map((feature, i) => (
                                                        <li key={i} className="text-xs text-muted-foreground/80 flex items-center gap-1.5">
                                                            <div className="size-1 rounded-full bg-primary/50" />
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>

                                        {index < flow.nodes.length - 1 && (
                                            <div className="self-center hidden md:flex text-white/20">
                                                <ArrowRight size={24} />
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
