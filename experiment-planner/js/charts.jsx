/* ── charts.jsx — D3 chart components ───────────────────────────────────── */
const { useRef, useEffect } = React;

function HistogramChart({ data }) {
  const ref = useRef();

  useEffect(() => {
    if (!data || !data.length || !ref.current) return;
    const el = ref.current;
    const W  = el.clientWidth || 480;
    const H  = 210;
    const m  = { top: 16, right: 16, bottom: 36, left: 36 };

    const svg = d3.select(el).attr('width', W).attr('height', H);
    svg.selectAll('*').remove();

    const x = d3.scaleLinear().domain([-0.6, 0.9]).range([m.left, W - m.right]);

    const bins = d3.histogram()
      .value(d => d)
      .domain(x.domain())
      .thresholds(x.ticks(40))(data);

    const y = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length)])
      .range([H - m.bottom, m.top]);

    // Grid
    svg.append('g').selectAll('line')
      .data(y.ticks(4)).join('line')
      .attr('x1', m.left).attr('x2', W - m.right)
      .attr('y1', d => y(d)).attr('y2', d => y(d))
      .attr('stroke', 'var(--chart-grid)');

    // Bars
    svg.selectAll('.bar').data(bins).join('rect')
      .attr('x', d => x(d.x0) + 1)
      .attr('y', d => y(d.length))
      .attr('width', d => Math.max(0, x(d.x1) - x(d.x0) - 2))
      .attr('height', d => H - m.bottom - y(d.length))
      .attr('fill', d => (d.x0 + d.x1) / 2 > 0 ? 'var(--success)' : 'var(--danger)')
      .attr('opacity', 0.75)
      .attr('rx', 2);

    // Zero line
    svg.append('line')
      .attr('x1', x(0)).attr('x2', x(0))
      .attr('y1', m.top).attr('y2', H - m.bottom)
      .attr('stroke', 'var(--text-dim)').attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,3');

    // X axis
    svg.append('g')
      .attr('transform', `translate(0,${H - m.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d => `${(d*100).toFixed(0)}%`).ticks(6))
      .call(g => g.select('.domain').attr('stroke', 'var(--border)'))
      .call(g => g.selectAll('text').attr('fill', 'var(--text-muted)').attr('font-size', 10))
      .call(g => g.selectAll('.tick line').attr('stroke', 'var(--border)'));

    svg.append('text')
      .attr('x', W / 2).attr('y', H - 2)
      .attr('text-anchor', 'middle').attr('fill', 'var(--text-dim)').attr('font-size', 10)
      .text('Measured improvement across simulated tests');
  }, [data]);

  return <svg ref={ref} style={{ width: '100%', display: 'block' }} />;
}

function PvalueChart({ data, alpha }) {
  const ref = useRef();

  useEffect(() => {
    if (!data || !data.length || !ref.current) return;
    const el = ref.current;
    const W  = el.clientWidth || 480;
    const H  = 210;
    const m  = { top: 16, right: 20, bottom: 36, left: 42 };

    const svg = d3.select(el).attr('width', W).attr('height', H);
    svg.selectAll('*').remove();

    const x = d3.scaleLinear().domain([1, data.length]).range([m.left, W - m.right]);
    const y = d3.scaleLinear().domain([0, 1]).range([H - m.bottom, m.top]);

    // CI band
    svg.append('path').datum(data)
      .attr('fill', 'var(--ci-band)')
      .attr('d', d3.area()
        .x(d => x(d.day))
        .y0(d => y(Math.min(1, d.p75)))
        .y1(d => y(Math.max(0, d.p25)))
        .curve(d3.curveCatmullRom)
      );

    // Median line (animated)
    const lineFn = d3.line()
      .x(d => x(d.day)).y(d => y(d.pvalue)).curve(d3.curveCatmullRom);

    const path = svg.append('path').datum(data)
      .attr('fill', 'none').attr('stroke', 'var(--accent)').attr('stroke-width', 2.5)
      .attr('d', lineFn);

    const len = path.node().getTotalLength();
    path.attr('stroke-dasharray', `${len} ${len}`).attr('stroke-dashoffset', len)
      .transition().duration(1600).ease(d3.easeLinear).attr('stroke-dashoffset', 0);

    // Alpha threshold
    svg.append('line')
      .attr('x1', m.left).attr('x2', W - m.right)
      .attr('y1', y(alpha)).attr('y2', y(alpha))
      .attr('stroke', 'var(--danger)').attr('stroke-width', 1.5).attr('stroke-dasharray', '5,4');

    svg.append('text')
      .attr('x', W - m.right - 4).attr('y', y(alpha) - 5)
      .attr('text-anchor', 'end').attr('fill', 'var(--danger)').attr('font-size', 10)
      .text(`${Math.round((1 - alpha) * 100)}% confidence threshold`);

    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${H - m.bottom})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d => `Day ${d}`))
      .call(g => g.select('.domain').attr('stroke', 'var(--border)'))
      .call(g => g.selectAll('text').attr('fill', 'var(--text-muted)').attr('font-size', 10))
      .call(g => g.selectAll('.tick line').attr('stroke', 'var(--border)'));

    svg.append('g')
      .attr('transform', `translate(${m.left},0)`)
      .call(d3.axisLeft(y).ticks(4).tickFormat(d => `${Math.round(d*100)}%`))
      .call(g => g.select('.domain').attr('stroke', 'var(--border)'))
      .call(g => g.selectAll('text').attr('fill', 'var(--text-muted)').attr('font-size', 10))
      .call(g => g.selectAll('.tick line').attr('stroke', 'var(--border)'));

    svg.append('text')
      .attr('transform', 'rotate(-90)').attr('x', -(H / 2)).attr('y', 13)
      .attr('text-anchor', 'middle').attr('fill', 'var(--text-dim)').attr('font-size', 10)
      .text('Chance result is luck');
  }, [data, alpha]);

  return <svg ref={ref} style={{ width: '100%', display: 'block' }} />;
}
