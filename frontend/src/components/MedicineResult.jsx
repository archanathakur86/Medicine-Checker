// frontend/src/components/MedicineResult.jsx
// Professional medicine results page with comprehensive information

import React, { useState } from 'react';
import PriceComparison from './PriceComparison';

const MedicineResult = ({ 
  medicine, 
  verification = null,
  showPriceComparison = true 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Determine confidence level based on score
  const getConfidenceLevel = (score) => {
    if (score >= 85) return 'HIGH';
    if (score >= 65) return 'MEDIUM';
    return 'LOW';
  };

  // Get status display text and styling
  const getStatusInfo = (status) => {
    const statusMap = {
      authentic: {
        label: 'Verified Authentic',
        className: 'verification-box--genuine',
        icon: '✓',
        description: 'This medicine appears to be authentic based on AI analysis.',
        color: '#27ae60'
      },
      genuine: {
        label: 'Verified Authentic',
        className: 'verification-box--genuine',
        icon: '✓',
        description: 'This medicine appears to be authentic based on AI analysis.',
        color: '#27ae60'
      },
      suspect: {
        label: 'Needs Verification',
        className: 'verification-box--suspect',
        icon: '⚠',
        description: 'Some inconsistencies detected. Manual verification recommended.',
        color: '#f39c12'
      },
      counterfeit: {
        label: 'Potentially Counterfeit',
        className: 'verification-box--counterfeit',
        icon: '✗',
        description: 'Significant red flags detected. DO NOT USE - Consult a pharmacist.',
        color: '#e74c3c'
      }
    };
    return statusMap[status?.toLowerCase()] || statusMap.suspect;
  };

  const confidenceLevel = verification?.score 
    ? getConfidenceLevel(verification.score) 
    : null;
  
  const statusInfo = verification?.status 
    ? getStatusInfo(verification.status) 
    : null;

  return (
    <div className="medicine-result-container">
      {/* Hero Section with Medicine Name and Verification */}
      <div className="medicine-hero glass-card">
        <div className="medicine-hero__content">
          <div className="medicine-hero__badge">
            {medicine.category || 'Pharmaceutical'}
          </div>
          <h1 className="medicine-hero__name gradient-text">
            <span className="float-icon">💊</span> {medicine.name}
          </h1>
          {medicine.genericName && medicine.genericName !== medicine.name && (
            <p className="medicine-hero__generic">{medicine.genericName}</p>
          )}
          <div className="medicine-hero__meta">
            <span className="meta-item">
              <strong>🏭</strong> {medicine.manufacturer || 'Various Manufacturers'}
            </span>
            {medicine.route && (
              <span className="meta-item">
                <strong>💉</strong> {medicine.route}
              </span>
            )}
          </div>
        </div>

        {/* Verification Status Badge */}
        {verification && statusInfo && (
          <div className={`verification-badge ${statusInfo.className} glow-effect`}>
            <div className="verification-badge__icon">{statusInfo.icon}</div>
            <div className="verification-badge__content">
              <h3>{statusInfo.label}</h3>
              {confidenceLevel && (
                <span className={`confidence-tag confidence-tag--${confidenceLevel.toLowerCase()}`}>
                  {confidenceLevel} CONFIDENCE
                </span>
              )}
              {verification.score !== undefined && (
                <div className="verification-score">
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{width: `${verification.score}%`, backgroundColor: statusInfo.color}}
                    ></div>
                  </div>
                  <span className="score-text">{verification.score}/100</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="medicine-tabs">
        <button 
          className={`medicine-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="tab-icon">📋</span> Overview
        </button>
        <button 
          className={`medicine-tab ${activeTab === 'benefits' ? 'active' : ''}`}
          onClick={() => setActiveTab('benefits')}
        >
          <span className="tab-icon">✨</span> Benefits
        </button>
        <button 
          className={`medicine-tab ${activeTab === 'usage' ? 'active' : ''}`}
          onClick={() => setActiveTab('usage')}
        >
          <span className="tab-icon">⏰</span> How to Use
        </button>
        <button 
          className={`medicine-tab ${activeTab === 'sideeffects' ? 'active' : ''}`}
          onClick={() => setActiveTab('sideeffects')}
        >
          <span className="tab-icon">⚠️</span> Side Effects
        </button>
        <button 
          className={`medicine-tab ${activeTab === 'price' ? 'active' : ''}`}
          onClick={() => setActiveTab('price')}
        >
          <span className="tab-icon">💰</span> Best Price
        </button>
      </div>

      {/* Tab Content */}
      <div className="medicine-content">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-panel fade-in">
            <div className="content-grid">
              
              {/* Description Card */}
              <div className="info-card glass-card zoom-in">
                <div className="info-card__header">
                  <span className="info-card__icon">📖</span>
                  <h2>What is {medicine.name}?</h2>
                </div>
                <p className="info-card__description">
                  {medicine.description || `${medicine.name} is a pharmaceutical medication used for medical treatment.`}
                </p>
              </div>

              {/* Quick Facts */}
              <div className="info-card glass-card zoom-in">
                <div className="info-card__header">
                  <span className="info-card__icon">⚡</span>
                  <h2>Quick Facts</h2>
                </div>
                <div className="quick-facts">
                  {medicine.dosage && (
                    <div className="fact-item">
                      <span className="fact-label">💊 Dosage Form</span>
                      <span className="fact-value">{medicine.dosage.substring(0, 100)}</span>
                    </div>
                  )}
                  {medicine.category && (
                    <div className="fact-item">
                      <span className="fact-label">🏷️ Category</span>
                      <span className="fact-value">{medicine.category}</span>
                    </div>
                  )}
                  {medicine.route && (
                    <div className="fact-item">
                      <span className="fact-label">💉 Administration</span>
                      <span className="fact-value">{medicine.route}</span>
                    </div>
                  )}
                  {medicine.source && (
                    <div className="fact-item">
                      <span className="fact-label">📊 Data Source</span>
                      <span className="fact-value badge badge-info">{medicine.source}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Verification Details */}
              {verification && verification.hints && verification.hints.length > 0 && (
                <div className="info-card glass-card zoom-in info-card--full">
                  <div className="info-card__header">
                    <span className="info-card__icon">🔍</span>
                    <h2>AI Analysis Details</h2>
                  </div>
                  <ul className="analysis-list">
                    {verification.hints.map((hint, idx) => (
                      <li key={idx} className="analysis-item slide-in-left">
                        <span className="analysis-bullet">✓</span>
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Benefits Tab */}
        {activeTab === 'benefits' && (
          <div className="tab-panel fade-in">
            <div className="benefits-section">
              <div className="section-header">
                <h2 className="gradient-text">✨ Benefits & Advantages</h2>
                <p>Why this medicine is prescribed and how it helps</p>
              </div>
              
              <div className="benefits-grid">
                {medicine.benefits && medicine.benefits.length > 0 ? (
                  medicine.benefits.map((benefit, idx) => (
                    <div key={idx} className="benefit-card glass-card zoom-in">
                      <div className="benefit-number">{idx + 1}</div>
                      <p className="benefit-text">{benefit}</p>
                    </div>
                  ))
                ) : (
                  <div className="benefit-card glass-card">
                    <div className="benefit-number">1</div>
                    <p className="benefit-text">Effective treatment as prescribed by healthcare professional</p>
                  </div>
                )}
              </div>

              {/* Contraindications */}
              {medicine.contraindications && medicine.contraindications.length > 0 && (
                <div className="warning-card glass-card">
                  <div className="warning-card__header">
                    <span className="warning-icon">🚫</span>
                    <h3>Who Should NOT Take This Medicine</h3>
                  </div>
                  <ul className="warning-list">
                    {medicine.contraindications.map((contra, idx) => (
                      <li key={idx}>
                        <span className="bullet-icon">⚠️</span>
                        {contra}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Usage Tab */}
        {activeTab === 'usage' && (
          <div className="tab-panel fade-in">
            <div className="usage-section">
              <div className="section-header">
                <h2 className="gradient-text">⏰ How & When to Take</h2>
                <p>Important dosage and timing information</p>
              </div>

              <div className="usage-grid">
                {/* When to Take */}
                <div className="usage-card glass-card glow-effect">
                  <div className="usage-card__icon">🕐</div>
                  <h3>Best Time to Take</h3>
                  <p className="usage-timing">
                    {medicine.whenToTake?.timing || medicine.dosageInfo?.timing || 'As directed by your physician'}
                  </p>
                  <div className="usage-note">
                    <strong>With Food:</strong> {medicine.whenToTake?.withFood || medicine.dosageInfo?.withFood || 'Check label'}
                  </div>
                </div>

                {/* Dosage Instructions */}
                <div className="usage-card glass-card">
                  <div className="usage-card__icon">💊</div>
                  <h3>Dosage Instructions</h3>
                  <p className="usage-instructions">
                    {medicine.dosage || 'Follow your doctor\'s prescription'}
                  </p>
                </div>

                {/* Important Instructions */}
                <div className="usage-card glass-card usage-card--full">
                  <div className="usage-card__icon">📌</div>
                  <h3>Important Instructions</h3>
                  <ul className="instruction-list">
                    {medicine.whenToTake?.instructions ? (
                      medicine.whenToTake.instructions.map((instruction, idx) => (
                        <li key={idx}>
                          <span className="check-icon">✓</span>
                          {instruction}
                        </li>
                      ))
                    ) : (
                      <>
                        <li><span className="check-icon">✓</span> Take exactly as prescribed</li>
                        <li><span className="check-icon">✓</span> Do not skip doses</li>
                        <li><span className="check-icon">✓</span> Complete the full course</li>
                        <li><span className="check-icon">✓</span> Consult doctor if you miss a dose</li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Storage */}
                {medicine.storage && (
                  <div className="usage-card glass-card usage-card--full">
                    <div className="usage-card__icon">🌡️</div>
                    <h3>Storage & Handling</h3>
                    <p className="storage-info">{medicine.storage}</p>
                  </div>
                )}

                {/* Drug Interactions */}
                {medicine.interactions && medicine.interactions.length > 0 && (
                  <div className="usage-card glass-card usage-card--full warning-border">
                    <div className="usage-card__icon">⚠️</div>
                    <h3>Drug Interactions</h3>
                    <p className="interaction-note">Inform your doctor if you are taking:</p>
                    <ul className="interaction-list">
                      {medicine.interactions.map((interaction, idx) => (
                        <li key={idx}>
                          <span className="dot-icon">•</span>
                          {interaction}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Side Effects Tab */}
        {activeTab === 'sideeffects' && (
          <div className="tab-panel fade-in">
            <div className="sideeffects-section">
              <div className="section-header">
                <h2 className="gradient-text">⚠️ Side Effects & Warnings</h2>
                <p>Be aware of potential side effects and warnings</p>
              </div>

              <div className="sideeffects-grid">
                {/* Common Side Effects */}
                {medicine.sideEffects && (
                  <>
                    {medicine.sideEffects.common && medicine.sideEffects.common.length > 0 && (
                      <div className="sideeffect-card glass-card">
                        <div className="sideeffect-header sideeffect-header--common">
                          <span className="sideeffect-icon">💊</span>
                          <h3>Common Side Effects</h3>
                          <span className="sideeffect-badge badge-info">Usually Mild</span>
                        </div>
                        <ul className="sideeffect-list">
                          {medicine.sideEffects.common.map((effect, idx) => (
                            <li key={idx}>
                              <span className="bullet">•</span>
                              {effect}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Serious Side Effects */}
                    {medicine.sideEffects.serious && medicine.sideEffects.serious.length > 0 && (
                      <div className="sideeffect-card glass-card">
                        <div className="sideeffect-header sideeffect-header--serious">
                          <span className="sideeffect-icon">⚠️</span>
                          <h3>Serious Side Effects</h3>
                          <span className="sideeffect-badge badge-warning">Seek Medical Help</span>
                        </div>
                        <ul className="sideeffect-list">
                          {medicine.sideEffects.serious.map((effect, idx) => (
                            <li key={idx}>
                              <span className="bullet">⚠</span>
                              {effect}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Rare Side Effects */}
                    {medicine.sideEffects.rare && medicine.sideEffects.rare.length > 0 && (
                      <div className="sideeffect-card glass-card">
                        <div className="sideeffect-header sideeffect-header--rare">
                          <span className="sideeffect-icon">🔴</span>
                          <h3>Rare Side Effects</h3>
                          <span className="sideeffect-badge badge-danger">Emergency</span>
                        </div>
                        <ul className="sideeffect-list">
                          {medicine.sideEffects.rare.map((effect, idx) => (
                            <li key={idx}>
                              <span className="bullet">!</span>
                              {effect}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                {/* Old format support */}
                {Array.isArray(medicine.sideEffects) && (
                  <div className="sideeffect-card glass-card">
                    <div className="sideeffect-header">
                      <span className="sideeffect-icon">💊</span>
                      <h3>Side Effects</h3>
                    </div>
                    <ul className="sideeffect-list">
                      {medicine.sideEffects.map((effect, idx) => (
                        <li key={idx}>
                          <span className="bullet">•</span>
                          {effect}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings */}
                {medicine.warnings && medicine.warnings.length > 0 && (
                  <div className="sideeffect-card glass-card sideeffect-card--full warning-border glow-effect">
                    <div className="sideeffect-header sideeffect-header--warning">
                      <span className="sideeffect-icon">🚨</span>
                      <h3>Important Warnings</h3>
                    </div>
                    <ul className="warning-list-detailed">
                      {medicine.warnings.map((warning, idx) => (
                        <li key={idx} className="warning-item">
                          <span className="warning-number">{idx + 1}</span>
                          <p>{warning}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Emergency Contact */}
                <div className="emergency-card glass-card">
                  <div className="emergency-icon">🚑</div>
                  <h3>When to Seek Emergency Help</h3>
                  <p>Contact emergency services immediately if you experience:</p>
                  <ul className="emergency-list">
                    <li>Difficulty breathing or swallowing</li>
                    <li>Severe allergic reaction (rash, itching, swelling)</li>
                    <li>Chest pain or irregular heartbeat</li>
                    <li>Loss of consciousness</li>
                    <li>Any severe unexpected symptoms</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Price Tab */}
        {activeTab === 'price' && showPriceComparison && (
          <div className="tab-panel fade-in">
            <div className="price-section">
              <div className="section-header">
                <h2 className="gradient-text">💰 Find Best Price</h2>
                <p>Compare prices from trusted pharmacies</p>
              </div>
              <div className="price-wrapper glass-card">
                <PriceComparison 
                  medicineName={medicine.name} 
                  dosage={medicine.dosage}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer Footer */}
      <div className="medicine-disclaimer glass-card">
        <div className="disclaimer-icon">⚕️</div>
        <div className="disclaimer-content">
          <h4>Medical Disclaimer</h4>
          <p>
            {medicine.disclaimer || 
              'This information is provided for educational purposes only and is not a substitute for professional medical advice. Always consult with a qualified healthcare provider before starting, stopping, or changing any medication. Verify medicine authenticity with a licensed pharmacist.'}
          </p>
          {medicine.lastUpdated && (
            <p className="disclaimer-date">Last updated: {medicine.lastUpdated}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineResult;
