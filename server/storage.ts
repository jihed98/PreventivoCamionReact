import { db } from './db';
import { 
  users, quotes, truckParams, taxSettings,
  type User, type InsertUser, 
  type InsertQuote, type Quote,
  type InsertTruckParams, type TruckParams,
  type InsertTaxSettings, type TaxSettings
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Quote methods
  getQuotes(userId?: number): Promise<Quote[]>;
  getQuoteById(id: number): Promise<Quote | undefined>;
  createQuote(quote: InsertQuote): Promise<Quote>;
  updateQuoteStatus(id: number, status: string): Promise<boolean>;
  
  // Truck parameters methods
  getTruckParams(userId: number): Promise<TruckParams | undefined>;
  saveTruckParams(params: InsertTruckParams): Promise<TruckParams>;
  
  // Tax settings methods
  getTaxSettings(userId: number): Promise<TaxSettings | undefined>;
  saveTaxSettings(settings: InsertTaxSettings): Promise<TaxSettings>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Quote methods
  async getQuotes(userId?: number): Promise<Quote[]> {
    if (userId) {
      return await db
        .select()
        .from(quotes)
        .where(eq(quotes.userId, userId))
        .orderBy(desc(quotes.created));
    }
    return await db
      .select()
      .from(quotes)
      .orderBy(desc(quotes.created));
  }
  
  async getQuoteById(id: number): Promise<Quote | undefined> {
    const [quote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, id));
    return quote || undefined;
  }
  
  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const [quote] = await db
      .insert(quotes)
      .values(insertQuote)
      .returning();
    return quote;
  }
  
  async updateQuoteStatus(id: number, status: string): Promise<boolean> {
    const result = await db
      .update(quotes)
      .set({ status })
      .where(eq(quotes.id, id))
      .returning({ id: quotes.id });
    
    return result.length > 0;
  }
  
  // Truck parameters methods
  async getTruckParams(userId: number): Promise<TruckParams | undefined> {
    const [params] = await db
      .select()
      .from(truckParams)
      .where(eq(truckParams.userId, userId));
    return params || undefined;
  }
  
  async saveTruckParams(params: InsertTruckParams): Promise<TruckParams> {
    // Check if params already exist for this user
    const existingParams = await this.getTruckParams(params.userId!);
    
    if (existingParams) {
      // Update existing params
      const [updatedParams] = await db
        .update(truckParams)
        .set({
          ...params,
          updated: new Date()
        })
        .where(eq(truckParams.id, existingParams.id))
        .returning();
      return updatedParams;
    } else {
      // Create new params
      const [newParams] = await db
        .insert(truckParams)
        .values(params)
        .returning();
      return newParams;
    }
  }
  
  // Tax settings methods
  async getTaxSettings(userId: number): Promise<TaxSettings | undefined> {
    const [settings] = await db
      .select()
      .from(taxSettings)
      .where(eq(taxSettings.userId, userId));
    return settings || undefined;
  }
  
  async saveTaxSettings(settings: InsertTaxSettings): Promise<TaxSettings> {
    // Check if settings already exist for this user
    const existingSettings = await this.getTaxSettings(settings.userId!);
    
    if (existingSettings) {
      // Update existing settings
      const [updatedSettings] = await db
        .update(taxSettings)
        .set({
          ...settings,
          updated: new Date()
        })
        .where(eq(taxSettings.id, existingSettings.id))
        .returning();
      return updatedSettings;
    } else {
      // Create new settings
      const [newSettings] = await db
        .insert(taxSettings)
        .values(settings)
        .returning();
      return newSettings;
    }
  }
}

// Utilizziamo la classe con database invece di quella in memoria
export const storage = new DatabaseStorage();
