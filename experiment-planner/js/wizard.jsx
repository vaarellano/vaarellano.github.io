/* ── wizard.jsx — step components + shared constants ────────────────────── */
const { useState: useStateW } = React;

const GOALS = [
  { value: 'signups',     label: 'Sign-ups / Registrations' },
  { value: 'purchases',   label: 'Purchases / Conversions' },
  { value: 'clicks',      label: 'Click-through Rate' },
  { value: 'forms',       label: 'Form Completions' },
  { value: 'engagement',  label: 'Engagement / Time on Page' },
];

const LIFT_PRESETS = [
  { id: 'tiny',   label: 'Tiny',   range: '< 3%', lift: 2,  icon: '🌱', example: 'like 3.00% → 3.06%' },
  { id: 'small',  label: 'Small',  range: '3–7%', lift: 5,  icon: '📈', example: 'like 3.00% → 3.15%' },
  { id: 'medium', label: 'Medium', range: '7–15%',lift: 10, icon: '🚀', example: 'like 3.00% → 3.30%' },
  { id: 'big',    label: 'Big',    range: '> 15%',lift: 20, icon: '💥', example: 'like 3.00% → 3.60%' },
];

const CONFIDENCE_PRESETS = [
  { id: 0.80, label: 'Pretty confident', pct: '80%', desc: 'Good for quick wins where the stakes are low' },
  { id: 0.95, label: 'Very confident',   pct: '95%', desc: 'Standard for most product decisions', recommended: true },
  { id: 0.99, label: 'Certain',          pct: '99%', desc: 'Required when mistakes are costly' },
];

function WizardProgress({ step }) {
  const steps = ['Goal', 'Numbers', 'Lift', 'Confidence', 'Results'];
  return (
    <div className="wizard-progress">
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div className={`progress-step${i+1 <= step ? ' active' : ''}${i+1 === step ? ' current' : ''}`}>
            <div className="progress-dot">{i+1 < step ? '✓' : i+1}</div>
            <div className="progress-label">{s}</div>
          </div>
          {i < steps.length - 1 && <div className={`progress-line${i+1 < step ? ' active' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function StepGoal({ inputs, onChange, onNext }) {
  return (
    <div className="step-content">
      <h2 className="step-title">What are you testing?</h2>
      <p className="step-subtitle">Tell us about the change you're making and what you want to measure.</p>

      <div className="form-group">
        <label className="form-label">What metric are you trying to improve?</label>
        <select className="form-input" value={inputs.goal} onChange={e => onChange({ goal: e.target.value })}>
          <option value="">Choose a metric…</option>
          {GOALS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Describe your test in one sentence (optional)</label>
        <input type="text" className="form-input"
          placeholder="e.g. New checkout button color vs. original"
          value={inputs.goalDescription}
          onChange={e => onChange({ goalDescription: e.target.value })} />
      </div>

      <button className="btn-next" onClick={onNext} disabled={!inputs.goal}>Next →</button>
    </div>
  );
}

function StepNumbers({ inputs, onChange, onNext, onBack }) {
  return (
    <div className="step-content">
      <h2 className="step-title">Your current numbers</h2>
      <p className="step-subtitle">Don't worry about being exact — estimates work fine.</p>

      <div className="form-group">
        <label className="form-label">Out of every 100 visitors, how many complete your goal?</label>
        <div className="input-row">
          <input type="number" className="form-input" min="0.1" max="100" step="0.1"
            value={inputs.baseline} onChange={e => onChange({ baseline: e.target.value })} />
          <span className="input-unit">%</span>
        </div>
        <span className="form-hint">Example: if 3 out of 100 visitors buy something, enter 3</span>
      </div>

      <div className="form-group">
        <label className="form-label">How many visitors do you get per day?</label>
        <div className="input-row">
          <input type="number" className="form-input" min="10" step="50"
            value={inputs.dailyVisitors} onChange={e => onChange({ dailyVisitors: e.target.value })} />
          <span className="input-unit">visitors / day</span>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Maximum weeks you can run this test</label>
        <div className="input-row">
          <input type="number" className="form-input" min="1" max="52" step="1"
            value={inputs.maxWeeks} onChange={e => onChange({ maxWeeks: e.target.value })} />
          <span className="input-unit">weeks</span>
        </div>
      </div>

      <div className="step-nav">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <button className="btn-next" onClick={onNext}
          disabled={!inputs.baseline || !inputs.dailyVisitors || !inputs.maxWeeks}>
          Next →
        </button>
      </div>
    </div>
  );
}

function StepLift({ inputs, onChange, onNext, onBack }) {
  const base = parseFloat(inputs.baseline) || 3;
  return (
    <div className="step-content">
      <h2 className="step-title">How big an improvement are you expecting?</h2>
      <p className="step-subtitle">Pick the one that best matches your intuition.</p>

      <div className="preset-grid">
        {LIFT_PRESETS.map(p => (
          <button key={p.id}
            className={`preset-card${inputs.liftPreset === p.id ? ' selected' : ''}`}
            onClick={() => onChange({ liftPreset: p.id })}>
            <span className="preset-icon">{p.icon}</span>
            <span className="preset-label">{p.label}</span>
            <span className="preset-range">{p.range}</span>
            <span className="preset-example">{p.example}</span>
          </button>
        ))}
      </div>

      <div className="step-nav">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <button className="btn-next" onClick={onNext} disabled={!inputs.liftPreset}>Next →</button>
      </div>
    </div>
  );
}

function StepConfidence({ inputs, onChange, onNext, onBack }) {
  return (
    <div className="step-content">
      <h2 className="step-title">How sure do you need to be?</h2>
      <p className="step-subtitle">Higher confidence means more time and traffic — but fewer false alarms.</p>

      <div className="confidence-grid">
        {CONFIDENCE_PRESETS.map(p => (
          <button key={p.id}
            className={`confidence-card${inputs.confidence === p.id ? ' selected' : ''}`}
            onClick={() => onChange({ confidence: p.id })}>
            {p.recommended && <span className="recommended-badge">Recommended</span>}
            <span className="confidence-pct">{p.pct}</span>
            <span className="confidence-label">{p.label}</span>
            <span className="confidence-desc">{p.desc}</span>
          </button>
        ))}
      </div>

      <div className="step-nav">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <button className="btn-next" onClick={onNext} disabled={!inputs.confidence}>
          Run Simulation →
        </button>
      </div>
    </div>
  );
}
