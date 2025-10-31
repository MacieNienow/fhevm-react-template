'use client';

import { useState } from 'react';
import { useEncrypt } from '@fhevm/sdk/react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useFHEContext } from '../fhe/FHEProvider';

interface HealthData {
  heartRate: string;
  bloodPressure: string;
  temperature: string;
}

export function MedicalExample() {
  const { isReady } = useFHEContext();
  const [healthData, setHealthData] = useState<HealthData>({
    heartRate: '72',
    bloodPressure: '120',
    temperature: '98',
  });
  const [result, setResult] = useState<string | null>(null);

  const { encrypt, isEncrypting } = useEncrypt('euint32');

  const handleSubmitData = async () => {
    try {
      setResult('Encrypting health data...');

      const heartRate = parseInt(healthData.heartRate);
      const bloodPressure = parseInt(healthData.bloodPressure);
      const temperature = parseInt(healthData.temperature);

      if (isNaN(heartRate) || isNaN(bloodPressure) || isNaN(temperature)) {
        setResult('Error: Invalid health data');
        return;
      }

      const [encHR, encBP, encTemp] = await Promise.all([
        encrypt(heartRate),
        encrypt(bloodPressure),
        encrypt(temperature),
      ]);

      setResult(`
Health Data Encrypted Successfully!

Heart Rate: ${heartRate} bpm → ${encHR.hex.substring(0, 20)}...
Blood Pressure: ${bloodPressure} mmHg → ${encBP.hex.substring(0, 20)}...
Temperature: ${temperature}°F → ${encTemp.hex.substring(0, 20)}...

Your health data is now encrypted and can be:
• Stored on-chain without revealing actual values
• Shared with healthcare providers securely
• Analyzed using homomorphic operations
• Compared against thresholds without decryption

Example Smart Contract Operations:
- TFHE.gt(heartRate, threshold) // Check if HR is high
- TFHE.add(heartRate, offset) // Adjust readings
- TFHE.eq(bloodPressure, normal) // Compare to normal range

All computations happen on encrypted data, preserving
complete medical privacy!
      `.trim());
    } catch (error) {
      console.error('Health data encryption error:', error);
      setResult(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-bold text-white">Private Health Records</h3>
        <p className="text-sm text-gray-400 mt-1">
          Confidential medical data storage using FHE
        </p>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Health Data Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Heart Rate (bpm)"
              type="number"
              value={healthData.heartRate}
              onChange={(e) => setHealthData({ ...healthData, heartRate: e.target.value })}
              placeholder="72"
            />
            <Input
              label="Blood Pressure (mmHg)"
              type="number"
              value={healthData.bloodPressure}
              onChange={(e) => setHealthData({ ...healthData, bloodPressure: e.target.value })}
              placeholder="120"
            />
            <Input
              label="Temperature (°F)"
              type="number"
              value={healthData.temperature}
              onChange={(e) => setHealthData({ ...healthData, temperature: e.target.value })}
              placeholder="98"
            />
          </div>

          {/* Health Status Indicators */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30 text-center">
              <div className="text-2xl mb-1">❤️</div>
              <p className="text-xs text-gray-300">Heart Rate</p>
              <p className="text-sm font-semibold text-green-400">Normal</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30 text-center">
              <div className="text-2xl mb-1">🩺</div>
              <p className="text-xs text-gray-300">Blood Pressure</p>
              <p className="text-sm font-semibold text-blue-400">Normal</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30 text-center">
              <div className="text-2xl mb-1">🌡️</div>
              <p className="text-xs text-gray-300">Temperature</p>
              <p className="text-sm font-semibold text-yellow-400">Normal</p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmitData}
            disabled={!isReady || isEncrypting}
            isLoading={isEncrypting}
            className="w-full"
          >
            {isEncrypting ? 'Encrypting...' : 'Encrypt & Store Health Data'}
          </Button>

          {/* Result */}
          {result && (
            <div className={`p-3 rounded-lg ${
              result.includes('Error')
                ? 'bg-red-500/20 border border-red-500/50'
                : 'bg-green-500/20 border border-green-500/50'
            }`}>
              <pre className="text-xs text-white whitespace-pre-wrap">
                {result}
              </pre>
            </div>
          )}

          {/* Info */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-300 mb-2">
              Medical Privacy with FHE
            </h4>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Patient data encrypted before storage</li>
              <li>• Analysis possible without decrypting</li>
              <li>• HIPAA-compliant privacy protection</li>
              <li>• Secure sharing with healthcare providers</li>
              <li>• Threshold checks without data exposure</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
