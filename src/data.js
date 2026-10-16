export const KEY = 'hongshu-analytics-v1';
export const day = () => new Date().toLocaleDateString('sv-SE');
export function seed() {
 const now = new Date();
 const accounts=[{id:'a1',name:'山野生活研究所',handle:'shanye_life',color:'#e45c62'},{id:'a2',name:'小林的家居日记',handle:'lin_home',color:'#6d8b75'},{id:'a3',name:'慢慢好物精选',handle:'manman_select',color:'#8c7bb0'}];
 const titles=['把日子过成喜欢的样子｜我的周末生活','小户型也能拥有的松弛感客厅','这 5 件好物，让生活幸福感翻倍','在城市里，找到属于自己的小森林','认真生活的人，都值得被温柔以待','一平米的治愈角落｜家居灵感','周末出逃计划：去山野里呼吸','我的春日清单，简单又美好','低预算改造，家的另一种可能','那些舍不得分享的生活好物','忙碌之后，给自己一杯咖啡','生活需要一点留白'];
 const notes=Array.from({length:30},(_,i)=>{const d=new Date(now);d.setDate(d.getDate()-(29-i));const reads=1800+i*129+(i%5)*413;return {id:`n${i}`,accountId:accounts[i%3].id,date:d.toLocaleDateString('sv-SE'),title:titles[i%titles.length],category:['生活方式','家居灵感','好物分享'][i%3],exposure:reads*5,reads,likes:Math.round(reads*.065),comments:25+i*3,saves:90+i*9};});
 const campaigns=Array.from({length:12},(_,i)=>({id:`c${i}`,accountId:notes[i*2].accountId,noteId:notes[i*2].id,date:notes[i*2].date,name:`${titles[i]} · 薯条推广`,amount:200+i*65,messages:16+i*4,leads:5+i*2}));
 return {accounts,notes,campaigns};
}
export function validateRow(type,row,accounts,notes=[]) {
 if(!accounts.some(a=>a.id===row.accountId)) throw new Error('账号不存在，请先创建或选择账号');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(row.date)||Number.isNaN(Date.parse(row.date))||new Date(row.date).toISOString().slice(0,10)!==row.date) throw new Error('日期须为有效的 YYYY-MM-DD 格式');
 const fields=type==='notes'?['exposure','reads','likes','comments','saves']:['amount','messages','leads'];
 if(!String(type==='notes'?row.title:row.name).trim()) throw new Error('名称不能为空');
 for(const f of fields){if(!Number.isFinite(Number(row[f]))||Number(row[f])<0||String(row[f]).trim()==='')throw new Error('数值须为非负数字'); if(f!=='amount'&&!Number.isInteger(Number(row[f])))throw new Error('数量须为整数');}
 if(type==='campaigns'&&Number(row.leads)>Number(row.messages))throw new Error('有效线索不能大于私信数量');
 if(type==='campaigns'&&row.noteId&&!notes.some(n=>n.id===row.noteId&&n.accountId===row.accountId))throw new Error('关联笔记不属于当前账号');
 return Object.fromEntries(Object.entries(row).map(([k,v])=>[k,fields.includes(k)?Number(v):typeof v==='string'?v.trim():v]));
}
export const cost = c => c.leads ? c.amount/c.leads : null;
export function summarize(notes,campaigns){return {exposure:notes.reduce((s,n)=>s+n.exposure,0),reads:notes.reduce((s,n)=>s+n.reads,0),interactions:notes.reduce((s,n)=>s+n.likes+n.comments+n.saves,0),amount:campaigns.reduce((s,c)=>s+c.amount,0),leads:campaigns.reduce((s,c)=>s+c.leads,0)};}
