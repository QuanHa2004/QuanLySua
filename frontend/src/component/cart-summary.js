import useCart from "../context/cart-context";

export default function CartSummary({ showPaymentSection = false }) {
  const { cartItems } = useCart();

  // Lọc ra các sản phẩm được chọn để thanh toán
  const selectedItems = cartItems.filter(item => item.is_checked);

  // Tính tổng tiền hàng
  const total_amount = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Thuế VAT 8%
  const taxRate = 0.08;
  const taxes = total_amount * taxRate;

  // Tổng cộng = tiền hàng + thuế
  const total = total_amount + taxes;

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <h4 className="text-sm font-bold text-[#1a3c7e] uppercase mb-3">Sản phẩm đã chọn</h4>
        <div className="max-h-[240px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
          {cartItems.length === 0 ? (
            <p className="text-gray-400 italic text-sm text-center py-4">Chưa có sản phẩm nào!</p>
          ) : (
            <ul className="space-y-3">
              {selectedItems.map((item) => (
                <li key={item.product_id} className="flex justify-between items-start text-sm group">
                  <div className="flex-1 min-w-[0] pr-3">
                    <span className="font-medium text-[#333] block line-clamp-2 group-hover:text-[#1a3c7e] transition-colors">
                      {item.product_name}
                    </span>
                    <span className="text-xs text-gray-500 mt-1 block">
                      x{item.quantity}
                    </span>
                  </div>

                  <span className="font-bold text-[#333] whitespace-nowrap">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="space-y-3 px-1">
        <div className="flex justify-between text-base">
          <span className="text-gray-600">Tổng tiền hàng</span>
          <span className="font-medium text-[#333]">{total_amount.toLocaleString('vi-VN')}₫</span>
        </div>

        <div className="flex justify-between text-base">
          <span className="text-gray-600">Thuế VAT</span>
          <span className="font-medium text-[#333]">{taxes.toLocaleString('vi-VN')}₫</span>
        </div>

        {showPaymentSection && selectedItems.length > 0 && (
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
              </svg>
              Voucher
            </span>
            <span className="text-sm text-blue-500 font-medium cursor-pointer hover:underline">Chọn mã giảm giá</span>
          </div>
        )}
      </div>

      <div className="border-t border-dashed border-gray-300"></div>

      <div className="flex justify-between items-end">
        <span className="text-lg font-bold text-[#1a3c7e]">Tổng cộng</span>
        <div className="text-right">
          <span className="text-2xl font-bold text-[#d32f2f] block leading-none">
            {total.toLocaleString('vi-VN')}₫
          </span>
          <span className="text-xs text-gray-400 font-normal mt-1 block">
            (Đã bao gồm VAT)
          </span>
        </div>
      </div>
    </div>
  );
}
