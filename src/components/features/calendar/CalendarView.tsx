import React from 'react';
import { Card } from '@/components/ui';
import type { AppointmentProps } from '@/domain/entities/Appointment';

export interface CalendarBlockedSlot {
    id: string;
    startTime: string | Date;
    endTime: string | Date;
    reason: string;
}

export interface CalendarOperatingHours {
    dayOfWeek: number;
    openTime: string; // HH:mm
    closeTime: string; // HH:mm
    active: boolean;
}

interface CalendarViewProps {
    appointments: AppointmentProps[];
    blockedSlots?: CalendarBlockedSlot[];
    operatingHours?: CalendarOperatingHours[];
    currentDate: Date;
    onNavigate: (direction: 'prev' | 'next' | 'today') => void;
    onSlotClick: (date: Date) => void;
    onAppointmentClick?: (appointment: AppointmentProps) => void;
    onBlockClick?: (block: CalendarBlockedSlot) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
    appointments,
    blockedSlots = [],
    operatingHours = [],
    currentDate,
    onNavigate,
    onSlotClick,
    onAppointmentClick,
    onBlockClick
}) => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(d.getDate() + i);
        return d;
    });

    const hours = Array.from({ length: 13 }, (_, i) => i + 9);

    const isOperating = (date: Date, hour: number) => {
        if (!operatingHours.length) return true; // Default open if no hours defined
        const dayConfig = operatingHours.find(h => h.dayOfWeek === date.getDay());
        if (!dayConfig || !dayConfig.active) return false;

        const [openH] = dayConfig.openTime.split(':').map(Number);
        const [closeH] = dayConfig.closeTime.split(':').map(Number);
        return hour >= openH && hour < closeH;
    };

    const getAppointmentInSlot = (date: Date, hour: number) => {
        return appointments.find(appt => {
            const apptDate = new Date(appt.startTime);
            return apptDate.getDate() === date.getDate() &&
                apptDate.getMonth() === date.getMonth() &&
                apptDate.getFullYear() === date.getFullYear() &&
                apptDate.getHours() === hour;
        });
    };

    const getBlockInSlot = (date: Date, hour: number) => {
        return blockedSlots.find(block => {
            const blockStart = new Date(block.startTime);
            const blockEnd = new Date(block.endTime);
            const slotStart = new Date(date);
            slotStart.setHours(hour);
            // Simple overlap check for the hour slot
            return slotStart >= blockStart && slotStart < blockEnd;
        });
    };

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                    {startOfWeek.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => onNavigate('prev')} style={{ padding: '0.5rem', cursor: 'pointer', background: 'transparent', border: '1px solid #333', color: 'white', borderRadius: '4px' }}>&lt;</button>
                    <button onClick={() => onNavigate('today')} style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: 'transparent', border: '1px solid #333', color: 'white', borderRadius: '4px' }}>hoje</button>
                    <button onClick={() => onNavigate('next')} style={{ padding: '0.5rem', cursor: 'pointer', background: 'transparent', border: '1px solid #333', color: 'white', borderRadius: '4px' }}>&gt;</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '50px repeat(7, 1fr)', gap: '1px', background: '#333', border: '1px solid #333' }}>
                <div style={{ background: '#08283B' }}></div>
                {weekDays.map(day => (
                    <div key={day.toISOString()} style={{ padding: '0.5rem', textAlign: 'center', background: '#08283B', fontWeight: 600 }}>
                        {day.toLocaleDateString('pt-BR', { weekday: 'short' })} <br />
                        <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>{day.getDate()}</span>
                    </div>
                ))}

                {hours.map(hour => (
                    <React.Fragment key={hour}>
                        <div style={{ padding: '0.5rem', textAlign: 'right', fontSize: '0.75rem', opacity: 0.6, background: '#051a26', borderTop: '1px solid #1a1a1a' }}>
                            {hour}:00
                        </div>
                        {weekDays.map(day => {
                            const isOpen = isOperating(day, hour);
                            const appt = getAppointmentInSlot(day, hour);
                            const block = getBlockInSlot(day, hour);
                            const slotDate = new Date(day);
                            slotDate.setHours(hour);

                            let background = isOpen ? '#051a26' : 'rgba(0,0,0,0.5)';
                            let cursor = isOpen ? 'pointer' : 'default';

                            if (appt) cursor = 'pointer';
                            if (block) cursor = 'pointer';

                            return (
                                <div
                                    key={`${day.toISOString()}-${hour}`}
                                    onClick={() => {
                                        if (appt && onAppointmentClick) onAppointmentClick(appt);
                                        else if (block && onBlockClick) onBlockClick(block);
                                        else if (isOpen && !appt && !block) onSlotClick(slotDate);
                                    }}
                                    style={{
                                        background,
                                        borderTop: '1px solid #1a1a1a',
                                        borderLeft: '1px solid #1a1a1a',
                                        minHeight: '60px',
                                        cursor,
                                        position: 'relative',
                                        transition: 'background 0.2s',
                                        opacity: isOpen ? 1 : 0.5
                                    }}
                                    onMouseEnter={(e) => !appt && !block && isOpen && (e.currentTarget.style.background = '#0a2e42')}
                                    onMouseLeave={(e) => !appt && !block && isOpen && (e.currentTarget.style.background = background)}
                                >
                                    {block && (
                                        <div style={{
                                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                            background: 'repeating-linear-gradient(45deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.1) 10px, rgba(239, 68, 68, 0.2) 10px, rgba(239, 68, 68, 0.2) 20px)',
                                            display: 'grid', placeItems: 'center',
                                            fontSize: '0.65rem', fontWeight: 800, color: 'var(--void-blaze-orange)', textTransform: 'uppercase', letterSpacing: '0.05em'
                                        }}>
                                            Bloqueado
                                        </div>
                                    )}
                                    {appt && (
                                        <div style={{
                                            position: 'absolute', top: 2, left: 2, right: 2, bottom: 2,
                                            background: appt.status === 'confirmed' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(204, 176, 240, 0.2)',
                                            borderLeft: `3px solid ${appt.status === 'confirmed' ? '#4ade80' : '#CCB0F0'}`,
                                            padding: '4px', fontSize: '0.75rem', overflow: 'hidden', color: 'white', zIndex: 2
                                        }}>
                                            <strong>{appt.serviceId}</strong>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </Card>
    );
};
