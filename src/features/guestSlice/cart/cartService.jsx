import axiosClient from "../../../api/axiosClient";

const getCart = async () => {
  const response = await axiosClient.get("/cart");
  return response.data;
};

const addToCart = async (data) => {
  const response = await axiosClient.post(`/cart`, data);
  return response.data;
};

const deleteCart = async () => {
  const response = await axiosClient.delete(`/cart`);
  return response.data;
}

const updateCartItem = async (data) => {
  const response = await axiosClient.put(`/cart`, data);
  return response.data;
}
const applyCoupon = async (data) => {
  const response = await axiosClient.put(`/cart/apply-coupon`, data);
  return response.data;
}
const deleteCartItem = async (data) => {
  const response = await axiosClient.delete(`/cart-item`, data);
  return response.data;
}

const cartService = {
    getCart,
    addToCart,
    deleteCartItem,
    deleteCart,
    updateCartItem,
    applyCoupon,
};

export default cartService;
