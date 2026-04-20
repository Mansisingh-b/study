import React from 'react';
import { usePlanner } from '../context/PlannerContext';
import { 
  Line, 
  Doughnut, 
  Bar 
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './Analytics.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics: React.FC = () => {
  const { tasks, goals } = usePlanner();

  const today = new Date();
  const getWeekStart = () => {
    const d = new Date(today);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Live weekly data
  const weeklyPlanned: number[] = [];
  const weeklyActual: number[] = [];
  let bestDay = 'None';
  let bestDayCount = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(getWeekStart());
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayTasks = tasks.filter(t => t.date === dateStr);
    const planned = dayTasks.length;
    const actual = dayTasks.filter(t => t.completed).length;
    weeklyPlanned.push(planned);
    weeklyActual.push(actual);
    if (actual > bestDayCount) {
      bestDayCount = actual;
      bestDay = dayNames[i];
    }
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const unfulfilledTasks = totalTasks - completedTasks;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const goalsDone = goals.filter(g => g.progress >= g.target).length;

  // Line chart - live data
  const lineData = {
    labels: dayNames,
    datasets: [
      {
        label: 'Planned',
        data: weeklyPlanned,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        borderDash: [5, 5],
        pointRadius: 5,
        pointBackgroundColor: '#6366f1',
      },
      {
        label: 'Actual',
        data: weeklyActual,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#10b981',
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { usePointStyle: true, padding: 20 }
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#0f172a',
        bodyColor: '#64748b',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
      }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
      x: { grid: { display: false } }
    }
  };

  // Doughnut - live data
  const doughnutData = {
    labels: ['Completed', 'Remaining'],
    datasets: [{
      data: totalTasks > 0 ? [completedTasks, unfulfilledTasks] : [0, 1], // Provide fake data to render grey circle on 0
      backgroundColor: totalTasks > 0 ? ['#10b981', '#ef4444'] : ['#e2e8f0', '#e2e8f0'],
      borderWidth: 0,
      cutout: '70%',
    }]
  };

  const doughnutOptions = {
    responsive: true,
    animation: false as const,
    plugins: {
      legend: { display: true, position: 'bottom' as const, labels: { usePointStyle: true, padding: 12 } },
      tooltip: { enabled: totalTasks > 0 }
    }
  };

  // Plugin to draw center text on the donut
  const centerTextPlugin = {
    id: 'centerText',
    afterDraw(chart: ChartJS) {
      if (chart.config.type !== 'doughnut') return;
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      ctx.save();
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillStyle = '#1e293b';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${progressPercent}%`, centerX, centerY);
      ctx.restore();
    }
  };

  // Bar chart - live by category
  const categories = [...new Set(tasks.map(t => t.category || 'General'))];
  const barData = {
    labels: categories.length > 0 ? categories : ['No Tasks'],
    datasets: [{
      label: 'Tasks',
      data: categories.length > 0 ? categories.map(cat => tasks.filter(t => (t.category || 'General') === cat).length) : [0],
      backgroundColor: '#6366f1',
      borderRadius: 4,
      barThickness: 40,
    }]
  };

  const barOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { beginAtZero: true, grid: { color: '#f1f5f9' } } }
  };

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Track your productivity and progress</p>
      </div>

      <div className="analytics-charts-grid">
        <div className="chart-card">
          <h3 className="chart-card-title">📈 Progress of the Week</h3>
          <div className="chart-wrapper">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-card-title">📊 Task Analytics</h3>
          <div className="analytics-of-week-content">
            <div className="pie-chart-wrapper">
              <Doughnut data={doughnutData} options={doughnutOptions} plugins={[centerTextPlugin as any]} />
            </div>
            <div className="analytics-stats-list">
              <div className="analytic-stat-item">
                <span className="label">Total Tasks</span>
                <span className="value">{totalTasks}</span>
              </div>
              <div className="analytic-stat-item">
                <span className="label">Completed</span>
                <span className="value">{completedTasks}</span>
              </div>
              <div className="analytic-stat-item">
                <span className="label">Unfulfilled</span>
                <span className="value">{unfulfilledTasks}</span>
              </div>
              <div className="analytic-stat-item">
                <span className="label">Progress</span>
                <span className="value highlight">{progressPercent}%</span>
              </div>
              <div className="analytic-stat-item">
                <span className="label">Goals Done</span>
                <span className="value">{goalsDone}</span>
              </div>
              <div className="analytic-stat-item">
                <span className="label">Productive Day</span>
                <span className="value blue-text">{bestDayCount > 0 ? bestDay : 'None'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card full-width">
          <h3 className="chart-card-title">Task Distribution</h3>
          <div className="chart-wrapper">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
