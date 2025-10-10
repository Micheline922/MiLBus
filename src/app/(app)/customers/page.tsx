
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Customer } from "@/lib/data";
import { PlusCircle, Pencil, Mail } from "lucide-react";
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
import AddCustomerForm from "@/components/dashboard/add-customer-form";
import { useToast } from "@/hooks/use-toast";

export default function CustomersPage() {
  const { username } = useAuth();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (username) {
      const data = loadData(username);
      setCustomers(data.customers);
    }
  }, [username]);
  
  const handleSaveData = (key: 'customers', value: Customer[]) => {
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

  const handleCustomersSubmit = (values: { customers: Customer[] }) => {
    if (handleSaveData('customers', values.customers)) {
        setCustomers(values.customers);
        setEditDialogOpen(false);
    }
  };
  
  const handleAddCustomer = (newCustomer: Omit<Customer, 'id'>) => {
    if (!username || !customers) return;
    const newId = `c${customers.length + 1}_${Date.now()}`;
    const customerToAdd: Customer = { ...newCustomer, id: newId };
    const updatedCustomers = [...customers, customerToAdd];
    
    if (handleSaveData('customers', updatedCustomers)) {
      setCustomers(updatedCustomers);
      setAddDialogOpen(false);
      toast({
          title: "Client ajouté !",
          description: `${newCustomer.name} a été ajouté à votre liste de clients.`,
      });
    }
  };

  const handleContactByEmail = (customer: Customer) => {
     if (!customer.contact.includes('@')) {
      toast({
        variant: "destructive",
        title: "E-mail invalide",
        description: "Ce contact ne semble pas être une adresse e-mail valide.",
      });
      return;
    }
    const subject = `Message pour ${customer.name}`;
    window.location.href = `mailto:${customer.contact}?subject=${encodeURIComponent(subject)}`;
  }

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
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un client
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajouter un nouveau client</DialogTitle>
                    <DialogDescription>
                        Remplissez les informations ci-dessous.
                    </DialogDescription>
                </DialogHeader>
                <AddCustomerForm onSubmit={handleAddCustomer} />
            </DialogContent>
        </Dialog>
      </div>

       <Card className="relative group">
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Pencil className="mr-2 h-4 w-4" /> Modifier la liste
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
                <TableHead className="text-right">Actions</TableHead>
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
                    <Button variant="outline" size="sm" onClick={() => handleContactByEmail(customer)} disabled={!customer.contact.includes('@')}>
                        <Mail className="mr-2 h-4 w-4" />
                        Contacter
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
