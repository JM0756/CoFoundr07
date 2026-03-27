import { useState } from "react"

// ─── Font & global style injection ───────────────────────────────────────────
;(() => {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap'
  document.head.appendChild(link)
  const st = document.createElement('style')
  st.textContent = `*{box-sizing:border-box;margin:0;padding:0}body{background:#F7F2E8;font-family:'Outfit',sans-serif}button{cursor:pointer;border:none;background:none;font-family:'Outfit',sans-serif}input,select,textarea{font-family:'Outfit',sans-serif;outline:none}@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}@keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`
  document.head.appendChild(st)
})()

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:       '#F7F2E8',
  card:     '#FEFCF8',
  forest:   '#1D3829',
  sage:     '#3E6B4E',
  sageLt:   '#E8F2EB',
  terra:    '#B85C2A',
  terraLt:  '#FAEEE7',
  amber:    '#C07C12',
  amberLt:  '#FEF5E0',
  cream:    '#FEFCF8',
  text:     '#1A0D05',
  muted:    '#7A6D60',
  dimmed:   '#A89E93',
  border:   'rgba(29,56,41,0.10)',
  borderMd: 'rgba(29,56,41,0.20)',
}

// ─── Style helpers ─────────────────────────────────────────────────────────────
const S = {
  card: {
    background: C.card, borderRadius: 14,
    border: `1px solid ${C.border}`, padding: '18px 22px',
  },
  btn: (v='primary') => {
    const base = { padding:'10px 22px', borderRadius:9, fontWeight:500, fontSize:14, cursor:'pointer', transition:'all 0.15s', display:'inline-flex', alignItems:'center', gap:6 }
    if (v==='primary')   return {...base, background:C.forest, color:'#fff', border:'none'}
    if (v==='terra')     return {...base, background:C.terra, color:'#fff', border:'none'}
    if (v==='sage')      return {...base, background:C.sage, color:'#fff', border:'none'}
    if (v==='ghost')     return {...base, background:'transparent', color:C.muted, border:`1px solid ${C.border}`}
    if (v==='danger')    return {...base, background:'#FEE2E2', color:'#B91C1C', border:'none', padding:'6px 14px', fontSize:13}
    if (v==='sm-ghost')  return {...base, background:'transparent', color:C.muted, border:`1px solid ${C.border}`, padding:'6px 14px', fontSize:13}
    return base
  },
  pill: (active, col=C.forest) => ({
    padding:'7px 18px', borderRadius:99, fontWeight:500, fontSize:13, cursor:'pointer', transition:'all 0.2s',
    background: active ? col : 'transparent',
    color: active ? '#fff' : C.muted,
    border: `1.5px solid ${active ? col : C.border}`,
  }),
  input: {
    width:'100%', padding:'10px 14px', borderRadius:9, fontSize:14,
    border:`1px solid ${C.border}`, background:'#fff', color:C.text,
  },
  label: {
    fontSize:11, fontWeight:600, color:C.muted, textTransform:'uppercase',
    letterSpacing:'0.07em', marginBottom:6, display:'block',
  },
  badge: (col=C.terra) => ({
    padding:'3px 9px', borderRadius:99, fontSize:11, fontWeight:700,
    background: col===C.terra ? C.terraLt : col===C.amber ? C.amberLt : C.sageLt,
    color: col,
  }),
  lora: (size, w=600) => ({ fontFamily:"'Lora',serif", fontSize:size, fontWeight:w }),
}

// ─── Mock data ─────────────────────────────────────────────────────────────────
const DASHBOARD_CAFE = 'Starbucks · South End, Charlotte, NC'

const SEED = [
  { id:1,  name:'Blueberry Muffin',           cat:'Bakery',   orig:4.95, sale:1.95, qty:3, max:5, mins:85,  cafe:'Starbucks · South End, Charlotte, NC',            icon:'🧁' },
  { id:2,  name:'Butter Croissant',           cat:'Bakery',   orig:4.45, sale:1.75, qty:4, max:7, mins:60,  cafe:'Starbucks · South End, Charlotte, NC',            icon:'🥐' },
  { id:3,  name:'Iced Caramel Macchiato',     cat:'Drinks',   orig:6.25, sale:2.75, qty:6, max:9, mins:100, cafe:'Starbucks · South End, Charlotte, NC',            icon:'🥤' },
  { id:4,  name:'Pepperoni Slice',            cat:'Hot Food', orig:5.25, sale:2.20, qty:5, max:8, mins:40,  cafe:'Domino\'s · Uptown, Charlotte, NC',              icon:'🍕' },
  { id:5,  name:'Garlic Parmesan Knots',      cat:'Hot Food', orig:6.00, sale:2.50, qty:3, max:6, mins:55,  cafe:'Domino\'s · University City, Charlotte, NC',     icon:'🧄' },
  { id:6,  name:'Chicken Sandwich',           cat:'Hot Food', orig:6.85, sale:2.95, qty:4, max:7, mins:45,  cafe:'Chick-fil-A · SouthPark, Charlotte, NC',          icon:'🍔' },
  { id:7,  name:'Waffle Fries',               cat:'Hot Food', orig:4.35, sale:1.85, qty:7, max:10,mins:70,  cafe:'Chick-fil-A · SouthPark, Charlotte, NC',          icon:'🍟' },
  { id:8,  name:'Cobb Salad',                 cat:'Salads',   orig:9.45, sale:4.25, qty:2, max:4, mins:50,  cafe:'Chick-fil-A · University City, Charlotte, NC',    icon:'🥗' },
  { id:9,  name:'Spinach, Feta & Egg Wrap',   cat:'Hot Food', orig:5.95, sale:2.40, qty:3, max:5, mins:65,  cafe:'Starbucks · South End, Charlotte, NC',            icon:'🌯' },
]

const CATS = ['All','Bakery','Hot Food','Drinks','Salads']
const CAT_ICONS = { Bakery:'🥐', 'Hot Food':'🫕', Drinks:'☕', Salads:'🥗' }

let nextId = 10

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fmt  = n => `$${n.toFixed(2)}`
const disc = (o,s) => Math.round((1-s/o)*100)
const tLeft= m => m >= 60 ? `${Math.floor(m/60)}h ${m%60>0?` ${m%60}m`:''}` : `${m}m`

// ─── Components ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{ ...S.card, flex:1, minWidth:140, animation:'fadeIn 0.3s ease' }}>
      <div style={S.label}>{label}</div>
      <div style={{ ...S.lora(30,700), color:accent||C.forest, lineHeight:1, marginBottom:4 }}>{value}</div>
      {sub && <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>{sub}</div>}
    </div>
  )
}

function DiscBadge({ orig, sale }) {
  return <span style={S.badge(C.terra)}>{disc(orig,sale)}% off</span>
}

function ListingRow({ item, onRemove }) {
  return (
    <div style={{ ...S.card, display:'flex', alignItems:'center', gap:18, marginBottom:10, animation:'fadeIn 0.3s ease' }}>
      <div style={{ fontSize:32, lineHeight:1 }}>{item.icon}</div>
      <div style={{ flex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
          <span style={{ fontSize:15, fontWeight:600, color:C.text }}>{item.name}</span>
          <span style={{ ...S.badge(C.amber), fontSize:11 }}>{item.cat}</span>
          <DiscBadge orig={item.orig} sale={item.sale} />
        </div>
        <div style={{ display:'flex', gap:18, fontSize:13, color:C.muted }}>
          <span>
            <span style={{ textDecoration:'line-through' }}>{fmt(item.orig)}</span>
            <span style={{ color:C.forest, fontWeight:600, marginLeft:6 }}>→ {fmt(item.sale)}</span>
          </span>
          <span>· {item.qty} of {item.max} left</span>
          <span style={{ color: item.mins < 45 ? C.terra : C.muted }}>· Expires in {tLeft(item.mins)}</span>
        </div>
      </div>
      <button style={S.btn('danger')} onClick={() => onRemove(item.id)}>Remove</button>
    </div>
  )
}

function AddForm({ onAdd, onCancel }) {
  const [f, setF] = useState({ name:'', cat:'Bakery', orig:'', sale:'', qty:'' })
  const upd = (k,v) => setF(prev => ({...prev, [k]:v}))
  const o = parseFloat(f.orig), sa = parseFloat(f.sale)
  const validPrice = f.orig && f.sale && sa < o && sa > 0
  const valid = f.name && validPrice && f.qty && parseInt(f.qty) > 0

  return (
    <div style={{ ...S.card, marginBottom:22, borderColor:C.sage, borderWidth:1.5, animation:'slideUp 0.25s ease' }}>
      <div style={{ ...S.lora(17), color:C.forest, marginBottom:18 }}>New Surplus Listing</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={S.label}>Item Name</label>
          <input style={S.input} placeholder="e.g. Sourdough Loaf" value={f.name} onChange={e=>upd('name',e.target.value)} />
        </div>
        <div>
          <label style={S.label}>Category</label>
          <select style={S.input} value={f.cat} onChange={e=>upd('cat',e.target.value)}>
            {['Bakery','Hot Food','Drinks','Salads'].map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={S.label}>Quantity Available</label>
          <input style={S.input} type="number" min="1" placeholder="e.g. 5" value={f.qty} onChange={e=>upd('qty',e.target.value)} />
        </div>
        <div>
          <label style={S.label}>Original Price ($)</label>
          <input style={S.input} type="number" step="0.50" min="0.5" placeholder="e.g. 8.50" value={f.orig} onChange={e=>upd('orig',e.target.value)} />
        </div>
        <div>
          <label style={S.label}>Surplus Price ($)</label>
          <input style={S.input} type="number" step="0.50" min="0.5" placeholder="e.g. 3.00" value={f.sale} onChange={e=>upd('sale',e.target.value)} />
        </div>
        {validPrice && (
          <div style={{ gridColumn:'1/-1', padding:'10px 14px', background:C.sageLt, borderRadius:9, fontSize:13, color:C.sage, fontWeight:500 }}>
            ✓ {disc(o,sa)}% discount — customers save {fmt(o - sa)} per item
          </div>
        )}
        {f.sale && f.orig && !validPrice && parseFloat(f.sale) >= parseFloat(f.orig) && (
          <div style={{ gridColumn:'1/-1', padding:'10px 14px', background:C.terraLt, borderRadius:9, fontSize:13, color:C.terra }}>
            Surplus price must be lower than original price
          </div>
        )}
      </div>
      <div style={{ display:'flex', gap:10, marginTop:18 }}>
        <button style={{ ...S.btn('primary'), opacity: valid ? 1 : 0.45 }} onClick={() => valid && onAdd(f)}>
          Post Listing
        </button>
        <button style={S.btn('ghost')} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

function ItemCard({ item, onAdd, cartQty }) {
  const d = disc(item.orig, item.sale)
  const urgent = item.qty <= 2
  const soldOut = item.qty === 0
  return (
    <div style={{ ...S.card, display:'flex', flexDirection:'column', animation:'fadeIn 0.3s ease', opacity: soldOut ? 0.6 : 1 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
        <span style={{ fontSize:44, lineHeight:1 }}>{item.icon}</span>
        <span style={S.badge(C.terra)}>{d}% off</span>
      </div>
      <div style={{ fontSize:11, fontWeight:600, color:C.dimmed, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>{item.cafe}</div>
      <div style={{ ...S.lora(17), color:C.text, marginBottom:10, lineHeight:1.25 }}>{item.name}</div>
      <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:10 }}>
        <span style={{ ...S.lora(22,700), color:C.forest }}>{fmt(item.sale)}</span>
        <span style={{ fontSize:13, color:C.dimmed, textDecoration:'line-through' }}>{fmt(item.orig)}</span>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:16 }}>
        <span style={{ color: urgent && !soldOut ? C.terra : C.muted, fontWeight: urgent ? 600 : 400 }}>
          {soldOut ? 'Sold out' : `${item.qty} left${urgent ? ' — hurry!' : ''}`}
        </span>
        {!soldOut && <span style={{ color:C.muted }}>{tLeft(item.mins)}</span>}
      </div>
      <button
        style={{ ...S.btn(soldOut ? 'ghost' : 'primary'), width:'100%', justifyContent:'center', marginTop:'auto', opacity: soldOut ? 0.5 : 1 }}
        onClick={() => !soldOut && onAdd(item)}
        disabled={soldOut}
      >
        {soldOut ? 'Sold out' : cartQty > 0 ? `Add another (${cartQty} in bag)` : 'Add to bag'}
      </button>
    </div>
  )
}

function CartPanel({ cart, onRemove, onCheckout }) {
  const total    = cart.reduce((sum,c) => sum + c.sale * c.qty, 0)
  const savings  = cart.reduce((sum,c) => sum + (c.orig - c.sale) * c.qty, 0)
  const count    = cart.reduce((sum,c) => sum + c.qty, 0)
  return (
    <div style={{ ...S.card, width:320, flexShrink:0, animation:'fadeIn 0.2s ease' }}>
      <div style={{ ...S.lora(16), color:C.forest, paddingBottom:14, borderBottom:`1px solid ${C.border}`, marginBottom:14 }}>
        Your Bag · {count} item{count!==1?'s':''}
      </div>
      {cart.length === 0 ? (
        <div style={{ textAlign:'center', padding:'32px 0', color:C.muted, fontSize:13 }}>
          <div style={{ fontSize:32, marginBottom:10 }}>🛍</div>
          Your bag is empty
        </div>
      ) : (
        <>
          <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:16 }}>
            {cart.map(item => (
              <div key={item.id} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:22 }}>{item.icon}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:C.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.name}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{fmt(item.sale)} × {item.qty}</div>
                </div>
                <div style={{ fontSize:13, fontWeight:600, color:C.forest }}>{fmt(item.sale * item.qty)}</div>
                <button style={{ fontSize:18, color:C.dimmed, lineHeight:1, paddingLeft:6 }} onClick={() => onRemove(item.id)}>×</button>
              </div>
            ))}
          </div>
          <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:13 }}>
              <span style={{ color:C.muted }}>Subtotal</span>
              <span style={{ fontWeight:600, color:C.text }}>{fmt(total)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:18, fontSize:13 }}>
              <span style={{ color:C.sage }}>You're saving</span>
              <span style={{ fontWeight:700, color:C.sage }}>−{fmt(savings)}</span>
            </div>
            <button style={{ ...S.btn('terra'), width:'100%', justifyContent:'center' }} onClick={onCheckout}>
              Reserve & Pay · {fmt(total)}
            </button>
            <div style={{ fontSize:11, color:C.dimmed, textAlign:'center', marginTop:10 }}>
              Collect in-store within your pickup window
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode]         = useState('customer')
  const [listings, setListings] = useState(SEED)
  const [cart, setCart]         = useState([])
  const [filter, setFilter]     = useState('All')
  const [showAdd, setShowAdd]   = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [toast, setToast]       = useState('')
  const [success, setSuccess]   = useState(false)

  const fireToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2800) }

  const addToCart = item => {
    setCart(prev => {
      const ex = prev.find(c => c.id === item.id)
      return ex ? prev.map(c => c.id===item.id ? {...c, qty:c.qty+1} : c) : [...prev, {...item, qty:1}]
    })
    setListings(prev => prev.map(l => l.id===item.id ? {...l, qty:l.qty-1} : l))
    fireToast(`${item.name} added to your bag!`)
  }

  const removeFromCart = id => {
    const item = cart.find(c => c.id === id)
    if (item) setListings(prev => prev.map(l => l.id===id ? {...l, qty:l.qty+item.qty} : l))
    setCart(prev => prev.filter(c => c.id !== id))
  }

  const addListing = form => {
    const o = parseFloat(form.orig), sa = parseFloat(form.sale)
    setListings(prev => [...prev, {
      id: nextId++, name:form.name, cat:form.cat,
      orig:o, sale:sa, qty:parseInt(form.qty), max:parseInt(form.qty),
      mins:120, cafe:DASHBOARD_CAFE, icon: CAT_ICONS[form.cat] || '🍽',
    }])
    setShowAdd(false)
    fireToast('Listing posted successfully!')
  }

  const checkout = () => {
    setCart([])
    setShowCart(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3500)
  }

  const myListings = listings.filter(l => l.cafe === DASHBOARD_CAFE)
  const filtered   = filter === 'All' ? listings : listings.filter(l => l.cat === filter)
  const cartCount  = cart.reduce((s,c) => s + c.qty, 0)
  const cartSaved  = cart.reduce((s,c) => s + (c.orig - c.sale)*c.qty, 0)

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Outfit',sans-serif", color:C.text }}>

      {/* ── Toast ──────────────────────────────────────────────────── */}
      {toast && (
        <div style={{ position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', background:C.forest, color:'#fff', padding:'11px 26px', borderRadius:99, fontSize:14, fontWeight:500, zIndex:1000, whiteSpace:'nowrap', boxShadow:'0 6px 24px rgba(0,0,0,0.18)', animation:'slideUp 0.25s ease' }}>
          {toast}
        </div>
      )}

      {/* ── Success Banner ──────────────────────────────────────────── */}
      {success && (
        <div style={{ position:'fixed', top:0, left:0, right:0, background:C.sage, color:'#fff', padding:'14px 24px', textAlign:'center', fontSize:15, fontWeight:500, zIndex:1000, animation:'fadeIn 0.3s ease' }}>
          🎉 Order reserved! Head to the cafe to collect your food and reduce waste.
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header style={{ background:C.card, borderBottom:`1px solid ${C.border}`, padding:'0 32px', display:'flex', alignItems:'center', justifyContent:'space-between', height:66, position:'sticky', top:0, zIndex:100 }}>

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:24 }}>🌿</span>
          <span style={{ ...S.lora(21,700), color:C.forest }}>LastBite</span>
          <span style={{ fontSize:12, color:C.dimmed, marginLeft:2 }}>surplus food, happy planet</span>
        </div>

        {/* Mode Toggle */}
        <div style={{ display:'flex', background:C.bg, borderRadius:99, padding:5, gap:3, border:`1px solid ${C.border}` }}>
          {[['customer','🧑‍🍳  I\'m Hungry'],['cafe','🏪  Cafe Dashboard']].map(([m, lbl]) => (
            <button key={m} style={S.pill(mode===m)} onClick={() => setMode(m)}>{lbl}</button>
          ))}
        </div>

        {/* Cart button (customer only) */}
        {mode === 'customer' ? (
          <button
            style={{ ...S.btn('terra'), position:'relative' }}
            onClick={() => setShowCart(v => !v)}
          >
            🛍  Bag
            {cartCount > 0 && (
              <span style={{ background:'rgba(255,255,255,0.28)', borderRadius:99, padding:'1px 8px', fontSize:12, fontWeight:700 }}>
                {cartCount}
              </span>
            )}
          </button>
        ) : (
          <div style={{ width:100 }} />
        )}
      </header>

      <main style={{ maxWidth:1240, margin:'0 auto', padding:'36px 28px' }}>

        {/* ════════════════════════════════════════════════════════════
            CAFE MODE
        ════════════════════════════════════════════════════════════ */}
        {mode === 'cafe' && (
          <div style={{ animation:'fadeIn 0.3s ease' }}>
            {/* Page header */}
            <div style={{ marginBottom:30 }}>
              <div style={{ ...S.lora(30,700), color:C.forest, marginBottom:5 }}>{DASHBOARD_CAFE}</div>
              <div style={{ fontSize:14, color:C.muted }}>Manage surplus listings · reduce waste · earn revenue in Charlotte, NC</div>
            </div>

            {/* Stats row */}
            <div style={{ display:'flex', gap:14, marginBottom:32, flexWrap:'wrap' }}>
              <StatCard label="Active Listings"  value={myListings.length}                                              sub="items live now" />
              <StatCard label="Units Available"  value={myListings.reduce((s,l) => s+l.qty, 0)}                        sub="across all listings"  accent={C.sage} />
              <StatCard label="Food Saved Est."  value={`${(myListings.reduce((s,l)=>s+l.qty,0)*0.28).toFixed(1)} kg`} sub="from landfill today"  accent={C.amber} />
              <StatCard label="Surplus Revenue"  value={fmt(myListings.reduce((s,l)=>s+l.sale*(l.max-l.qty),0))}       sub="earned from sales"    accent={C.terra} />
            </div>

            {/* Listings header + CTA */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
              <div style={{ ...S.lora(17), color:C.text }}>Active Listings ({myListings.length})</div>
              {!showAdd && (
                <button style={S.btn('primary')} onClick={() => setShowAdd(true)}>+ New Listing</button>
              )}
            </div>

            {/* Add form */}
            {showAdd && <AddForm onAdd={addListing} onCancel={() => setShowAdd(false)} />}

            {/* Listing rows */}
            {myListings.length === 0 && !showAdd ? (
              <div style={{ ...S.card, textAlign:'center', padding:'52px 24px', color:C.muted }}>
                <div style={{ fontSize:42, marginBottom:14 }}>📋</div>
                <div style={{ ...S.lora(17), color:C.text, marginBottom:6 }}>No listings yet</div>
                <div style={{ fontSize:14 }}>Click "New Listing" to post your first surplus item</div>
              </div>
            ) : myListings.map(item => (
              <ListingRow key={item.id} item={item} onRemove={id => setListings(prev => prev.filter(l => l.id !== id))} />
            ))}

            {/* Info banner */}
            <div style={{ marginTop:32, padding:'16px 22px', background:C.sageLt, borderRadius:12, border:`1px solid ${C.borderMd}`, display:'flex', gap:14, alignItems:'flex-start' }}>
              <span style={{ fontSize:20, lineHeight:1 }}>💡</span>
              <div>
                <div style={{ fontSize:14, fontWeight:600, color:C.sage, marginBottom:3 }}>Reduce food waste, grow your reputation</div>
                <div style={{ fontSize:13, color:C.muted, lineHeight:1.55 }}>Listings appear to customers instantly. Items posted within 2 hours of closing sell 3× faster — add your end-of-day stock for maximum impact.</div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            CUSTOMER MODE
        ════════════════════════════════════════════════════════════ */}
        {mode === 'customer' && (
          <div style={{ animation:'fadeIn 0.3s ease' }}>
            {/* Hero row */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:26, flexWrap:'wrap', gap:12 }}>
              <div>
                <div style={{ ...S.lora(30,700), color:C.forest, marginBottom:5 }}>Today's Surplus Deals</div>
                <div style={{ fontSize:14, color:C.muted }}>
                  {listings.filter(l=>l.qty>0).length} items available across Charlotte, NC · pick up before they're gone
                </div>
              </div>
              {cartSaved > 0 && (
                <div style={{ padding:'10px 18px', background:C.sageLt, borderRadius:10, fontSize:13, color:C.sage, fontWeight:600, border:`1px solid ${C.borderMd}` }}>
                  🎉 You're saving {fmt(cartSaved)} today!
                </div>
              )}
            </div>

            {/* Category filter */}
            <div style={{ display:'flex', gap:8, marginBottom:28, flexWrap:'wrap' }}>
              {CATS.map(cat => (
                <button key={cat} style={S.pill(filter===cat)} onClick={() => setFilter(cat)}>
                  {cat !== 'All' && CAT_ICONS[cat] + '  '}{cat}
                </button>
              ))}
            </div>

            {/* Content row: grid + cart */}
            <div style={{ display:'flex', gap:24, alignItems:'flex-start' }}>

              {/* Item grid */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))', gap:16 }}>
                  {filtered.map(item => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onAdd={addToCart}
                      cartQty={(cart.find(c=>c.id===item.id)||{qty:0}).qty}
                    />
                  ))}
                </div>
                {filtered.length === 0 && (
                  <div style={{ ...S.card, textAlign:'center', padding:'52px 24px', color:C.muted }}>
                    <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
                    <div style={{ fontSize:15 }}>No items in this category right now — check back soon!</div>
                  </div>
                )}
              </div>

              {/* Cart sidebar */}
              {showCart && (
                <CartPanel cart={cart} onRemove={removeFromCart} onCheckout={checkout} />
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
