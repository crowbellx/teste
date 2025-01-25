import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X } from "lucide-react";

interface PrintRegistrationProps {
  onSubmit?: (data: PrintData) => void;
  isLoading?: boolean;
}

export interface PrintData {
  code: string;
  name: string;
  description: string;
  status?: "in_process" | "completed" | "pending";
  imageUrl?: string;
  quantity: number;
}

export default function PrintRegistration({
  onSubmit = () => {},
  isLoading = false,
}: PrintRegistrationProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const parsedQuantity = parseInt(quantity);

    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return; // Add proper error handling here
    }

    onSubmit({
      code: formData.get("code") as string,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as "in_process" | "completed" | "pending",
      imageUrl: previewUrl || undefined,
      quantity: parsedQuantity,
    });
  };

  return (
    <Card className="w-full max-w-[600px] bg-white">
      <CardHeader>
        <CardTitle>Cadastro de Estampa</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="in_process">Em Processo</option>
                <option value="pending">Pendente</option>
                <option value="completed">Concluído</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantidade inicial"
                required
              />
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

          <div className="space-y-2">
            <Label>Imagem da Estampa</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-32 h-32 border-2 border-dashed rounded-lg overflow-hidden">
                {previewUrl ? (
                  <div className="relative group">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPreviewUrl("")}
                      className="absolute inset-0 bg-black/50 text-white hidden group-hover:flex items-center justify-center"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                  >
                    <ImagePlus className="w-8 h-8 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-2">Upload</span>
                  </label>
                )}
              </div>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Cadastrando..." : "Cadastrar Estampa"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
