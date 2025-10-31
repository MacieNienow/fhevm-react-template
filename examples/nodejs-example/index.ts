/**
 * Node.js CLI Example for @fhevm/sdk
 * Demonstrates server-side encryption and SDK usage
 */

import { createFhevmInstance, encryptValue, encryptBatch, FhevmClient } from '@fhevm/sdk';

// Configuration
const CONFIG = {
  gatewayAddress: '0x79d6742b1Bf62452bfcBC6b137ed4eA1ba459a6B' as `0x${string}`,
  chainId: 11155111, // Sepolia
};

/**
 * Example 1: Functional API - Simple encryption
 */
async function functionalApiExample() {
  console.log('\n========================================');
  console.log('Example 1: Functional API');
  console.log('========================================\n');

  console.log('Initializing FHEVM instance...');
  const fhevm = await createFhevmInstance(CONFIG);
  console.log('✓ FHEVM initialized successfully\n');

  console.log('Public Key:', fhevm.publicKey.key.substring(0, 50) + '...\n');

  // Encrypt a single value
  console.log('Encrypting value: 42 (euint64)');
  const encrypted42 = await encryptValue(42, 'euint64');
  console.log('✓ Encrypted Data (hex):', encrypted42.hex.substring(0, 50) + '...');
  console.log('  Data length:', encrypted42.data.length, 'bytes\n');

  // Encrypt different types
  console.log('Encrypting value: 255 (euint8)');
  const encrypted255 = await encryptValue(255, 'euint8');
  console.log('✓ Encrypted Data (hex):', encrypted255.hex.substring(0, 50) + '...\n');

  console.log('Encrypting value: true (ebool)');
  const encryptedTrue = await encryptValue(1, 'ebool');
  console.log('✓ Encrypted Data (hex):', encryptedTrue.hex.substring(0, 50) + '...\n');

  // Batch encryption
  console.log('Batch encrypting values: [10, 20, 30, 40, 50] (euint32)');
  const encryptedBatch = await encryptBatch([10, 20, 30, 40, 50], 'euint32');
  console.log('✓ Encrypted', encryptedBatch.length, 'values successfully');
  encryptedBatch.forEach((enc, i) => {
    console.log(`  [${i}]:`, enc.hex.substring(0, 40) + '...');
  });
}

/**
 * Example 2: Class-based API - FhevmClient
 */
async function classBasedApiExample() {
  console.log('\n========================================');
  console.log('Example 2: Class-based API (FhevmClient)');
  console.log('========================================\n');

  console.log('Creating FhevmClient instance...');
  const client = new FhevmClient(CONFIG);

  console.log('Initializing client...');
  await client.init();
  console.log('✓ Client initialized\n');

  console.log('Client status:', client.isInitialized() ? 'Ready' : 'Not Ready');
  console.log('Public Key:', client.getPublicKey().key.substring(0, 50) + '...\n');

  // Encrypt using client
  console.log('Encrypting value: 1000000 (euint64)');
  const encrypted = await client.encrypt(1000000, 'euint64');
  console.log('✓ Encrypted:', encrypted.hex.substring(0, 50) + '...\n');

  // Batch encryption using client
  console.log('Batch encrypting coordinates: [40.7128, -74.0060] as integers');
  const lat = Math.floor(40.7128 * 1e6); // 40712800
  const lon = Math.floor(-74.0060 * 1e6); // -74006000 (convert to positive for euint)
  const coords = await client.encryptBatch([lat, Math.abs(lon)], 'euint64');
  console.log('✓ Latitude encrypted:', coords[0].hex.substring(0, 40) + '...');
  console.log('✓ Longitude encrypted:', coords[1].hex.substring(0, 40) + '...\n');

  // Get EIP-712 domain (for permit signatures)
  const contractAddress = '0x9e77F5121215474e473401E9768a517DAFde1f87' as `0x${string}`;
  console.log('Getting EIP-712 domain for contract:', contractAddress);
  const domain = client.getEIP712Domain(contractAddress);
  console.log('✓ Domain:', {
    name: domain.name,
    version: domain.version,
    chainId: domain.chainId,
    verifyingContract: domain.verifyingContract,
  });
}

/**
 * Example 3: Real-world use case - Private data encryption
 */
async function realWorldExample() {
  console.log('\n========================================');
  console.log('Example 3: Real-world Use Case');
  console.log('Private Medical Data Encryption');
  console.log('========================================\n');

  const client = new FhevmClient(CONFIG);
  await client.init();

  // Simulate medical data
  const medicalData = {
    patientId: 12345,
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    heartRate: 72,
    bloodGlucose: 95,
    isHighRisk: 0, // false
  };

  console.log('Original Medical Data:');
  console.log(JSON.stringify(medicalData, null, 2));
  console.log('\nEncrypting sensitive medical data...\n');

  // Encrypt all medical data
  const encryptedData = {
    patientId: await client.encrypt(medicalData.patientId, 'euint32'),
    bloodPressureSystolic: await client.encrypt(medicalData.bloodPressureSystolic, 'euint8'),
    bloodPressureDiastolic: await client.encrypt(medicalData.bloodPressureDiastolic, 'euint8'),
    heartRate: await client.encrypt(medicalData.heartRate, 'euint8'),
    bloodGlucose: await client.encrypt(medicalData.bloodGlucose, 'euint8'),
    isHighRisk: await client.encrypt(medicalData.isHighRisk, 'ebool'),
  };

  console.log('Encrypted Medical Data (ready for smart contract):');
  console.log({
    patientId: encryptedData.patientId.hex.substring(0, 30) + '...',
    bloodPressureSystolic: encryptedData.bloodPressureSystolic.hex.substring(0, 30) + '...',
    bloodPressureDiastolic: encryptedData.bloodPressureDiastolic.hex.substring(0, 30) + '...',
    heartRate: encryptedData.heartRate.hex.substring(0, 30) + '...',
    bloodGlucose: encryptedData.bloodGlucose.hex.substring(0, 30) + '...',
    isHighRisk: encryptedData.isHighRisk.hex.substring(0, 30) + '...',
  });

  console.log('\n✓ All medical data encrypted successfully!');
  console.log('Ready to submit to confidential smart contract.');
}

/**
 * Example 4: Performance benchmark
 */
async function performanceBenchmark() {
  console.log('\n========================================');
  console.log('Example 4: Performance Benchmark');
  console.log('========================================\n');

  const client = new FhevmClient(CONFIG);
  await client.init();

  // Benchmark single encryption
  console.log('Benchmarking single value encryption...');
  const iterations = 10;
  const startSingle = Date.now();

  for (let i = 0; i < iterations; i++) {
    await client.encrypt(Math.floor(Math.random() * 1000000), 'euint64');
  }

  const endSingle = Date.now();
  const avgSingle = (endSingle - startSingle) / iterations;
  console.log(`✓ Average time for single encryption: ${avgSingle.toFixed(2)}ms\n`);

  // Benchmark batch encryption
  console.log('Benchmarking batch encryption (10 values)...');
  const startBatch = Date.now();

  const values = Array.from({ length: 10 }, () => Math.floor(Math.random() * 1000000));
  await client.encryptBatch(values, 'euint64');

  const endBatch = Date.now();
  const totalBatch = endBatch - startBatch;
  console.log(`✓ Total time for batch encryption: ${totalBatch.toFixed(2)}ms`);
  console.log(`✓ Average per value: ${(totalBatch / 10).toFixed(2)}ms`);
  console.log(`✓ Batch speedup: ${(avgSingle / (totalBatch / 10)).toFixed(2)}x faster\n`);
}

/**
 * Main entry point
 */
async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  Node.js FHEVM SDK Examples           ║');
  console.log('║  @fhevm/sdk Server-side Integration   ║');
  console.log('╚════════════════════════════════════════╝');

  try {
    await functionalApiExample();
    await classBasedApiExample();
    await realWorldExample();
    await performanceBenchmark();

    console.log('\n========================================');
    console.log('All examples completed successfully! ✓');
    console.log('========================================\n');
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

// Run examples
main();
