
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Customer } from "@/lib/data";
import { PlusCircle, MessageSquare, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from '@/hooks/use-auth';
import { loadData, saveData } from '@/lib/storage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import EditCustomersForm from "@/components/dashboard/edit-customers-form";

export default function CustomersPage() {
  const { username } = useAuth();
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (username) {
      const data = loadData(username);
      setCustomers(data.customers);
    }
  }, [username]);

  const handleCustomersSubmit = (values: { customers: Customer[] }) => {
    if (!username) return;
    setCustomers(values.customers);
    saveData(username, 'customers', values.customers);
    setDialogOpen(false);
  };

  if (!customers) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Gérez votre base de données clients.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un client
        </Button>
      </div>

       <Card className="relative group">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Pencil className="mr-2 h-4 w-4" /> Modifier
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Modifier la Liste des Clients</DialogTitle>
                <DialogDescription>
                  Mettez à jour les informations de vos clients.
                </DialogDescription>
              </DialogHeader>
              <EditCustomersForm initialValues={{ customers }} onSubmit={handleCustomersSubmit} />
            </DialogContent>
          </Dialog>
        <CardHeader>
          <CardTitle>Liste des Clients</CardTitle>
          <CardDescription>
            Informations et historique d'achats de vos clients.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Achats</TableHead>
                <TableHead>Dernier Achat</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.contact}</TableCell>
                  <TableCell>{customer.purchaseHistory}</TableCell>
                  <TableCell>{isClient ? new Date(customer.lastPurchase).toLocaleDateString() : ''}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MessageSquare className="h-4 w-4" />
                      <span className="sr-only">Contacter</span>
                    </Button>
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
