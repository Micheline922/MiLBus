
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PastryExpense } from '@/lib/data';
import { useEffect, useState } from 'react';

type PastryExpensesTableProps = {
  expenses: PastryExpense[];
};

export default function PastryExpensesTable({ expenses }: PastryExpensesTableProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Détail des Dépenses - Pâtisseries</CardTitle>
        <CardDescription>Suivi des coûts des ingrédients et autres dépenses.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Article de Dépense</TableHead>
              <TableHead>Coût (FC)</TableHead>
              <TableHead>Catégorie de Pâtisserie</TableHead>
              <TableHead>Date d'Achat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.item}</TableCell>
                <TableCell>{expense.cost.toFixed(2)} FC</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{isClient ? new Date(expense.purchaseDate).toLocaleDateString() : ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
