import { User, Appointment, Product, Sale } from './schema';

// Generate dates relative to today
const today = new Date();
const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
const twoDaysAgo = new Date(today); twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const threeDaysAgo = new Date(today); threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

// Mock Data
const users: User[] = [
    {
        id: '1',
        email: 'admin@void.com',
        full_name: 'Admin User',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
    },
    // Imported Clients
    {
        id: '2',
        full_name: 'Vitor Cassaniga',
        email: 'cassaniga.vitor@gmail.com',
        role: 'client',
        cpf: '08557750927',
        birth_date: '1995-01-23',
        phone: '+55 41 99910-2045',
        address_neighborhood: 'Água Verde',
        address_city: 'Curitiba',
        profession: 'Engenheiro',
        lead_source: 'Instagram',
        nps_score: 10,
        last_survey_date: yesterday,
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '3',
        full_name: 'Ana clara',
        email: 'ana.fkuchla@gmail.com',
        role: 'client',
        cpf: '08037285901',
        birth_date: '2006-01-16',
        phone: '+55 42 98434-5830',
        address_neighborhood: 'Água Verde',
        address_city: 'curitiba',
        profession: 'Administrador',
        lead_source: 'Instagram',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '4',
        full_name: 'Paola da costa',
        email: 'paola.radiologia1@gmail.com',
        role: 'client',
        cpf: '088.875.479-55',
        birth_date: '1995-05-04',
        phone: '+55 41 99579-8525',
        address_neighborhood: 'Vista Alegre',
        address_city: 'Curitiba',
        profession: 'Médico',
        lead_source: 'Indicação',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '5',
        full_name: 'Geovanna Gaede',
        email: 'geovannagaede@yahoo.com.br',
        role: 'client',
        cpf: '041.954.259-05',
        birth_date: '1985-12-31',
        phone: '41 999933-5600',
        address_neighborhood: 'Água Verde',
        address_city: 'Curitiba',
        profession: 'Advogado',
        lead_source: 'Indicação',
        nps_score: 9,
        last_survey_date: threeDaysAgo,
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '6',
        full_name: 'William Rompapas',
        email: 'williampaps2@gmail.com',
        role: 'client',
        cpf: '061.476.259-69',
        birth_date: '1986-09-08',
        phone: '+55 41 99967-1996',
        address_neighborhood: '',
        address_city: 'Brasília',
        profession: 'Advogado',
        lead_source: 'Indicação',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '7',
        full_name: 'Ariadne Seixas',
        email: 'ariadnevinha@hotmail.com',
        role: 'client',
        cpf: '06403401998',
        birth_date: '1992-08-23',
        phone: '+55 41 99966-3750',
        address_neighborhood: 'Água Verde',
        address_city: 'Curitiba',
        profession: 'Advogado',
        lead_source: 'Indicação',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '8',
        full_name: 'Nicolle Lissa',
        email: 'nicollelissa@gmail.com',
        role: 'client',
        cpf: '09345784942',
        birth_date: '1995-11-07',
        phone: '+55 41 99707-4544',
        address_neighborhood: 'Água Verde',
        address_city: 'Curitiba',
        profession: 'Médico',
        lead_source: 'Indicação',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '9',
        full_name: 'Mariana Stie',
        email: 'marianasonza@gmail.com',
        role: 'client',
        cpf: '05587988961',
        birth_date: '1985-10-19',
        phone: '+55 41 99911-2535',
        address_neighborhood: 'Centro Cívico',
        address_city: 'Curitiba',
        profession: 'Advogado',
        lead_source: 'Indicação',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '10',
        full_name: 'Denise Maria',
        email: 'denisesilvaa1910@gmail.com',
        role: 'client',
        cpf: '90195051149',
        birth_date: '1981-10-19',
        phone: '+55 65 98150-8780',
        address_city: '',
        profession: 'Consultor',
        lead_source: 'Instagram',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '11',
        full_name: 'Karoline Fur',
        email: 'karolfp@gmail.com',
        role: 'client',
        cpf: '04511367990',
        birth_date: '1989-10-25',
        phone: '+55 41 99287-2510',
        address_neighborhood: 'Batel',
        address_city: 'Curitiba',
        profession: 'Médico',
        lead_source: 'Indicação',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '12',
        full_name: 'Luiz Fernan',
        email: 'luizftferreira@gmail.com',
        role: 'client',
        cpf: '04414238927',
        birth_date: '1992-01-07',
        phone: '+55 41 99921-6104',
        address_neighborhood: 'Batel',
        address_city: 'Curitiba',
        profession: 'Médico',
        lead_source: 'Indicação',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '13',
        full_name: 'Roberta de S',
        email: 'robertadeoliveira@yahoo.com.br',
        role: 'client',
        cpf: '02954096900',
        birth_date: '1980-12-21',
        phone: '+55 41 99615-5027',
        address_city: 'Pinhais',
        profession: 'Dentista',
        lead_source: 'Instagram',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '14',
        full_name: 'Jocelia Figue',
        email: 'jopresidente@hotmail.com',
        role: 'client',
        cpf: '61011010968',
        birth_date: '1967-03-11',
        phone: '+55 41 98418-0900',
        address_neighborhood: 'Seminário',
        address_city: 'Curitiba',
        profession: 'Biomédico',
        lead_source: 'outro',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '15',
        full_name: 'Thomas Aug',
        email: 'tab.thomas@gmail.com',
        role: 'client',
        cpf: '09802148903',
        birth_date: '1994-01-14',
        phone: '+55 41 98863-0761',
        address_neighborhood: 'Bacacheri',
        address_city: 'Curitiba',
        profession: 'Marketing',
        lead_source: 'Instagram',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '16',
        full_name: 'Bruna de Ma',
        email: 'brunamattos221@gmail.com',
        role: 'client',
        cpf: '11859349951',
        birth_date: '2000-12-21',
        phone: '+55 41 99265-2824',
        address_neighborhood: 'Água Verde',
        address_city: 'Curitiba',
        profession: 'Advogado',
        lead_source: 'Indicação',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '17',
        full_name: 'Fabiano Ueh',
        email: 'fabianoguskuma@gmail.com',
        role: 'client',
        cpf: '370051938-90',
        birth_date: '1989-05-04',
        phone: '+55 41 99181-8796',
        address_neighborhood: 'Juvevê',
        address_city: 'Curitiba',
        profession: 'Dentista',
        lead_source: 'Instagram',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '18',
        full_name: 'Juliana Carn',
        email: 'julianaavirgolino@gmail.com',
        role: 'client',
        cpf: '06003194901',
        birth_date: '1997-10-28',
        phone: '+55 41 99809-6558',
        address_neighborhood: 'Centro',
        address_city: 'Curitiba',
        profession: 'Psicólogo',
        lead_source: 'Indicação',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '19',
        full_name: 'Felipe Degas',
        email: 'Felipe.aranega@gmail.com',
        role: 'client',
        cpf: '05305239907',
        birth_date: '1985-04-16',
        phone: '+55 41 98404-4510',
        address_neighborhood: 'Água Verde',
        address_city: 'Curitiba',
        profession: 'Designer Gráfico',
        lead_source: 'Indicação',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '20',
        full_name: 'Sarah Engel',
        email: 'srhengelf@gmail.com',
        role: 'client',
        cpf: '09200082912',
        birth_date: '1995-11-24',
        phone: '+55 47 98863-4270',
        address_neighborhood: 'Mercês',
        address_city: 'Curitiba',
        profession: 'Mídias Sociais',
        lead_source: 'Indicação',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '21',
        full_name: 'Juliana Wies',
        email: 'jwiestel@gmail.com',
        role: 'client',
        cpf: '05898330909',
        birth_date: '1986-03-12',
        phone: '+55 41 99221-1184',
        address_neighborhood: 'Bigorrilho',
        address_city: 'Curitiba',
        profession: 'Médico',
        lead_source: 'Indicação',
        created_at: new Date(),
        updated_at: new Date()
    }
];

const products: Product[] = [
    { id: 'prod_explorer', name: 'Plano Explorer', price: 199, category: 'merchandise', active: true, created_at: new Date(), updated_at: new Date() },
    { id: 'prod_voyager', name: 'Plano Voyager', price: 349, category: 'merchandise', active: true, created_at: new Date(), updated_at: new Date() },
    { id: 'prod_float', name: 'Flutuação Avulsa (60m)', price: 150, category: 'therapy', duration_minutes: 60, active: true, created_at: new Date(), updated_at: new Date() },
    { id: 'prod_gift', name: 'Gift Card', price: 150, category: 'gift_card', active: true, created_at: new Date(), updated_at: new Date() },
];



const appointments: Appointment[] = [
    {
        id: '101',
        client_id: '2', // Vitor Cassaniga
        service_id: 'float-60',
        start_time: new Date(new Date().setHours(10, 0, 0, 0)),
        end_time: new Date(new Date().setHours(11, 0, 0, 0)),
        status: 'confirmed',
        created_at: yesterday,
        updated_at: yesterday,
    },
    {
        id: '102',
        client_id: '3', // Ana clara
        service_id: 'float-90',
        start_time: new Date(tomorrow.setHours(14, 0, 0, 0)),
        end_time: new Date(tomorrow.setHours(15, 30, 0, 0)),
        status: 'confirmed',
        created_at: twoDaysAgo,
        updated_at: twoDaysAgo,
    },
    {
        id: '103',
        client_id: '4', // Paola da costa
        service_id: 'massage-60',
        start_time: new Date(today.setHours(16, 0, 0, 0)),
        end_time: new Date(today.setHours(17, 0, 0, 0)),
        status: 'pending',
        created_at: today,
        updated_at: today,
    },
    {
        id: '104',
        client_id: '5', // Geovanna Gaede
        service_id: 'float-60',
        start_time: new Date(yesterday.setHours(18, 0, 0, 0)),
        end_time: new Date(yesterday.setHours(19, 0, 0, 0)),
        status: 'completed',
        created_at: threeDaysAgo,
        updated_at: threeDaysAgo,
    },
    {
        id: '105',
        client_id: '7', // Ariadne Seixas
        service_id: 'float-60',
        start_time: new Date(tomorrow.setHours(9, 0, 0, 0)),
        end_time: new Date(tomorrow.setHours(10, 0, 0, 0)),
        status: 'confirmed',
        created_at: yesterday,
        updated_at: yesterday,
    }
];

const sales: Sale[] = [
    {
        id: 's1',
        client_id: '2', // Vitor
        items: [{ product_id: 'prod_voyager', quantity: 1, unit_price: 349 }],
        total_amount: 349,
        payment_method: 'credit_card',
        status: 'completed',
        created_at: threeDaysAgo
    },
    {
        id: 's2',
        client_id: '3', // Ana clara
        items: [{ product_id: 'prod_float', quantity: 1, unit_price: 150 }],
        total_amount: 150,
        payment_method: 'pix',
        status: 'completed',
        created_at: twoDaysAgo
    },
    {
        id: 's3',
        client_id: '5', // Geovanna
        items: [{ product_id: 'prod_gift', quantity: 2, unit_price: 150 }],
        total_amount: 300,
        payment_method: 'credit_card',
        status: 'completed',
        created_at: yesterday
    },
    {
        id: 's4',
        client_id: '8', // Nicolle Lissa
        items: [{ product_id: 'prod_explorer', quantity: 1, unit_price: 199 }],
        total_amount: 199,
        payment_method: 'debit_card',
        status: 'completed',
        created_at: today
    }
];

import { SurveyResponse } from './schema';

const surveys: SurveyResponse[] = [
    {
        id: 'surv1',
        client_id: '2', // Vitor
        appointment_id: '101',
        nps_score: 10,
        water_temp_rating: 'perfect',
        after_feeling: 'Relaxado e sem dores nas costas',
        comments: 'Experiência incrível, voltarei com certeza!',
        created_at: yesterday
    },
    {
        id: 'surv2',
        client_id: '5', // Geovanna
        appointment_id: '104',
        nps_score: 9,
        water_temp_rating: 'perfect',
        after_feeling: 'Energizada',
        created_at: threeDaysAgo
    }
];

// Mock DB Methods
export const db = {
    users: {
        findUnique: async (options: { where: { email?: string; id?: string } }) => {
            if (options.where.email) {
                return users.find(u => u.email === options.where.email) || null;
            }
            if (options.where.id) {
                return users.find(u => u.id === options.where.id) || null;
            }
            return null;
        },
        findMany: async () => users,
        create: async (data: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
            const newUser: User = {
                ...data,
                id: Math.random().toString(36).substr(2, 9),
                created_at: new Date(),
                updated_at: new Date(),
            };
            users.push(newUser);
            return newUser;
        }
    },
    appointments: {
        findMany: async () => appointments,
        create: async (data: any) => {
            const newAppt = { ...data, id: Math.random().toString(), created_at: new Date(), updated_at: new Date() };
            appointments.push(newAppt);
            return newAppt;
        }
    },
    sales: {
        findMany: async () => sales,
        // Helper to join data for UI
        findManyWithDetails: async () => {
            return sales.map(sale => {
                const client = users.find(u => u.id === sale.client_id);
                const itemsWithDetails = sale.items.map(item => {
                    const product = products.find(p => p.id === item.product_id);
                    return { ...item, product_name: product?.name || 'Unknown' };
                });
                return {
                    ...sale,
                    client_name: client?.full_name || 'Unknown Client',
                    items: itemsWithDetails
                };
            });
        }
    },
    surveys: {
        findMany: async () => surveys,
        findByClientId: async (clientId: string) => surveys.filter(s => s.client_id === clientId)
    }
};
