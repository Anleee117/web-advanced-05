import React from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { removeFromCart, updateQuantity, clearCart } from './cartSlice'
import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
} from './cartSelectors'
import { ShoppingCart, ShoppingBag, X, Minus, Plus, Trash2 } from '../../components/Icons'

const CartPanel: React.FC = () => {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)
  const count = useAppSelector(selectCartCount)

  const handleQuantityChange = (id: number, newQty: number) => {
    dispatch(updateQuantity({ id, quantity: newQty }))
  }

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id))
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  if (items.length === 0) {
    return (
      <aside className="cart-panel" aria-label="Giỏ hàng">
        <div className="cart-panel__header">
          <h2 className="cart-panel__title">
            <ShoppingCart className="cart-icon" size={18} strokeWidth={2} /> Giỏ Hàng
          </h2>
          <span className="cart-badge">0</span>
        </div>
        <div className="cart-panel__empty">
          <ShoppingBag size={48} strokeWidth={1} color="#C1C3CC" />
          <p>Giỏ hàng của bạn đang trống</p>
          <span className="empty-hint">Thêm sản phẩm để bắt đầu mua sắm!</span>
        </div>
      </aside>
    )
  }

  return (
    <aside className="cart-panel" aria-label="Giỏ hàng">
      <div className="cart-panel__header">
        <h2 className="cart-panel__title">
          <ShoppingCart className="cart-icon" size={18} strokeWidth={2} /> Giỏ Hàng
        </h2>
        <span className="cart-badge">{count}</span>
      </div>

      <ul className="cart-list" role="list">
        {items.map((item) => (
          <li key={item.id} className="cart-item">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="cart-item__img"
            />
            <div className="cart-item__details">
              <p className="cart-item__name">{item.title}</p>
              <span className="cart-item__unit-price">
                ${item.price.toFixed(2)} / cái
              </span>
              <div className="cart-item__controls">
                <div className="qty-control">
                  <button
                    id={`dec-qty-${item.id}`}
                    className="qty-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    aria-label="Giảm số lượng"
                  >
                    <Minus size={12} strokeWidth={2.5} />
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    id={`inc-qty-${item.id}`}
                    className="qty-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    aria-label="Tăng số lượng"
                  >
                    <Plus size={12} strokeWidth={2.5} />
                  </button>
                </div>
                <span className="cart-item__subtotal">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
            <button
              id={`remove-${item.id}`}
              className="cart-item__remove"
              onClick={() => handleRemove(item.id)}
              aria-label={`Xoá ${item.title} khỏi giỏ`}
            >
              <X size={10} strokeWidth={2.5} />
            </button>
          </li>
        ))}
      </ul>

      <div className="cart-panel__footer">
        <div className="cart-summary">
          <div className="cart-summary__row">
            <span>Số lượng:</span>
            <strong>{count} sản phẩm</strong>
          </div>
          <div className="cart-summary__row cart-summary__total">
            <span>Tổng cộng:</span>
            <strong className="total-price">${total.toFixed(2)}</strong>
          </div>
        </div>
        <button id="checkout-btn" className="btn btn--primary btn--full">
          <ShoppingCart size={14} strokeWidth={2} /> Thanh toán
        </button>
        <button
          id="clear-cart-btn"
          className="btn btn--ghost btn--full"
          onClick={handleClearCart}
        >
          <Trash2 size={14} strokeWidth={2} /> Xoá giỏ hàng
        </button>
      </div>
    </aside>
  )
}

export default CartPanel
