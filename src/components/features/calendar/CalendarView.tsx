import React from 'react';
import { Card, Button } from '@/components/ui';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import type { AppointmentProps } from '@/domain/entities/Appointment';
import { cn } from '@/lib/utils/cn';

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
    appointments: (AppointmentProps & { clientName?: string })[];
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
        <Card padding="none" className="overflow-hidden border border-gray-200 shadow-sm relative z-0">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-gray-500" />
                    {startOfWeek.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                    <Button onClick={() => onNavigate('prev')} intent="secondary" size="sm" leftIcon={<ChevronLeft size={16} />}>
                        Anterior
                    </Button>
                    <Button onClick={() => onNavigate('today')} intent="secondary" size="sm">
                        Hoje
                    </Button>
                    <Button onClick={() => onNavigate('next')} intent="secondary" size="sm" rightIcon={<ChevronRight size={16} />}>
                        Próxima
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-[60px_repeat(7,1fr)] bg-gray-200 gap-[1px] text-sm">
                {/* Header Row */}
                <div className="bg-gray-50"></div>
                {weekDays.map(day => {
                    const isToday = new Date().toDateString() === day.toDateString();
                    return (
                        <div key={day.toISOString()} className={cn(
                            "p-3 text-center font-medium bg-gray-50 flex flex-col items-center justify-center border-b border-gray-200",
                            isToday && "bg-brand-50"
                        )}>
                            <span className={cn("text-xs uppercase tracking-wider", isToday ? "text-brand-700 font-bold" : "text-gray-500")}>
                                {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
                            </span>
                            <span className={cn("text-lg leading-none mt-1", isToday ? "text-brand-700 font-bold" : "text-gray-900")}>
                                {day.getDate()}
                            </span>
                        </div>
                    );
                })}

                {/* Time Slots */}
                {hours.map(hour => (
                    <React.Fragment key={hour}>
                        {/* Time Label */}
                        <div className="bg-white p-2 text-right text-xs text-gray-400 font-medium relative -top-3">
                            {hour}:00
                        </div>

                        {/* Days Columns */}
                        {weekDays.map(day => {
                            const isOpen = isOperating(day, hour);
                            const appt = getAppointmentInSlot(day, hour);
                            const block = getBlockInSlot(day, hour);
                            const slotDate = new Date(day);
                            slotDate.setHours(hour);

                            let cellClass = "bg-white hover:bg-gray-50 cursor-pointer relative transition-colors h-16 border-gray-100";

                            if (!isOpen) {
                                cellClass = "bg-gray-50/50 cursor-not-allowed pattern-dots pattern-gray-200 pattern-bg-transparent pattern-size-2 pattern-opacity-20";
                            }

                            if (appt || block) {
                                cellClass = "bg-white cursor-pointer p-1";
                            }

                            return (
                                <div
                                    key={`${day.toISOString()}-${hour}`}
                                    onClick={() => {
                                        if (appt && onAppointmentClick) onAppointmentClick(appt);
                                        else if (block && onBlockClick) onBlockClick(block);
                                        else if (isOpen && !appt && !block) onSlotClick(slotDate);
                                    }}
                                    className={cellClass}
                                >
                                    {block && (
                                        <div className="w-full h-full rounded bg-error-50 border-l-4 border-error-500 p-1 flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-error-700 uppercase tracking-wider truncate px-1">
                                                Bloqueado
                                            </span>
                                        </div>
                                    )}
                                    {appt && (
                                        <div className={cn(
                                            "w-full h-full rounded border-l-4 p-1.5 shadow-sm text-xs overflow-hidden flex flex-col",
                                            appt.status === 'confirmed'
                                                ? "bg-success-50 border-success-500 text-success-800"
                                                : "bg-brand-50 border-brand-500 text-brand-800"
                                        )}>
                                            <strong className="truncate font-semibold">{appt.clientName || 'Cliente'}</strong>
                                            <span className="truncate opacity-80">{appt.serviceId}</span>
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
