import React, { useState, useEffect } from 'react';
import { setupAPI } from '../services/api';
import {
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  Loader,
  Server,
  Wifi,
  Globe,
  Shield
} from 'lucide-react';
import '../Setup.css';

function Setup() {
  const [loading, setLoading] = useState(true);
  const [setupStatus, setSetupStatus] = useState(null);
  const [serverInfo, setServerInfo] = useState(null);
  const [instructions, setInstructions] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [appId, setAppId] = useState('');
  const [appIdError, setAppIdError] = useState('');
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [receiverTest, setReceiverTest] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState('');

  // Load initial data
  useEffect(() => {
    loadSetupData();
  }, []);

  const loadSetupData = async () => {
    setLoading(true);
    try {
      const [statusData, serverData, instructionsData] = await Promise.all([
        setupAPI.getStatus(),
        setupAPI.getServerInfo(),
        setupAPI.getInstructions()
      ]);

      setSetupStatus(statusData);
      setServerInfo(serverData);
      setInstructions(instructionsData);

      // Set APP_ID if already configured
      if (statusData.appId) {
        setAppId(statusData.appId);
      }
    } catch (error) {
      console.error('Failed to load setup data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(label);
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSaveAppId = async () => {
    // Validate APP_ID
    if (!appId) {
      setAppIdError('APP_ID is required');
      return;
    }

    if (!/^[A-Z0-9]{8}$/.test(appId)) {
      setAppIdError('Invalid APP_ID format. Expected 8 alphanumeric characters (e.g., 12345678)');
      return;
    }

    setSaving(true);
    setAppIdError('');

    try {
      const result = await setupAPI.saveAppId(appId);

      if (result.success) {
        // Reload setup status
        await loadSetupData();
        setActiveStep(activeStep + 1);
      } else {
        setAppIdError(result.error || 'Failed to save APP_ID');
      }
    } catch (error) {
      setAppIdError(error.message || 'Failed to save APP_ID');
    } finally {
      setSaving(false);
    }
  };

  const handleTestReceiver = async () => {
    if (!serverInfo) return;

    setTesting(true);
    try {
      const result = await setupAPI.testReceiver(serverInfo.receiverUrl);
      setReceiverTest(result);
    } catch (error) {
      setReceiverTest({
        accessible: false,
        error: error.message
      });
    } finally {
      setTesting(false);
    }
  };

  const openUrl = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="setup-container">
        <div className="loading-state">
          <Loader className="spin" size={48} />
          <p>Loading setup wizard...</p>
        </div>
      </div>
    );
  }

  const isSetupComplete = setupStatus?.setupComplete;

  return (
    <div className="setup-container">
      <header className="setup-header">
        <div className="setup-title">
          <Settings size={32} />
          <div>
            <h1>Chromecast Setup Wizard</h1>
            <p>Configure your custom Chromecast receiver for HTML presentations</p>
          </div>
        </div>

        {isSetupComplete && (
          <div className="setup-complete-badge">
            <CheckCircle size={20} />
            <span>Setup Complete</span>
          </div>
        )}
      </header>

      {/* Setup Status Overview */}
      <div className="setup-status-overview">
        <div className={`status-card ${setupStatus?.receiverFileExists ? 'success' : 'error'}`}>
          <div className="status-icon">
            {setupStatus?.receiverFileExists ? <CheckCircle size={24} /> : <XCircle size={24} />}
          </div>
          <div className="status-info">
            <h3>Receiver File</h3>
            <p>{setupStatus?.receiverFileExists ? 'Installed' : 'Missing'}</p>
          </div>
        </div>

        <div className={`status-card ${setupStatus?.appIdConfigured ? 'success' : 'warning'}`}>
          <div className="status-icon">
            {setupStatus?.appIdConfigured ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
          </div>
          <div className="status-info">
            <h3>APP_ID</h3>
            <p>{setupStatus?.appIdConfigured ? `Configured (${setupStatus.appId})` : 'Not Configured'}</p>
          </div>
        </div>

        <div className={`status-card ${receiverTest?.accessible ? 'success' : 'neutral'}`}>
          <div className="status-icon">
            {receiverTest?.accessible ? <CheckCircle size={24} /> :
             receiverTest?.accessible === false ? <XCircle size={24} /> :
             <Wifi size={24} />}
          </div>
          <div className="status-info">
            <h3>Network</h3>
            <p>{receiverTest?.accessible ? 'Accessible' :
               receiverTest ? 'Not Accessible' : 'Not Tested'}</p>
          </div>
        </div>

        <div className={`status-card ${isSetupComplete ? 'success' : 'neutral'}`}>
          <div className="status-icon">
            {isSetupComplete ? <CheckCircle size={24} /> : <Settings size={24} />}
          </div>
          <div className="status-info">
            <h3>Status</h3>
            <p>{isSetupComplete ? 'Ready to Cast' : 'Setup Required'}</p>
          </div>
        </div>
      </div>

      {/* Server Information */}
      <div className="setup-section">
        <div className="section-header">
          <Server size={24} />
          <h2>Server Information</h2>
        </div>

        {serverInfo && (
          <div className="server-info-grid">
            <div className="info-card">
              <label>Server Address</label>
              <div className="value-with-copy">
                <code>{serverInfo.primaryAddress}:{serverInfo.port}</code>
                <button
                  className="copy-btn"
                  onClick={() => handleCopy(`${serverInfo.primaryAddress}:${serverInfo.port}`, 'Address copied!')}
                  title="Copy address"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <div className="info-card">
              <label>Receiver URL</label>
              <div className="value-with-copy">
                <code className="url-code">{serverInfo.receiverUrl}</code>
                <button
                  className="copy-btn"
                  onClick={() => handleCopy(serverInfo.receiverUrl, 'Receiver URL copied!')}
                  title="Copy receiver URL"
                >
                  <Copy size={16} />
                </button>
              </div>
              <p className="info-note">
                Use this URL when registering your receiver in Google Cast Console
              </p>
            </div>

            <div className="info-card full-width">
              <label>Network Interfaces</label>
              <div className="network-interfaces">
                {serverInfo.addresses.map((addr, index) => (
                  <div key={index} className={`interface ${addr.primary ? 'primary' : ''}`}>
                    <Wifi size={14} />
                    <span>{addr.interface}</span>
                    <code>{addr.address}</code>
                    {addr.primary && <span className="badge">Primary</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="info-card full-width">
              <button
                className="test-btn"
                onClick={handleTestReceiver}
                disabled={testing}
              >
                {testing ? (
                  <>
                    <Loader className="spin" size={16} />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    <span>Test Receiver Accessibility</span>
                  </>
                )}
              </button>

              {receiverTest && (
                <div className={`test-result ${receiverTest.accessible ? 'success' : 'error'}`}>
                  {receiverTest.accessible ? (
                    <>
                      <CheckCircle size={16} />
                      <span>Receiver is accessible from network</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} />
                      <span>Receiver not accessible: {receiverTest.error}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Registration Instructions */}
      {instructions && (
        <div className="setup-section">
          <div className="section-header">
            <Globe size={24} />
            <h2>Google Cast Registration</h2>
          </div>

          <div className="registration-info">
            <div className="cost-info">
              <Shield size={20} />
              <div>
                <strong>One-time registration fee: $5 USD</strong>
                <p>Required by Google to access Cast Developer Console</p>
              </div>
            </div>
            <div className="time-info">
              <AlertCircle size={20} />
              <div>
                <strong>Estimated time: {instructions.estimatedTime}</strong>
                <p>Includes registration and configuration</p>
              </div>
            </div>
          </div>

          <div className="steps-container">
            {instructions.steps.map((step, index) => (
              <div
                key={step.number}
                className={`setup-step ${activeStep === index ? 'active' : ''} ${activeStep > index ? 'completed' : ''}`}
              >
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>

                  {step.action === 'open_url' && (
                    <button
                      className="action-btn primary"
                      onClick={() => openUrl(step.url)}
                    >
                      <ExternalLink size={16} />
                      <span>Open Google Cast Console</span>
                    </button>
                  )}

                  {step.action === 'copy_receiver_url' && serverInfo && (
                    <div className="copy-action">
                      <code className="url-display">{serverInfo.receiverUrl}</code>
                      <button
                        className="action-btn"
                        onClick={() => handleCopy(serverInfo.receiverUrl, 'Receiver URL copied!')}
                      >
                        <Copy size={16} />
                        <span>Copy URL</span>
                      </button>
                    </div>
                  )}

                  {step.action === 'input_app_id' && (
                    <div className="app-id-input">
                      <input
                        type="text"
                        placeholder="Enter 8-character APP_ID (e.g., 12345678)"
                        value={appId}
                        onChange={(e) => {
                          setAppId(e.target.value.toUpperCase());
                          setAppIdError('');
                        }}
                        maxLength={8}
                        disabled={setupStatus?.appIdConfigured}
                      />
                      {!setupStatus?.appIdConfigured && (
                        <button
                          className="action-btn primary"
                          onClick={handleSaveAppId}
                          disabled={saving || !appId}
                        >
                          {saving ? (
                            <>
                              <Loader className="spin" size={16} />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle size={16} />
                              <span>Save APP_ID</span>
                            </>
                          )}
                        </button>
                      )}
                      {appIdError && (
                        <div className="error-message">
                          <XCircle size={14} />
                          <span>{appIdError}</span>
                        </div>
                      )}
                      {setupStatus?.appIdConfigured && (
                        <div className="success-message">
                          <CheckCircle size={14} />
                          <span>APP_ID configured successfully</span>
                        </div>
                      )}
                    </div>
                  )}

                  {step.action === 'optional' && (
                    <button
                      className="action-btn secondary"
                      onClick={() => openUrl(step.url)}
                    >
                      <ExternalLink size={16} />
                      <span>Register Test Device</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {isSetupComplete && (
            <div className="completion-message">
              <CheckCircle size={48} />
              <h2>Setup Complete!</h2>
              <p>
                Your Chromecast receiver is configured and ready to use. You can now cast HTML presentations to your Chromecast devices.
              </p>
              <p className="restart-note">
                <AlertCircle size={16} />
                If you just configured the APP_ID, please <strong>restart Narrowcast Pro</strong> for the changes to take effect.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Warnings and Errors */}
      {setupStatus?.warnings && setupStatus.warnings.length > 0 && (
        <div className="setup-section">
          <div className="warnings-list">
            {setupStatus.warnings.map((warning, index) => (
              <div key={index} className="warning-item">
                <AlertCircle size={20} />
                <span>{warning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {setupStatus?.errors && setupStatus.errors.length > 0 && (
        <div className="setup-section">
          <div className="errors-list">
            {setupStatus.errors.map((error, index) => (
              <div key={index} className="error-item">
                <XCircle size={20} />
                <span>{error}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Copy Feedback Toast */}
      {copyFeedback && (
        <div className="copy-toast">
          <CheckCircle size={16} />
          <span>{copyFeedback}</span>
        </div>
      )}
    </div>
  );
}

export default Setup;
