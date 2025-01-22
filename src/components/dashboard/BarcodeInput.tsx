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
  onSubmit?: (code: string, quantity: number) => void;
  isLoading?: boolean;
  availableQuantity?: number;
}

const BarcodeInput = ({
  onSubmit = () => {},
  isLoading = false,
  availableQuantity = 0,
}: BarcodeInputProps) => {
  const [code, setCode] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [tempCode, setTempCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      setTempCode(code);
      setShowDialog(true);
      setCode("");
    }
  };

  const handleQuantitySubmit = () => {
    const parsedQuantity = parseInt(quantity);
    if (parsedQuantity > 0 && parsedQuantity <= availableQuantity) {
      onSubmit(tempCode, parsedQuantity);
      setShowDialog(false);
      setQuantity("");
    }
  };

  return (
    <>
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

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quantidade de Saída</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Quantidade</Label>
              <Input
                type="number"
                min="1"
                max={availableQuantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={`Máximo: ${availableQuantity}`}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleQuantitySubmit}
              disabled={
                !quantity ||
                parseInt(quantity) <= 0 ||
                parseInt(quantity) > availableQuantity
              }
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BarcodeInput;
