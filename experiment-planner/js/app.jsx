/* ── app.jsx — root App component + API key modal ────────────────────────── */
const { useState: useStateA } = React;

function ApiKeyModal({ onSave, onSkip }) {
  const [key, setKey] = useStateA('');
  const [err, setErr] = useStateA('');

  function handleSave() {
    if (!key.trim().startsWith('sk-ant-')) { setErr('Key should start with sk-ant-'); return; }
    Claude.saveKey(key.trim());
    onSave(key.trim());
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">Enable AI Features</h2>
        <p className="modal-desc">
          Add your Anthropic API key to get experiment ideas and plain-English analysis from Claude.
          Your key is stored only in your browser — never sent to any server.
        </p>
        <div className="form-group">
          <label className="form-label">Anthropic API Key</label>
          <input type="password" className="form-input" placeholder="sk-ant-…"
            value={key} onChange={e => { setKey(e.target.value); setErr(''); }} />
          {err && <span className="form-error">{err}</span>}
        </div>
        <div className="modal-actions">
          <button className="btn-skip" onClick={onSkip}>Skip for now</button>
          <button className="btn-primary" onClick={handleSave} disabled={!key}>Save Key</button>
        </div>
        <p className="modal-footnote">
          Get a key at <span className="modal-link">console.anthropic.com</span>
        </p>
      </div>
    </div>
  );
}

function App() {
  const [step, setStep] = useStateA(1);
  const [inputs, setInputs] = useStateA({
    goal: '', goalDescription: '',
    baseline: '3', dailyVisitors: '1000', maxWeeks: '8',
    liftPreset: '', confidence: 0,
  });
  const [apiKey,    setApiKey]    = useStateA(() => Claude.getKey());
  const [showModal, setShowModal] = useStateA(false);

  function update(patch) { setInputs(p => ({ ...p, ...patch })); }

  function handleSaveKey(k) { setApiKey(k); setShowModal(false); }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo"><span className="logo-icon">⚗️</span><span className="logo-text">Experiment Planner</span></div>
        {step < 5 && <WizardProgress step={step} />}
        <button className="btn-api-key" onClick={() => setShowModal(true)}>
          {apiKey ? '🔑 API Key' : '+ Add AI'}
        </button>
      </header>

      <main className="app-main">
        {step === 1 && <StepGoal       inputs={inputs} onChange={update} onNext={() => setStep(2)} />}
        {step === 2 && <StepNumbers    inputs={inputs} onChange={update} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <StepLift       inputs={inputs} onChange={update} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
        {step === 4 && <StepConfidence inputs={inputs} onChange={update} onNext={() => setStep(5)} onBack={() => setStep(3)} />}
        {step === 5 && <ResultsScreen  inputs={inputs} onBack={() => setStep(1)} apiKey={apiKey} onRequestKey={() => setShowModal(true)} />}
      </main>

      {showModal && <ApiKeyModal onSave={handleSaveKey} onSkip={() => setShowModal(false)} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
