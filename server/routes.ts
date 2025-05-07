import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertQuoteSchema } from "../shared/schema";

// Middleware per validare l'ID
const validateIdParam = (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID non valido" });
  }
  req.params.id = id.toString();
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API per i preventivi
  
  // Ottieni tutti i preventivi
  app.get("/api/quotes", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const quotes = await storage.getQuotes(userId);
      res.json(quotes);
    } catch (error) {
      console.error("Errore nel recupero dei preventivi:", error);
      res.status(500).json({ error: "Errore nel recupero dei preventivi" });
    }
  });
  
  // Ottieni un preventivo specifico
  app.get("/api/quotes/:id", validateIdParam, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const quote = await storage.getQuoteById(id);
      
      if (!quote) {
        return res.status(404).json({ error: "Preventivo non trovato" });
      }
      
      res.json(quote);
    } catch (error) {
      console.error("Errore nel recupero del preventivo:", error);
      res.status(500).json({ error: "Errore nel recupero del preventivo" });
    }
  });
  
  // Crea un nuovo preventivo
  app.post("/api/quotes", async (req: Request, res: Response) => {
    try {
      // Validazione dei dati
      const validationResult = insertQuoteSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Dati del preventivo non validi",
          details: validationResult.error.errors 
        });
      }
      
      const newQuote = await storage.createQuote(validationResult.data);
      res.status(201).json(newQuote);
    } catch (error) {
      console.error("Errore durante la creazione del preventivo:", error);
      res.status(500).json({ error: "Errore durante la creazione del preventivo" });
    }
  });
  
  // Aggiorna lo stato di un preventivo
  app.patch("/api/quotes/:id/status", validateIdParam, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      // Validazione dello stato
      const statusSchema = z.object({
        status: z.enum(["pending", "confirmed", "rejected"])
      });
      
      const validationResult = statusSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Stato non valido",
          details: validationResult.error.errors
        });
      }
      
      const success = await storage.updateQuoteStatus(id, validationResult.data.status);
      
      if (!success) {
        return res.status(404).json({ error: "Preventivo non trovato" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Errore durante l'aggiornamento dello stato:", error);
      res.status(500).json({ error: "Errore durante l'aggiornamento dello stato" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
