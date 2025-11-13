// backend/src/services/drugInteractionService.js
// Service for checking drug interactions using NIH RxNav API

const https = require('https');

const RXNAV_BASE_URL = 'https://rxnav.nlm.nih.gov/REST';

// Common known interactions (fallback database)
const KNOWN_INTERACTIONS = {
  // Blood thinners
  'warfarin_aspirin': {
    description: 'The risk or severity of bleeding can be increased when Warfarin is combined with Aspirin.',
    severity: 'High',
  },
  'warfarin_ibuprofen': {
    description: 'Ibuprofen may increase the anticoagulant activities of Warfarin, increasing bleeding risk.',
    severity: 'High',
  },
  'warfarin_naproxen': {
    description: 'Naproxen may increase the anticoagulant activities of Warfarin.',
    severity: 'High',
  },
  // NSAIDs
  'aspirin_ibuprofen': {
    description: 'Ibuprofen may decrease the cardioprotective effects of low-dose Aspirin.',
    severity: 'Moderate',
  },
  'aspirin_naproxen': {
    description: 'Taking these together may increase the risk of stomach bleeding.',
    severity: 'Moderate',
  },
  'ibuprofen_naproxen': {
    description: 'Do not take multiple NSAIDs together as it increases risk of side effects.',
    severity: 'High',
  },
  // Diabetes
  'metformin_alcohol': {
    description: 'Alcohol may increase the risk of lactic acidosis in patients taking Metformin.',
    severity: 'High',
  },
  // Antibiotics
  'amoxicillin_methotrexate': {
    description: 'Amoxicillin may decrease the excretion rate of Methotrexate.',
    severity: 'Moderate',
  },
  // Cholesterol
  'simvastatin_grapefruit': {
    description: 'Grapefruit may increase the serum concentration of Simvastatin.',
    severity: 'High',
  },
};

/**
 * Make HTTPS request to RxNav API
 */
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error('Failed to parse API response'));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Extract generic drug name from medicine name (remove dosage, brand info)
 * Example: "Paracetamol 500mg" -> "paracetamol"
 */
function extractGenericName(medicineName) {
  if (!medicineName) return '';
  
  // Remove dosage information (e.g., "500mg", "20%", "I.P.")
  let cleaned = medicineName
    .toLowerCase()
    .replace(/\d+\s*(mg|g|ml|mcg|%|i\.p\.|tablets?|capsules?)/gi, '')
    .trim();
  
  // Take first word (usually the generic name)
  const firstWord = cleaned.split(/\s+/)[0];
  
  return firstWord;
}

/**
 * Check known interactions database (fallback)
 */
function checkKnownInteractions(generic1, generic2) {
  const key1 = `${generic1}_${generic2}`;
  const key2 = `${generic2}_${generic1}`;
  
  if (KNOWN_INTERACTIONS[key1]) {
    return [{
      ...KNOWN_INTERACTIONS[key1],
      drug1: generic1,
      drug2: generic2,
      source: 'internal_database',
    }];
  }
  
  if (KNOWN_INTERACTIONS[key2]) {
    return [{
      ...KNOWN_INTERACTIONS[key2],
      drug1: generic2,
      drug2: generic1,
      source: 'internal_database',
    }];
  }
  
  return [];
}

/**
 * Get RxCUI (RxNorm Concept Unique Identifier) for a drug name
 */
async function getRxCUI(drugName) {
  try {
    const genericName = extractGenericName(drugName);
    if (!genericName) {
      throw new Error('Invalid drug name');
    }

    const url = `${RXNAV_BASE_URL}/rxcui.json?name=${encodeURIComponent(genericName)}`;
    const data = await makeRequest(url);

    if (data.idGroup && data.idGroup.rxnormId && data.idGroup.rxnormId.length > 0) {
      return data.idGroup.rxnormId[0];
    }

    return null;
  } catch (error) {
    console.error(`Error getting RxCUI for ${drugName}:`, error.message);
    return null;
  }
}

/**
 * Get drug interactions between two medicines
 */
async function checkInteractions(medicine1Name, medicine2Name) {
  try {
    const generic1 = extractGenericName(medicine1Name);
    const generic2 = extractGenericName(medicine2Name);

    // First, check our known interactions database
    let interactions = checkKnownInteractions(generic1, generic2);
    
    // Try to get RxCUIs for additional information
    let rxcui1 = null;
    let rxcui2 = null;
    
    try {
      rxcui1 = await getRxCUI(medicine1Name);
      rxcui2 = await getRxCUI(medicine2Name);
      
      // If we have both RxCUIs, try the NIH API (currently has endpoint issues)
      // Keeping this for when the API is available
      if (rxcui1 && rxcui2 && interactions.length === 0) {
        try {
          const url = `${RXNAV_BASE_URL}/interaction/list.json?rxcuis=${rxcui1}+${rxcui2}`;
          const data = await makeRequest(url);
          
          // Parse NIH response if available
          if (data.fullInteractionTypeGroup && data.fullInteractionTypeGroup.length > 0) {
            for (const group of data.fullInteractionTypeGroup) {
              if (group.fullInteractionType && group.fullInteractionType.length > 0) {
                for (const type of group.fullInteractionType) {
                  if (type.interactionPair && type.interactionPair.length > 0) {
                    for (const pair of type.interactionPair) {
                      interactions.push({
                        description: pair.description || 'Drug interaction detected',
                        severity: pair.severity || 'N/A',
                        drug1: pair.interactionConcept?.[0]?.minConceptItem?.name || medicine1Name,
                        drug2: pair.interactionConcept?.[1]?.minConceptItem?.name || medicine2Name,
                        source: 'nih_rxnav',
                      });
                    }
                  }
                }
              }
            }
          }
        } catch (apiError) {
          console.log('NIH API not available, using known interactions database');
        }
      }
    } catch (rxcuiError) {
      console.log('Could not get RxCUI, using known interactions database');
    }

    return {
      success: true,
      medicine1: { 
        name: medicine1Name, 
        genericName: generic1,
        rxcui: rxcui1 
      },
      medicine2: { 
        name: medicine2Name, 
        genericName: generic2,
        rxcui: rxcui2 
      },
      hasInteractions: interactions.length > 0,
      interactionCount: interactions.length,
      interactions: interactions,
      checkedAt: new Date().toISOString(),
      note: interactions.length > 0 ? 
        'Interaction found in database' : 
        'No known interactions found. Always consult your doctor.',
    };

  } catch (error) {
    console.error('Error checking drug interactions:', error.message);
    return {
      success: false,
      error: error.message,
      message: 'Failed to check drug interactions. Please try again later.',
      interactions: [],
    };
  }
}

/**
 * Check interactions for multiple medicines (batch check)
 */
async function checkMultipleInteractions(medicineNames) {
  try {
    if (!Array.isArray(medicineNames) || medicineNames.length < 2) {
      throw new Error('At least two medicines are required');
    }

    const results = [];
    const allInteractions = [];

    // Check each pair of medicines
    for (let i = 0; i < medicineNames.length; i++) {
      for (let j = i + 1; j < medicineNames.length; j++) {
        const result = await checkInteractions(medicineNames[i], medicineNames[j]);
        
        if (result.hasInteractions) {
          allInteractions.push({
            medicine1: medicineNames[i],
            medicine2: medicineNames[j],
            interactions: result.interactions,
          });
        }
        
        results.push(result);
      }
    }

    return {
      success: true,
      medicinesChecked: medicineNames,
      totalPairsChecked: results.length,
      interactionsFound: allInteractions.length > 0,
      allInteractions: allInteractions,
      detailedResults: results,
      checkedAt: new Date().toISOString(),
    };

  } catch (error) {
    console.error('Error in batch interaction check:', error.message);
    return {
      success: false,
      error: error.message,
      allInteractions: [],
    };
  }
}

module.exports = {
  checkInteractions,
  checkMultipleInteractions,
  getRxCUI,
  extractGenericName,
};
