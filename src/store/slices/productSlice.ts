import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService, Product } from '@/services';

interface ProductState {
  items: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  page: number;
  size: number;
}

const initialState: ProductState = {
  items: [],
  currentProduct: null,
  loading: false,
  error: null,
  totalCount: 0,
  page: 0,
  size: 20,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (
    { page = 0, size = 20, params }: { page?: number; size?: number; params?: any } = {},
    { rejectWithValue }
  ) => {
    try {
      const data = await productService.getAllProducts(page, size, params);
      return { items: data, page, size };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: number, { rejectWithValue }) => {
    try {
      const data = await productService.getProductById(id);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ query, page = 0, size = 20 }: { query: string; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const data = await productService.searchProducts(query, { page, size });
      return { items: data, page, size };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.page = action.payload.page;
        state.size = action.payload.size;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.page = action.payload.page;
        state.size = action.payload.size;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
