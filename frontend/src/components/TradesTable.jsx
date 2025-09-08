import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function TradesTable(){
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load(){
    setLoading(true);
    const res = await api.get('/trades/');
    setRows(res.data);
    setLoading(false);
  }

  useEffect(()=>{ load(); }, []);

  async function saveRow(updated){
    
    await api.patch(`/trades/${updated.id}/`, updated);
    await load();
  }

  async function deleteRow(id){
    await api.delete(`/trades/${id}/`);
    await load();
  }

  async function addRow(newRow){
    await api.post('/trades/', newRow);
    await load();
  }

  return (
    <div>
      <CreateForm onCreate={addRow} />
      {loading ? <div>Loading...</div> : (
        <table className="min-w-full border-collapse border">
          <thead>
            <tr>
              <th className="px-2">Code</th>
              <th className="px-2">Date</th>
              <th className="px-2">Close</th>
              <th className="px-2">Volume</th>
              <th className="px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => <Row key={r.id} row={r} onSave={saveRow} onDelete={deleteRow} />)}
          </tbody>
        </table>
      )}
    </div>
  );
}


function Row({row, onSave, onDelete}){
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState(row);
    useEffect(()=> setForm(row), [row]);
  
    const displayValue = (v, opts = {}) => {
      
      if (v === null || v === undefined || v === '') {
        return <span className="empty-cell"><span>—</span><span className="badge">∅</span></span>;
      }
      
      if (opts.number) {
        const n = Number(v);
        if (Number.isFinite(n)) return n.toLocaleString();
      }
      return String(v);
    };
  
    return (
      <tr>
        <td className="px-2">{displayValue(row.trade_code)}</td>
        <td className="px-2">{displayValue(row.date)}</td>
        <td className="px-2">
          {editing ? (
            <input value={form.close ?? ''} onChange={e=>setForm({...form, close: e.target.value})} />
          ) : (
            displayValue(row.close, {number:true})
          )}
        </td>
        <td className="px-2">
          {editing ? (
            <input value={form.volume ?? ''} onChange={e=>setForm({...form, volume: e.target.value})} />
          ) : (
            displayValue(row.volume, {number:true})
          )}
        </td>
        <td className="px-2">
          {editing ? (
            <>
              <button className="btn" onClick={async ()=>{ await onSave(form); setEditing(false); }}>Save</button>
              <button className="btn ghost" onClick={()=>setEditing(false)}>Cancel</button>
            </>
          ) : (
            <>
              <button className="btn" onClick={()=>setEditing(true)}>Edit</button>
              <button className="btn ghost" onClick={()=>onDelete(row.id)}>Delete</button>
            </>
          )}
        </td>
      </tr>
    );
  }
  

function CreateForm({onCreate}){
  const [form, setForm] = useState({trade_code:'', date:'', close:'', volume:''});
  return (
    <form onSubmit={e=>{ e.preventDefault(); onCreate(form); setForm({trade_code:'', date:'', close:'', volume:''}); }}>
      <input placeholder="code" value={form.trade_code} onChange={e=>setForm({...form, trade_code:e.target.value})} />
      <input placeholder="date (YYYY-MM-DD)" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
      <input placeholder="close" value={form.close} onChange={e=>setForm({...form, close:e.target.value})} />
      <input placeholder="volume" value={form.volume} onChange={e=>setForm({...form, volume:e.target.value})} />
      <button className='btn' type="submit">Add</button>
    </form>
  );
}
