import test from 'node:test';
import assert from 'node:assert/strict';
import { initializeToday, warsawMinutes, nextPlanIndex } from '../src/scripts/today.js';
import { renderToday } from '../src/templates/today.mjs';
import * as trip from '../src/data/trip.js';
import { dayDining } from '../src/data/day-dining.js';

class Node {
  constructor(attrs={}) { this.attrs=attrs; this.events={}; this.nodes={}; this.lists={}; this.hidden=false; this.classList={add(){}}; }
  getAttribute(key) { return this.attrs[key]; }
  setAttribute(key,value) { this.attrs[key]=value; }
  addEventListener(name,fn) { this.events[name]=fn; }
  querySelector(selector) { return this.nodes[selector] || null; }
  querySelectorAll(selector) { return this.lists[selector] || []; }
  closest() { return null; }
  trigger(name) { this.events[name]?.({target:this}); }
}
function fixture() {
  const root=new Node();
  const dates=['2026-10-24','2026-10-25'];
  const cards=dates.map(date=> {
    const card=new Node({'data-today-date':date});
    card.lists['[data-next-step]']=[600,720].map(n=>new Node({'data-plan-minute':String(n)}));
    card.lists['[data-hard-time]']=[660,780].map(n=>new Node({'data-plan-minute':String(n)}));
    for(const key of ['step-picker','next-ended','next-mode','hard-ended']) card.nodes[`[data-${key}]`]=new Node();
    return card;
  });
  root.lists['[data-today-card]']=cards;
  for(const key of ['today-status','today-outside','today-outside-note','date-picker','date-prev','date-next','date-reset']) root.nodes[`[data-${key}]`]=new Node();
  return {root,cards};
}

test('波蘭冬令時間重複的一小時皆正確，午夜為 0 分鐘',()=>{
  assert.equal(warsawMinutes(new Date('2026-10-25T00:30:00Z')),150);
  assert.equal(warsawMinutes(new Date('2026-10-25T01:30:00Z')),150);
  assert.equal(warsawMinutes(new Date('2026-10-25T23:00:00Z')),0);
  assert.equal(nextPlanIndex([600,720],720),1);
  assert.equal(nextPlanIndex([600,720],721),-1);
});

test('日期切換、手動選站、回到今天與跨午夜更新',()=>{
  const {root,cards}=fixture();
  const original={window:globalThis.window,document:globalThis.document,setInterval:globalThis.setInterval};
  const windowEvents={};
  globalThis.window={addEventListener:(type,fn)=>windowEvents[type]=fn};
  globalThis.document={addEventListener(){},hidden:false};
  globalThis.setInterval=()=>0;
  let now=new Date('2026-10-24T08:30:00Z'); // 10:30 波蘭
  try {
    initializeToday(root,()=>now);
    assert.equal(cards[0].hidden,false);
    assert.equal(cards[0].lists['[data-next-step]'][1].hidden,false);
    root.nodes['[data-date-next]'].trigger('click');
    assert.equal(cards[1].hidden,false);
    assert.equal(root.nodes['[data-date-next]'].disabled,true);
    assert.match(root.nodes['[data-today-status]'].textContent,/預覽/);
    const picker=cards[1].nodes['[data-step-picker]'];picker.value='1';picker.trigger('change');
    windowEvents.focus();
    assert.equal(cards[1].lists['[data-next-step]'][1].hidden,false,'重新聚焦保留手動選站');
    root.nodes['[data-date-reset]'].trigger('click');
    assert.equal(cards[0].hidden,false);
    now=new Date('2026-10-24T22:05:00Z'); // 波蘭 10/25 00:05
    windowEvents.focus();
    assert.equal(cards[1].hidden,false,'自動模式跨午夜換日');
    now=new Date('2026-10-25T20:00:00Z');windowEvents.focus();
    assert.ok(cards[1].lists['[data-next-step]'].every(node=>node.hidden));
    assert.equal(cards[1].nodes['[data-next-ended]'].hidden,false);
    assert.equal(cards[1].nodes['[data-hard-ended]'].hidden,false);
  } finally {Object.assign(globalThis,original);}
});

test('今日卡保留票務狀態、餐廳注意事項及住宿地址限制',()=>{
  const html=renderToday({...trip, dayDining, safety:{emergency:[]}});
  assert.match(html,/指定日待確認／尚未訂票/);
  assert.match(html,/此地址為接待與取鑰匙處/);
  assert.match(html,/門牌尚未確認/);
  assert.match(html,/客滿或想換口味/);
  assert.ok(html.includes(dayDining[5][0].note.replaceAll('&','&amp;')));
  const day5=html.split('data-today-date="2026-10-28"')[1].split('</article>')[0];
  const stay=day5.split('data-today-stay')[1].split('</section>')[0];
  assert.ok(stay.includes('接待處導航'));
  const day4=html.split('data-today-date="2026-10-27"')[1].split('</article>')[0];
  assert.ok(!day4.split('data-today-stay')[1].split('</section>')[0].includes('住宿導航'));
});
