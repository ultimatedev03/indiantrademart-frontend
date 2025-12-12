import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService, Cart } from '@/services';

interface CartState {
  data: Cart | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const data = await cartService.getCart();
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: number; quantity: number }, { rejectWithValue }) => {
    try {
      const data = await cartService.addToCart({ productId, quantity });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId: number, { rejectWithValue }) => {
    try {
      await cartService.removeFromCart(cartItemId);
      const updatedCart = await cartService.getCart();
      return updatedCart;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async (
    { cartItemId, quantity }: { cartItemId: number; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const data = await cartService.updateQuantity(cartItemId, quantity);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update quantity');
    }
  }
);

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    await cartService.clearCart();
    return null;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.data = null;
        state.loading = false;
      });
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;
