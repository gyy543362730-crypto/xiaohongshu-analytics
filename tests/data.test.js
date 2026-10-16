import {describe,it,expect} from 'vitest';
import {seed,validateRow,cost,summarize} from '../src/data';
describe('运营数据规则',()=>{
 it('生成多账号可用模拟数据',()=>{const d=seed();expect(d.accounts).toHaveLength(3);expect(d.notes).toHaveLength(30);d.notes.forEach(n=>expect(()=>validateRow('notes',n,d.accounts)).not.toThrow());d.campaigns.forEach(c=>expect(()=>validateRow('campaigns',c,d.accounts,d.notes)).not.toThrow())});
 it('正确汇总曝光、互动、费用与线索',()=>{expect(summarize([{exposure:100,reads:50,likes:3,comments:2,saves:5}],[{amount:80,leads:4}])).toEqual({exposure:100,reads:50,interactions:10,amount:80,leads:4})});
 it('表单字符串按数值比较线索',()=>{const d=seed();expect(validateRow('campaigns',{...d.campaigns[0],messages:'20',leads:'6'},d.accounts,d.notes).leads).toBe(6)});
 it('零线索成本为空，其他正确计算',()=>{expect(cost({amount:120,leads:0})).toBeNull();expect(cost({amount:120,leads:3})).toBe(40)});
 it('拒绝负数、非整数、无效日期和跨账号笔记',()=>{const d=seed();for(const patch of [{reads:-1},{reads:1.5},{date:'2026-02-30'},{accountId:'unknown'}])expect(()=>validateRow('notes',{...d.notes[0],...patch},d.accounts)).toThrow();expect(()=>validateRow('campaigns',{...d.campaigns[0],leads:999},d.accounts,d.notes)).toThrow();expect(()=>validateRow('campaigns',{...d.campaigns[0],accountId:'a2'},d.accounts,d.notes)).toThrow()});
});
