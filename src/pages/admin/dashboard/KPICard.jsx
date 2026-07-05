import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const KPICard = ({ title, value, icon: Icon, color, change, changeType }) => {
  const formatValue = (val) => {
    if (title.toLowerCase().includes("doanh thu")) {
      return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
    }
    return new Intl.NumberFormat("vi-VN").format(val);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formatValue(value)}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {changeType === "up" ? (
                <TrendingUp size={14} className="text-green-500" />
              ) : (
                <TrendingDown size={14} className="text-red-500" />
              )}
              <span className={`text-xs font-medium ${changeType === "up" ? "text-green-600" : "text-red-600"}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-gray-400">so với tuần trước</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon size={24} className={`text-${color}-600`} />
        </div>
      </div>
    </div>
  );
};

export default KPICard;