// frontend/src/components/Search.jsx
// React component: Medicine search + details display

import React, { useEffect, useState } from 'react';
import MedicineResult from './MedicineResult';

const Search = () => {
  // -----------------------------
  // State management
  // -----------------------------
  // query: text entered by the user
  // result: medicine object returned by the API
  // isLoading: request in progress indicator
  // error: error message (e.g., Not Found)
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // -----------------------------
  // API call function
  // -----------------------------
  // Calls GET /api/medicine/:name and updates state accordingly
  const handleSearch = async (q) => {
    const name = (q ?? query).trim();
    if (!name) {
      setError('');
      setResult(null);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setResult(null);

      const res = await fetch(`/api/medicine/${encodeURIComponent(name)}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError('Not Found');
          setResult(null);
          return;
        }
        const msg = await res.text();
        throw new Error(msg || 'Request failed');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------
  // Debounced search on query change (optional UX enhancement)
  // -----------------------------
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      // Clear results for very short or empty queries
      setError('');
      setResult(null);
      return undefined;
    }

    const tid = setTimeout(() => {
      handleSearch(trimmed);
    }, 500);

    return () => clearTimeout(tid);
  }, [query]);

  // Form submit handler to trigger search immediately
  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="search">
      <h2 className="search__title">Drug Information Hub</h2>

      {/* Search bar */}
      <form className="search__form" onSubmit={onSubmit}>
        <input
          className="search__input"
          type="text"
          placeholder="Search medicine by name (e.g., Paracetamol 500)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary search__button" type="submit" disabled={isLoading}>
          {isLoading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {/* Error / Not Found */}
      {error && <p className="search__error">{error}</p>}

      {/* Result display */}
      {result && (
        <div className="search__result">
          <MedicineResult 
            medicine={{
              ...result,
              aiGenerated: result.aiGenerated || result.source?.includes('FDA') || result.source?.includes('AI')
            }}
            verification={null}
            showPriceComparison={true}
          />
        </div>
      )}
    </div>
  );
};

export default Search;
