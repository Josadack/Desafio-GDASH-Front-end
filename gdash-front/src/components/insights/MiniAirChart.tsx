import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

interface Props {
  title: string;
  description: string;
  dataKey: string;
  color: string;
  data: any[];
}

export function MiniAirChart({ title, description, dataKey, color, data }: Props) {
  return (
    <div className="bg-slate-900/80 rounded-lg p-3">
      <div className="mb-1">
    <span className="text-xs font-semibold text-white">
      {title}
    </span>
    <p className="text-[11px] text-white/60 leading-tight">
      {description}
    </p>
  </div>

      <div className="h-[100px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id={`gradient-${dataKey}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>

            {/* HORÁRIOS */}
            <XAxis
              dataKey="time"
              stroke="#94A3B8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval={3} // mostra a cada 3 horas
            />

            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${dataKey})`}
              dot={false}
            />

            <Tooltip
              cursor={false}
              contentStyle={{
                backgroundColor: "#020617",
                border: "none",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "#94a3b8" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
