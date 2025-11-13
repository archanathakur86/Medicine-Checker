// Simple test for drug interaction service
const service = require('./backend/src/services/drugInteractionService');

async function testInteractions() {
  console.log('=== Drug Interaction Checker Test ===\n');

  // Test 1: Known interaction (Aspirin + Warfarin)
  console.log('Test 1: Aspirin + Warfarin (known interaction)');
  console.log('Checking...\n');
  
  const test1 = await service.checkInteractions('Aspirin 100mg', 'Warfarin 5mg');
  
  console.log('Medicine 1:', test1.medicine1);
  console.log('Medicine 2:', test1.medicine2);
  console.log('Has Interactions:', test1.hasInteractions);
  console.log('Interaction Count:', test1.interactionCount);
  
  if (test1.interactions.length > 0) {
    console.log('\n⚠️ INTERACTIONS FOUND:');
    test1.interactions.forEach((interaction, idx) => {
      console.log(`\n${idx + 1}. ${interaction.drug1} + ${interaction.drug2}`);
      console.log(`   Severity: ${interaction.severity}`);
      console.log(`   Description: ${interaction.description}`);
    });
  } else {
    console.log('✓ No interactions found');
  }
  
  console.log('\n' + '='.repeat(60) + '\n');

  // Test 2: Safe combination
  console.log('Test 2: Paracetamol + Vitamin D (should be safe)');
  console.log('Checking...\n');
  
  const test2 = await service.checkInteractions('Paracetamol 500mg', 'Vitamin D3');
  
  console.log('Medicine 1:', test2.medicine1);
  console.log('Medicine 2:', test2.medicine2);
  console.log('Has Interactions:', test2.hasInteractions);
  console.log('Interaction Count:', test2.interactionCount);
  
  if (test2.interactions.length > 0) {
    console.log('\n⚠️ INTERACTIONS FOUND:');
    test2.interactions.forEach((interaction, idx) => {
      console.log(`\n${idx + 1}. ${interaction.drug1} + ${interaction.drug2}`);
      console.log(`   Severity: ${interaction.severity}`);
      console.log(`   Description: ${interaction.description}`);
    });
  } else {
    console.log('✓ No interactions found');
  }
  
  console.log('\n' + '='.repeat(60) + '\n');

  // Test 3: Multiple medicines
  console.log('Test 3: Batch check - Multiple medicines');
  console.log('Checking: Aspirin, Ibuprofen, Warfarin\n');
  
  const test3 = await service.checkMultipleInteractions([
    'Aspirin 100mg',
    'Ibuprofen 400mg',
    'Warfarin 5mg'
  ]);
  
  console.log('Medicines Checked:', test3.medicinesChecked);
  console.log('Total Pairs Checked:', test3.totalPairsChecked);
  console.log('Interactions Found:', test3.interactionsFound);
  
  if (test3.allInteractions.length > 0) {
    console.log('\n⚠️ ALL INTERACTIONS:');
    test3.allInteractions.forEach((pair, idx) => {
      console.log(`\n${idx + 1}. ${pair.medicine1} + ${pair.medicine2}`);
      pair.interactions.forEach(interaction => {
        console.log(`   - ${interaction.description}`);
        console.log(`     Severity: ${interaction.severity}`);
      });
    });
  }
  
  console.log('\n=== Test Complete ===');
}

// Run tests
testInteractions().catch(console.error);
