'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button, Input, Badge } from '@/components/ui';
import {
    Waves,
    Sparkles,
    Zap,
    Gift,
    Edit2,
    Trash2,
    Plus,
    Search,
    Tag,
    Layers,
    X,
    Crown
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Toaster, toast } from 'sonner';

interface Variation {
    id?: string;
    name: string;
    description?: string;
    price: number;
    promoPrice?: number;
    sessions?: number;
}

interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    promoPrice?: number;
    promoLabel?: string;
    promoType?: string;
    promoStartDate?: string;
    promoEndDate?: string;
    category: string;
    durationMinutes?: number;
    active: boolean;
    variations?: Variation[];
}

export default function ServicesPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [search, setSearch] = useState('');

    // Form State
    const [form, setForm] = useState({
        name: '',
        price: '',
        category: 'floatation',
        durationMinutes: '',
        promoPrice: '',
        promoLabel: '',
        promoType: 'manual',
        promoStartDate: '',
        promoEndDate: '',
        active: true
    });

    const [variations, setVariations] = useState<Variation[]>([]);

    const fetchProducts = useCallback(async () => {
        try {
            const res = await fetch('/api/products?page=1&limit=50');
            const data = await res.json();
            setProducts(data.data || []);
        } catch (error) {
            console.error("Failed to fetch products", error);
            toast.error("Falha ao carregar serviços");
        }
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const resetForm = () => {
        setForm({
            name: '', price: '', category: 'floatation', durationMinutes: '',
            promoPrice: '', promoLabel: '', promoType: 'manual',
            promoStartDate: '', promoEndDate: '', active: true
        });
        setVariations([]);
        setEditingProduct(null);
        setShowForm(false);
    };

    const openEdit = (p: Product) => {
        setEditingProduct(p);
        setForm({
            name: p.name,
            price: String(p.price),
            category: p.category,
            durationMinutes: p.durationMinutes ? String(p.durationMinutes) : '',
            promoPrice: p.promoPrice ? String(p.promoPrice) : '',
            promoLabel: p.promoLabel || '',
            promoType: p.promoType || 'manual',
            promoStartDate: p.promoStartDate ? p.promoStartDate.slice(0, 10) : '',
            promoEndDate: p.promoEndDate ? p.promoEndDate.slice(0, 10) : '',
            active: p.active
        });
        setVariations(p.variations || []);
        setShowForm(true);
    };

    // Variation Handlers
    const addVariation = () => {
        setVariations([...variations, { name: '', price: 0, sessions: 1 }]);
    };

    const updateVariation = (index: number, field: keyof Variation, value: any) => {
        const newVariations = [...variations];
        newVariations[index] = { ...newVariations[index], [field]: value };
        setVariations(newVariations);
    };

    const removeVariation = (index: number) => {
        setVariations(variations.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name: form.name,
            price: Number(form.price),
            category: form.category,
            durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : undefined,
            promoPrice: form.promoPrice ? Number(form.promoPrice) : undefined,
            promoLabel: form.promoLabel || undefined,
            promoType: form.promoType || undefined,
            promoStartDate: form.promoStartDate ? new Date(form.promoStartDate).toISOString() : undefined,
            promoEndDate: form.promoEndDate ? new Date(form.promoEndDate).toISOString() : undefined,
            active: form.active,
            variations: variations.length > 0 ? variations : undefined
        };

        try {
            if (editingProduct) {
                await fetch(`/api/products/${editingProduct.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                toast.success("Serviço atualizado com sucesso");
            } else {
                await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                toast.success("Serviço criado com sucesso");
            }
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error("Failed to save product", error);
            toast.error("Erro ao salvar serviço");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja remover este serviço?')) return;
        try {
            await fetch(`/api/products/${id}`, { method: 'DELETE' });
            toast.success("Serviço removido");
            fetchProducts();
        } catch (error) {
            toast.error("Erro ao remover serviço");
        }
    };

    const getIcon = (category: string) => {
        switch (category) {
            case 'floatation': return <Waves size={20} />;
            case 'massage': return <Sparkles size={20} />;
            case 'combo': return <Zap size={20} />;
            case 'gift_card': return <Gift size={20} />;
            case 'void_club': return <Crown size={20} />;
            default: return <Tag size={20} />;
        }
    };

    const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-display-sm font-semibold text-fg-primary tracking-tight font-display">catálogo de serviços</h1>
                    <p className="text-sm text-fg-tertiary mt-1">gerencie preços, variações e metadados</p>
                </div>
                <Button intent="primary" size="sm" onClick={() => { resetForm(); setShowForm(true); }}>
                    <Plus className="mr-2 size-4" /> novo serviço
                </Button>
            </div>

            {/* Form Modal (Inline) */}
            {showForm && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <Card className="bg-surface border-border-secondary">
                        <div className="flex justify-between mb-6">
                            <h3 className="text-lg font-semibold text-fg-primary flex items-center gap-2 font-display">
                                {editingProduct ? <Edit2 size={18} /> : <Plus size={18} />}
                                {editingProduct ? 'editar serviço' : 'novo serviço'}
                            </h3>
                            <Button intent="secondary" size="sm" onClick={resetForm}><X size={18} /></Button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Info */}
                            <div className="col-span-1 md:col-span-2 grid grid-cols-[2fr_1fr] gap-4">
                                <div>
                                    <Input
                                        label="nome do serviço"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        required
                                        placeholder="ex: flutuação avulsa"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-fg-secondary mb-1.5 block">categoria</label>
                                    <select
                                        value={form.category}
                                        onChange={e => setForm({ ...form, category: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-border-primary bg-bg-primary text-fg-primary text-sm h-[38px] focus:ring-2 focus:ring-focus-ring outline-none"
                                    >
                                        <option value="floatation">flutuação</option>
                                        <option value="massage">massagem</option>
                                        <option value="combo">combo</option>
                                        <option value="gift_card">vale presente</option>
                                        <option value="void_club">void club</option>
                                        <option value="merchandise">produto</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <Input
                                    label="preço base (r$)"
                                    type="number"
                                    value={form.price}
                                    onChange={e => setForm({ ...form, price: e.target.value })}
                                    required
                                    placeholder="0.00"
                                    helperText="se houver variações, este é o preço 'a partir de'"
                                />
                            </div>

                            <div>
                                <Input
                                    label="duração (min)"
                                    type="number"
                                    value={form.durationMinutes}
                                    onChange={e => setForm({ ...form, durationMinutes: e.target.value })}
                                    placeholder="opcional"
                                />
                            </div>

                            {/* Variations Section */}
                            <div className="col-span-1 md:col-span-2 border-t border-border-secondary pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <Layers size={16} className="text-fg-tertiary" />
                                        <span className="text-sm font-semibold text-fg-primary">variações</span>
                                    </div>
                                    <Button type="button" intent="secondary" size="sm" onClick={addVariation}>
                                        <Plus className="mr-1 size-3.5" /> adicionar variação
                                    </Button>
                                </div>

                                {variations.length === 0 && (
                                    <p className="text-sm text-fg-quaternary italic">nenhuma variação configurada. será usado o preço base.</p>
                                )}

                                <div className="grid gap-3">
                                    {variations.map((v, idx) => (
                                        <div key={idx} className="grid grid-cols-[1.5fr_2fr_1fr_0.8fr_1fr_auto] gap-2 items-end p-3 bg-bg-secondary rounded-lg border border-border-secondary">
                                            <Input label="nome" value={v.name} onChange={e => updateVariation(idx, 'name', e.target.value)} placeholder="ex: 3 sessões" />
                                            <Input label="descrição" value={v.description || ''} onChange={e => updateVariation(idx, 'description', e.target.value)} placeholder="detalhes" />
                                            <Input label="preço" type="number" value={String(v.price ?? '')} onChange={val => updateVariation(idx, 'price', Number(val))} />
                                            <Input label="sessões" type="number" value={String(v.sessions ?? '')} onChange={val => updateVariation(idx, 'sessions', Number(val))} placeholder="1" />
                                            <Input label="promo" type="number" value={String(v.promoPrice ?? '')} onChange={val => updateVariation(idx, 'promoPrice', val ? Number(val) : undefined)} placeholder="opcional" />
                                            <Button type="button" intent="tertiary" size="sm" onClick={() => removeVariation(idx)} className="text-fg-error-primary hover:text-fg-error-primary_hover h-8 w-8 p-0">
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Promo Config */}
                            <div className="col-span-1 md:col-span-2 border-t border-border-secondary pt-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Tag size={16} className="text-fg-tertiary" />
                                    <span className="text-sm font-semibold text-fg-primary">promoção geral</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <Input label="etiqueta" value={form.promoLabel} onChange={e => setForm({ ...form, promoLabel: e.target.value })} placeholder="ex: 20% OFF" />
                                    <Input label="início" type="date" value={form.promoStartDate} onChange={e => setForm({ ...form, promoStartDate: e.target.value })} />
                                    <Input label="fim" type="date" value={form.promoEndDate} onChange={e => setForm({ ...form, promoEndDate: e.target.value })} />
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2 flex gap-3 justify-end mt-4">
                                <Button intent="secondary" size="md" type="button" onClick={resetForm}>cancelar</Button>
                                <Button intent="primary" size="md" type="submit">{editingProduct ? 'salvar alterações' : 'criar serviço'}</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {/* Search Filter */}
            <div className="max-w-[400px]">
                <Input
                    placeholder="buscar serviço..."
                    leftIcon={<Search size={16} />}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="bg-bg-primary"
                />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(p => (
                    <Card
                        key={p.id}
                        padding="none"
                        className={cn(
                            "flex flex-col h-full min-h-[200px] relative transition-all duration-200 group border-border-secondary hover:border-border-brand hover:shadow-md",
                            !p.active && "opacity-60 border-dashed"
                        )}
                    >
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className={cn(
                                    "p-2.5 rounded-lg border shadow-xs",
                                    "bg-bg-primary text-fg-primary border-border-secondary"
                                )}>
                                    {getIcon(p.category)}
                                </div>
                                {p.variations && p.variations.length > 0 && (
                                    <Badge size="sm" intent="gray" className="rounded-full">
                                        {p.variations.length} variações
                                    </Badge>
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-fg-primary font-display leading-tight">{p.name.toLowerCase()}</h3>
                                <p className="text-xs font-semibold text-fg-quaternary uppercase tracking-wider mt-1">{p.category.replace('_', ' ')}</p>
                            </div>

                            <div className="mt-auto pt-4">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-fg-primary font-display">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                                    </span>
                                    {p.variations && p.variations.length > 0 && <span className="text-xs text-fg-tertiary">a partir de</span>}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-border-secondary px-4 py-3 flex justify-between bg-bg-secondary/50">
                            <Button intent="secondary" size="sm" onClick={() => openEdit(p)} className="h-8 text-xs">
                                <Edit2 className="mr-1.5 size-3.5" /> editar
                            </Button>
                            <Button intent="tertiary" size="sm" onClick={() => handleDelete(p.id)} className="h-8 text-xs text-fg-error-primary hover:text-fg-error-primary_hover">
                                <Trash2 className="mr-1.5 size-3.5" /> remover
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
