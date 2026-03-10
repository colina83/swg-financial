import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const quarters = [
  "Q1 2024",
  "Q2 2024",
  "Q3 2024",
  "Q4 2024",
  "Q1 2025",
  "Q2 2025",
  "Q3 2025",
  "Q4 2025",
];

const rawData = [
  { q: "Q1 2024", total: 35.1, vessels: 18.8, seismic: 10.3, other: 0.8, rou: 0.6, mfg: 0.1, mc: 0,    writedown: 0   },
  { q: "Q2 2024", total: 34.1, vessels: 18.3, seismic: 11.1, other: 0.3, rou: 0.6, mfg: 0.1, mc: 0,    writedown: 0   },
  { q: "Q3 2024", total: 36.1, vessels: 20.5, seismic: 11.3, other: 0.3, rou: 0.6, mfg: 0.1, mc: 0,    writedown: 0   },
  { q: "Q4 2024", total: 38.9, vessels: 23.4, seismic: 11.5, other: 0.3, rou: 0.6, mfg: 0.1, mc: 0.4,  writedown: 0   },
  { q: "Q1 2025", total: 37.3, vessels: 17.2, seismic: 8.9,  other: 0.3, rou: 0.7, mfg: 0.1, mc: 3.6,  writedown: 3.6 },
  { q: "Q2 2025", total: 31.0, vessels: 16.5, seismic: 8.7,  other: 0.3, rou: 0.7, mfg: 0.1, mc: 1.3,  writedown: 0   },
  { q: "Q3 2025", total: 31.2, vessels: 16.8, seismic: 8.5,  other: 0.3, rou: 0.7, mfg: 0.1, mc: 1.7,  writedown: 0   },
  { q: "Q4 2025", total: 49.3, vessels: 20.5, seismic: 6.1,  other: 0.2, rou: 0.5, mfg: 0.0, mc: 20.3, writedown: 0   },
];

const bsData = [
  { q: "Q1 2024", total: null  },
  { q: "Q2 2024", total: null  },
  { q: "Q3 2024", total: null  },
  { q: "Q4 2024", total: 959.2 },
  { q: "Q1 2025", total: 930.0 },
  { q: "Q2 2025", total: 914.2 },
  { q: "Q3 2025", total: 887.0 },
  { q: "Q4 2025", total: 863.9 },
];

const COLORS = {
  vessels: "#0ea5e9",
  seismic: "#6366f1",
  other:   "#f59e0b",
  rou:     "#10b981",
  mfg:     "#f97316",
  mc:      "#e11d48",
};

const fmt = (v) => `$${v.toFixed(1)}M`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#1e293b",
        border: "1px solid #334155",
        borderRadius: 8,
        padding: "10px 14px",
        color: "#f1f5f9",
        fontSize: 13,
      }}
    >
      <p style={{ fontWeight: 700, marginBottom: 6, color: "#38bdf8" }}>{label}</p>
      {payload.map((p) => (
        <div
          key={p.name}
          style={{ display: "flex", justifyContent: "space-between", gap: 20, marginBottom: 2 }}
        >
          <span style={{ color: p.fill || p.color }}>{p.name}</span>
          <span style={{ fontWeight: 600 }}>{fmt(p.value)}</span>
        </div>
      ))}
      <div
        style={{
          borderTop: "1px solid #475569",
          marginTop: 6,
          paddingTop: 6,
          fontWeight: 700,
        }}
      >
        Total: {fmt(payload.reduce((s, p) => s + p.value, 0))}
      </div>
    </div>
  );
};

const NOTE =
  "Note: Vessel D&A includes straight-line depreciation + periodic maintenance component capitalised to balance sheet. MC = Multi-Client library amortisation (incl. accelerated). Q1 2025 includes $3.6M write-down on seismic equipment. Q4 2025 MC includes $20.3M (straight-line + accelerated). Asset-level quarterly splits are estimated proportionally from annual Note 4 disclosures and reported totals.";

const fleetData = [
  { q: "Q1 2024", days: 91, totalVessels: 23, activeVessels: 8.3,  vesselDepn: 18.8 },
  { q: "Q2 2024", days: 91, totalVessels: 23, activeVessels: 10.0, vesselDepn: 18.3 },
  { q: "Q3 2024", days: 92, totalVessels: 23, activeVessels: 11.1, vesselDepn: 20.5 },
  { q: "Q4 2024", days: 92, totalVessels: 23, activeVessels: 9.9,  vesselDepn: 23.4 },
  { q: "Q1 2025", days: 90, totalVessels: 23, activeVessels: 9.0,  vesselDepn: 17.2 },
  { q: "Q2 2025", days: 91, totalVessels: 21, activeVessels: 8.1,  vesselDepn: 16.5 },
  { q: "Q3 2025", days: 92, totalVessels: 21, activeVessels: 7.8,  vesselDepn: 16.8 },
  { q: "Q4 2025", days: 92, totalVessels: 21, activeVessels: 8.8,  vesselDepn: 20.5 },
];

export default function App() {
  const [view, setView] = useState("stacked");

  const stackedData = rawData.map((d) => ({
    q: d.q,
    "Seismic Vessels": d.vessels,
    "Seismic Equipment": d.seismic,
    "Other Equip.": d.other,
    "Right of Use": d.rou,
    "Mfg. Equip.": d.mfg,
    "MC Library (incl. write-down)": d.mc,
  }));

  const totalLine = rawData.map((d) => ({
    q: d.q,
    "Total D&A": d.total,
    "Excl. MC": d.total - d.mc,
  }));

  const bsCarrying = rawData.map((d, i) => ({
    q: d.q,
    "Tangible Assets (BS)": bsData[i].total,
  }));

  const perDayData = fleetData.map((d, i) => {
    const rd = rawData[i];
    const totalFleetDays = d.totalVessels * d.days;
    const activeFleetDays = d.activeVessels * d.days;
    const vesselDepnUSD = d.vesselDepn * 1e6;
    const equipDepn = (rd.seismic + rd.other + rd.mfg + rd.rou) * 1e6;
    const totalExclMC = (rd.total - rd.mc) * 1e6;
    return {
      q: d.q,
      "Vessel / Total Fleet": Math.round(vesselDepnUSD / totalFleetDays),
      "Equip. / Total Fleet": Math.round(equipDepn / totalFleetDays),
      "Total / Total Fleet": Math.round(totalExclMC / totalFleetDays),
      "Vessel / Active": Math.round(vesselDepnUSD / activeFleetDays),
      "Equip. / Active": Math.round(equipDepn / activeFleetDays),
      "Total / Active": Math.round(totalExclMC / activeFleetDays),
      _active: d.activeVessels,
      _total: d.totalVessels,
      _vesselDepn: d.vesselDepn,
      _equipDepn: rd.seismic + rd.other + rd.mfg + rd.rou,
      _totalExclMC: rd.total - rd.mc,
      _days: d.days,
    };
  });

  const fmtUSD = (v) => v.toLocaleString();

  const tabs = [
    { id: "stacked", label: "D&A by Asset Class" },
    { id: "total",   label: "Total D&A Trend" },
    { id: "bs",      label: "Balance Sheet Values" },
    { id: "vessel",  label: "Depr. per Vessel/Day" },
    { id: "table",   label: "Data Table" },
  ];

  return (
    <div
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        padding: "24px",
        fontFamily: "system-ui,sans-serif",
        color: "#f1f5f9",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: "#38bdf8" }}>
          Shearwater GeoServices — Quarterly Depreciation &amp; Amortisation
        </h1>
        <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 20 }}>
          Source: Quarterly IFRS reports, 2024–2025 · All figures in USD millions
        </p>

        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              style={{
                padding: "7px 16px",
                borderRadius: 20,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                background: view === t.id ? "#0ea5e9" : "#1e293b",
                color: view === t.id ? "#fff" : "#94a3b8",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {view === "stacked" && (
          <>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>
              Stacked bars showing estimated D&amp;A contribution by asset category each quarter
            </p>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={stackedData} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="q" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickFormatter={(v) => `$${v}M`}
                  domain={[0, 55]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                <Bar dataKey="Seismic Vessels" stackId="a" fill={COLORS.vessels} />
                <Bar dataKey="Seismic Equipment" stackId="a" fill={COLORS.seismic} />
                <Bar dataKey="Right of Use" stackId="a" fill={COLORS.rou} />
                <Bar dataKey="Other Equip." stackId="a" fill={COLORS.other} />
                <Bar dataKey="Mfg. Equip." stackId="a" fill={COLORS.mfg} />
                <Bar
                  dataKey="MC Library (incl. write-down)"
                  stackId="a"
                  fill={COLORS.mc}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div
              style={{
                marginTop: 16,
                background: "#1e293b",
                borderRadius: 8,
                padding: "12px 16px",
              }}
            >
              <p style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                🔴 <b style={{ color: "#e11d48" }}>Red segment</b> = Multi-Client library
                amortisation — strip out when analysing pure vessel/hardware depreciation. Q1 2025
                includes a $3.6M equipment write-down. Q4 2025 spike driven by $20.3M MC
                amortisation.
              </p>
            </div>
          </>
        )}

        {view === "total" && (
          <>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>
              Total D&amp;A vs. D&amp;A excluding Multi-Client library amortisation
            </p>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={totalLine}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="q" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickFormatter={(v) => `$${v}M`}
                  domain={[25, 55]}
                />
                <Tooltip
                  formatter={(v) => fmt(v)}
                  labelStyle={{ color: "#38bdf8" }}
                  contentStyle={{ background: "#1e293b", border: "1px solid #334155" }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                <Line
                  dataKey="Total D&A"
                  stroke="#0ea5e9"
                  strokeWidth={2.5}
                  dot={{ r: 5, fill: "#0ea5e9" }}
                />
                <Line
                  dataKey="Excl. MC"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 5, fill: "#10b981" }}
                  strokeDasharray="6 3"
                />
                <ReferenceLine
                  x="Q4 2024"
                  stroke="#f59e0b"
                  strokeDasharray="4 2"
                  label={{ value: "MC starts", fill: "#f59e0b", fontSize: 11 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div
              style={{
                marginTop: 16,
                background: "#1e293b",
                borderRadius: 8,
                padding: "12px 16px",
              }}
            >
              <p style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                The green dashed line (Excl. MC) shows underlying vessel and equipment depreciation
                — broadly declining in 2025 as older seismic equipment reaches full depreciation.
                Total D&amp;A spikes in Q4 2025 due to $20.3M MC library amortisation.
              </p>
            </div>
          </>
        )}

        {view === "bs" && (
          <>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>
              Tangible asset carrying value on the balance sheet (net book value after accumulated
              depreciation)
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={bsCarrying}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="q" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickFormatter={(v) => `$${v}M`}
                  domain={[800, 1050]}
                />
                <Tooltip
                  formatter={(v) => (v ? fmt(v) : "N/A")}
                  labelStyle={{ color: "#38bdf8" }}
                  contentStyle={{ background: "#1e293b", border: "1px solid #334155" }}
                />
                <Line
                  dataKey="Tangible Assets (BS)"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ r: 5, fill: "#6366f1" }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <div
              style={{
                marginTop: 16,
                background: "#1e293b",
                borderRadius: 8,
                padding: "12px 16px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {[
                { l: "Q4 2024 – Vessels",        v: "$865.4M", s: "Seismic eq: $84.3M | ROU: $7.6M" },
                { l: "Q4 2025 – Total Tangibles", v: "$863.9M", s: "Broadly stable YoY despite limited capex" },
                { l: "Full-year 2024 – Vessel D&A",    v: "$93.1M", s: "Incl. $23.1M periodic maintenance" },
                { l: "Full-year 2024 – Seismic Eq D&A", v: "$45.8M", s: "3–7 yr useful life" },
              ].map((c) => (
                <div
                  key={c.l}
                  style={{ background: "#0f172a", borderRadius: 6, padding: "10px 12px" }}
                >
                  <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 4px" }}>{c.l}</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: "#38bdf8", margin: "0 0 2px" }}>
                    {c.v}
                  </p>
                  <p style={{ fontSize: 11, color: "#475569", margin: 0 }}>{c.s}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {view === "table" && (
          <>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>
              Full quarterly D&amp;A breakdown — all figures in USD millions
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#1e293b" }}>
                    {[
                      "Quarter",
                      "Vessels (D)",
                      "Seismic Eq.",
                      "Other Eq.",
                      "ROU",
                      "Mfg.",
                      "MC Amort.",
                      "Write-down",
                      "Total D&A",
                      "Excl. MC",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "9px 10px",
                          textAlign: h === "Quarter" ? "left" : "right",
                          color: "#94a3b8",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          borderBottom: "1px solid #334155",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rawData.map((d, i) => (
                    <tr
                      key={d.q}
                      style={{
                        background: i % 2 === 0 ? "#0f172a" : "#111827",
                        borderBottom: "1px solid #1e293b",
                      }}
                    >
                      <td style={{ padding: "8px 10px", fontWeight: 600, color: "#38bdf8" }}>
                        {d.q}
                      </td>
                      {[
                        d.vessels,
                        d.seismic,
                        d.other,
                        d.rou,
                        d.mfg,
                        d.mc,
                        d.writedown,
                        d.total,
                        d.total - d.mc,
                      ].map((v, j) => (
                        <td
                          key={j}
                          style={{
                            padding: "8px 10px",
                            textAlign: "right",
                            color:
                              j === 7
                                ? "#f1f5f9"
                                : j === 5 || j === 6
                                ? v > 0
                                  ? "#e11d48"
                                  : "#475569"
                                : "#cbd5e1",
                          }}
                        >
                          {v > 0 ? `$${v.toFixed(1)}M` : "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  {[
                    ["2024 Total", rawData.slice(0, 4)],
                    ["2025 Total", rawData.slice(4)],
                  ].map(([label, rows]) => (
                    <tr key={label} style={{ background: "#1e293b", fontWeight: 700 }}>
                      <td style={{ padding: "9px 10px", color: "#f1f5f9" }}>{label}</td>
                      {[
                        rows.reduce((s, d) => s + d.vessels,   0),
                        rows.reduce((s, d) => s + d.seismic,   0),
                        rows.reduce((s, d) => s + d.other,     0),
                        rows.reduce((s, d) => s + d.rou,       0),
                        rows.reduce((s, d) => s + d.mfg,       0),
                        rows.reduce((s, d) => s + d.mc,        0),
                        rows.reduce((s, d) => s + d.writedown, 0),
                        rows.reduce((s, d) => s + d.total,     0),
                        rows.reduce((s, d) => s + (d.total - d.mc), 0),
                      ].map((v, j) => (
                        <td
                          key={j}
                          style={{ padding: "9px 10px", textAlign: "right", color: "#fbbf24" }}
                        >
                          ${v.toFixed(1)}M
                        </td>
                      ))}
                    </tr>
                  ))}
                </tfoot>
              </table>
            </div>
          </>
        )}

        {view === "vessel" && (
          <>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>
              Daily depreciation rates normalised per vessel-day, grouped by Total Fleet (all
              owned vessels incl. stacked) and Active Fleet (deployed vessels only). All figures
              exclude MC library amortisation.
            </p>

            {/* ── Metric legend cards ── */}
            {[
              {
                group: "Total Fleet (all owned vessels × days)",
                items: [
                  { color: "#0ea5e9", label: "Vessel / Total Fleet", desc: "Vessel D&A ÷ total fleet vessel-days." },
                  { color: "#f59e0b", label: "Equip. / Total Fleet", desc: "Equipment D&A (Seismic + Other + Mfg. + ROU) ÷ total fleet vessel-days." },
                  { color: "#10b981", label: "Total / Total Fleet", desc: "Vessel + Equipment D&A ÷ total fleet vessel-days." },
                ],
              },
              {
                group: "Active Fleet (deployed vessels × days)",
                items: [
                  { color: "#818cf8", label: "Vessel / Active", desc: "Vessel D&A ÷ active vessel-days." },
                  { color: "#c084fc", label: "Equip. / Active", desc: "Equipment D&A ÷ active vessel-days." },
                  { color: "#34d399", label: "Total / Active", desc: "Vessel + Equipment D&A ÷ active vessel-days." },
                ],
              },
            ].map((g) => (
              <div key={g.group} style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 11, color: "#64748b", fontWeight: 700, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {g.group}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                  {g.items.map((c) => (
                    <div
                      key={c.label}
                      style={{
                        background: "#1e293b",
                        borderRadius: 8,
                        padding: "10px 12px",
                        borderLeft: `3px solid ${c.color}`,
                      }}
                    >
                      <p style={{ fontSize: 11, color: c.color, fontWeight: 700, margin: "0 0 4px" }}>
                        {c.label}
                      </p>
                      <p style={{ fontSize: 11, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                        {c.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* ── Bar chart ── */}
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={perDayData} barGap={2} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="q" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  domain={[0, 50000]}
                />
                <Tooltip
                  formatter={(v, n) => [`$${v.toLocaleString()}/vessel/day`, n]}
                  labelStyle={{ color: "#38bdf8", fontWeight: 700 }}
                  contentStyle={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                <Bar dataKey="Vessel / Total Fleet" fill="#0ea5e9" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Equip. / Total Fleet" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Total / Total Fleet" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Vessel / Active" fill="#818cf8" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Equip. / Active" fill="#c084fc" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Total / Active" fill="#34d399" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            {/* ── Detailed table ── */}
            <div style={{ marginTop: 20, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  {/* Group header row */}
                  <tr style={{ background: "#1e293b" }}>
                    <th colSpan={4} aria-label="Fleet info" style={{ padding: "6px 8px", textAlign: "center", color: "#64748b", fontWeight: 700, borderBottom: "1px solid #334155", fontSize: 10, letterSpacing: 0.5 }}></th>
                    <th colSpan={3} style={{ padding: "6px 8px", textAlign: "center", color: "#94a3b8", fontWeight: 700, borderBottom: "1px solid #334155", borderLeft: "2px solid #334155", fontSize: 10, letterSpacing: 0.5 }}>
                      D&amp;A (USD M)
                    </th>
                    <th colSpan={3} style={{ padding: "6px 8px", textAlign: "center", color: "#0ea5e9", fontWeight: 700, borderBottom: "1px solid #334155", borderLeft: "2px solid #334155", fontSize: 10, letterSpacing: 0.5 }}>
                      $/Day — Total Fleet
                    </th>
                    <th colSpan={3} style={{ padding: "6px 8px", textAlign: "center", color: "#818cf8", fontWeight: 700, borderBottom: "1px solid #334155", borderLeft: "2px solid #334155", fontSize: 10, letterSpacing: 0.5 }}>
                      $/Day — Active Fleet
                    </th>
                  </tr>
                  {/* Sub-header row */}
                  <tr style={{ background: "#1e293b" }}>
                    {[
                      { label: "Quarter", align: "left" },
                      { label: "Days", align: "right" },
                      { label: "Total Fleet", align: "right" },
                      { label: "Active (avg)", align: "right" },
                    ].map((h) => (
                      <th
                        key={h.label}
                        style={{
                          padding: "8px 8px",
                          textAlign: h.align,
                          color: "#94a3b8",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          borderBottom: "2px solid #334155",
                        }}
                      >
                        {h.label}
                      </th>
                    ))}
                    {/* D&A columns */}
                    {[
                      { label: "Vessel", color: "#0ea5e9" },
                      { label: "Equip.", color: "#f59e0b" },
                      { label: "Total", color: "#10b981" },
                    ].map((h, idx) => (
                      <th
                        key={`da-${h.label}`}
                        style={{
                          padding: "8px 8px",
                          textAlign: "right",
                          color: h.color,
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          borderBottom: "2px solid #334155",
                          borderLeft: idx === 0 ? "2px solid #334155" : "none",
                        }}
                      >
                        {h.label}
                      </th>
                    ))}
                    {/* Total Fleet $/day columns */}
                    {[
                      { label: "Vessel", color: "#0ea5e9" },
                      { label: "Equip.", color: "#f59e0b" },
                      { label: "Total", color: "#10b981" },
                    ].map((h, idx) => (
                      <th
                        key={`tf-${h.label}`}
                        style={{
                          padding: "8px 8px",
                          textAlign: "right",
                          color: h.color,
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          borderBottom: "2px solid #334155",
                          borderLeft: idx === 0 ? "2px solid #334155" : "none",
                        }}
                      >
                        {h.label}
                      </th>
                    ))}
                    {/* Active Fleet $/day columns */}
                    {[
                      { label: "Vessel", color: "#818cf8" },
                      { label: "Equip.", color: "#c084fc" },
                      { label: "Total", color: "#34d399" },
                    ].map((h, idx) => (
                      <th
                        key={`af-${h.label}`}
                        style={{
                          padding: "8px 8px",
                          textAlign: "right",
                          color: h.color,
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          borderBottom: "2px solid #334155",
                          borderLeft: idx === 0 ? "2px solid #334155" : "none",
                        }}
                      >
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fleetData.map((d, i) => {
                    const rd = rawData[i];
                    const totalFleetDays = d.totalVessels * d.days;
                    const activeFleetDays = d.activeVessels * d.days;
                    const vesselDepnUSD = d.vesselDepn * 1e6;
                    const equipVal = rd.seismic + rd.other + rd.mfg + rd.rou;
                    const equipDepn = equipVal * 1e6;
                    const totalVal = rd.total - rd.mc;
                    const totalExclMC = totalVal * 1e6;
                    return (
                      <tr
                        key={d.q}
                        style={{
                          background: i % 2 === 0 ? "#0f172a" : "#111827",
                          borderBottom: "1px solid #1e293b",
                        }}
                      >
                        <td style={{ padding: "7px 8px", fontWeight: 600, color: "#38bdf8" }}>
                          {d.q}
                        </td>
                        <td style={{ padding: "7px 8px", textAlign: "right", color: "#94a3b8" }}>
                          {d.days}
                        </td>
                        <td style={{ padding: "7px 8px", textAlign: "right", color: "#94a3b8" }}>
                          {d.totalVessels}
                        </td>
                        <td style={{ padding: "7px 8px", textAlign: "right", color: "#94a3b8" }}>
                          {d.activeVessels}
                        </td>
                        {/* D&A values */}
                        <td style={{ padding: "7px 8px", textAlign: "right", color: "#0ea5e9", borderLeft: "2px solid #1e293b" }}>
                          ${d.vesselDepn.toFixed(1)}M
                        </td>
                        <td style={{ padding: "7px 8px", textAlign: "right", color: "#f59e0b" }}>
                          ${equipVal.toFixed(1)}M
                        </td>
                        <td style={{ padding: "7px 8px", textAlign: "right", color: "#10b981", fontWeight: 600 }}>
                          ${totalVal.toFixed(1)}M
                        </td>
                        {/* $/day — Total Fleet */}
                        <td style={{ padding: "7px 8px", textAlign: "right", color: "#0ea5e9", fontWeight: 600, borderLeft: "2px solid #1e293b" }}>
                          {fmtUSD(Math.round(vesselDepnUSD / totalFleetDays))}
                        </td>
                        <td style={{ padding: "7px 8px", textAlign: "right", color: "#f59e0b", fontWeight: 600 }}>
                          {fmtUSD(Math.round(equipDepn / totalFleetDays))}
                        </td>
                        <td style={{ padding: "7px 8px", textAlign: "right", color: "#10b981", fontWeight: 600 }}>
                          {fmtUSD(Math.round(totalExclMC / totalFleetDays))}
                        </td>
                        {/* $/day — Active Fleet */}
                        <td style={{ padding: "7px 8px", textAlign: "right", color: "#818cf8", fontWeight: 600, borderLeft: "2px solid #1e293b" }}>
                          {fmtUSD(Math.round(vesselDepnUSD / activeFleetDays))}
                        </td>
                        <td style={{ padding: "7px 8px", textAlign: "right", color: "#c084fc", fontWeight: 600 }}>
                          {fmtUSD(Math.round(equipDepn / activeFleetDays))}
                        </td>
                        <td style={{ padding: "7px 8px", textAlign: "right", color: "#34d399", fontWeight: 600 }}>
                          {fmtUSD(Math.round(totalExclMC / activeFleetDays))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div
              style={{
                marginTop: 14,
                background: "#1e293b",
                borderRadius: 8,
                padding: "12px 16px",
                borderLeft: "3px solid #6366f1",
              }}
            >
              <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>
                <b style={{ color: "#6366f1" }}>How to read this table:</b> The <b>D&amp;A</b> columns
                show quarterly Vessel and Equipment depreciation in USD millions, with a <b>Total</b> (Vessel + Equipment,
                excl. MC). The <b>$/Day — Total Fleet</b> group divides each D&amp;A figure by total
                fleet vessel-days (all owned vessels × calendar days), reflecting the full fleet
                burden including stacked vessels. The <b>$/Day — Active Fleet</b> group divides by
                active vessel-days only (deployed vessels × days), showing the cost on working fleet.
                <b> Note:</b> Shearwater does not disclose per-vessel book values; all figures
                represent fleet-average daily rates.
              </p>
            </div>
          </>
        )}

        <div
          style={{
            marginTop: 20,
            background: "#1e293b",
            borderRadius: 8,
            padding: "12px 16px",
            borderLeft: "3px solid #f59e0b",
          }}
        >
          <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>
            <b style={{ color: "#f59e0b" }}>Methodology note:</b> {NOTE}
          </p>
        </div>
      </div>
    </div>
  );
}
