import { useState } from 'react';
import { useFhevm, useEncrypt } from '@fhevm/sdk/react';
import './App.css';

function App() {
  const [value, setValue] = useState<string>('42');
  const [encryptedData, setEncryptedData] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const { isReady, isLoading, error } = useFhevm({
    gatewayAddress: '0x79d6742b1Bf62452bfcBC6b137ed4eA1ba459a6B',
    chainId: 11155111,
  });

  const { encrypt, isEncrypting } = useEncrypt('euint64');

  const handleEncrypt = async () => {
    try {
      setStatus('Encrypting...');
      setEncryptedData('');

      const numValue = parseInt(value);
      if (isNaN(numValue)) {
        setStatus('Error: Please enter a valid number');
        return;
      }

      const encrypted = await encrypt(numValue);
      setEncryptedData(encrypted.hex);
      setStatus('Encryption successful!');
    } catch (err) {
      console.error('Encryption error:', err);
      setStatus(`Error: ${(err as Error).message}`);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>React FHE Encryption Demo</h1>
        <p>Simple encrypted counter using @fhevm/sdk</p>
      </header>

      <main className="app-main">
        <div className="status-section">
          <div className={`status-badge ${isReady ? 'ready' : 'loading'}`}>
            <span className="status-dot"></span>
            <span>FHEVM: {isLoading ? 'Initializing...' : isReady ? 'Ready' : 'Error'}</span>
          </div>
          {error && <p className="error-text">Error: {error.message}</p>}
        </div>

        <div className="card">
          <h2>Encrypt a Value</h2>

          <div className="form-group">
            <label htmlFor="value-input">Value to Encrypt (euint64)</label>
            <input
              id="value-input"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter a number"
              disabled={!isReady}
            />
          </div>

          <button
            onClick={handleEncrypt}
            disabled={!isReady || !value || isEncrypting}
            className="encrypt-button"
          >
            {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
          </button>

          {status && (
            <div className={`status-message ${status.includes('Error') ? 'error' : 'success'}`}>
              {status}
            </div>
          )}

          {encryptedData && (
            <div className="result-section">
              <label>Encrypted Data (Hex):</label>
              <div className="code-block">
                <code>{encryptedData}</code>
              </div>
              <p className="info-text">Length: {encryptedData.length} characters</p>
            </div>
          )}
        </div>

        <div className="info-card">
          <h3>About This Demo</h3>
          <ul>
            <li>✓ Simple React 18 + Vite setup</li>
            <li>✓ Direct SDK integration with hooks</li>
            <li>✓ Encrypt values using FHE</li>
            <li>✓ Ready to use in smart contracts</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
