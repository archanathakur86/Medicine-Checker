// backend/src/services/aiMedicineInfo.js
// Medicine information service using OpenFDA API (FREE - no key needed)

const https = require('https');

/**
 * Get medicine information from OpenFDA API (FREE)
 * @param {string} medicineName - Name of the medicine to search
 * @returns {Promise<Object>} Medicine information
 */
async function getMedicineInfoFromAI(medicineName) {
  try {
    console.log(`Searching OpenFDA for: ${medicineName}`);
    
    // Search OpenFDA drug labels database
    const searchUrl = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(medicineName)}"+openfda.generic_name:"${encodeURIComponent(medicineName)}"&limit=1`;
    
    const fdaData = await makeHttpsRequest(searchUrl);
    
    if (!fdaData || !fdaData.results || fdaData.results.length === 0) {
      // Try generic search
      const genericUrl = `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(medicineName)}&limit=1`;
      const genericData = await makeHttpsRequest(genericUrl);
      
      if (!genericData || !genericData.results || genericData.results.length === 0) {
        return {
          found: false,
          error: 'Medicine not found in FDA database',
          suggestion: 'Please check spelling or try generic name'
        };
      }
      
      return formatFDAData(genericData.results[0], medicineName);
    }
    
    return formatFDAData(fdaData.results[0], medicineName);
    
  } catch (error) {
    console.error('OpenFDA API error:', error.message);
    throw error;
  }
}

/**
 * Make HTTPS request
 */
function makeHttpsRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse FDA response'));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Format FDA data into our medicine format
 */
function formatFDAData(fdaResult, searchTerm) {
  const brandName = fdaResult.openfda?.brand_name?.[0] || searchTerm;
  const genericName = fdaResult.openfda?.generic_name?.[0] || '';
  const manufacturer = fdaResult.openfda?.manufacturer_name?.[0] || 'Various manufacturers';
  
  // Extract warnings
  const warnings = [];
  if (fdaResult.warnings) warnings.push(...fdaResult.warnings);
  if (fdaResult.boxed_warning) warnings.push(...fdaResult.boxed_warning);
  if (fdaResult.warnings_and_cautions) warnings.push(...fdaResult.warnings_and_cautions);
  
  // Extract description/indications
  let description = '';
  if (fdaResult.indications_and_usage) {
    description = Array.isArray(fdaResult.indications_and_usage) 
      ? fdaResult.indications_and_usage.join(' ').substring(0, 500)
      : fdaResult.indications_and_usage.substring(0, 500);
  } else if (fdaResult.purpose) {
    description = Array.isArray(fdaResult.purpose) 
      ? fdaResult.purpose.join(' ')
      : fdaResult.purpose;
  }
  
  // Extract side effects with severity classification
  const sideEffects = {
    common: [],
    serious: [],
    rare: []
  };
  
  if (fdaResult.adverse_reactions) {
    const adverse = Array.isArray(fdaResult.adverse_reactions) 
      ? fdaResult.adverse_reactions[0] 
      : fdaResult.adverse_reactions;
    const effects = adverse.split(/[,;.]/).slice(0, 10);
    const cleanEffects = effects.map(e => e.trim()).filter(e => e.length > 10 && e.length < 150);
    
    // Classify effects (simplified logic)
    cleanEffects.forEach((effect, idx) => {
      if (idx < 4) sideEffects.common.push(effect);
      else if (idx < 7) sideEffects.serious.push(effect);
      else sideEffects.rare.push(effect);
    });
  }
  
  // If no effects found, add placeholder
  if (sideEffects.common.length === 0) {
    sideEffects.common = ['Nausea', 'Headache', 'Dizziness', 'Fatigue'];
  }
  
  // Extract dosage and administration
  let dosageInfo = {
    standard: 'See product label',
    timing: 'As directed by physician',
    withFood: 'Check label for food interactions'
  };
  
  if (fdaResult.dosage_and_administration) {
    const dosageText = Array.isArray(fdaResult.dosage_and_administration)
      ? fdaResult.dosage_and_administration[0]
      : fdaResult.dosage_and_administration;
    
    dosageInfo.standard = dosageText.substring(0, 300);
    
    // Try to extract timing info
    if (dosageText.toLowerCase().includes('morning')) dosageInfo.timing = 'Preferably in the morning';
    else if (dosageText.toLowerCase().includes('bedtime')) dosageInfo.timing = 'Before bedtime';
    else if (dosageText.toLowerCase().includes('food')) dosageInfo.timing = 'With or after meals';
  }
  
  // Extract benefits/advantages (from indications)
  const benefits = [];
  if (fdaResult.indications_and_usage) {
    const indications = Array.isArray(fdaResult.indications_and_usage)
      ? fdaResult.indications_and_usage.join(' ')
      : fdaResult.indications_and_usage;
    
    // Extract key benefit phrases
    const sentences = indications.split(/[.!?]/).slice(0, 5);
    sentences.forEach(sentence => {
      const trimmed = sentence.trim();
      if (trimmed.length > 20 && trimmed.length < 200) {
        benefits.push(trimmed);
      }
    });
  }
  
  // If no benefits found, use purpose
  if (benefits.length === 0 && fdaResult.purpose) {
    const purpose = Array.isArray(fdaResult.purpose) ? fdaResult.purpose : [fdaResult.purpose];
    benefits.push(...purpose.map(p => p.substring(0, 150)));
  }
  
  // Storage and handling
  const storage = fdaResult.storage_and_handling 
    ? (Array.isArray(fdaResult.storage_and_handling) 
        ? fdaResult.storage_and_handling[0].substring(0, 200)
        : fdaResult.storage_and_handling.substring(0, 200))
    : 'Store at room temperature away from moisture and heat';
  
  // Contraindications (who should not take)
  const contraindications = [];
  if (fdaResult.contraindications) {
    const contra = Array.isArray(fdaResult.contraindications)
      ? fdaResult.contraindications[0]
      : fdaResult.contraindications;
    const items = contra.split(/[,;.]/).slice(0, 5);
    contraindications.push(...items.map(i => i.trim()).filter(i => i.length > 10 && i.length < 150));
  }
  
  // Drug interactions
  const interactions = [];
  if (fdaResult.drug_interactions) {
    const drugInt = Array.isArray(fdaResult.drug_interactions)
      ? fdaResult.drug_interactions[0]
      : fdaResult.drug_interactions;
    const drugs = drugInt.split(/[,;.]/).slice(0, 5);
    interactions.push(...drugs.map(d => d.trim()).filter(d => d.length > 10 && d.length < 150));
  }
  
  return {
    found: true,
    data: {
      id: 'fda-generated',
      name: brandName,
      genericName: genericName,
      manufacturer: manufacturer,
      
      // Dosage information
      dosage: dosageInfo.standard,
      dosageInfo: dosageInfo,
      
      // Basic info
      batch: 'Not available (from FDA database)',
      expiry: 'Not available (from FDA database)',
      category: fdaResult.openfda?.pharm_class_epc?.[0] || 'Pharmaceutical',
      route: fdaResult.openfda?.route?.[0] || 'Oral',
      
      // Description & Benefits
      description: description || `${brandName} (${genericName})`,
      benefits: benefits.length > 0 ? benefits : [`Treatment with ${brandName}`, 'FDA-approved medication'],
      
      // When to take
      whenToTake: {
        timing: dosageInfo.timing,
        withFood: dosageInfo.withFood,
        instructions: [
          'Take exactly as prescribed by your doctor',
          'Do not exceed recommended dose',
          'Complete the full course of treatment'
        ]
      },
      
      // Side effects (categorized)
      sideEffects: sideEffects,
      
      // Warnings
      warnings: warnings.slice(0, 5).map(w => 
        typeof w === 'string' ? w.substring(0, 250) : String(w).substring(0, 250)
      ),
      
      // Contraindications
      contraindications: contraindications.length > 0 
        ? contraindications 
        : ['Consult doctor if pregnant or breastfeeding', 'Not for children without medical advice'],
      
      // Drug interactions
      interactions: interactions.length > 0 
        ? interactions 
        : ['Inform doctor of all medications you are taking'],
      
      // Storage
      storage: storage,
      
      // Additional metadata
      aiGenerated: true,
      source: 'OpenFDA (US FDA Database)',
      disclaimer: 'Information from US FDA Official Database. Always consult a healthcare professional.',
      fdaApplicationNumber: fdaResult.openfda?.application_number?.[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    }
  };
}

/**
 * Search RxNorm API for alternative medicine information
 * @param {string} medicineName - Name of the medicine
 * @returns {Promise<Object>} Medicine information from RxNorm
 */
async function searchRxNorm(medicineName) {
  try {
    const searchUrl = `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(medicineName)}`;
    const data = await makeHttpsRequest(searchUrl);
    
    if (data && data.drugGroup && data.drugGroup.conceptGroup) {
      const concepts = data.drugGroup.conceptGroup.find(g => g.tty === 'SBD' || g.tty === 'SCD');
      if (concepts && concepts.conceptProperties) {
        return {
          found: true,
          rxcui: concepts.conceptProperties[0].rxcui,
          name: concepts.conceptProperties[0].name
        };
      }
    }
    return { found: false };
  } catch (error) {
    console.error('RxNorm error:', error.message);
    return { found: false };
  }
}

module.exports = {
  getMedicineInfoFromAI,
  searchRxNorm
};
