import React from 'react';
import TradesChart from './components/TradesChart';
import TradesTable from './components/TradesTable';
import './index.css';

export default function App(){
  return (
    <div className="app-container">
      <div className="header">
        <div>
          <div className="title">Trades Dashboard</div>
          <div className="subtitle">React + Django (SQLite). CRUD table and multi-axis chart.</div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <a className="btn ghost" href="http://127.0.0.1:8000/admin/" target="_blank" rel="noreferrer">Django Admin</a>
          <button className="btn" onClick={()=>window.location.reload()}>Refresh</button>
        </div>
      </div>

      <div className="card chart-wrapper">
        <div style={{flex:1, minWidth:320}}>
          <TradesChart />
        </div>
      </div>

      <div className="card table-wrap">
        <TradesTable />
      </div>
    </div>
  );
}
