/* ── Stats.js — Monte Carlo engine + statistical math ────────────────────── */
const Stats = (() => {

  // ── Primitives ────────────────────────────────────────────────────────────

  function gaussian() {
    let u, v;
    do { u = Math.random(); } while (u === 0);
    do { v = Math.random(); } while (v === 0);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  // Binomial sample — normal approximation for large n, Bernoulli for small
  function binomial(n, p) {
    if (n <= 0 || p <= 0) return 0;
    if (p >= 1) return n;
    const mean = n * p;
    const std  = Math.sqrt(n * p * (1 - p));
    if (std < 3) {
      let k = 0;
      for (let i = 0; i < n; i++) if (Math.random() < p) k++;
      return k;
    }
    return Math.min(n, Math.max(0, Math.round(mean + std * gaussian())));
  }

  // Standard normal CDF — Abramowitz & Stegun 26.2.17 (~7 decimal places)
  function normalCDF(z) {
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989422820 * Math.exp(-z * z / 2);
    const p = d * t * (0.3193815302
            + t * (-0.3565637813
            + t * (1.7814779372
            + t * (-1.8212559978
            + t * 1.3302744290))));
    return z > 0 ? 1 - p : p;
  }

  // Inverse normal CDF — Beasley-Springer-Moro rational approximation
  function inverseNormal(p) {
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    if (p < 0.5) return -inverseNormal(1 - p);
    const c = [2.515517, 0.802853, 0.010328];
    const d = [1.432788, 0.189269, 0.001308];
    const q = Math.sqrt(-2 * Math.log(1 - p));
    return q - (c[0] + c[1]*q + c[2]*q*q) / (1 + d[0]*q + d[1]*q*q + d[2]*q*q*q);
  }

  // ── Core Stats ────────────────────────────────────────────────────────────

  // Two-proportion z-test — returns two-tailed p-value
  function zTest(convC, nC, convT, nT) {
    if (nC <= 0 || nT <= 0) return 1;
    const pC     = convC / nC;
    const pT     = convT / nT;
    const pPool  = (convC + convT) / (nC + nT);
    const se     = Math.sqrt(pPool * (1 - pPool) * (1/nC + 1/nT));
    if (se === 0) return 1;
    const z = (pT - pC) / se;
    return 2 * (1 - normalCDF(Math.abs(z)));
  }

  // Required sample size per group (Evans formula for two proportions)
  function sampleSize(baseline, relLift, alpha, targetPower) {
    const p1  = baseline;
    const p2  = baseline * (1 + relLift / 100);
    if (Math.abs(p2 - p1) < 1e-9) return Infinity;
    const za  = inverseNormal(1 - alpha / 2);
    const zb  = inverseNormal(targetPower);
    const pB  = (p1 + p2) / 2;
    const num = Math.pow(
      za * Math.sqrt(2 * pB * (1 - pB)) +
      zb * Math.sqrt(p1*(1-p1) + p2*(1-p2)), 2
    );
    const den = Math.pow(p2 - p1, 2);
    return Math.ceil(num / den);
  }

  // Composite risk score 0–100
  function riskScore({ alpha, simulatedPower, relLift, daysRequired }) {
    const fp   = alpha * 100;
    const fn   = (1 - simulatedPower) * 100;
    const lift = relLift < 3 ? 35 : relLift > 15 ? 5 : 30 - relLift;
    const time = daysRequired > 60 ? 25 : daysRequired > 30 ? 12 : 0;
    return Math.min(100, Math.round(fp*0.30 + fn*0.35 + lift*0.25 + time*0.10));
  }

  // ── Monte Carlo Engine ────────────────────────────────────────────────────

  // Runs nTrials simulated experiments; reports progress via onProgress(done, total).
  // Returns a Promise that resolves with results when all trials complete.
  function runMonteCarlo(params, onProgress) {
    return new Promise(resolve => {
      const {
        baseline,
        relLift,
        dailyVisitors,
        alpha,
        targetPower = 0.80,
        nTrials     = 3000,
      } = params;

      const treatRate  = baseline * (1 + relLift / 100);
      const nPerGroup  = sampleSize(baseline, relLift, alpha, targetPower);
      const daysNeeded = Math.ceil(nPerGroup / Math.max(1, dailyVisitors / 2));

      const liftDist = [];
      const pvalues  = [];
      let   sigCount = 0;
      let   done     = 0;
      const BATCH    = 300;

      function tick() {
        const end = Math.min(done + BATCH, nTrials);
        for (let i = done; i < end; i++) {
          const ctrlConv  = binomial(nPerGroup, baseline);
          const treatConv = binomial(nPerGroup, treatRate);
          const pC        = ctrlConv  / nPerGroup;
          const pT        = treatConv / nPerGroup;
          const lift      = pC > 0 ? (pT - pC) / pC : 0;
          const p         = zTest(ctrlConv, nPerGroup, treatConv, nPerGroup);
          liftDist.push(lift);
          pvalues.push(p);
          if (p < alpha) sigCount++;
        }
        done = end;
        onProgress(done, nTrials);

        if (done < nTrials) {
          requestAnimationFrame(tick);
        } else {
          const simulatedPower = sigCount / nTrials;
          resolve({
            liftDist,
            pvalues,
            sigCount,
            simulatedPower,
            nPerGroup,
            daysNeeded,
            riskScore: riskScore({ alpha, simulatedPower, relLift, daysRequired: daysNeeded }),
          });
        }
      }

      requestAnimationFrame(tick);
    });
  }

  // Simulate p-value trajectory day by day (averaged across nPaths runs)
  // Returns [{day, pvalue, p25, p75}]
  function simulatePvaluePath({ baseline, relLift, dailyVisitors, alpha, maxDays = 84, nPaths = 30 }) {
    const treatRate      = baseline * (1 + relLift / 100);
    const dailyPerGroup  = Math.max(1, Math.floor(dailyVisitors / 2));
    const allPaths       = [];

    for (let path = 0; path < nPaths; path++) {
      let ctrlConv = 0, ctrlN = 0, treatConv = 0, treatN = 0;
      const series = [];
      for (let day = 1; day <= maxDays; day++) {
        ctrlConv  += binomial(dailyPerGroup, baseline);
        ctrlN     += dailyPerGroup;
        treatConv += binomial(dailyPerGroup, treatRate);
        treatN    += dailyPerGroup;
        series.push(zTest(ctrlConv, ctrlN, treatConv, treatN));
      }
      allPaths.push(series);
    }

    const result = [];
    for (let d = 0; d < maxDays; d++) {
      const vals = allPaths.map(p => p[d]).sort((a, b) => a - b);
      result.push({
        day:    d + 1,
        pvalue: vals[Math.floor(nPaths / 2)],
        p25:    vals[Math.floor(nPaths * 0.25)],
        p75:    vals[Math.floor(nPaths * 0.75)],
      });
    }
    return result;
  }

  return { gaussian, binomial, normalCDF, inverseNormal, zTest, sampleSize, riskScore, runMonteCarlo, simulatePvaluePath };
})();
