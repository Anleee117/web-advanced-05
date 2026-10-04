import React from 'react'
import { useFavoritesStore } from './favoritesStore'
import { Heart, X } from '../../components/Icons'

const FavoritesPanel: React.FC = () => {
  const items = useFavoritesStore((state) => state.items)
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite)

  return (
    <aside className="favorites-panel" aria-label="Sản phẩm yêu thích">
      {/* Header — flat red, no gradient */}
      <div className="favorites-panel__header">
        <h2 className="favorites-panel__title">
          <Heart className="fav-icon" size={18} fill="white" color="white" strokeWidth={2} />
          Yêu Thích
        </h2>
        <span className="favorites-badge">{items.length}</span>
      </div>

      {items.length === 0 ? (
        <div className="favorites-panel__empty">
          <Heart size={48} strokeWidth={1} color="#C1C3CC" />
          <p>Chưa có sản phẩm yêu thích</p>
          <span className="empty-hint">Nhấn icon tim để thêm sản phẩm bạn thích!</span>
        </div>
      ) : (
        <ul className="favorites-list" role="list">
          {items.map((item) => (
            <li key={item.id} className="favorites-item">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="favorites-item__img"
              />
              <div className="favorites-item__details">
                <p className="favorites-item__name">{item.title}</p>
                <span className="favorites-item__price">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <button
                id={`remove-fav-${item.id}`}
                className="favorites-item__remove"
                onClick={() => removeFavorite(item.id)}
                aria-label={`Xoá ${item.title} khỏi yêu thích`}
              >
                <X size={10} strokeWidth={2.5} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}

export default FavoritesPanel
