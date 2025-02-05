"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ComponentProps } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

type ChartData = Array<{
  week: string;
  total1: number;
  total2: number;
}>;

type Props = ComponentProps<typeof Card> & {
  data: ChartData;
  period: string;
}

const chartConfig = {
  total1: {
    label: "Teste create",
    color: "#2563eb",
  },
  total2: {
    label: "Teste rezolvate",
    color: "#60a5fa",
  },
} satisfies ChartConfig

export default function ActivityChart({ data, period, ...props }: Props) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Activitate în platformă</CardTitle>
        <CardDescription>Perioada {period}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[100px] max-h-[300px] w-full">
          <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false}/>
            <XAxis
              dataKey="week"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent className="min-w-40" />} />
            <Bar dataKey="total1" fill="var(--color-total1)" radius={4} />
            <Bar dataKey="total2" fill="var(--color-total2)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}