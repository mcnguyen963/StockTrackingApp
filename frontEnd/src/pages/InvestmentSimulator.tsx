import React, { useState, useMemo } from "react";
import { Box, Container, TextField, MenuItem, Stack } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import * as Papa from "papaparse";

type StockData = {
  Date: string;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
};

type StockDataWithDate = StockData & { DateObj: Date };

type Period = "daily" | "monthly" | "yearly";
type SimulatorType = "buy uniform" | "buy lowest" | "buy highest";

interface DataPoint {
  time: string;
  portfolioValue: number;
  totalDeposit: number;
}

type ResampledDataPoint = {
  time: string;
  price: number;
};

export default function InvestmentSimulator() {
  const [parsedData, setParsedData] = useState<StockDataWithDate[]>([]);
  const [startDate, setStartDate] = useState("2005-01-01");
  const [endDate, setEndDate] = useState("2025-01-01");
  const [startingMoney, setStartingMoney] = useState(1000);
  const [regularDeposit, setRegularDeposit] = useState(300);
  const [period, setPeriod] = useState<Period>("monthly");
  const [simType, setSimType] = useState<SimulatorType>("buy uniform");

  // Parse CSV with DD/MM/YYYY format
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data: StockDataWithDate[] = (results.data as StockData[]).map(
          (row: any) => {
            const [day, month, year] = row.Date.split("/").map(Number);
            const dateObj = new Date(year, month - 1, day); // JS months 0-indexed

            if (isNaN(dateObj.getTime())) {
              console.warn("Invalid date in CSV:", row.Date);
            }

            return {
              ...row,
              Open: parseFloat(row.Open),
              High: parseFloat(row.High),
              Low: parseFloat(row.Low),
              Close: parseFloat(row.Close),
              Volume: parseFloat(row.Volume),
              DateObj: dateObj,
            };
          }
        );

        setParsedData(data);
      },
    });
  };

  const chartData: DataPoint[] = useMemo(() => {
    if (!parsedData.length) return [];

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredData = parsedData
      .filter((d) => d.DateObj >= start && d.DateObj <= end)
      .sort((a, b) => a.DateObj.getTime() - b.DateObj.getTime());

    if (!filteredData.length) return [];

    const getPrice = (d: StockDataWithDate) => {
      switch (simType) {
        case "buy uniform":
          return d.Close;
        case "buy lowest":
          return d.Low;
        case "buy highest":
          return d.High;
        default:
          return d.Close;
      }
    };

    const resampled: ResampledDataPoint[] = [];

    const groupData = (keyFn: (d: StockDataWithDate) => string) => {
      const map = new Map<string, StockDataWithDate[]>();
      filteredData.forEach((d) => {
        const key = keyFn(d);
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(d);
      });
      return map;
    };

    let grouped: Map<string, StockDataWithDate[]> = new Map();

    if (period === "daily") {
      filteredData.forEach((d) =>
        resampled.push({
          time: d.DateObj.toISOString().slice(0, 10),
          price: getPrice(d),
        })
      );
    } else if (period === "monthly") {
      grouped = groupData(
        (d) => `${d.DateObj.getFullYear()}-${d.DateObj.getMonth()}`
      );
    } else if (period === "yearly") {
      grouped = groupData((d) => `${d.DateObj.getFullYear()}`);
    }

    if (period !== "daily") {
      grouped.forEach((values) => {
        let price: number;
        if (simType === "buy lowest") price = Math.min(...values.map(getPrice));
        else if (simType === "buy highest")
          price = Math.max(...values.map(getPrice));
        else price = values[values.length - 1].Close;

        resampled.push({
          time: values[0].DateObj.toISOString().slice(0, 10),
          price,
        });
      });

      resampled.sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
      );
    }

    // Simulation
    let shares = startingMoney / resampled[0].price;
    let totalDeposit = startingMoney;

    const points: DataPoint[] = [
      {
        time: resampled[0].time,
        portfolioValue: shares * resampled[0].price,
        totalDeposit,
      },
    ];

    for (let i = 1; i < resampled.length; i++) {
      const price = resampled[i].price;
      shares += regularDeposit / price;
      totalDeposit += regularDeposit;
      points.push({
        time: resampled[i].time,
        portfolioValue: shares * price,
        totalDeposit,
      });
    }

    return points;
  }, [
    parsedData,
    startDate,
    endDate,
    startingMoney,
    regularDeposit,
    period,
    simType,
  ]);

  return (
    <Container sx={{ mt: 4 }}>
      <Stack direction="column" spacing={2} sx={{ mb: 4 }}>
        <TextField type="file" onChange={handleFileChange} />
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <TextField
          label="Regular Deposit"
          value={regularDeposit}
          onChange={(e) => setRegularDeposit(Number(e.target.value) || 0)}
        />
        <TextField
          select
          label="Period"
          value={period}
          onChange={(e) => setPeriod(e.target.value as Period)}
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="yearly">Yearly</MenuItem>
        </TextField>
        <TextField
          select
          label="Simulator Type"
          value={simType}
          onChange={(e) => setSimType(e.target.value as SimulatorType)}
        >
          <MenuItem value="buy uniform">Buy Uniform (Close)</MenuItem>
          <MenuItem value="buy lowest">Buy Lowest (Low)</MenuItem>
          <MenuItem value="buy highest">Buy Highest (High)</MenuItem>
        </TextField>
      </Stack>

      <Box sx={{ width: "100%", height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              label={{
                value: "Date",
                position: "insideBottomRight",
                offset: -5,
              }}
            />
            <YAxis
              width={80}
              label={{
                value: "Amount ($)",
                angle: -90,
                position: "insideLeft",
                offset: 0,
              }}
              tickFormatter={(v) =>
                v >= 1_000_000_000
                  ? `${(v / 1_000_000_000).toFixed(1)}B`
                  : v >= 1_000_000
                  ? `${(v / 1_000_000).toFixed(1)}M`
                  : v >= 1_000
                  ? `${(v / 1_000).toFixed(0)}K`
                  : v.toString()
              }
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="portfolioValue"
              stroke="#1976d2"
              strokeWidth={2}
              name="Portfolio Value"
            />
            <Line
              type="monotone"
              dataKey="totalDeposit"
              stroke="#ff9800"
              strokeWidth={2}
              name="Total Deposited"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Container>
  );
}
