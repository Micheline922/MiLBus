
'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { debts } from "@/lib/data";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function DebtsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Dettes</h1>
          <p className="text-muted-foreground">Suivez les dettes de vos clients.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une dette
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Dettes</CardTitle>
          <CardDescription>
            Suivi des dettes en cours et remboursées.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du débiteur</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date de la dette</TableHead>
                <TableHead>Date de paiement</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {debts.map((debt) => (
                <TableRow key={debt.id}>
                  <TableCell className="font-medium">{debt.debtorName}</TableCell>
                  <TableCell>{debt.amount.toFixed(2)} FC</TableCell>
                  <TableCell>{isClient ? new Date(debt.debtDate).toLocaleDateString() : ''}</TableCell>
                  <TableCell>{isClient ? new Date(debt.paymentDate).toLocaleDateString() : ''}</TableCell>
                  <TableCell>
                    <Badge variant={debt.status === 'Remboursée' ? 'secondary' : 'outline'}>
                      {debt.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Marquer comme remboursée</DropdownMenuItem>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuItem>Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
