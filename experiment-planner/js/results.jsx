/* ── results.jsx — simulation results, AI panel, results screen ─────────── */
const { useState: useStateR, useEffect: useEffectR } = React;

const N_TRIALS = 3000;

function StatCard({ value, label, sub, color }) {
  return (
    <div className="stat-card">
      <div className="stat-value" style={color ? { color } : {}}>{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

function RiskMeter({ score }) {
  const color = score < 30 ? 'var(--success)' : score < 60 ? 'var(--warning)' : 'var(--danger)';
  const label = score < 30 ? 'Low Risk' : score < 60 ? 'Moderate Risk' : 'High Risk';
  return (
    <div className="stat-card">
      <div className="stat-value" style={{ color }}>{score}</div>
      <div className="stat-label">Risk Score</div>
      <div className="stat-sub">{label} — {100 - score}/100 reliability</div>
    </div>
  );
}

function AIPanel({ inputs, simResults, apiKey, onRequestKey }) {
  const [ai, setAi] = useStateR({ status: 'idle', text: '', error: null });

  useEffectR(() => {
    if (simResults && apiKey) startAI();
  }, [simResults, apiKey]);

  async function startAI() {
    setAi({ status: 'loading', text: '', error: null });
    const baseline   = parseFloat(inputs.baseline);
    const liftPreset = LIFT_PRESETS.find(l => l.id === inputs.liftPreset);
    const goalLabel  = GOALS.find(g => g.value === inputs.goal)?.label || inputs.goal;

    const prompt = `You are an A/B testing advisor helping a marketing professional plan an experiment.

Context:
- Goal: Improve ${goalLabel}${inputs.goalDescription ? ` (${inputs.goalDescription})` : ''}
- Current rate: ${baseline}%
- Expected improvement: ${liftPreset?.lift || 10}% relative lift
- Daily traffic: ${inputs.dailyVisitors} visitors/day
- Confidence needed: ${Math.round(inputs.confidence * 100)}%

Simulation results:
- Visitors needed per group: ${simResults.nPerGroup.toLocaleString()}
- Days to get results: ${simResults.daysNeeded} days
- Simulated success rate: ${Math.round(simResults.simulatedPower * 100)}%
- Risk score: ${simResults.riskScore}/100

Provide three sections exactly as formatted below:

TOP 3 EXPERIMENT IDEAS:
TEST 1: [one sentence describing what to change]
WHY: [one sentence rationale]

TEST 2: [one sentence describing what to change]
WHY: [one sentence rationale]

TEST 3: [one sentence describing what to change]
WHY: [one sentence rationale]

WHAT YOUR RESULTS MEAN:
[2 short paragraphs in plain English — no jargon — explaining the simulation and main risks]

RECOMMENDATION:
[Start with "GO ✓", "WAIT ⏳", or "RETHINK ✗" then one sentence explaining why]`;

    try {
      let full = '';
      for await (const chunk of Claude.stream(prompt, apiKey)) {
        full += chunk;
        setAi({ status: 'streaming', text: full, error: null });
      }
      setAi({ status: 'done', text: full, error: null });
    } catch (err) {
      setAi({ status: 'error', text: '', error: err.message });
    }
  }

  function parse(text) {
    const tests = [];
    const testRe = /TEST \d+:\s*(.+?)(?:\nWHY:|$)/gs;
    const whyRe  = /WHY:\s*(.+?)(?:\nTEST|\nWHAT|$)/gs;
    const tMatches = [...text.matchAll(testRe)];
    const wMatches = [...text.matchAll(whyRe)];
    tMatches.forEach((m, i) => tests.push({ test: m[1].trim(), why: wMatches[i]?.[1]?.trim() || '' }));

    const meaningM = text.match(/WHAT YOUR RESULTS MEAN:\s*([\s\S]+?)(?:RECOMMENDATION:|$)/);
    const meaning  = meaningM?.[1]?.trim() || '';

    const recM = text.match(/RECOMMENDATION:\s*([\s\S]+)$/);
    const rec  = recM?.[1]?.trim() || '';
    let verdict = '';
    if (rec.startsWith('GO'))     verdict = 'go';
    else if (rec.startsWith('WAIT'))   verdict = 'wait';
    else if (rec.startsWith('RETHINK')) verdict = 'rethink';
    const recText = rec.replace(/^(GO ✓|WAIT ⏳|RETHINK ✗)\s*/,'').trim();

    return { tests, meaning, verdict, recText };
  }

  if (!apiKey) return (
    <div className="ai-panel ai-locked">
      <div className="ai-lock-icon">🔒</div>
      <h3>AI Analysis</h3>
      <p>Add a Claude API key to get experiment ideas, plain-English results, and a Go / No-Go recommendation.</p>
      <button className="btn-unlock" onClick={onRequestKey}>Add API Key</button>
    </div>
  );

  if (ai.status === 'idle' || ai.status === 'loading') return (
    <div className="ai-panel ai-loading">
      <div className="ai-spinner" />
      <p>Analyzing your experiment…</p>
    </div>
  );

  if (ai.status === 'error') return (
    <div className="ai-panel ai-error">
      <p>⚠️ AI analysis failed: {ai.error}</p>
      <button className="btn-retry" onClick={startAI}>Retry</button>
    </div>
  );

  if (ai.status === 'streaming') return (
    <div className="ai-panel ai-streaming">
      <div className="ai-stream-header"><div className="ai-spinner-small" /><span>Analyzing your experiment…</span></div>
      <pre className="ai-stream-text">{ai.text}<span className="cursor">▋</span></pre>
    </div>
  );

  const { tests, meaning, verdict, recText } = parse(ai.text);
  const verdictColor = { go: 'var(--success)', wait: 'var(--warning)', rethink: 'var(--danger)' }[verdict] || 'var(--accent)';
  const verdictLabel = { go: 'GO ✓ Run this test', wait: 'WAIT ⏳ Not ready yet', rethink: 'RETHINK ✗ Adjust your plan' }[verdict] || 'Recommendation';

  return (
    <div className="ai-panel ai-done">
      {tests.length > 0 && (
        <div className="ai-section">
          <h3 className="ai-section-title">Top 3 experiment ideas</h3>
          <div className="hypothesis-list">
            {tests.map((t, i) => (
              <div key={i} className="hypothesis-card">
                <span className="hypothesis-num">{i + 1}</span>
                <div>
                  <div className="hypothesis-test">{t.test}</div>
                  {t.why && <div className="hypothesis-why">{t.why}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {meaning && (
        <div className="ai-section">
          <h3 className="ai-section-title">What your simulation is telling you</h3>
          <p className="ai-meaning">{meaning}</p>
        </div>
      )}

      {verdict && (
        <div className="ai-verdict" style={{ borderColor: verdictColor }}>
          <div className="verdict-label" style={{ color: verdictColor }}>{verdictLabel}</div>
          <div className="verdict-reason">{recText}</div>
        </div>
      )}
    </div>
  );
}

function ResultsScreen({ inputs, onBack, apiKey, onRequestKey }) {
  const [progress,   setProgress]   = useStateR(0);
  const [simResults, setSimResults] = useStateR(null);
  const [pvPath,     setPvPath]     = useStateR(null);

  useEffectR(() => { runSim(); }, []);

  async function runSim() {
    const baseline      = parseFloat(inputs.baseline) / 100;
    const liftPreset    = LIFT_PRESETS.find(l => l.id === inputs.liftPreset);
    const relLift       = liftPreset?.lift || 10;
    const alpha         = 1 - inputs.confidence;
    const dailyVisitors = parseInt(inputs.dailyVisitors, 10);

    const results = await Stats.runMonteCarlo(
      { baseline, relLift, dailyVisitors, alpha, targetPower: 0.80, nTrials: N_TRIALS },
      (done, total) => setProgress(done / total)
    );
    setSimResults(results);

    const path = Stats.simulatePvaluePath({
      baseline, relLift, dailyVisitors, alpha,
      maxDays: Math.min(90, results.daysNeeded * 2 + 14),
      nPaths:  30,
    });
    setPvPath(path);
  }

  if (!simResults) return (
    <div className="results-loading">
      <h2 className="step-title">Running your simulation…</h2>
      <p className="step-subtitle">Simulating {N_TRIALS.toLocaleString()} possible versions of your experiment</p>
      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{ width: `${progress * 100}%` }} />
      </div>
      <div className="progress-label">{Math.round(progress * 100)}%</div>
    </div>
  );

  const goalLabel  = GOALS.find(g => g.value === inputs.goal)?.label || 'your goal';
  const liftPreset = LIFT_PRESETS.find(l => l.id === inputs.liftPreset);
  const alpha      = 1 - inputs.confidence;
  const weeksNeeded = Math.ceil(simResults.daysNeeded / 7);
  const maxWeeks    = parseInt(inputs.maxWeeks, 10);
  const feasible    = weeksNeeded <= maxWeeks;

  return (
    <div className="results-screen">
      <div className="results-header">
        <button className="btn-back-sm" onClick={onBack}>← Start over</button>
        <div>
          <h2 className="results-title">Your Experiment Plan</h2>
          <p className="results-subtitle">
            Testing: <strong>{goalLabel}</strong> · Baseline: <strong>{inputs.baseline}%</strong> · Expecting a <strong>{liftPreset?.label?.toLowerCase()}</strong> improvement
          </p>
        </div>
      </div>

      <div className="metrics-grid">
        <StatCard
          value={`${weeksNeeded} wk${weeksNeeded !== 1 ? 's' : ''}`}
          label="Time needed"
          sub={feasible ? `✓ Within your ${maxWeeks}-week window` : `⚠ Exceeds your ${maxWeeks}-week window`}
          color={feasible ? 'var(--success)' : 'var(--warning)'}
        />
        <StatCard
          value={simResults.nPerGroup.toLocaleString()}
          label="Visitors needed per group"
          sub={`${(simResults.nPerGroup * 2).toLocaleString()} total`}
        />
        <StatCard
          value={`${Math.round(simResults.simulatedPower * 100)}%`}
          label="Chance of catching a real win"
          sub={`Across ${N_TRIALS.toLocaleString()} simulations`}
          color={simResults.simulatedPower >= 0.7 ? 'var(--success)' : 'var(--warning)'}
        />
        <RiskMeter score={simResults.riskScore} />
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Spread of simulated outcomes</h3>
          <p className="chart-desc">Green = your variant won. Red = it lost. Wider spread means more uncertainty.</p>
          <HistogramChart data={simResults.liftDist} />
        </div>
        {pvPath && (
          <div className="chart-card">
            <h3 className="chart-title">How your confidence builds over time</h3>
            <p className="chart-desc">The line shows when your test typically crosses the significance threshold.</p>
            <PvalueChart data={pvPath} alpha={alpha} />
          </div>
        )}
      </div>

      <AIPanel inputs={inputs} simResults={simResults} apiKey={apiKey} onRequestKey={onRequestKey} />
    </div>
  );
}
