import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface InventoryRecord {
  id: string;
  code: string;
  name: string;
  description: string;
  status: "in_process" | "completed" | "pending";
  entryTimestamp?: Date;
  exitTimestamp?: Date;
  operator: string;
  quantity: number;
}

interface InventoryTableProps {
  records?: InventoryRecord[];
  onUpdateStatus?: (id: string, newStatus: InventoryRecord["status"]) => void;
  userRole?: "admin" | "operator" | "viewer";
}

const getStatusColor = (status: InventoryRecord["status"]) => {
  switch (status) {
    case "in_process":
      return "bg-blue-500";
    case "completed":
      return "bg-green-500";
    case "pending":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusText = (status: InventoryRecord["status"]) => {
  switch (status) {
    case "in_process":
      return "EM PROCESSO";
    case "completed":
      return "CONCLUÍDO";
    case "pending":
      return "PENDENTE";
  }
};

const InventoryTable = ({
  records = [],
  onUpdateStatus = () => {},
  userRole = "viewer",
}: InventoryTableProps) => {
  const canUpdateStatus = userRole === "admin" || userRole === "operator";

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Registro de Estoque
        </h2>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Entrada</TableHead>
              <TableHead>Saída</TableHead>
              <TableHead>Operador</TableHead>
              {canUpdateStatus && (
                <TableHead className="w-[50px]">Ações</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.code}</TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.description}</TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(record.status)}`}>
                    {getStatusText(record.status)}
                  </Badge>
                </TableCell>
                <TableCell>{record.quantity}</TableCell>
                <TableCell>
                  {record.entryTimestamp
                    ? format(record.entryTimestamp, "dd/MM/yyyy HH:mm")
                    : "-"}
                </TableCell>
                <TableCell>
                  {record.exitTimestamp
                    ? format(record.exitTimestamp, "dd/MM/yyyy HH:mm")
                    : "-"}
                </TableCell>
                <TableCell>{record.operator}</TableCell>
                {canUpdateStatus && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(record.id, "pending")}
                          disabled={record.status === "pending"}
                        >
                          Marcar como Pendente
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            onUpdateStatus(record.id, "in_process")
                          }
                          disabled={record.status === "in_process"}
                        >
                          Marcar como Em Processo
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(record.id, "completed")}
                          disabled={record.status === "completed"}
                        >
                          Marcar como Concluído
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InventoryTable;
