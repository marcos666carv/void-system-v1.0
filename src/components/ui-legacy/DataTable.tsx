'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
import s from './DataTable.module.css';

interface Column<T> {
    key: keyof T | string;
    header: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    pageSize?: number;
    onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id: string | number }>({ data, columns, pageSize = 10, onRowClick }: DataTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = useMemo(() => {
        if (!sortConfig) return data;
        return [...data].sort((a: any, b: any) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return sortedData.slice(startIndex, startIndex + pageSize);
    }, [sortedData, currentPage, pageSize]);

    const totalPages = Math.ceil(data.length / pageSize);

    return (
        <div className={s.container}>
            <div className={s.tableWrapper}>
                <table className={s.table}>
                    <thead>
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className={s.th}
                                    onClick={() => col.sortable && handleSort(col.key as string)}
                                    style={{ cursor: col.sortable ? 'pointer' : 'default' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {col.header}
                                        {sortConfig?.key === col.key && (
                                            sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((item) => (
                            <tr
                                key={item.id}
                                className={s.tr}
                                onClick={() => onRowClick && onRowClick(item)}
                                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                            >
                                {columns.map((col, index) => (
                                    <td key={index} className={s.td}>
                                        {col.render ? col.render(item) : (item as any)[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className={s.td} style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                                    <span style={{ opacity: 0.5 }}>nenhum dado encontrado</span>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/** Pagination Controls */}
            {totalPages > 1 && (
                <div className={s.pagination}>
                    <span className={s.pageInfo}>
                        página {currentPage} de {totalPages}
                    </span>
                    <div className={s.controls}>
                        <button
                            className={s.pageButton}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={14} />
                        </button>
                        <button
                            className={s.pageButton}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
