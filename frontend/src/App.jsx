import axios from 'axios';
import * as echarts from 'echarts';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

const text = {
  title: '\u94f6\u884c\u4e1a\u52a1\u6570\u636e\u8d28\u91cf\u68c0\u67e5\u4e0e\u98ce\u9669\u770b\u677f\u7cfb\u7edf',
  check: '\u6267\u884c\u6570\u636e\u8d28\u91cf\u68c0\u67e5',
  checking: '\u68c0\u67e5\u4e2d...',
  totalCustomers: '\u603b\u5ba2\u6237\u6570',
  errorCustomers: '\u5f02\u5e38\u6570\u636e\u6570',
  highRiskCustomers: '\u9ad8\u98ce\u9669\u5ba2\u6237\u6570',
  averageLoanAmount: '\u5e73\u5747\u8d37\u6b3e\u91d1\u989d',
  riskChart: '\u98ce\u9669\u7b49\u7ea7\u5206\u5e03',
  errorChart: '\u5f02\u5e38\u7c7b\u578b\u5206\u5e03',
  lowRisk: '\u4f4e\u98ce\u9669',
  mediumRisk: '\u4e2d\u98ce\u9669',
  highRisk: '\u9ad8\u98ce\u9669',
  customerCount: '\u5ba2\u6237\u6570',
  errorType: '\u5f02\u5e38\u7c7b\u578b',
  name: '\u59d3\u540d',
  phone: '\u624b\u673a\u53f7',
  loanAmount: '\u8d37\u6b3e\u91d1\u989d',
  monthlyIncome: '\u6708\u6536\u5165',
  creditScore: '\u4fe1\u7528\u5206',
  riskLevel: '\u98ce\u9669\u7b49\u7ea7',
  errorReason: '\u5f02\u5e38\u539f\u56e0',
  noData: '\u6682\u65e0\u5ba2\u6237\u6570\u636e',
  unchecked: '\u672a\u68c0\u67e5',
  none: '\u65e0'
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f5f7fb',
    color: '#172033',
    fontFamily: 'Arial, "Microsoft YaHei", sans-serif'
  },
  header: {
    background: '#ffffff',
    borderBottom: '1px solid #e6eaf2',
    padding: '22px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap'
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700
  },
  button: {
    border: 0,
    borderRadius: 6,
    background: '#1769e0',
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 600,
    padding: '11px 18px',
    cursor: 'pointer'
  },
  main: {
    padding: 32,
    maxWidth: 1280,
    margin: '0 auto'
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
    marginBottom: 22
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e6eaf2',
    borderRadius: 8,
    padding: 18
  },
  cardLabel: {
    color: '#667085',
    fontSize: 14,
    marginBottom: 10
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 700
  },
  chartGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 16,
    marginBottom: 22
  },
  panel: {
    background: '#ffffff',
    border: '1px solid #e6eaf2',
    borderRadius: 8,
    padding: 16
  },
  panelTitle: {
    margin: '0 0 12px',
    fontSize: 17,
    fontWeight: 700
  },
  chart: {
    width: '100%',
    height: 320
  },
  tableWrap: {
    background: '#ffffff',
    border: '1px solid #e6eaf2',
    borderRadius: 8,
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: 920
  },
  th: {
    background: '#f0f3f8',
    color: '#344054',
    textAlign: 'left',
    fontSize: 14,
    padding: '12px 14px',
    borderBottom: '1px solid #e6eaf2'
  },
  td: {
    padding: '12px 14px',
    borderBottom: '1px solid #edf0f5',
    fontSize: 14
  },
  tag: {
    display: 'inline-block',
    minWidth: 52,
    textAlign: 'center',
    borderRadius: 14,
    padding: '4px 9px',
    fontWeight: 700,
    fontSize: 13
  },
  empty: {
    textAlign: 'center',
    color: '#667085',
    padding: 28
  }
};

function App() {
  const riskChartRef = useRef(null);
  const errorChartRef = useRef(null);
  const [customers, setCustomers] = useState([]);
  const [summary, setSummary] = useState({
    totalCustomers: 0,
    errorCustomers: 0,
    highRiskCustomers: 0,
    averageLoanAmount: 0,
    lowRiskCount: 0,
    mediumRiskCount: 0,
    highRiskCount: 0
  });
  const [errorTypes, setErrorTypes] = useState({});
  const [loading, setLoading] = useState(false);

  const cards = useMemo(() => [
    { label: text.totalCustomers, value: summary.totalCustomers },
    { label: text.errorCustomers, value: summary.errorCustomers },
    { label: text.highRiskCustomers, value: summary.highRiskCustomers },
    { label: text.averageLoanAmount, value: formatMoney(summary.averageLoanAmount) }
  ], [summary]);

  async function loadData() {
    const [customerRes, summaryRes, errorTypeRes] = await Promise.all([
      api.get('/customers'),
      api.get('/dashboard/summary'),
      api.get('/dashboard/error-types')
    ]);
    setCustomers(customerRes.data);
    setSummary(summaryRes.data);
    setErrorTypes(errorTypeRes.data);
  }

  async function handleCheck() {
    setLoading(true);
    try {
      await api.post('/check');
      await loadData();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData().catch((error) => {
      console.error('Failed to load dashboard data:', error);
    });
  }, []);

  useEffect(() => {
    if (!riskChartRef.current) {
      return undefined;
    }
    const chart = echarts.init(riskChartRef.current);
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 20, top: 36, bottom: 36 },
      xAxis: { type: 'category', data: [text.lowRisk, text.mediumRisk, text.highRisk] },
      yAxis: { type: 'value', minInterval: 1 },
      series: [{
        name: text.customerCount,
        type: 'bar',
        barWidth: 42,
        data: [
          summary.lowRiskCount,
          summary.mediumRiskCount,
          summary.highRiskCount
        ],
        itemStyle: {
          color: (params) => ['#16a34a', '#f59e0b', '#dc2626'][params.dataIndex]
        }
      }]
    });
    const resize = () => chart.resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      chart.dispose();
    };
  }, [summary]);

  useEffect(() => {
    if (!errorChartRef.current) {
      return undefined;
    }
    const chart = echarts.init(errorChartRef.current);
    const data = Object.entries(errorTypes).map(([name, value]) => ({ name, value }));
    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: 0, type: 'scroll' },
      series: [{
        name: text.errorType,
        type: 'pie',
        radius: ['38%', '64%'],
        center: ['50%', '42%'],
        data,
        label: { formatter: '{b}: {c}' }
      }]
    });
    const resize = () => chart.resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      chart.dispose();
    };
  }, [errorTypes]);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>{text.title}</h1>
        <button style={styles.button} onClick={handleCheck} disabled={loading}>
          {loading ? text.checking : text.check}
        </button>
      </header>

      <main style={styles.main}>
        <section style={styles.cards}>
          {cards.map((card) => (
            <div style={styles.card} key={card.label}>
              <div style={styles.cardLabel}>{card.label}</div>
              <div style={styles.cardValue}>{card.value}</div>
            </div>
          ))}
        </section>

        <section style={styles.chartGrid}>
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>{text.riskChart}</h2>
            <div ref={riskChartRef} style={styles.chart} />
          </div>
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>{text.errorChart}</h2>
            <div ref={errorChartRef} style={styles.chart} />
          </div>
        </section>

        <section style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {[text.name, text.phone, text.loanAmount, text.monthlyIncome, text.creditScore, text.riskLevel, text.errorReason].map((title) => (
                  <th style={styles.th} key={title}>{title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td style={styles.empty} colSpan="7">{text.noData}</td>
                </tr>
              ) : customers.map((item) => (
                <tr key={item.id}>
                  <td style={styles.td}>{item.customerName}</td>
                  <td style={styles.td}>{item.phone || '-'}</td>
                  <td style={styles.td}>{formatMoney(item.loanAmount)}</td>
                  <td style={styles.td}>{formatMoney(item.monthlyIncome)}</td>
                  <td style={styles.td}>{item.creditScore ?? '-'}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.tag, ...riskTagStyle(item.riskLevel) }}>
                      {item.riskLevel || text.unchecked}
                    </span>
                  </td>
                  <td style={styles.td}>{item.errorReason || text.none}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

function formatMoney(value) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  return Number(value).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function riskTagStyle(riskLevel) {
  if (riskLevel === text.highRisk) {
    return { color: '#b42318', background: '#fee4e2' };
  }
  if (riskLevel === text.mediumRisk) {
    return { color: '#b54708', background: '#fef0c7' };
  }
  if (riskLevel === text.lowRisk) {
    return { color: '#027a48', background: '#d1fadf' };
  }
  return { color: '#344054', background: '#eaecf0' };
}

export default App;
