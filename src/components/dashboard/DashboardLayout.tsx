import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, Menu } from "lucide-react";
import BarcodeInput from "./BarcodeInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AdminDashboard from "./AdminDashboard";
import PrintRegistration from "./PrintRegistration";
import InventoryTable from "./InventoryTable";
import StatsPanel from "./StatsPanel";
import { PrintData } from "./PrintRegistration";
import { useToast } from "@/components/ui/use-toast";

interface DashboardLayoutProps {
  userName?: string;
  userRole?: "admin" | "operator" | "viewer";
  onLogout?: () => void;
}

interface PrintInventory extends PrintData {
  id: string;
  status: "in_process" | "completed" | "pending";
  entryTimestamp?: Date;
  exitTimestamp?: Date;
  operator: string;
  quantity: number;
}

const DashboardLayout = ({
  userName = "John Doe",
  userRole = "operator",
  onLogout = () => {},
}: DashboardLayoutProps) => {
  const { toast } = useToast();
  const [showRegistration, setShowRegistration] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [prints, setPrints] = useState<PrintData[]>([]);
  const [inventory, setInventory] = useState<PrintInventory[]>([]);
  const [users, setUsers] = useState<
    Array<{
      id: string;
      username: string;
      role: "admin" | "operator" | "viewer";
      lastLogin?: Date;
    }>
  >([]);

  const handlePrintRegistration = (data: PrintData) => {
    setPrints((prev) => [...prev, data]);
    setInventory((prev) => [
      ...prev,
      {
        ...data,
        id: Date.now().toString(),
        status: data.status || "pending",
        entryTimestamp: new Date(),
        operator: userName,
        quantity: 100, // Default quantity for new prints
      },
    ]);
    setShowRegistration(false);
    toast({
      title: "Estampa cadastrada",
      description: `A estampa ${data.name} foi cadastrada com sucesso!`,
    });
  };

  const handleBarcodeSubmit = (code: string, quantity: number) => {
    const print = prints.find((p) => p.code === code);

    if (!print) {
      toast({
        title: "Erro",
        description: "Estampa não encontrada!",
        variant: "destructive",
      });
      return;
    }

    const item = inventory.find(
      (i) => i.code === code && i.status === "in_process",
    );

    if (!item) {
      toast({
        title: "Erro",
        description: "Não há estampas em processo com este código!",
        variant: "destructive",
      });
      return;
    }

    if (quantity > item.quantity) {
      toast({
        title: "Erro",
        description: `Quantidade maior que o disponível (${item.quantity})!`,
        variant: "destructive",
      });
      return;
    }

    if (quantity === item.quantity) {
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
          quantity: quantity,
        },
        ...prev.map((record) =>
          record.id === item.id
            ? { ...record, quantity: record.quantity - quantity }
            : record,
        ),
      ]);
    }

    toast({
      title: "Saída registrada",
      description: `${quantity} unidades da estampa ${print.name} foram registradas!`,
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
              <div className="text-right mr-4">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
              {userRole === "admin" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAdminDashboard(true)}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
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
              <PrintRegistration onSubmit={handlePrintRegistration} />
            </DialogContent>
          </Dialog>

          {(userRole === "admin" || userRole === "operator") && (
            <section className="flex justify-center">
              <BarcodeInput
                onSubmit={handleBarcodeSubmit}
                availableQuantity={100}
                isLoading={false}
              />
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
};

export default DashboardLayout;
