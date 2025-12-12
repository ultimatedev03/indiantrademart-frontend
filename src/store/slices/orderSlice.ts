import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService, Order } from '@/services';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  page: number;
  size: number;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  page: 0,
  size: 20,
};

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (
    { page = 0, size = 20 }: { page?: number; size?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const data = await orderService.getMyOrders(page, size);
      return { orders: data, page, size };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id: number, { rejectWithValue }) => {
    try {
      const data = await orderService.getOrderById(id);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (
    data: { cartItems: any[]; shippingAddressId: number; paymentMethodId: number },
    { rejectWithValue }
  ) => {
    try {
      const order = await orderService.createOrder(data);
      return order;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async ({ id, reason }: { id: number; reason: string }, { rejectWithValue }) => {
    try {
      await orderService.cancelOrder(id, reason);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
    }
  }
);

export const trackOrder = createAsyncThunk(
  'orders/trackOrder',
  async (orderNumber: string, { rejectWithValue }) => {
    try {
      const data = await orderService.trackOrder(orderNumber);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to track order');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.page = action.payload.page;
        state.size = action.payload.size;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const order = state.orders.find((o) => o.id === action.payload);
        if (order) {
          order.orderStatus = 'CANCELLED';
        }
      })
      .addCase(trackOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      });
  },
});

export const { clearError, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
