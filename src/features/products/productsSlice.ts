import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  thumbnail: string
  rating: number
}

interface ProductsState {
  items: Product[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  isOptimized: boolean
  searchQuery: string
}

const getInitialOptimizedState = (): boolean => {
  const saved = localStorage.getItem('isOptimized')
  return saved !== null ? JSON.parse(saved) : true
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
  isOptimized: getInitialOptimizedState(),
  searchQuery: '',
}

// Generate 10,000 items dynamically for performance benchmark
const generate10kProducts = (baseProducts: Product[]): Product[] => {
  const categories = ['beauty', 'fragrances', 'furniture', 'groceries', 'home-decoration', 'laptops', 'smartphones', 'sunglasses']
  const items: Product[] = []
  
  const sampleImages = baseProducts.length > 0 ? baseProducts.map(p => p.thumbnail) : [
    'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png',
    'https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/thumbnail.png',
    'https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/thumbnail.png'
  ]

  for (let i = 1; i <= 10000; i++) {
    const cat = categories[i % categories.length]
    const img = sampleImages[i % sampleImages.length]
    items.push({
      id: i,
      title: `Sản phẩm #${i} - ${cat.toUpperCase()} Premium Edition`,
      price: Math.floor((i * 17) % 990) + 9.99,
      description: `Mô tả chi tiết cho sản phẩm cao cấp số ${i} thuộc danh mục ${cat}.`,
      category: cat,
      thumbnail: img,
      rating: Number((3.5 + ((i * 13) % 15) / 10).toFixed(1)),
    })
  }
  return items
}

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/products?limit=20')
      let base: Product[] = []
      if (response.ok) {
        const data = await response.json()
        base = data.products || []
      }
      return generate10kProducts(base)
    } catch {
      return generate10kProducts([])
    }
  }
)

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    toggleOptimization: (state) => {
      state.isOptimized = !state.isOptimized
      localStorage.setItem('isOptimized', JSON.stringify(state.isOptimized))
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Lỗi khi tạo 10.000 sản phẩm'
      })
  },
})

export const { toggleOptimization, setSearchQuery } = productsSlice.actions
export default productsSlice.reducer
