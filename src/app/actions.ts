
'use server';

import { analyzeSalesDataForRestock, AnalyzeSalesDataForRestockOutput } from '@/ai/flows/analyze-sales-data-for-restock';
import { getSalesTrendInsights, GetSalesTrendInsightsOutput } from '@/ai/flows/get-sales-trend-insights';
import { getWeeklySalesSummary, GetWeeklySalesSummaryOutput } from '@/ai/flows/get-weekly-sales-summary';
import { menuSuggester, MenuSuggesterOutput } from '@/ai/flows/menu-suggester-flow';
import { CartItem } from '@/hooks/use-cart';
import { initialData, Order, Sale } from '@/lib/data';
import { loadData, saveData } from '@/lib/storage';

type AiInsightResult = {
    data?: AnalyzeSalesDataForRestockOutput;
    error?: string;
}

export async function getAiSalesInsights(salesData: string): Promise<AiInsightResult> {
  if (!salesData.trim()) {
    return { error: 'Veuillez fournir des données de ventes à analyser.' };
  }
  try {
    const insights = await analyzeSalesDataForRestock({ salesData });
    return { data: insights };
  } catch (e) {
    console.error('AI Insight Error:', e);
    return { error: 'Une erreur est survenue lors de l\'analyse des données.' };
  }
}

type WeeklySummaryResult = {
  data?: GetWeeklySalesSummaryOutput;
  error?: string;
}

export async function getWeeklyAiSummary(salesData: string): Promise<WeeklySummaryResult> {
    if (!salesData.trim()) {
        return { error: 'Veuillez fournir des données de ventes à analyser.' };
    }
  try {
    const summary = await getWeeklySalesSummary({ salesData });
    return { data: summary };
  } catch (e) {
    console.error('Weekly AI Summary Error:', e);
    return { error: 'Une erreur est survenue lors de la génération du résumé hebdomadaire.' };
  }
}

type MenuSuggestionResult = {
    data?: MenuSuggesterOutput;
    error?: string;
}

export async function getMenuSuggestion(prompt: string): Promise<MenuSuggestionResult> {
    try {
        const suggestion = await menuSuggester({ prompt });
        return { data: suggestion };
    } catch (e) {
        console.error('Menu Suggestion Error:', e);
        return { error: 'An error occurred while generating a suggestion.' };
    }
}

type SalesTrendResult = {
    data?: GetSalesTrendInsightsOutput;
    error?: string;
}

export async function getMonthlySalesAnalysis(salesData: string): Promise<SalesTrendResult> {
    if (!salesData.trim()) {
        return { error: 'Veuillez fournir des données de ventes à analyser.' };
    }
    try {
        const result = await getSalesTrendInsights({ salesData });
        return { data: result };
    } catch (e) {
        console.error('Sales Trend Error:', e);
        return { error: 'Une erreur est survenue lors de l\'analyse des tendances de ventes.' };
    }
}

type CreateOrderResult = {
    success: boolean;
    error?: string;
};

export async function createOrderFromCart(
    username: string, 
    cartItems: CartItem[],
    customerInfo: { name: string; phone: string; email: string; }
): Promise<CreateOrderResult> {
    if (!username || !cartItems.length || !customerInfo.name || !customerInfo.phone || !customerInfo.email) {
        return { success: false, error: 'Informations de commande incomplètes.' };
    }

    try {
        const appData = loadData(username);

        const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const newOrder: Order = {
            id: `o${appData.orders.length + 1}_${Date.now()}`,
            customerName: customerInfo.name,
            customerPhone: customerInfo.phone,
            customerEmail: customerInfo.email,
            products: cartItems.flatMap(item => Array(item.quantity).fill(item.name)),
            totalAmount: totalAmount,
            paidAmount: 0,
            remainingAmount: totalAmount,
            status: 'En attente',
            date: new Date().toISOString().split('T')[0],
        };

        const updatedOrders = [...appData.orders, newOrder];
        
        // Also add to sales for tracking
        const newSales: Sale[] = cartItems.map(item => ({
            id: `s_cart_${Date.now()}_${item.id}`,
            productName: item.name,
            customerName: customerInfo.name,
            date: new Date().toISOString().split('T')[0],
            amount: item.price * item.quantity,
            quantity: item.quantity,
        }));
        
        const updatedSales = [...appData.sales, ...newSales];

        saveData(username, 'orders', updatedOrders);
        saveData(username, 'sales', updatedSales);

        return { success: true };
    } catch (e) {
        console.error('Error creating order from cart:', e);
        return { success: false, error: "Impossible de créer la commande." };
    }
}
