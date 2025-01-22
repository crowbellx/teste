import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PrintRegistrationProps {
  onSubmit?: (data: PrintData) => void;
  isLoading?: boolean;
}

export interface PrintData {
  code: string;
  name: string;
  description: string;
  status?: "in_process" | "completed" | "pending";
}

const PrintRegistration = ({
  onSubmit = () => {},
  isLoading = false,
}: PrintRegistrationProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit({
      code: formData.get("code") as string,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as "in_process" | "completed" | "pending",
    });
  };

  return (
    <Card className="w-full max-w-[600px] bg-white">
      <CardHeader>
        <CardTitle>Cadastro de Estampa</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                name="code"
                placeholder="Código da estampa"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                placeholder="Nome da estampa"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="pending">Pendente</option>
                <option value="in_process">Em Processo</option>
                <option value="completed">Concluído</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descrição da estampa"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Cadastrando..." : "Cadastrar Estampa"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PrintRegistration;
