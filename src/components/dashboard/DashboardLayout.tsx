import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Menu } from "lucide-react";
import BarcodeInput from "./BarcodeInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import AdminDashboard from "./AdminDashboard";
import PrintRegistration, { PrintData } from "./PrintRegistration";
import InventoryTable from "./InventoryTable";
import StatsPanel from "./StatsPanel";
import { useToast } from "@/components/ui/use-toast";

interface DashboardLayoutProps {
  userRole?: "admin" | "operator" | "viewer";
}

interface PrintInventory extends PrintData {
  id: string;
  status: "in_process" | "completed" | "pending";
  entryTimestamp?: Date;
  exitTimestamp?: Date;
  operator: string;
}

interface BatchPrint {
  code: string;
  prints: Array<{
    code: string;
    quantity: number;
  }>;
}

export default function DashboardLayout({
  userRole = "admin",
}: DashboardLayoutProps) {
  const { toast } = useToast();
  const [showRegistration, setShowRegistration] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [prints, setPrints] = useState<PrintData[]>([]);
  const [inventory, setInventory] = useState<PrintInventory[]>([]);
  const [batchPrints, setBatchPrints] = useState<BatchPrint[]>([
    {
      code: "LOTE001",
      prints: [
        { code: "EST001", quantity: 2 },
        { code: "EST002", quantity: 3 },
      ],
    },
    {
      code: "LOTE002",
      prints: [
        { code: "EST003", quantity: 1 },
        { code: "EST004", quantity: 4 },
      ],
    },
  ]);
  const [users, setUsers] = useState<
    Array<{
      id: string;
      username: string;
      role: "admin" | "operator" | "viewer";
      lastLogin?: Date;
    }>
  >([]);

  const handlePrintRegistration = (data: PrintData) => {
    if (prints.some((p) => p.code === data.code)) {
      toast({
        title: "Erro",
        description: "Já existe uma estampa cadastrada com este código!",
        variant: "destructive",
      });
      return;
    }

    setPrints((prev) => [...prev, data]);
    setInventory((prev) => [
      ...prev,
      {
        ...data,
        id: Date.now().toString(),
        status: data.status || "pending",
        entryTimestamp: new Date(),
        operator: "Sistema",
      },
    ]);
    setShowRegistration(false);
    toast({
      title: "Estampa cadastrada",
      description: `A estampa ${data.name} foi cadastrada com ${data.quantity} unidades!`,
    });
  };

  const handleBarcodeSubmit = (batchCode: string) => {
    const batch = batchPrints.find((b) => b.code === batchCode);

    if (!batch) {
      toast({
        title: "Erro",
        description: "Lote não encontrado!",
        variant: "destructive",
      });
      return;
    }

    let allPrintsValid = true;
    let errorMessage = "";

    // Validate all prints in the batch
    for (const printData of batch.prints) {
      const print = prints.find((p) => p.code === printData.code);
      if (!print) {
        allPrintsValid = false;
        errorMessage = `Estampa ${printData.code} não encontrada!`;
        break;
      }

      const item = inventory.find(
        (i) => i.code === printData.code && i.status === "in_process",
      );

      if (!item) {
        allPrintsValid = false;
        errorMessage = `Não há estampas em processo com o código ${printData.code}!`;
        break;
      }

      if (printData.quantity > item.quantity) {
        allPrintsValid = false;
        errorMessage = `Quantidade maior que o disponível para ${printData.code} (${item.quantity})!`;
        break;
      }
    }

    if (!allPrintsValid) {
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    // Process all prints in the batch
    batch.prints.forEach((printData) => {
      const item = inventory.find(
        (i) => i.code === printData.code && i.status === "in_process",
      );

      if (!item) return; // Should never happen due to validation above

      if (printData.quantity === item.quantity) {
        setInventory((prev) =>
          prev.map((record) =>
            record.id === item.id
              ? {
                  ...record,
                  status: "completed",
                  exitTimestamp: new Date(),
                }
              : record,
          ),
        );
      } else {
        setInventory((prev) => [
          {
            ...item,
            id: Date.now().toString(),
            status: "completed",
            exitTimestamp: new Date(),
            quantity: printData.quantity,
          },
          ...prev.map((record) =>
            record.id === item.id
              ? { ...record, quantity: record.quantity - printData.quantity }
              : record,
          ),
        ]);
      }
    });

    toast({
      title: "Saídas registradas",
      description: `${batch.prints.length} estampas do lote ${batchCode} foram registradas!`,
    });
  };

  const handleUpdateStatus = (
    id: string,
    newStatus: PrintInventory["status"],
  ) => {
    setInventory((prev) =>
      prev.map((record) =>
        record.id === id
          ? {
              ...record,
              status: newStatus,
              exitTimestamp:
                newStatus === "completed" ? new Date() : record.exitTimestamp,
            }
          : record,
      ),
    );
    toast({
      title: "Status atualizado",
      description: "O status da estampa foi atualizado com sucesso!",
    });
  };

  const stats = {
    inProcessItems: inventory
      .filter((r) => r.status === "in_process")
      .reduce((acc, curr) => acc + curr.quantity, 0),
    completedItems: inventory
      .filter((r) => r.status === "completed")
      .reduce((acc, curr) => acc + curr.quantity, 0),
    totalItems: inventory.reduce((acc, curr) => acc + curr.quantity, 0),
  };

  const handleAddUser = (userData: {
    username: string;
    role: "admin" | "operator" | "viewer";
  }) => {
    setUsers((prev) => [
      ...prev,
      { ...userData, id: Date.now().toString(), lastLogin: new Date() },
    ]);
    toast({
      title: "Usuário adicionado",
      description: `O usuário ${userData.username} foi adicionado com sucesso!`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
    toast({
      title: "Usuário removido",
      description: "O usuário foi removido com sucesso!",
    });
  };

  const existingCodes = prints.map((p) => p.code);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900 ml-2">
                Print Shop Control
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {userRole === "admin" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAdminDashboard(true)}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Dialog open={showAdminDashboard} onOpenChange={setShowAdminDashboard}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Painel Administrativo</DialogTitle>
          </DialogHeader>
          <AdminDashboard
            users={users}
            stats={stats}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
          />
        </DialogContent>
      </Dialog>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {userRole === "admin" && (
            <section className="flex justify-center">
              <Button
                onClick={() => setShowRegistration(true)}
                className="w-full max-w-[600px]"
              >
                Cadastrar Nova Estampa
              </Button>
            </section>
          )}

          <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
            <DialogContent className="max-w-[600px]">
              <PrintRegistration
                onSubmit={handlePrintRegistration}
                existingCodes={existingCodes}
              />
            </DialogContent>
          </Dialog>

          {(userRole === "admin" || userRole === "operator") && (
            <section className="flex justify-center">
              <BarcodeInput onSubmit={handleBarcodeSubmit} isLoading={false} />
            </section>
          )}

          <section>
            <StatsPanel {...stats} />
          </section>

          <section>
            <InventoryTable
              records={inventory}
              onUpdateStatus={handleUpdateStatus}
              userRole={userRole}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
