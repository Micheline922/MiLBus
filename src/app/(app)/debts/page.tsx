
'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Debt } from "@/lib/data";
import { MoreHorizontal, PlusCircle, Pencil } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import EditDebtsForm from "@/components/dashboard/edit-debts-form";
import { useAuth } from '@/hooks/use-auth';
import { loadData, saveData } from '@/lib/storage';
import AddDebtForm, { AddDebtFormValues } from "@/components/dashboard/add-debt-form";
import { useToast } from "@/hooks/use-toast";


export default function DebtsPage() {
  const { user, username } = useAuth();
  const { toast } = useToast();
  const [debts, setDebts] = useState<Debt[] | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  const currency = useMemo(() => (user?.currency === 'USD' ? '$' : 'FC'), [user?.currency]);

  useEffect(() => {
    setIsClient(true);
    if (username) {
      const data = loadData(username);
      setDebts(data.debts);
    }
  }, [username]);
  
  const handleSaveData = (key: 'debts', value: Debt[]) => {
    if (!username) return;
    try {
      saveData(username, key, value);
      return true;
    } catch (error) {
      if (error instanceof Error && error.message.includes('quota')) {
        toast({
          variant: 'destructive',
          title: 'Erreur de Sauvegarde',
          description: "Le stockage local est plein. Impossible de sauvegarder les modifications.",
          duration: 5000,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: "Une erreur est survenue lors de la sauvegarde.",
          duration: 5000,
        });
        console.error(error);
      }
      return false;
    }
  };

  const handleDebtsSubmit = (values: { debts: Debt[] }) => {
    if (handleSaveData('debts', values.debts)) {
        setDebts(values.debts);
        setEditDialogOpen(false);
    }
  };
  
  const handleAddDebt = (values: AddDebtFormValues) => {
    if (!username || !debts) return;

    const newDebt: Debt = {
      id: `d${debts.length + 1}_${Date.now()}`,
      ...values,
    };

    const updatedDebts = [...debts, newDebt];
    if (handleSaveData('debts', updatedDebts)) {
      setDebts(updatedDebts);
      setAddDialogOpen(false);
      toast({
        title: "Dette ajoutée !",
        description: `La dette de ${newDebt.debtorName} a été enregistrée.`,
      });
    }
  };

  if (!debts) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Dettes</h1>
          <p className="text-muted-foreground">Suivez les dettes de vos clients.</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une dette
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajouter une nouvelle dette</DialogTitle>
                    <DialogDescription>
                        Remplissez les informations ci-dessous.
                    </DialogDescription>
                </DialogHeader>
                <AddDebtForm onSubmit={handleAddDebt} />
            </DialogContent>
        </Dialog>
      </div>

      <Card className="relative group">
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <Pencil className="mr-2 h-4 w-4" /> Modifier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Modifier les Dettes</DialogTitle>
              <DialogDescription>
                Mettez à jour les détails des dettes de vos clients.
              </DialogDescription>
            </DialogHeader>
            <EditDebtsForm initialValues={{ debts }} onSubmit={handleDebtsSubmit} />
          </DialogContent>
        </Dialog>
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
                  <TableCell>{debt.amount.toFixed(2)} {currency}</TableCell>
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
