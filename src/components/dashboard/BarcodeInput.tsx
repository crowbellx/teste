import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Barcode, Keyboard } from "lucide-react";

interface BarcodeInputProps {
  onSubmit?: (code: string) => void;
  isLoading?: boolean;
}

const BarcodeInput = ({
  onSubmit = () => {},
  isLoading = false,
}: BarcodeInputProps) => {
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onSubmit(code.trim());
      setCode("");
    }
  };

  return (
    <Card className="w-full max-w-[600px] p-6 bg-white">
      <Tabs defaultValue="scanner" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="scanner" className="flex items-center gap-2">
            <Barcode className="w-4 h-4" />
            Scanner
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Keyboard className="w-4 h-4" />
            Entrada Manual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scanner">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Escaneie o código de barras..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="text-lg"
              autoFocus
            />
            <Button
              type="submit"
              className="w-full"
              disabled={!code.trim() || isLoading}
            >
              {isLoading ? "Processando..." : "Registrar Saída"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="manual">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Digite o código manualmente..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="text-lg"
            />
            <Button
              type="submit"
              className="w-full"
              disabled={!code.trim() || isLoading}
            >
              {isLoading ? "Processando..." : "Registrar Saída"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default BarcodeInput;
