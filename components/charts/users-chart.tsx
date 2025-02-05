"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ComponentProps } from "react";

type ChartData = Array<{
  role: string,
  count: number
}>;

type Props = ComponentProps<typeof Card> & {
  data: ChartData;
};

const chartConfig = {
  count: {
    label: "Număr utilizatori",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function UsersChart({ data, ...props }: Props) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Utilizatori înregistrați</CardTitle>
        <CardDescription>Număr de utilizatori în platformă</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="role"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>        
    </Card>
  );
}
