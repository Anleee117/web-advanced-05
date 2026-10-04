import React from 'react'
import { useAppSelector } from '../app/hooks'
import { selectCartCount, selectCartTotal } from '../features/cart/cartSelectors'
import { useFavoritesStore } from '../features/favorites/favoritesStore'
import { Store, Heart, ShoppingCart } from './Icons'

interface HeaderProps {
  onCartClick: () => void
  onFavClick: () => void
  cartOpen: boolean
  favOpen: boolean
}

const Header: React.FC<HeaderProps> = ({ onCartClick, onFavClick, cartOpen, favOpen }) => {
  const count = useAppSelector(selectCartCount)
  const total = useAppSelector(selectCartTotal)
  const favCount = useFavoritesStore((state) => state.items.length)

  return (
    <header className="header" role="banner">
      <div className="header__inner">
        {/* Brand */}
        <div className="header__brand">
          <Store className="brand-icon" size={26} strokeWidth={1.75} />
          <h1 className="brand-name">ShopVN</h1>
        </div>

        {/* Actions */}
        <div className="header__actions">
          {/* Favorites — Outlined */}
          <button
            id="fav-toggle-btn"
            className={`fav-toggle ${favOpen ? 'fav-toggle--active' : ''}`}
            onClick={onFavClick}
            aria-label={`Yêu thích (${favCount} sản phẩm)`}
            aria-expanded={favOpen}
          >
            <Heart className="fav-toggle__icon" size={16} strokeWidth={2} />
            <span className="fav-toggle__info">
              <span className="fav-toggle__label">Yêu thích</span>
              <span className="fav-toggle__count">{favCount} sp</span>
            </span>
            {favCount > 0 && (
              <span className="fav-toggle__badge" aria-hidden="true">
                {favCount}
              </span>
            )}
          </button>

          {/* Cart — Filled primary */}
          <button
            id="cart-toggle-btn"
            className={`cart-toggle ${cartOpen ? 'cart-toggle--active' : ''}`}
            onClick={onCartClick}
            aria-label={`Giỏ hàng (${count} sản phẩm, tổng $${total.toFixed(2)})`}
            aria-expanded={cartOpen}
          >
            <ShoppingCart className="cart-toggle__icon" size={16} strokeWidth={2} />
            <span className="cart-toggle__info">
              <span className="cart-toggle__label">Giỏ hàng</span>
              <span className="cart-toggle__total">${total.toFixed(2)}</span>
            </span>
            {count > 0 && (
              <span className="cart-toggle__badge" aria-hidden="true">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
