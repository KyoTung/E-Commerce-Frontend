import React from "react";

const TopProducts = ({ products }) => {
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price || 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Top sản phẩm bán chạy</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">SL bán</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Doanh thu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item._id.image}
                      alt={item._id.title}
                      className="w-10 h-10 object-contain border rounded bg-white"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{item._id.title}</p>
                      <p className="text-xs text-gray-500">
                        {item._id.color} - {item._id.storage}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center font-semibold">{item.totalQuantity}</td>
                <td className="px-4 py-3 text-right font-medium text-[#d70018]">
                  {formatPrice(item.totalRevenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {products.length === 0 && (
        <p className="text-center text-gray-400 py-4">Chưa có dữ liệu</p>
      )}
    </div>
  );
};

export default TopProducts;