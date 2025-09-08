import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TradesChart(){
  const [codes, setCodes] = useState([]);
  const [code, setCode] = useState('');
  const [data, setData] = useState([]);

  useEffect(()=>{ 
    api.get('/trades/tradecodes/')
      .then(r=>setCodes(r.data || []))
      .catch(()=>setCodes([]));
  }, []);

  useEffect(()=>{
    if(!code){ setData([]); return; }
    api.get(`/trades/series/?trade_code=${encodeURIComponent(code)}`)
      .then(r=>{
        const sorted = (r.data || []).slice().sort((a,b)=> new Date(a.date) - new Date(b.date)).map(d=>({
          ...d,
          close: d.close === null ? null : Number(d.close),
          volume: d.volume === null ? 0 : Number(d.volume)
        }));
        setData(sorted);
      })
      .catch(()=> setData([]));
  }, [code]);

  return (
    <div>
      <div style={{marginBottom:8}} className="select-wrapper">
        <select
          className="select-contrast"
          value={code}
          onChange={e=>setCode(e.target.value)}
        >
          <option value="">Select trade code</option>
          {codes.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {data.length>0 ? (
        <div style={{width:'100%', height:360}}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar dataKey="volume" yAxisId="right" />
              <Line dataKey="close" yAxisId="left" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{padding:18, color:'var(--muted)'}}>No series to show. Choose a trade code.</div>
      )}
    </div>
  );
}
