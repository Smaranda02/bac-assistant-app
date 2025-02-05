"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ComponentProps } from "react";
import { LabelList, Pie, PieChart } from "recharts";

type TeachersChartData = Array<{
  count: number,
  subject: string
}>;

type Props = ComponentProps<typeof Card> & {
  data: TeachersChartData;
}

export default function TeachersChart({ data, ...props }: Props) {
  const chartData = data.map((d, i) => ({...d, fill: `hsl(var(--chart-${i + 1}))`}));

  const chartConfig = {
    ...Object.fromEntries(chartData.map((data, index) => [data.subject, { label: data.subject, color: "#ff0000" }])),
    count: {
      label: "Total",
    },
  } satisfies ChartConfig

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Total profesori</CardTitle>
        <CardDescription>Distribuție profesori pe materii</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="count" hideLabel />}
            />
            <Pie data={chartData} dataKey="count">
              <LabelList
                dataKey="subject"
                className="fill-background"
                stroke="none"
                fontSize={12}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
