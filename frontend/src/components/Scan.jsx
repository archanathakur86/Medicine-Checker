// frontend/src/components/Scan.jsx
// React component: Image upload + authenticity verification

import React, { useState } from 'react';
import MedicineResult from './MedicineResult';

const Scan = () => {
  // -----------------------------
  // State management
  // -----------------------------
  // Hold selected files (images) and API response/result
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null); // { score, status, ... }
  const [medicineInfo, setMedicineInfo] = useState(null); // Medicine details
  const [searchingMedicine, setSearchingMedicine] = useState(false);

  // Handle file input changes
  const handleFileChange = (e) => {
    setError('');
    setResult(null);
    const selected = Array.from(e.target.files || []);
    // Basic client-side validation: only images
    const valid = selected.filter((f) => f.type.startsWith('image/'));
    if (valid.length !== selected.length) {
      setError('Only image files are allowed.');
    }
    setFiles(valid);
  };

  // -----------------------------
  // API call: /api/verify
  // -----------------------------
  const handleVerify = async () => {
    setError('');
    setResult(null);

    if (!files.length) {
      setError('Please select at least one image to verify.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));

      // Use fetch to simulate calling the backend endpoint
      const res = await fetch('/api/verify', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Verification failed');
      }

      const data = await res.json();
      // Normalize API response to support both { score } and { authenticityScore }
      const normalizedScore =
        typeof data.score === 'number'
          ? data.score
          : typeof data.authenticityScore === 'number'
          ? data.authenticityScore
          : undefined;
      
      const verificationResult = { 
        score: normalizedScore, 
        status: data.status,
        hints: data.hints || [],
        batchNumber: data.batchNumber
      };
      
      setResult(verificationResult);

      // If batch number or medicine name detected, try to fetch medicine info
      if (data.batchNumber || data.medicineName) {
        await fetchMedicineInfo(data.batchNumber || data.medicineName);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Fetch medicine information from database or AI
  const fetchMedicineInfo = async (searchTerm) => {
    try {
      setSearchingMedicine(true);
      const res = await fetch(`/api/medicine/${encodeURIComponent(searchTerm)}`);
      
      if (res.ok) {
        const data = await res.json();
        setMedicineInfo(data);
      }
    } catch (err) {
      console.log('Could not fetch medicine info:', err.message);
      // Don't show error - medicine info is optional
    } finally {
      setSearchingMedicine(false);
    }
  };

  return (
    <div className="scan">
      <h2 className="scan__title">AI Authenticity Check</h2>

      {/* File input */}
      <div className="scan__uploader">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="scan__input"
        />
        {files.length > 0 && (
          <p className="scan__hint">{files.length} file(s) selected</p>
        )}
      </div>

      {/* Verify button */}
      <button
        className="btn btn-primary scan__button"
        onClick={handleVerify}
        disabled={loading}
      >
        {loading ? 'Verifying…' : 'Verify Medicine'}
      </button>

      {/* Error message */}
      {error && <p className="scan__error">{error}</p>}

      {/* Result area */}
      {result && (
        <div className="scan__result">
          {searchingMedicine && (
            <div className="loading-medicine">
              <p>🔍 Searching medicine information...</p>
            </div>
          )}
          
          {medicineInfo ? (
            <MedicineResult 
              medicine={medicineInfo} 
              verification={result}
              showPriceComparison={true}
            />
          ) : (
            <div className="verification-only">
              <h3>Verification Complete</h3>
              <div className="result__row">
                <span className="result__label">Authenticity Score:</span>
                <span className="result__value">{result.score}/100</span>
              </div>
              <div className="result__row">
                <span className="result__label">Status:</span>
                <span className={`result__value status--${(result.status || '').toLowerCase()}`}>
                  {result.status}
                </span>
              </div>
              {result.hints && result.hints.length > 0 && (
                <div className="result__hints">
                  <h4>Analysis Notes:</h4>
                  <ul>
                    {result.hints.map((hint, idx) => (
                      <li key={idx}>{hint}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.batchNumber && (
                <div className="result__row">
                  <span className="result__label">Detected Batch:</span>
                  <span className="result__value">{result.batchNumber}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Scan;
