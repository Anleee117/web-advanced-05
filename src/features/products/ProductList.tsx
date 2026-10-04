import React, { useState, useMemo, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchProducts, toggleOptimization, setSearchQuery } from './productsSlice'
import {
  selectProducts,
  selectProductsStatus,
  selectProductsError,
} from './productsSelectors'
import ProductCard from './ProductCard'
import { Loader2, AlertTriangle, RefreshCw, Zap, ShieldAlert, Search } from '../../components/Icons'

const MemoizedProductCard = React.memo(ProductCard)

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch()
  const products = useAppSelector(selectProducts)
  const status = useAppSelector(selectProductsStatus)
  const error = useAppSelector(selectProductsError)
  const isOptimized = useAppSelector((state) => state.products.isOptimized)
  const searchQuery = useAppSelector((state) => state.products.searchQuery)

  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 12 // Giảm xuống 12 sp/trang để LCP cực kỳ nhanh (dưới 1s)

  React.useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts())
    }
  }, [status, dispatch])

  // Lọc sản phẩm theo từ khóa
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products
    const q = searchQuery.toLowerCase()
    return products.filter(
      (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    )
  }, [products, searchQuery])

  // Tính tổng số trang
  const totalPages = useMemo(() => {
    return Math.ceil(filteredProducts.length / PAGE_SIZE) || 1
  }, [filteredProducts.length])

  // Lấy danh sách sản phẩm hiển thị của trang hiện tại
  const displayedProducts = useMemo(() => {
    if (!isOptimized) {
      // Khi TẮT tối ưu: Nhồi toàn bộ 10.000 sản phẩm vào DOM cùng lúc -> Lighthouse đỏ điểm (Score ~42)
      return filteredProducts
    }
    // Khi BẬT tối ưu: Phân trang mượt mà 12 sp/trang -> Lighthouse xanh điểm (Score 90-100)
    const startIndex = (currentPage - 1) * PAGE_SIZE
    return filteredProducts.slice(startIndex, startIndex + PAGE_SIZE)
  }, [filteredProducts, isOptimized, currentPage])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value))
    setCurrentPage(1)
  }, [dispatch])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (status === 'loading') {
    return (
      <div className="status-container">
        <Loader2 size={40} strokeWidth={1.5} className="spinner-icon" />
        <p className="status-text">Đang khởi tạo 10.000 sản phẩm...</p>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="status-container status-container--error">
        <AlertTriangle size={36} strokeWidth={1.5} />
        <p className="status-text">Lỗi: {error}</p>
        <button
          id="retry-fetch"
          className="btn btn--primary"
          style={{ width: 'auto', padding: '0 1.5rem' }}
          onClick={() => dispatch(fetchProducts())}
        >
          <RefreshCw size={14} strokeWidth={2} /> Thử lại
        </button>
      </div>
    )
  }

  return (
    <section aria-label="Danh sách sản phẩm">
      {/* Control Panel tối ưu */}
      <div style={{
        background: isOptimized ? '#E8F8F5' : '#FDEDEC',
        border: `1.5px solid ${isOptimized ? '#27AE60' : '#E74C3C'}`,
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: '1.05rem',
              fontWeight: 700,
              color: isOptimized ? '#1E8449' : '#C0392B',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {isOptimized ? <Zap size={20} /> : <ShieldAlert size={20} />}
              Chế độ: {isOptimized ? `ĐÃ TỐI ƯU HÓA ` : 'CHƯA TỐI ƯU HÓA'}
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#555' }}>
              Hiển thị: <strong>{displayedProducts.length.toLocaleString()}</strong> / <strong>{filteredProducts.length.toLocaleString()}</strong> sản phẩm (Trang {currentPage}/{totalPages}).
              {!isOptimized && ' ⚠️ Render 10.000 items trực tiếp gây giật lag nặng khi gõ tìm kiếm hoặc tương tác!'}
            </p>
          </div>

          <button
            onClick={() => dispatch(toggleOptimization())}
            className={`btn ${isOptimized ? 'btn--primary' : 'btn--ghost'}`}
            style={{
              width: 'auto',
              padding: '0 20px',
              height: '42px',
              fontWeight: 700,
              background: isOptimized ? '#27AE60' : '#C0392B',
              color: '#fff',
              borderColor: isOptimized ? '#27AE60' : '#C0392B',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            {isOptimized ? ' Tắt Tối Ưu ' : 'Bật Tối Ưu '}
          </button>
        </div>

        {/* Tìm kiếm */}
        <div style={{ position: 'relative', marginTop: '4px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            placeholder="Tìm kiếm trong 10.000 sản phẩm..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '10px 12px 10px 38px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Grid sản phẩm */}
      <div className="products-grid">
        {displayedProducts.map((product) => (
          isOptimized ? (
            <MemoizedProductCard key={product.id} product={product} />
          ) : (
            <ProductCard key={product.id} product={product} />
          )
        ))}
      </div>

      {/* Giao diện Phân Trang (Chỉ hiện khi ĐÃ TỐI ƯU) */}
      {isOptimized && totalPages > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          gap: '8px',
          marginTop: '36px',
          flexWrap: 'wrap'
        }}>
          <button
            className="btn btn--ghost"
            style={{ width: 'auto', padding: '0 16px', height: '36px' }}
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            « Trước
          </button>

          {/* Render các trang số */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
            let pageNum = currentPage
            if (currentPage <= 3) {
              pageNum = index + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + index
            } else {
              pageNum = currentPage - 2 + index
            }

            if (pageNum < 1 || pageNum > totalPages) return null

            const isActive = pageNum === currentPage

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: isActive ? 'none' : '1px solid #DDDEE6',
                  background: isActive ? '#C0392B' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#2B2D33',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {pageNum}
              </button>
            )
          })}

          <button
            className="btn btn--ghost"
            style={{ width: 'auto', padding: '0 16px', height: '36px' }}
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Sau »
          </button>

          <span style={{ fontSize: '0.85rem', color: '#666', marginLeft: '12px' }}>
            Trang <strong>{currentPage}</strong> / <strong>{totalPages}</strong> (Tổng 10.000 sản phẩm)
          </span>
        </div>
      )}
    </section>
  )
}

export default ProductList
