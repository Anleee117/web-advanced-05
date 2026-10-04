import React from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { addToCart } from '../cart/cartSlice'
import { selectIsInCart } from '../cart/cartSelectors'
import { useFavoritesStore } from '../favorites/favoritesStore'
import type { Product } from './productsSlice'
import { Heart, ShoppingCart, Check, Star } from '../../components/Icons'

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch()
  const isInCart = useAppSelector(selectIsInCart(product.id))

  const isFavorite = useFavoritesStore((state) => state.isFavorite(product.id))
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)

  const handleAddToCart = () => dispatch(addToCart(product))
  const handleToggleFavorite = () => toggleFavorite(product)

  return (
    <article className="product-card">
      {/* Image area with explicit aspect-ratio to fix CLS */}
      <div className="product-card__img-wrap">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="product-card__img"
          loading="lazy"
          width="150"
          height="150"
          decoding="async"
        />
        {/* Category badge */}
        <span className="product-card__category">{product.category}</span>

        {/* Favorite button */}
        <button
          id={`fav-${product.id}`}
          className={`favorite-btn ${isFavorite ? 'favorite-btn--active' : ''}`}
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          aria-pressed={isFavorite}
        >
          <Heart
            size={15}
            strokeWidth={2}
            fill={isFavorite ? '#C0392B' : 'none'}
            color={isFavorite ? '#C0392B' : '#9799A3'}
          />
        </button>
      </div>

      {/* Body */}
      <div className="product-card__body">
        <h3 className="product-card__title">{product.title}</h3>

        {/* Meta — Alignment: rating trái, giá phải */}
        <div className="product-card__meta">
          <div className="product-card__rating">
            <Star size={12} fill="#D4740F" color="#D4740F" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
          <span className="product-card__price">${product.price.toFixed(2)}</span>
        </div>
      </div>

      {/* Footer — CTA */}
      <div className="product-card__footer">
        <button
          id={`add-to-cart-${product.id}`}
          className={`btn ${isInCart ? 'btn--in-cart' : 'btn--primary'}`}
          onClick={handleAddToCart}
          aria-label={isInCart ? 'Thêm thêm vào giỏ' : 'Thêm vào giỏ hàng'}
        >
          {isInCart ? (
            <>
              <Check size={14} strokeWidth={2.5} /> Thêm nữa
            </>
          ) : (
            <>
              <ShoppingCart size={14} strokeWidth={2} /> Thêm vào giỏ
            </>
          )}
        </button>
      </div>
    </article>
  )
}

export default ProductCard
