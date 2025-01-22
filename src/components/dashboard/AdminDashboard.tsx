import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Settings2, BarChart3 } from "lucide-react";
import AdminPanel from "./AdminPanel";
import StatsPanel from "./StatsPanel";

interface AdminDashboardProps {
  users?: Array<{
    id: string;
    username: string;
    role: "admin" | "operator" | "viewer";
    lastLogin?: Date;
  }>;
  stats?: {
    inProcessItems: number;
    completedItems: number;
    totalItems: number;
  };
  onAddUser?: (user: {
    username: string;
    role: "admin" | "operator" | "viewer";
  }) => void;
  onDeleteUser?: (userId: string) => void;
}

const AdminDashboard = ({
  users = [],
  stats = { inProcessItems: 0, completedItems: 0, totalItems: 0 },
  onAddUser = () => {},
  onDeleteUser = () => {},
}: AdminDashboardProps) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Estatísticas
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <AdminPanel
            users={users}
            onAddUser={onAddUser}
            onDeleteUser={onDeleteUser}
          />
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <StatsPanel {...stats} />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>Configurações em desenvolvimento...</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Configurações de notificações</li>
                  <li>Preferências do sistema</li>
                  <li>Backup e restauração</li>
                  <li>Logs do sistema</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
