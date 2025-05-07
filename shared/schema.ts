import { pgTable, text, serial, integer, boolean, json, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Original user schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Truck parameters table
export const truckParams = pgTable("truck_params", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  brand: text("brand"),
  model: text("model"),
  year: integer("year"),
  licensePlate: text("license_plate"),
  capacity: real("capacity"),
  value: real("value").notNull(),
  amortizationYears: integer("amortization_years").notNull(),
  insurance: real("insurance").notNull(),
  roadTax: real("road_tax").notNull(),
  inspection: real("inspection").notNull(),
  tachograph: real("tachograph").notNull(),
  fuelCost: real("fuel_cost").notNull(),
  tiresCost: real("tires_cost").notNull(),
  tollCost: real("toll_cost").notNull(),
  foodLodgingCost: real("food_lodging_cost").notNull(),
  loadUnloadCost: real("load_unload_cost").notNull(),
  maintenanceCost: real("maintenance_cost").notNull(),
  created: timestamp("created").defaultNow(),
  updated: timestamp("updated").defaultNow(),
});

export const insertTruckParamsSchema = createInsertSchema(truckParams).omit({
  id: true,
  created: true,
  updated: true,
});

// Tax settings table
export const taxSettings = pgTable("tax_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  regime: text("regime").notNull(), // "forfettario" or "ordinario"
  irpef: real("irpef").notNull(),
  regionalTax: real("regional_tax").notNull(),
  municipalTax: real("municipal_tax").notNull(),
  inps: real("inps").notNull(),
  vat: real("vat").notNull(),
  applyVatByDefault: boolean("apply_vat_by_default").notNull(),
  vatNote: text("vat_note"),
  created: timestamp("created").defaultNow(),
  updated: timestamp("updated").defaultNow(),
});

export const insertTaxSettingsSchema = createInsertSchema(taxSettings).omit({
  id: true,
  created: true,
  updated: true,
});

// Quotes table
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  distance: real("distance").notNull(),
  hours: real("hours").notNull(),
  roadType: text("road_type").notNull(),
  loadUnloadHours: real("load_unload_hours").notNull(),
  hasVat: boolean("has_vat").notNull(),
  costs: json("costs").notNull(), // Fixed and variable costs
  totalCost: real("total_cost").notNull(),
  margin: real("margin").notNull(),
  marginRate: real("margin_rate").notNull(),
  subtotal: real("subtotal").notNull(),
  vatAmount: real("vat_amount"),
  finalPrice: real("final_price").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, rejected
  created: timestamp("created").defaultNow(),
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  created: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTruckParams = z.infer<typeof insertTruckParamsSchema>;
export type TruckParams = typeof truckParams.$inferSelect;

export type InsertTaxSettings = z.infer<typeof insertTaxSettingsSchema>;
export type TaxSettings = typeof taxSettings.$inferSelect;

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;
