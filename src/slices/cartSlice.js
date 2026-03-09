import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiBase = import.meta.env.VITE_API_BASE;
const apiPath = import.meta.env.VITE_API_PATH;

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    carts: [],
    total: 0,
    final_total: 0,
    coupon: {},
    code: '',
    currentStep: 1,
    loading: false,
    loadingItem: ''
  },
  reducers: {
    updateCart(state, action) {
      const { carts, total, final_total } = action.payload;
      state.carts = carts || [];
      state.total = total || 0;
      state.final_total = final_total || 0;

      if (!carts || carts.length === 0) {
        state.coupon = {};
        state.code = '';
      }
    },
    clearCart: (state) => {
      state.carts = [];
      state.total = 0;
      state.final_total = 0;
      state.coupon = {};
      state.code = '';
    },
    updateCoupon(state, action) {
      state.coupon = action.payload || {};
    },
    updateCode(state, action) {
      state.code = action.payload || '';
    },
    updateStep(state, action) {
      state.currentStep = action.payload || 1;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setLoadingItem(state, action) {
      state.loadingItem = action.payload;
    }
  }
});

export const getCartAsync = createAsyncThunk(
  'cart/getCartAsync',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.get(`${apiBase}/api/${apiPath}/cart`);
      dispatch(updateCart(res.data.data));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
)

export const addCartAsync = createAsyncThunk(
  'cart/addCartAsync',
  async (data, { dispatch, rejectWithValue }) => {
    const { product_id } = data;

    try {
      dispatch(setLoadingItem(product_id));
      await axios.post(`${apiBase}/api/${apiPath}/cart`, {data});
      dispatch(getCartAsync());
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    } finally {
      dispatch(setLoadingItem(''));
    }
  }
)

export const removeAllCartAsync = createAsyncThunk(
  'cart/removeAllCartAsync',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      await axios.delete(`${apiBase}/api/${apiPath}/carts`);
      dispatch(getCartAsync());
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
)

export const removeCartAsync = createAsyncThunk(
  'cart/removeCartAsync',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoadingItem(id));
      await axios.delete(`${apiBase}/api/${apiPath}/cart/${id}`);
      dispatch(getCartAsync());
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    } finally {
      dispatch(setLoadingItem(''));
    }
  }
)

export const updateCartNumAsync = createAsyncThunk(
  'cart/updateCartNumAsync',
  async ({id, data}, { dispatch, rejectWithValue }) => {
    try {
      await axios.put(`${apiBase}/api/${apiPath}/cart/${id}`, { data });
      dispatch(getCartAsync());
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
)

export const checkCouponAsync = createAsyncThunk(
  'cart/checkCouponAsync',
  async (data, { dispatch, rejectWithValue }) => {
    const { code } = data;

    try {
      dispatch(setLoadingItem(code));
      const res = await axios.post(`${apiBase}/api/${apiPath}/coupon`, { data });
      dispatch(updateCoupon(res.data));
      dispatch(getCartAsync());
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    } finally {
      dispatch(setLoadingItem(''));
    }
  }
)

export const { updateCart, clearCart, updateCoupon, updateCode, updateStep, setLoading, setLoadingItem } = cartSlice.actions;

export default cartSlice.reducer;