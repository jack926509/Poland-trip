import { segments, auschwitzBus } from '../data/rail.js';

/** id（如 'eip-5300'）→ 完整交通段；找不到就是資料本身兜不起來，直接丟錯。 */
export function resolveSegment(id) {
  const segment = segments.find(item => item.id === id);
  if (!segment) throw new Error(`resolveSegment 找不到交通段：${id}`);
  return segment;
}

/**
 * days[].train 現在只存 {segmentId}；模板一律用這支換回行程頁要顯示的欄位，
 * 沒有當天交通就回 null。回傳形狀對齊原本 days[].train 的欄位名稱
 * （type/leg/from/to/dep/arr/dur/price/saleOpens/saleCheckedAt），
 * 但數字全部來自 rail.js 的 segments，不是另一份手key 的拷貝。
 */
export function segmentForDay(day) {
  const segmentId = day?.train?.segmentId;
  if (!segmentId) return null;
  const segment = resolveSegment(segmentId);
  return {
    type: segment.dayType ?? segment.type,
    leg: segment.dayLeg,
    from: segment.from,
    to: segment.to,
    dep: segment.dayDep ?? segment.dep,
    arr: segment.dayArr ?? segment.arr,
    dur: segment.dayDur ?? segment.dur,
    price: segment.dayPrice ?? segment.price,
    saleOpens: segment.saleOpens,
    saleCheckedAt: segment.saleCheckedAt,
  };
}

/** Lajkonik 巴士目前採用（decision === '採用'）的去回班次，供文字引用時不再手抄時刻。 */
export function lajkonikAdopted() {
  const pick = services => {
    const service = services.find(item => item.decision === '採用');
    if (!service) throw new Error('auschwitzBus 找不到 decision="採用" 的班次');
    return service;
  };
  return {
    outbound: pick(auschwitzBus.outbound.services),
    inbound: pick(auschwitzBus.inbound.services),
  };
}
