// src/pages/CompoundCalculator.tsx
import React, { useMemo } from "react";
import { Box, Container, TextField, Stack, MenuItem } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type DepositFrequency = "Monthly" | "Yearly";

interface DataPoint {
  year: number;
  balance: number;
  totalDeposit: number;
}

export default function CompoundCalculator() {
  const [principal, setPrincipal] = React.useState(1000);
  const [rate, setRate] = React.useState(5);
  const [years, setYears] = React.useState(10);
  const [regularDeposit, setRegularDeposit] = React.useState(0);
  const [depositFrequency, setDepositFrequency] =
    React.useState<DepositFrequency>("Monthly");

  const data: DataPoint[] = useMemo(() => {
    const points: DataPoint[] = [];
    let balance = principal;
    let totalDeposit = principal;

    const periodsPerYear = depositFrequency === "Monthly" ? 12 : 1;
    const depositPerPeriod = regularDeposit;

    for (let y = 1; y <= years; y++) {
      for (let p = 0; p < periodsPerYear; p++) {
        balance += depositPerPeriod;
        balance += (balance * rate) / 100 / periodsPerYear;
        totalDeposit += depositPerPeriod;
      }
      points.push({
        year: y,
        balance: parseFloat(balance.toFixed(2)),
        totalDeposit: parseFloat(totalDeposit.toFixed(2)),
      });
    }

    return points;
  }, [principal, rate, years, regularDeposit, depositFrequency]);

  return (
    <Container
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "20px",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ width: { xs: "100%", sm: "80%" }, marginBottom: 4 }}
        justifyContent="center"
        alignItems="center"
      >
        <TextField
          label="Principal ($)"
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
          fullWidth
        />
        <TextField
          label="Annual Interest Rate (%)"
          type="number"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value) || 0)}
          fullWidth
        />
        <TextField
          label="Years"
          type="number"
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          fullWidth
        />
        <TextField
          label="Regular Deposit ($)"
          type="number"
          value={regularDeposit}
          onChange={(e) => setRegularDeposit(Number(e.target.value))}
          fullWidth
        />

        <TextField
          select
          label="Deposit Frequency"
          value={depositFrequency}
          onChange={(e) =>
            setDepositFrequency(e.target.value as DepositFrequency)
          }
          fullWidth
        >
          <MenuItem value="Monthly">Monthly</MenuItem>
          <MenuItem value="Yearly">Yearly</MenuItem>
        </TextField>
      </Stack>

      <Box sx={{ width: { xs: "100%", sm: "80%" }, height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              label={{
                value: "Year",
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
                style: { textAnchor: "middle" },
              }}
              tickFormatter={(value) => {
                if (value >= 1_000_000_000)
                  return `${(value / 1_000_000_000).toFixed(1)}B`;
                if (value >= 1_000_000)
                  return `${(value / 1_000_000).toFixed(1)}M`;
                if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
                return value.toString();
              }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#1976d2"
              strokeWidth={2}
              name="Balance"
            />
            <Line
              type="monotone"
              dataKey="totalDeposit"
              stroke="#ff9800"
              strokeWidth={2}
              name="Total Deposit"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Container>
  );
}
