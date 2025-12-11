import React, { useState, useMemo } from "react";
import {
  Box,
  Container,
  TextField,
  MenuItem,
  Stack,
  Button,
} from "@mui/material";
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

type StockDataWithDate = StockData & { DateObj: Date; timestamp: number };
type Period = "daily" | "monthly" | "yearly";
type SimulatorType = "buy uniform" | "buy lowest" | "buy highest";

interface DataPoint {
  time: string;
  portfolioValue: number;
  totalDeposit: number;
}

type ResampledDataPoint = {
  time: number;
  price: number;
};

const MAX_YEAR_GAP = 30;

export default function InvestmentSimulator() {
  const [parsedData, setParsedData] = useState<StockDataWithDate[]>([]);
  const [minDate, setMinDate] = useState<number | null>(null);
  const [maxDate, setMaxDate] = useState<number | null>(null);

  // Editable states
  const [startDate, setStartDate] = useState("2005-01-01");
  const [endDate, setEndDate] = useState("2025-01-01");
  const [startingMoney, setStartingMoney] = useState(1000);
  const [regularDeposit, setRegularDeposit] = useState(300);
  const [period, setPeriod] = useState<Period>("monthly");
  const [simType, setSimType] = useState<SimulatorType>("buy uniform");

  // Applied states (used by graph)
  const [appliedStartDate, setAppliedStartDate] = useState(startDate);
  const [appliedEndDate, setAppliedEndDate] = useState(endDate);
  const [appliedStartingMoney, setAppliedStartingMoney] =
    useState(startingMoney);
  const [appliedRegularDeposit, setAppliedRegularDeposit] =
    useState(regularDeposit);
  const [appliedPeriod, setAppliedPeriod] = useState(period);
  const [appliedSimType, setAppliedSimType] = useState(simType);

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
            const dateObj = new Date(year, month - 1, day);
            return {
              ...row,
              Open: +row.Open,
              High: +row.High,
              Low: +row.Low,
              Close: +row.Close,
              Volume: +row.Volume,
              DateObj: dateObj,
              timestamp: dateObj.getTime(),
            };
          }
        );
        if (!data.length) return;
        data.sort((a, b) => a.timestamp - b.timestamp);
        setParsedData(data);
        setMinDate(data[0].timestamp);
        setMaxDate(data[data.length - 1].timestamp);
      },
    });
  };

  const chartData: DataPoint[] = useMemo(() => {
    if (!parsedData.length) return [];

    const startTs = new Date(appliedStartDate).getTime();
    const endTs = new Date(appliedEndDate).getTime();

    const filtered = parsedData.filter(
      (d) => d.timestamp >= startTs && d.timestamp <= endTs
    );
    if (!filtered.length) return [];

    const getPrice = (d: StockDataWithDate) => {
      switch (appliedSimType) {
        case "buy lowest":
          return d.Low;
        case "buy highest":
          return d.High;
        default:
          return d.Close;
      }
    };

    const resampled: ResampledDataPoint[] = [];

    if (appliedPeriod === "daily") {
      for (const d of filtered) {
        resampled.push({ time: d.timestamp, price: getPrice(d) });
      }
    } else {
      const map = new Map<number, StockDataWithDate[]>();
      for (const d of filtered) {
        const key =
          appliedPeriod === "monthly"
            ? d.DateObj.getFullYear() * 100 + d.DateObj.getMonth()
            : d.DateObj.getFullYear();
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(d);
      }

      for (const values of map.values()) {
        let price: number;
        if (appliedSimType === "buy lowest")
          price = Math.min(...values.map(getPrice));
        else if (appliedSimType === "buy highest")
          price = Math.max(...values.map(getPrice));
        else price = values[values.length - 1].Close;

        resampled.push({ time: values[0].timestamp, price });
      }
      resampled.sort((a, b) => a.time - b.time);
    }

    // Simulation
    let shares = appliedStartingMoney / resampled[0].price;
    let totalDeposit = appliedStartingMoney;
    const points: DataPoint[] = [
      {
        time: new Date(resampled[0].time).toISOString().slice(0, 10),
        portfolioValue: shares * resampled[0].price,
        totalDeposit,
      },
    ];

    for (let i = 1; i < resampled.length; i++) {
      const price = resampled[i].price;
      shares += appliedRegularDeposit / price;
      totalDeposit += appliedRegularDeposit;
      points.push({
        time: new Date(resampled[i].time).toISOString().slice(0, 10),
        portfolioValue: shares * price,
        totalDeposit,
      });
    }

    return points;
  }, [
    parsedData,
    appliedStartDate,
    appliedEndDate,
    appliedStartingMoney,
    appliedRegularDeposit,
    appliedPeriod,
    appliedSimType,
  ]);

  const handleApply = () => {
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
    setAppliedStartingMoney(startingMoney);
    setAppliedRegularDeposit(regularDeposit);
    setAppliedPeriod(period);
    setAppliedSimType(simType);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Stack direction="column" spacing={2} sx={{ mb: 2 }}>
        <TextField type="file" onChange={handleFileChange} />

        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          error={Boolean(
            (startDate && endDate && startDate > endDate) ||
              (minDate &&
                maxDate &&
                (new Date(startDate).getTime() < minDate ||
                  new Date(startDate).getTime() > maxDate)) ||
              (startDate &&
                endDate &&
                new Date(endDate).getFullYear() -
                  new Date(startDate).getFullYear() >
                  MAX_YEAR_GAP)
          )}
          helperText={
            startDate && endDate && startDate > endDate
              ? "Start date cannot be after end date"
              : minDate &&
                maxDate &&
                (new Date(startDate).getTime() < minDate ||
                  new Date(startDate).getTime() > maxDate)
              ? `Start date must be between ${new Date(minDate)
                  .toISOString()
                  .slice(0, 10)} and ${new Date(maxDate)
                  .toISOString()
                  .slice(0, 10)}`
              : startDate &&
                endDate &&
                new Date(endDate).getFullYear() -
                  new Date(startDate).getFullYear() >
                  MAX_YEAR_GAP
              ? `Date range cannot exceed ${MAX_YEAR_GAP} years`
              : ""
          }
        />

        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          error={Boolean(
            (startDate && endDate && endDate < startDate) ||
              (minDate &&
                maxDate &&
                (new Date(endDate).getTime() < minDate ||
                  new Date(endDate).getTime() > maxDate)) ||
              (startDate &&
                endDate &&
                new Date(endDate).getFullYear() -
                  new Date(startDate).getFullYear() >
                  MAX_YEAR_GAP)
          )}
          helperText={
            startDate && endDate && endDate < startDate
              ? "End date cannot be before start date"
              : minDate &&
                maxDate &&
                (new Date(endDate).getTime() < minDate ||
                  new Date(endDate).getTime() > maxDate)
              ? `End date must be between ${new Date(minDate)
                  .toISOString()
                  .slice(0, 10)} and ${new Date(maxDate)
                  .toISOString()
                  .slice(0, 10)}`
              : startDate &&
                endDate &&
                new Date(endDate).getFullYear() -
                  new Date(startDate).getFullYear() >
                  MAX_YEAR_GAP
              ? `Date range cannot exceed ${MAX_YEAR_GAP} years`
              : ""
          }
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

        <Button variant="contained" onClick={handleApply}>
          Apply Changes
        </Button>
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
