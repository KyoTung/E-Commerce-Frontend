import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const RevenueChart = ({ data, period }) => {
  const formatXAxis = (tickItem) => {
    if (period === "day") {
      return format(new Date(tickItem), "dd/MM", { locale: vi });
    } else if (period === "week") {
      return `Tuần ${tickItem.split("-")[1]}`;
    } else {
      const [year, month] = tickItem.split("-");
      return `Tháng ${month}/${year}`;
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Doanh thu theo thời gian</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="_id" tickFormatter={formatXAxis} stroke="#9ca3af" />
          <YAxis tickFormatter={formatCurrency} stroke="#9ca3af" />
          <Tooltip
            formatter={(value) => formatCurrency(value)}
            labelFormatter={(label) => {
              if (period === "day") return format(new Date(label), "dd/MM/yyyy", { locale: vi });
              if (period === "week") return `Tuần ${label.split("-")[1]} năm ${label.split("-")[0]}`;
              return `Tháng ${label.split("-")[1]} năm ${label.split("-")[0]}`;
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Doanh thu"
            stroke="#d70018"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="orders"
            name="Số đơn hàng"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;