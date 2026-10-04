import React, { useState } from 'react'
import ProductList from './features/products/ProductList'
import CartPanel from './features/cart/CartPanel'
import FavoritesPanel from './features/favorites/FavoritesPanel'
import Header from './components/Header'

const App: React.FC = () => {
  const [cartOpen, setCartOpen] = useState(false)
  const [favOpen, setFavOpen] = useState(false)

  const handleCartClick = () => {
    setCartOpen((prev) => !prev)
    setFavOpen(false)
  }

  const handleFavClick = () => {
    setFavOpen((prev) => !prev)
    setCartOpen(false)
  }

  return (
    <div className="app">
      <Header
        onCartClick={handleCartClick}
        onFavClick={handleFavClick}
        cartOpen={cartOpen}
        favOpen={favOpen}
      />

      <main className="main-layout">
        <div className="main-layout__products">
          <div className="section-header">
            <h2 className="section-title">Danh Sách Sản Phẩm</h2>
          </div>
          <ProductList />
        </div>

        {/* Favorites sidebar */}
        <div className={`main-layout__sidebar ${favOpen ? 'main-layout__sidebar--open' : ''}`}>
          <FavoritesPanel />
        </div>

        {/* Cart sidebar */}
        <div className={`main-layout__cart ${cartOpen ? 'main-layout__cart--open' : ''}`}>
          <CartPanel />
        </div>
      </main>

      {/* Mobile overlay */}
      {(cartOpen || favOpen) && (
        <div
          className="overlay"
          onClick={() => { setCartOpen(false); setFavOpen(false) }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export default App
