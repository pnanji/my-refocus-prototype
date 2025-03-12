import { Client, ClientSummary, HomeQuote, AutoQuote } from './types';
import clients from '../data/clients.json';
import clientSummaries from '../data/clientSummaries.json';
import homeQuotes from '../data/homeQuotes.json';
import autoQuotes from '../data/autoQuotes.json';

// Type assertion for imported JSON
const clientsData = clients as Client[];
const clientSummariesData = clientSummaries as ClientSummary[];
const homeQuotesData = homeQuotes as HomeQuote[];
const autoQuotesData = autoQuotes as AutoQuote[];

// Client functions
export function getClients(): Client[] {
  return clientsData;
}

export function getClientById(id: string): Client | undefined {
  console.log('getClientById - Looking for client with id:', id, 'Type:', typeof id);
  const client = clientsData.find(client => client.id === id);
  console.log('getClientById - Found client:', client);
  return client;
}

// Client Summary functions
export function getClientSummary(clientId: string): ClientSummary | undefined {
  console.log('getClientSummary - Looking for summary with clientId:', clientId);
  const summary = clientSummariesData.find(summary => summary.clientId === clientId);
  console.log('getClientSummary - Found summary:', summary ? 'Yes' : 'No');
  return summary;
}

// Home Quote functions
export function getHomeQuoteByClientId(clientId: string): HomeQuote | undefined {
  console.log('getHomeQuoteByClientId - Looking for quote with clientId:', clientId);
  console.log('Available homeQuotes clientIds:', homeQuotesData.map(q => 
    ({ id: q.id, clientId: q.clientId, type: typeof q.clientId, match: q.clientId === clientId })));
  
  // Try finding by direct equality
  let quote = homeQuotesData.find(quote => quote.clientId === clientId);
  
  if (!quote) {
    // Try finding with string conversion
    console.log('Trying with string conversion...');
    quote = homeQuotesData.find(quote => String(quote.clientId) === String(clientId));
  }
  
  console.log('getHomeQuoteByClientId - Found quote:', quote ? 'Yes' : 'No');
  return quote;
}

export function getHomeQuoteById(id: string): HomeQuote | undefined {
  return homeQuotesData.find(quote => quote.id === id);
}

// Auto Quote functions
export function getAutoQuoteByClientId(clientId: string): AutoQuote | undefined {
  console.log('getAutoQuoteByClientId - Looking for quote with clientId:', clientId);
  console.log('Available autoQuotes clientIds:', autoQuotesData.map(q => 
    ({ id: q.id, clientId: q.clientId, type: typeof q.clientId, match: q.clientId === clientId })));
  
  // Try finding by direct equality
  let quote = autoQuotesData.find(quote => quote.clientId === clientId);
  
  if (!quote) {
    // Try finding with string conversion
    console.log('Trying with string conversion...');
    quote = autoQuotesData.find(quote => String(quote.clientId) === String(clientId));
  }
  
  console.log('getAutoQuoteByClientId - Found quote:', quote ? 'Yes' : 'No');
  return quote;
}

export function getAutoQuoteById(id: string): AutoQuote | undefined {
  return autoQuotesData.find(quote => quote.id === id);
} 