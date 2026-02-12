import { InMemoryClientRepository } from '@/infrastructure/database/repositories/InMemoryClientRepository';
import { InMemoryAppointmentRepository } from '@/infrastructure/database/repositories/InMemoryAppointmentRepository';
import { InMemorySaleRepository } from '@/infrastructure/database/repositories/InMemorySaleRepository';
import { InMemorySurveyRepository } from '@/infrastructure/database/repositories/InMemorySurveyRepository';
import { InMemoryProductRepository } from '@/infrastructure/database/repositories/InMemoryProductRepository';
import { InMemoryLocationRepository } from '@/infrastructure/database/repositories/InMemoryLocationRepository';
import { InMemoryTankRepository } from '@/infrastructure/database/repositories/InMemoryTankRepository';
import { InMemoryMaintenanceLogRepository } from '@/infrastructure/database/repositories/InMemoryMaintenanceLogRepository';
import { InMemoryBlockedSlotRepository } from '@/infrastructure/database/repositories/InMemoryBlockedSlotRepository';
import { InMemoryOperatingHoursRepository } from '@/infrastructure/database/repositories/InMemoryOperatingHoursRepository';

import { ListClients } from '@/application/use-cases/clients/ListClients';
import { GetClientById } from '@/application/use-cases/clients/GetClientById';
import { CreateClient } from '@/application/use-cases/clients/CreateClient';
import { ListAppointments } from '@/application/use-cases/appointments/ListAppointments';
import { CreateAppointment } from '@/application/use-cases/appointments/CreateAppointment';
import { ListSalesWithDetails } from '@/application/use-cases/sales/ListSalesWithDetails';
import { CreateSale } from '@/application/use-cases/sales/CreateSale';
import { GetDashboardMetrics } from '@/application/use-cases/dashboard/GetDashboardMetrics';
import { ListProducts } from '@/application/use-cases/products/ListProducts';
import { CreateProduct } from '@/application/use-cases/products/CreateProduct';
import { UpdateProduct } from '@/application/use-cases/products/UpdateProduct';
import { DeleteProduct } from '@/application/use-cases/products/DeleteProduct';
import { ListLocations, CreateLocation, UpdateLocation, DeleteLocation } from '@/application/use-cases/locations/LocationUseCases';
import { ListTanks, CreateTank, UpdateTank, GetTankById, CreateMaintenanceLog, ListMaintenanceLogs } from '@/application/use-cases/tanks/TankUseCases';
import { ListBlockedSlots, CreateBlockedSlot, DeleteBlockedSlot, GetOperatingHours, UpsertOperatingHours, RescheduleAppointment } from '@/application/use-cases/calendar/CalendarUseCases';

import { DrizzleClientRepository } from '@/infrastructure/database/repositories/DrizzleClientRepository';

import { DrizzleAppointmentRepository } from '@/infrastructure/database/repositories/DrizzleAppointmentRepository';

// Repositories (swap to Drizzle implementations in Phase 2)
const clientRepo = new DrizzleClientRepository();
// const clientRepo = new InMemoryClientRepository(); // Kept for reference or fallback
const appointmentRepo = new DrizzleAppointmentRepository();
const saleRepo = new InMemorySaleRepository();
const productRepo = new InMemoryProductRepository();
const surveyRepo = new InMemorySurveyRepository();
const locationRepo = new InMemoryLocationRepository();
const tankRepo = new InMemoryTankRepository();
const maintenanceLogRepo = new InMemoryMaintenanceLogRepository();
const blockedSlotRepo = new InMemoryBlockedSlotRepository();
const operatingHoursRepo = new InMemoryOperatingHoursRepository();

// Use cases — wired with repositories via constructor injection

// Clients
export const listClients = new ListClients(clientRepo);
export const getClientById = new GetClientById(clientRepo, appointmentRepo, saleRepo, surveyRepo);
export const createClient = new CreateClient(clientRepo);

// Appointments
export const listAppointments = new ListAppointments(appointmentRepo);
export const createAppointment = new CreateAppointment(appointmentRepo, clientRepo);
export const rescheduleAppointment = new RescheduleAppointment(appointmentRepo);

// Sales
export const listSalesWithDetails = new ListSalesWithDetails(saleRepo);
export const createSale = new CreateSale(saleRepo, productRepo);

// Products
export const listProducts = new ListProducts(productRepo);
export const createProduct = new CreateProduct(productRepo);
export const updateProduct = new UpdateProduct(productRepo);
export const deleteProduct = new DeleteProduct(productRepo);

// Locations
export const listLocations = new ListLocations(locationRepo);
export const createLocation = new CreateLocation(locationRepo);
export const updateLocation = new UpdateLocation(locationRepo);
export const deleteLocation = new DeleteLocation(locationRepo);

// Tanks
// Tanks
export const listTanks = new ListTanks(tankRepo);
export const createTank = new CreateTank(tankRepo);
export const updateTank = new UpdateTank(tankRepo);
export const getTankById = new GetTankById(tankRepo);
export const createMaintenanceLog = new CreateMaintenanceLog(maintenanceLogRepo);
export const listMaintenanceLogs = new ListMaintenanceLogs(maintenanceLogRepo);

// Calendar
export const listBlockedSlots = new ListBlockedSlots(blockedSlotRepo);
export const createBlockedSlot = new CreateBlockedSlot(blockedSlotRepo);
export const deleteBlockedSlot = new DeleteBlockedSlot(blockedSlotRepo);
export const getOperatingHours = new GetOperatingHours(operatingHoursRepo);
export const upsertOperatingHours = new UpsertOperatingHours(operatingHoursRepo);

// Dashboard
export const getDashboardMetrics = new GetDashboardMetrics(clientRepo, appointmentRepo, saleRepo, surveyRepo);
