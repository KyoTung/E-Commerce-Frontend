import React from "react";

const LowStockAlert = ({ items }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        ⚠️ Cảnh báo tồn kho thấp
      </h3>
      {items.length === 0 ? (
        <p className="text-center text-green-600 py-4">✅ Không có sản phẩm tồn kho thấp</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phân loại</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tồn kho</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={item.image} className="w-8 h-8 object-contain border rounded" alt="" />
                      <span className="font-medium text-gray-800">{item.productTitle}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.color} - {item.storage}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      {item.quantity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LowStockAlert;