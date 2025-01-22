import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { ArrowUpCircle, CheckCircle2, Clock } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  total: number;
  icon: React.ReactNode;
}

const StatsCard = ({
  title = "Items",
  value = 0,
  total = 100,
  icon,
}: StatsCardProps) => {
  const percentage = Math.round((value / total) * 100);

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <Progress
          value={percentage}
          className="mt-2"
          indicatorClassName={percentage === 100 ? "bg-green-500" : ""}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          {percentage}% of total
        </p>
      </CardContent>
    </Card>
  );
};

interface StatsPanelProps {
  inProcessItems?: number;
  completedItems?: number;
  totalItems?: number;
}

const StatsPanel = ({
  inProcessItems = 45,
  completedItems = 80,
  totalItems = 150,
}: StatsPanelProps) => {
  return (
    <div className="w-full p-6 bg-gray-50">
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="In Process"
          value={inProcessItems}
          total={totalItems}
          icon={<Clock className="h-4 w-4 text-yellow-500" />}
        />
        <StatsCard
          title="Completed"
          value={completedItems}
          total={totalItems}
          icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
        />
        <StatsCard
          title="Total Items"
          value={totalItems}
          total={totalItems}
          icon={<ArrowUpCircle className="h-4 w-4 text-blue-500" />}
        />
      </div>
    </div>
  );
};

export default StatsPanel;
