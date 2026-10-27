export const money=n=>n==null?'Not disclosed':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(n);
export const monthly=o=>typeof o.current_listed_price!=='number'?null:o.pricing_unit==='per year'?o.current_listed_price/12:o.current_listed_price;
export function validate(d){
 if(!d.venture||!Array.isArray(d.competitors)||!Array.isArray(d.pricing_offers))throw Error('Research schema is incomplete.');
 const ids=new Set(d.competitors.map(c=>c.competitor_id)),offers=new Set();
 if(ids.size!==d.competitors.length)throw Error('Duplicate competitor ID');
 for(const o of d.pricing_offers){if(offers.has(o.offer_id)||!ids.has(o.competitor_id))throw Error('Invalid offer relationship');offers.add(o.offer_id);if(o.current_listed_price!==null&&(!Number.isFinite(o.current_listed_price)||o.current_listed_price<0))throw Error('Invalid price');if(!/^https:\/\//.test(o.source_url))throw Error('Invalid source URL');}
 for(const c of d.competitors)if(d.pricing_offers.filter(o=>o.competitor_id===c.competitor_id&&o.representative).length!==1)throw Error('Representative offer mismatch');
 return d;
}
export const annualPaid=d=>d.pricing_offers.filter(o=>o.currency==='USD'&&o.billing_period==='Annual'&&o.current_listed_price>0&&o.verification_status==='Verified');
export const representatives=d=>annualPaid(d).filter(o=>o.representative&&d.comparison.included_offer_ids.includes(o.offer_id));
export function stats(offers){const a=offers.map(monthly).filter(Number.isFinite).sort((a,b)=>a-b),n=a.length;return {n,min:n?a[0]:null,max:n?a[n-1]:null,mean:n?a.reduce((a,b)=>a+b,0)/n:null,median:n?(a[Math.floor((n-1)/2)]+a[Math.ceil((n-1)/2)])/2:null};}
export function position(price,s){return price<s.min?'Below the researched range':price>s.max?'Above the researched range':price===s.median?'At the researched median':price<s.median?'Budget-oriented':'Premium-oriented';}
export function relation(price,benchmark){const delta=Math.round((price-benchmark)*100)/100;return {delta,label:Math.abs(delta)<=.01?'Comparable price':delta>0?'Competitor is cheaper':'Competitor is more expensive'};}
export function tier(c){return c.competitor_id==='C01'?'Unknown':c.competitor_id==='C03'?'Budget':c.competitor_id==='C02'?'Mid-market':'Premium';}
