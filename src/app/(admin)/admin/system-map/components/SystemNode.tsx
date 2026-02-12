import React from 'react';
import { Info } from 'lucide-react';
import s from '../SystemMap.module.css';

export interface SystemNodeProps {
    title: string;
    description: string;
    type: 'frontend' | 'app' | 'domain' | 'infra';
    icon?: React.ReactNode;
    details: {
        concept: string;
        motivation: string;
        guideline: string; // e.g. "From frontend_v2.md"
    };
}

export const SystemNode: React.FC<SystemNodeProps> = ({ title, description, type, icon, details }) => {

    const typeClass = (() => {
        switch (type) {
            case 'frontend': return s.typeFrontend;
            case 'app': return s.typeApp;
            case 'domain': return s.typeDomain;
            case 'infra': return s.typeInfra;
            default: return '';
        }
    })();

    return (
        <div className={`${s.node} ${typeClass}`}>
            <div className={s.nodeHeader}>
                <span className={s.nodeTitle}>{title}</span>
                <span className={s.nodeIcon}>{icon || <Info size={14} />}</span>
            </div>
            <p className={s.nodeDescription}>{description}</p>

            {/* Tooltip */}
            <div className={s.tooltip}>
                <span className={s.tooltipTitle}>{details.concept}</span>

                <div className={s.tooltipSection}>
                    <span className={s.tooltipLabel}>Motivação</span>
                    <p className={s.tooltipText}>{details.motivation}</p>
                </div>

                <div className={s.tooltipSection}>
                    <span className={s.tooltipLabel}>Referência</span>
                    <p className={s.tooltipText} style={{ opacity: 0.7, fontStyle: 'italic' }}>{details.guideline}</p>
                </div>
            </div>
        </div>
    );
};
