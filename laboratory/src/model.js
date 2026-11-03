export const clone=x=>structuredClone(x);
export const monthly=e=>e.amount/(e.frequency==='annual'?12:1);
export const monthlyPrice=p=>p.price/(p.billing==='annual'?12:1);
export function calculate(m){
 const ps=m.products.map(p=>({...p,monthlyPrice:monthlyPrice(p),unitVariable:p.variable,fixed:0,revenue:monthlyPrice(p)*p.quantity}));
 let shared=0,startup=0,depreciation=0;const lines=[];
 for(const e of m.expenses.filter(e=>e.enabled)){
  const targets=e.allocation==='shared'?ps:ps.filter(p=>p.id===e.allocation);let total=0;
  if(e.frequency==='once'){startup+=e.amount;total=e.lifeMonths>0?e.amount/e.lifeMonths:0;depreciation+=total;}
  else if(e.kind==='fixed')total=monthly(e);
  else {for(const p of targets){const u=e.kind==='percent'?p.monthlyPrice*e.amount/100:e.kind==='transaction'?e.amount/(p.billing==='annual'?12:1):monthly(e);p.unitVariable+=u;total+=u*p.quantity;}}
  if(e.frequency==='once'||e.kind==='fixed'){if(e.allocation==='shared')shared+=total;else if(targets[0])targets[0].fixed+=total;}
  lines.push({...e,monthlyTotal:total,annualized:total*12,startupCash:e.frequency==='once'?e.amount:0});
 }
 const revenue=ps.reduce((s,p)=>s+p.revenue,0),quantity=ps.reduce((s,p)=>s+p.quantity,0);
 for(const p of ps){const weight=m.allocation==='equal'||!(m.allocation==='revenue'?revenue:quantity)?1/ps.length:m.allocation==='revenue'?p.revenue/revenue:p.quantity/quantity;p.allocatedShared=shared*weight;p.unitMargin=p.monthlyPrice-p.unitVariable;p.marginPercent=p.monthlyPrice?p.unitMargin/p.monthlyPrice:null;p.variableTotal=p.unitVariable*p.quantity;p.contribution=p.unitMargin*p.quantity;p.profit=p.contribution-p.fixed-p.allocatedShared;}
 const fixed=shared+ps.reduce((s,p)=>s+p.fixed,0),variable=ps.reduce((s,p)=>s+p.variableTotal,0),contribution=revenue-variable,weightedMargin=quantity?contribution/quantity:ps.length===1?ps[0].unitMargin:null,weightedPrice=quantity?revenue/quantity:ps.length===1?ps[0].monthlyPrice:null;
 const breakEven=weightedMargin>0?fixed/weightedMargin:null,breakEvenUnits=breakEven===null?null:Math.ceil(breakEven-1e-10),breakEvenRevenue=breakEven===null?null:breakEven*weightedPrice;
 return {products:ps,lines,fixed,shared,variable,quantity,revenue,contribution,weightedMargin,weightedPrice,breakEven,breakEvenUnits,breakEvenRevenue,profit:revenue-variable-fixed,totalCost:fixed+variable,startup,depreciation,cashOperatingCost:fixed+variable-depreciation,marginSafety:revenue>0&&breakEvenRevenue!==null?(revenue-breakEvenRevenue)/revenue:null};
}
export function competitors(data){return data.pricing_offers.filter(p=>data.comparison.included_offer_ids.includes(p.offer_id)).map(p=>({...p,price:p.monthly_equivalent}));}
export function position(p,data){const reps=competitors(data),price=monthlyPrice(p),sorted=reps.map(x=>x.price).sort((a,b)=>a-b),median=sorted[Math.floor(sorted.length/2)],nearest=[...reps].sort((a,b)=>Math.abs(a.price-price)-Math.abs(b.price-price))[0];return {price,median,difference:price-median,nearest:nearest.competitor_name,nearestDifference:price-nearest.price,within:price>=data.preliminary_pricing_recommendation.minimum&&price<=data.preliminary_pricing_recommendation.maximum,cheaper:reps.filter(x=>x.price<price-.005).length,equal:reps.filter(x=>Math.abs(x.price-price)<.005).length,more:reps.filter(x=>x.price>price+.005).length};}
export function fingerprint(m){return JSON.stringify(m);}
export function evaluate(m,data,now=new Date().toISOString()){
 const r=calculate(m),financial=[],evidence=[],competitive=[],strengths=[],recommendations=[];
 if(r.products.some(p=>p.unitMargin<=0))financial.push('At least one plan has zero or negative contribution. More sales of that plan cannot cover overhead under constant-cost assumptions.');
 if(r.profit<0)financial.push(`Modeled monthly loss is $${(-r.profit).toFixed(2)} at ${r.quantity} assumed active halls.`);else strengths.push(`The current mix covers modeled operating costs by $${r.profit.toFixed(2)} per month.`);
 if(r.breakEven!==null)financial.push(`Break-even requires ${r.breakEven.toFixed(2)} equivalent active halls (${r.breakEvenUnits} rounded up), retaining the current sales mix.`);
 else financial.push('No finite break-even can be shown with this contribution margin or undefined sales mix.');
 const low=clone(m);low.products.forEach(p=>p.quantity*=.8);const lowResult=calculate(low),costStressProfit=r.revenue-1.1*(r.variable+r.fixed);
 if(lowResult.profit<0)financial.push(`20% lower volume produces $${lowResult.profit.toFixed(2)} monthly profit/loss.`);
 if(costStressProfit<0)financial.push(`10% higher operating costs produces $${costStressProfit.toFixed(2)} monthly profit/loss.`);
 for(const p of m.products){const c=position(p,data);competitive.push(`${p.name}: $${c.price.toFixed(2)}/hall/month equivalent, $${c.difference.toFixed(2)} versus the $${c.median.toFixed(2)} indirect median; ${c.cheaper} cheaper, ${c.more} more expensive and ${c.equal} equal references. ${c.within?'Within':'Outside'} the preliminary $60–$100 range. Closest reference ${c.nearest}, difference $${c.nearestDifference.toFixed(2)}.`);}
 competitive.push('Direct alternative Occuspace has no public numeric institutional price. A premium needs demonstrated wait accuracy and group-seat usefulness; competitor prices do not establish willingness to pay.');
 const active=m.expenses.filter(e=>e.enabled),illustrative=active.filter(e=>e.evidence==='Illustrative'),unsourced=active.filter(e=>!e.source),estimated=active.filter(e=>e.evidence!=='Researched');
 evidence.push(`${illustrative.length} active costs are illustrative; ${estimated.length} are not researched values; ${unsourced.length} lack a source URL.`);
 for(const id of ['maintenance','support','data','privacy','insurance'])if(!active.some(e=>e.id===id))evidence.push(`Suggested essential coverage “${id}” is disabled or missing. Confirm alternative provision.`);
 if(active.find(e=>e.id==='data')?.amount===0)evidence.push('Free, reliable occupancy data is assumed but not agreed. Obtain a campus data-access and integration specification.');
 if(!active.some(e=>e.id==='founder'&&e.amount>0))evidence.push('Founder compensation is absent or zero. Results omit this economic labor cost.');
 evidence.push('Sales quantities are unsupported student assumptions; product accuracy and performance remain untested.');
 const age=Math.max(0,Math.floor((new Date(now)-new Date(data.research_date))/86400000));evidence.push(`Competitor snapshot is ${age} days old (${data.research_date}); obtain current matched quotes before commitment.`);
 recommendations.push(r.profit<0?'Test lower fixed costs, higher contribution, or a supported higher volume; do not infer that price changes create demand.':'Validate the assumed volume with university pilots before relying on the modeled surplus.','Replace developer-hour, support, insurance and integration allowances with scoped quotes.','Validate campus data access and performance before promising customer-facing features.','Compare a 20% volume decline and 10% cost increase; keep startup cash and payment timing in a separate funding plan.');
 if(r.products.every(p=>p.unitMargin>0))strengths.push('Every plan contributes positively toward fixed costs.');
 const unsustainable=r.weightedMargin===null||r.weightedMargin<=0||r.profit<0;
 const high=r.products.some(p=>p.unitMargin<=0)||r.marginSafety===null||r.marginSafety<.2||lowResult.profit<0||costStressProfit<0;
 const risk=unsustainable?'Financially unsustainable under current assumptions':high?'High modeled risk':estimated.length||unsourced.length||age>90?'Moderate modeled risk':'Lower modeled risk';
 return {at:now,fingerprint:fingerprint(m),risk,major:unsustainable||high,financial,competitive,evidence,strengths,recommendations,stress:{lowerVolumeProfit:lowResult.profit,costIncreaseProfit:costStressProfit},criteria:'Unsustainable: nonpositive/undefined weighted contribution or base operating loss. High: any nonpositive product margin, margin of safety below 20%, or loss under 20% lower volume / 10% higher costs. Moderate: remaining unresearched costs or stale evidence. Lower: none of those triggers. Thresholds are disclosed teaching rules, not failure probabilities. Sales and performance uncertainty always remains.'};
}
export function validateModel(m){
 if(!m||!Array.isArray(m.products)||!m.products.length||m.products.length>30||!Array.isArray(m.expenses)||m.expenses.length>300)throw Error('Configuration must contain 1–30 plans and at most 300 expenses.');
 const ids=new Set();for(const p of m.products){if(typeof p.id!=='string'||ids.has(p.id))throw Error('Product IDs must be unique.');ids.add(p.id);for(const k of ['price','quantity','variable'])if(!Number.isFinite(p[k])||p[k]<0||p[k]>1e8)throw Error('Product numbers must be finite and nonnegative.');if(!['monthly','annual'].includes(p.billing))throw Error('Unsupported billing period.');}
 const eids=new Set();for(const e of m.expenses){if(typeof e.id!=='string'||eids.has(e.id))throw Error('Expense IDs must be unique.');eids.add(e.id);for(const k of ['amount','lifeMonths','max','reference'])if(!Number.isFinite(e[k])||e[k]<0||e[k]>1e9)throw Error('Invalid expense number.');if(!['monthly','annual','once'].includes(e.frequency)||!['fixed','variable','percent','transaction'].includes(e.kind)||!['Researched','Estimated','Illustrative','Student-Entered'].includes(e.evidence))throw Error('Invalid expense classification.');if(e.frequency==='once'&&e.kind!=='fixed')throw Error('Startup costs must use fixed classification.');if(e.allocation!=='shared'&&!ids.has(e.allocation))throw Error('Expense refers to a missing product.');if(e.source&&!/^https?:\/\//i.test(e.source))throw Error('Source links must use http or https.');}
 if(!['equal','units','revenue'].includes(m.allocation)||!Array.isArray(m.volumeFactors)||m.volumeFactors.length!==3||m.volumeFactors.some(v=>!Number.isFinite(v)||v<0||v>100))throw Error('Invalid allocation or volume scenarios.');return m;
}
