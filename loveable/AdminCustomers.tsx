import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CustomerCard } from '@/components/CustomerCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Customer, VoidLevel, VOID_LEVELS } from '@/types/void';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import { useVoid } from '@/contexts/VoidContext';

// Mock customers data with extended info
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@email.com',
    phone: '(41) 99999-1111',
    cpf: '123.456.789-00',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    xp: 4500,
    level: 'habitue',
    totalSpent: 2850,
    firstVisit: new Date('2024-01-15'),
    lastVisit: new Date('2025-01-20'),
    totalSessions: 18,
    preferredCommunication: 'whatsapp',
    acquisitionSource: 'instagram',
    preferences: { temperature: 35.5, lighting: 'fade', claustrophobiaNotes: '', physicalPainNotes: '' },
    bookings: [],
    suggestedActions: [
      { id: 'a1', type: 'upsell', title: 'Oferecer pacote 10x', description: 'Cliente frequente', priority: 'medium' },
    ],
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao@email.com',
    phone: '(41) 99999-2222',
    cpf: '987.654.321-00',
    xp: 850,
    level: 'iniciado',
    totalSpent: 380,
    firstVisit: new Date('2024-12-01'),
    lastVisit: new Date('2025-01-10'),
    totalSessions: 2,
    preferredCommunication: 'email',
    acquisitionSource: 'busca',
    preferences: { temperature: 35.0, lighting: 'off', claustrophobiaNotes: 'Leve', physicalPainNotes: '' },
    bookings: [],
    suggestedActions: [
      { id: 'a2', type: 'reminder', title: 'Lembrete 30 dias', description: 'Não retornou ainda', priority: 'high' },
    ],
  },
  {
    id: '3',
    name: 'Ana Oliveira',
    email: 'ana@email.com',
    phone: '(41) 99999-3333',
    cpf: '456.789.123-00',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    xp: 7200,
    level: 'mestre',
    totalSpent: 6800,
    firstVisit: new Date('2023-06-20'),
    lastVisit: new Date('2025-01-25'),
    totalSessions: 42,
    preferredCommunication: 'whatsapp',
    acquisitionSource: 'indicacao',
    preferences: { temperature: 35.8, lighting: 'fade', claustrophobiaNotes: '', physicalPainNotes: 'Dor lombar' },
    bookings: [],
    suggestedActions: [
      { id: 'a3', type: 'referral', title: 'Programa de indicação', description: 'Alta influência', priority: 'medium' },
    ],
  },
  {
    id: '4',
    name: 'Carlos Mendes',
    email: 'carlos@email.com',
    phone: '(41) 99999-4444',
    cpf: '789.123.456-00',
    xp: 2100,
    level: 'explorador',
    totalSpent: 1140,
    firstVisit: new Date('2024-08-10'),
    lastVisit: new Date('2024-12-15'),
    totalSessions: 6,
    preferredCommunication: 'phone',
    acquisitionSource: 'facebook',
    preferences: { temperature: 35.5, lighting: 'on', claustrophobiaNotes: '', physicalPainNotes: '' },
    bookings: [],
    suggestedActions: [
      { id: 'a4', type: 'winback', title: 'Reengajar cliente', description: 'Inativo há 40 dias', priority: 'high' },
    ],
  },
  {
    id: '5',
    name: 'Fernanda Costa',
    email: 'fernanda@email.com',
    phone: '(41) 99999-5555',
    cpf: '321.654.987-00',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    xp: 12500,
    level: 'voidwalker',
    totalSpent: 15200,
    firstVisit: new Date('2022-03-01'),
    lastVisit: new Date('2025-01-28'),
    totalSessions: 95,
    preferredCommunication: 'whatsapp',
    acquisitionSource: 'evento',
    preferences: { temperature: 36.0, lighting: 'fade', claustrophobiaNotes: '', physicalPainNotes: '' },
    bookings: [],
    suggestedActions: [
      { id: 'a5', type: 'birthday', title: 'Aniversário em 5 dias', description: 'Preparar surpresa VIP', priority: 'high' },
    ],
  },
  {
    id: '6',
    name: 'Pedro Almeida',
    email: 'pedro@email.com',
    phone: '(41) 99999-6666',
    cpf: '654.987.321-00',
    xp: 450,
    level: 'iniciado',
    totalSpent: 190,
    firstVisit: new Date('2025-01-05'),
    lastVisit: new Date('2025-01-05'),
    totalSessions: 1,
    preferredCommunication: 'whatsapp',
    acquisitionSource: 'indicacao',
    preferences: { temperature: 35.5, lighting: 'fade', claustrophobiaNotes: '', physicalPainNotes: '' },
    bookings: [],
    suggestedActions: [
      { id: 'a6', type: 'reminder', title: 'Primeira flutuação', description: 'Acompanhar experiência', priority: 'high' },
    ],
  },
];

export default function AdminCustomers() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { tanks } = useVoid();
  
  const levelFromUrl = searchParams.get('level') as VoidLevel | null;
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<VoidLevel | 'all'>(levelFromUrl || 'all');

  useEffect(() => {
    if (levelFromUrl) {
      setLevelFilter(levelFromUrl);
    }
  }, [levelFromUrl]);

  // Get clients currently in session from tanks
  const clientsInSession = tanks
    .filter(t => t.status === 'busy' && t.currentClient)
    .map(t => t.currentClient!.id);

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === 'all' || customer.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const handleAction = (customerId: string, actionType: string) => {
    console.log('Action:', actionType, 'for customer:', customerId);
  };

  const selectedLevelInfo = levelFilter !== 'all' ? VOID_LEVELS[levelFilter] : null;

  return (
    <div className="p-6 space-y-6">
      {/* Header with back button when filtered */}
      <div className="flex items-center gap-4">
        {levelFromUrl && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/lifecycle')}
            className="hover:bg-secondary/50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
            {selectedLevelInfo && (
              <div 
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: `${selectedLevelInfo.color}20`,
                  color: selectedLevelInfo.color
                }}
              >
                {selectedLevelInfo.name}
              </div>
            )}
          </div>
          <p className="text-muted-foreground">
            {levelFromUrl 
              ? `${filteredCustomers.length} clientes no nível ${selectedLevelInfo?.name}`
              : 'Pipeline de vendas e perfil do cliente'
            }
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={levelFilter} onValueChange={(v) => setLevelFilter(v as VoidLevel | 'all')}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por nível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os níveis</SelectItem>
            {Object.entries(VOID_LEVELS).map(([key, level]) => (
              <SelectItem key={key} value={key}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: level.color }}
                  />
                  {level.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Customer Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <CustomerCard 
            key={customer.id} 
            customer={customer}
            onAction={handleAction}
            isInSession={clientsInSession.includes(customer.id)}
          />
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Nenhum cliente encontrado
        </div>
      )}
    </div>
  );
}
