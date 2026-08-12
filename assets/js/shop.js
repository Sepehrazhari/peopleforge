/* Shop catalogue: product data, rendering, filtering and sorting.
   Only loaded on shop.html. */

const shopProducts=[
  {id:1,name:"Custom Performance Evaluation Form",desc:"Forms, rating rubrics, and manager guide. A complete review process, not just a form.",price:19,cat:"template",icon:"PE",ic:"icon-c",link:"/products/360-feedback",cta:"Build your form →"},
  {id:2,name:"Company handbook",desc:"Full Notion + PDF template covering culture, policies, and values. Editable in 30 minutes.",price:79,cat:"template",icon:"HB",ic:"icon-t"},
  {id:3,name:"Onboarding & offboarding kit",desc:"30-60-90 day plans, buddy programs, and exit interview frameworks.",price:49,cat:"template",icon:"OB",ic:"icon-b"},
  {id:4,name:"Career ladder framework",desc:"Level definitions, competencies, and promotion criteria for any team size.",price:99,cat:"framework",icon:"CL",ic:"icon-a",link:"/products/career-ladder",cta:"Build your ladder →"},
  {id:5,name:"Compensation system",desc:"Salary bands, benchmarking guide, and pay equity audit template.",price:149,cat:"framework",icon:"CS",ic:"icon-c"},
  {id:6,name:"Engagement survey + playbook",desc:"The survey questions, plus what a bad score on each topic usually means and what to do about it.",price:59,cat:"template",icon:"ES",ic:"icon-t",link:"/products/engagement-survey",cta:"Build your survey →"},
  {id:7,name:"Remote & hybrid work playbook",desc:"Async norms, meeting rhythms, and time-zone policies for distributed teams.",price:49,cat:"template",icon:"RW",ic:"icon-p"},
  {id:8,name:"AI prompt library for HR",desc:"200+ prompts for JDs, offer letters, PIPs, and performance reviews.",price:39,cat:"ai",icon:"AI",ic:"icon-b"},
  {id:9,name:"Recruiting framework",desc:"Interview scorecards, structured question banks, hiring decision rubrics, and email templates for every stage.",price:79,cat:"framework",icon:"RC",ic:"icon-a",link:"/products/recruiting",cta:"Build your kit →"},
  {id:10,name:"Manager bootcamp course",desc:"Self-paced course for first-time managers. The leadership curriculum they never got.",price:197,cat:"course",icon:"MB",ic:"icon-p"},
  {id:11,name:"HR audit & strategy session",desc:"90-min deep-dive into your current HR setup with a written action plan.",price:500,cat:"consulting",icon:"HA",ic:"icon-c"},
  {id:12,name:"Fractional CHRO retainer",desc:"Monthly HR leadership for companies not ready to hire full-time.",price:2000,cat:"consulting",icon:"FR",ic:"icon-t"},
];

let shopFilter='all';

function renderShop(list){
  const grid=document.getElementById('shopGrid');
  const count=document.getElementById('shopCount');
  if(count) count.textContent=list.length+' product'+(list.length!==1?'s':'');
  if(!grid) return;
  grid.innerHTML=list.map(p=>{
    const tag=p.link?'a':'div';
    const href=p.link?` href="${p.link}"`:'';
    const footer=p.link
      ? `<span class="product-price">$${p.price.toLocaleString()}</span><span class="product-add">${p.cta||'Build it →'}</span>`
      : `<span class="product-price">$${p.price.toLocaleString()}${p.cat==='consulting'?'+':''}</span><span class="badge badge-gray">Coming soon</span>`;
    return `
    <${tag} class="product-card${p.link?'':' is-soon'}"${href}>
      <div class="product-icon ${p.ic}">${p.icon}</div>
      <div style="margin-bottom:6px;"><span class="badge badge-gray">${p.cat}</span></div>
      <div class="product-name">${p.name}</div>
      <div class="product-desc">${p.desc}</div>
      <div class="product-footer">${footer}</div>
    </${tag}>`;
  }).join('');
}

function setShopFilter(cat,el){
  shopFilter=cat;
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  const bundle=document.getElementById('bundleSection');
  if(bundle) bundle.style.display=(cat==='all'||cat==='bundle')?'':'none';
  filterShop();
}

function filterShop(){
  const q=(document.getElementById('shopSearch')||{value:''}).value.toLowerCase();
  let list=shopProducts.filter(p=>(shopFilter==='all'||shopFilter==='bundle'||p.cat===shopFilter)&&(p.name.toLowerCase().includes(q)||p.desc.toLowerCase().includes(q)));
  renderShop(list);
}

function sortShop(val){
  let list=shopProducts.filter(p=>shopFilter==='all'||shopFilter==='bundle'||p.cat===shopFilter);
  if(val==='price-asc') list.sort((a,b)=>a.price-b.price);
  else if(val==='price-desc') list.sort((a,b)=>b.price-a.price);
  else if(val==='name') list.sort((a,b)=>a.name.localeCompare(b.name));
  renderShop(list);
}

renderShop(shopProducts);

document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',function(){
    const siblings=this.closest('.filter-bar').querySelectorAll('.filter-btn');
    siblings.forEach(s=>s.classList.remove('active'));
    this.classList.add('active');
  });
});
