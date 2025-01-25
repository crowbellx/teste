import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Barcode } from "lucide-react";

interface PrintItem {
  id: string;
  code: string;
  name: string;
  quantity: number;
  imageUrl?: string;
}

interface BatchOutputRegistrationProps {
  prints: PrintItem[];
  open: boolean;
  onClose: () => void;
  onSubmit: (outputs: Array<{ id: string; quantity: number }>) => void;
}

export default function BatchOutputRegistration({
  prints,
  open,
  onClose,
  onSubmit,
}: BatchOutputRegistrationProps) {
  const [barcodeInput, setBarcodeInput] = useState("");
  const [selectedPrints, setSelectedPrints] = useState<{
    [key: string]: number;
  }>({});
  const [focusInput, setFocusInput] = useState(false);

  // Auto-focus the input when dialog opens
  useEffect(() => {
    if (open && focusInput) {
      const timer = setTimeout(() => {
        const input = document.getElementById("barcode-input");
        if (input) input.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, focusInput]);

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = barcodeInput.trim();
    if (!code) return;

    const print = prints.find((p) => p.code === code);
    if (print) {
      setSelectedPrints((prev) => ({
        ...prev,
        [print.id]: prev[print.id] || 1,
      }));
    }
    setBarcodeInput("");
  };

  const handleQuantityChange = (id: string, quantity: string) => {
    const numericQuantity = parseInt(quantity) || 0;
    const print = prints.find((p) => p.id === id);

    if (print && numericQuantity <= print.quantity && numericQuantity >= 0) {
      setSelectedPrints((prev) => ({
        ...prev,
        [id]: numericQuantity,
      }));
    }
  };

  const handleRemovePrint = (id: string) => {
    setSelectedPrints((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = () => {
    const outputs = Object.entries(selectedPrints)
      .filter(([_, quantity]) => quantity > 0)
      .map(([id, quantity]) => ({ id, quantity }));

    onSubmit(outputs);
    onClose();
    setSelectedPrints({});
    setBarcodeInput("");
  };

  const selectedItems = prints.filter((p) => p.id in selectedPrints);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registrar Saída em Lote</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Barcode className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="barcode-input"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Escaneie o código de barras..."
                className="pl-9"
                onFocus={() => setFocusInput(true)}
                onBlur={() => setFocusInput(false)}
                autoComplete="off"
              />
            </div>
            <Button type="submit">Adicionar</Button>
          </form>

          <ScrollArea className="max-h-[40vh]">
            <div className="space-y-2">
              {selectedItems.map((print) => (
                <div
                  key={print.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  {print.imageUrl && (
                    <img
                      src={print.imageUrl}
                      alt={print.name}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                  )}

                  <div className="flex-1">
                    <p className="font-medium">{print.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Código: {print.code} | Disponível: {print.quantity}
                    </p>
                  </div>

                  <Input
                    type="number"
                    min="1"
                    max={print.quantity}
                    value={selectedPrints[print.id]}
                    onChange={(e) =>
                      handleQuantityChange(print.id, e.target.value)
                    }
                    className="w-24"
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemovePrint(print.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {selectedItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Escaneie os códigos de barras para adicionar itens à lista
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={selectedItems.length === 0}>
            Registrar {selectedItems.length} Saída
            {selectedItems.length !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
