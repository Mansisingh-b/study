import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import './Timetable.css';

const Timer: React.FC = () => {
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = mode === 'focus' ? focusDuration * 60 : breakDuration * 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setTimeout(() => setIsRunning(false), 0);
      if (soundOn) {
        try {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 800;
          gain.gain.value = 0.3;
          osc.start();
          setTimeout(() => { osc.stop(); ctx.close(); }, 1500);
        } catch { /* silent */ }
      }
      if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
      // Auto switch mode
      if (mode === 'focus') {
        setTimeout(() => setMode('break'), 0);
        setTimeout(() => setTimeLeft(breakDuration * 60), 0);
      } else {
        setTimeout(() => setMode('focus'), 0);
        setTimeout(() => setTimeLeft(focusDuration * 60), 0);
      }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, timeLeft, soundOn, mode, focusDuration, breakDuration]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? focusDuration * 60 : breakDuration * 60);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? focusDuration * 60 : breakDuration * 60);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Circle SVG
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="timer-page">
      <div className="timer-header">
        <h1 className="page-title">⏱ Study Timer</h1>
        <p className="page-subtitle">Focus with the Pomodoro technique</p>
      </div>

      <div className="timer-container card">
        {/* Mode Tabs */}
        <div className="timer-tabs">
          <button className={`timer-tab ${mode === 'focus' ? 'active' : ''}`} onClick={() => switchMode('focus')}>
            ⏱ Focus
          </button>
          <button className={`timer-tab ${mode === 'break' ? 'active' : ''}`} onClick={() => switchMode('break')}>
            ☕ Break
          </button>
        </div>

        {/* Timer Circle */}
        <div className="timer-circle-wrapper">
          <svg className="timer-svg" viewBox="0 0 260 260">
            <circle cx="130" cy="130" r={radius} fill="none" stroke="var(--border)" strokeWidth="8" />
            <circle
              cx="130" cy="130" r={radius}
              fill="none"
              stroke={mode === 'focus' ? '#6366f1' : '#10b981'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 130 130)"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="timer-display">
            <span className="timer-time">{formatTime(timeLeft)}</span>
            <span className="timer-label">{mode === 'focus' ? 'Focus Time' : 'Break Time'}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="timer-controls">
          <button className="timer-ctrl-btn" onClick={handleReset}>
            <RotateCcw size={20} />
          </button>
          <button className="timer-play-btn" onClick={isRunning ? handlePause : handleStart}>
            {isRunning ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button className="timer-ctrl-btn" onClick={() => setSoundOn(!soundOn)}>
            {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>

        {/* Duration Settings */}
        <div className="timer-settings">
          <div className="timer-setting-group">
            <label>Focus Duration (min)</label>
            <input
              type="number"
              className="input"
              min={1}
              max={120}
              value={focusDuration}
              onChange={(e) => {
                const v = parseInt(e.target.value) || 1;
                setFocusDuration(v);
                if (mode === 'focus' && !isRunning) setTimeLeft(v * 60);
              }}
            />
          </div>
          <div className="timer-setting-group">
            <label>Break Duration (min)</label>
            <input
              type="number"
              className="input"
              min={1}
              max={60}
              value={breakDuration}
              onChange={(e) => {
                const v = parseInt(e.target.value) || 1;
                setBreakDuration(v);
                if (mode === 'break' && !isRunning) setTimeLeft(v * 60);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
