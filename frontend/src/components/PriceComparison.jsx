// frontend/src/components/PriceComparison.jsx
// Price comparison component with "Find Lowest Price" button

import React, { useState } from 'react';

const PriceComparison = ({ medicineName, dosage }) => {
  const [loading, setLoading] = useState(false);
  const [priceData, setPriceData] = useState(null);
  const [error, setError] = useState(null);
  const [showPrices, setShowPrices] = useState(false);

  const fetchPrices = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = dosage 
        ? `/api/price/${encodeURIComponent(medicineName)}?dosage=${encodeURIComponent(dosage)}`
        : `/api/price/${encodeURIComponent(medicineName)}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setPriceData(data);
        setShowPrices(true);
      } else {
        setError(data.error || 'Failed to fetch prices');
      }
    } catch (err) {
      setError('Unable to fetch prices. Please try again.');
      console.error('Price fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  const getStockBadge = (inStock) => {
    return inStock ? (
      <span className="stock-badge stock-badge--in-stock">✓ In Stock</span>
    ) : (
      <span className="stock-badge stock-badge--out-of-stock">Out of Stock</span>
    );
  };

  const getRatingStars = (rating) => {
    return '⭐'.repeat(Math.floor(rating));
  };

  return (
    <div className="price-comparison">
      {!showPrices ? (
        <button 
          className="btn-find-price"
          onClick={fetchPrices}
          disabled={loading}
        >
          {loading ? '🔄 Finding Prices...' : '💰 Find Lowest Price'}
        </button>
      ) : (
        <div className="price-results">
          <div className="price-results__header">
            <h3>Price Comparison for {priceData.medicine?.name || medicineName}</h3>
            <button 
              className="btn-refresh"
              onClick={fetchPrices}
              disabled={loading}
            >
              🔄 Refresh
            </button>
          </div>

          {priceData.lowestPrice && (
            <div className="best-deal-banner">
              <div className="best-deal-banner__icon">🏆</div>
              <div className="best-deal-banner__content">
                <h4>Best Deal</h4>
                <p className="pharmacy-name">{priceData.lowestPrice.pharmacy}</p>
                <p className="price-value">{formatCurrency(priceData.lowestPrice.amount)}</p>
                {priceData.lowestPrice.savingsPercent > 0 && (
                  <p className="savings">
                    Save {formatCurrency(priceData.lowestPrice.savings)} ({priceData.lowestPrice.savingsPercent}%)
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="price-table">
            <div className="price-table__header">
              <span>Pharmacy</span>
              <span>Price</span>
              <span>Rating</span>
              <span>Delivery</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {priceData.prices.map((item, index) => {
              const isLowest = index === 0 && item.inStock;
              return (
              <div 
                key={index} 
                className={`price-table__row ${!item.inStock ? 'price-table__row--out-of-stock' : ''} ${isLowest ? 'price-table__row--best' : ''}`}
              >
                <div className="pharmacy-info">
                  <strong>{item.pharmacy}</strong>
                  {isLowest && <span className="badge-lowest">Lowest</span>}
                </div>
                
                <div className="price-info">
                  <span className="price-amount">{formatCurrency(item.price)}</span>
                  {item.discount > 0 && (
                    <span className="discount-badge">-{item.discount}%</span>
                  )}
                </div>

                <div className="rating-info">
                  <span>{getRatingStars(item.rating)}</span>
                  <span className="rating-value">{item.rating}</span>
                </div>

                <div className="delivery-info">
                  <span className="delivery-time">🚚 {item.deliveryTime}</span>
                </div>

                <div className="stock-info">
                  {getStockBadge(item.inStock)}
                </div>

                <div className="action-info">
                  {item.inStock && (
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-buy"
                    >
                      Buy Now →
                    </a>
                  )}
                </div>
              </div>
            );
            })}
          </div>

          {priceData.totalPharmacies > 0 && (
            <div className="price-summary">
              <p>
                Compared prices from <strong>{priceData.totalPharmacies} pharmacies</strong>
              </p>
              {priceData.note && (
                <p className="price-note">ℹ️ {priceData.note}</p>
              )}
            </div>
          )}

          <button 
            className="btn-hide-prices"
            onClick={() => setShowPrices(false)}
          >
            Hide Prices
          </button>
        </div>
      )}

      {error && (
        <div className="price-error">
          <p>⚠️ {error}</p>
        </div>
      )}
    </div>
  );
};

export default PriceComparison;
