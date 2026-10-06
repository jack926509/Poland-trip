// 「我的私人資料」的欄位清單（只有欄位名稱，沒有任何私人內容）。
//
// 訂位代號、票券存放位置、保單等私人資料只存在使用者手機的 localStorage，
// 不進建置、不進搜尋索引、不出現在 HTML 原始碼。這份檔案只決定「有哪些預約
// 可以填」與「旅途當天要在哪一天的哪個行程旁邊顯示」，內容全是公開事實。
//
// day：對應 trip.js days[].n，今日卡只在該天顯示；stay 類沒有 day，只在私人資料區填寫。
// stepPattern：用行程步驟名稱比對，命中的步驟旁邊會直接出現「票券在哪」一行。
// publicNote：公開可查的提醒（入場需同時出示證件、票券在哪個 App），不含私人內容。

export const privateSlots = [
  {
    id: 'flight-out', day: 1, kind: 'flight', label: '去程機票',
    detail: 'CX 479／QR 815／QR 259（10/23–10/24）',
    publicNote: '入境與登機都要出示護照。',
  },
  {
    id: 'train-eip5300', day: 2, kind: 'train', label: 'EIP 5300 華沙 → 克拉科夫',
    detail: '10/25 08:40 Warszawa Centralna 發車', stepPattern: 'EIP 5300',
    publicNote: '車票在 PKP Intercity App 的票券清單，出發前先存離線。',
  },
  {
    id: 'auschwitz-guide', day: 3, kind: 'ticket', label: 'Auschwitz 英文導覽入場證',
    detail: '10/26 10:30 個人 educator 導覽，2 人', stepPattern: '導覽',
    publicNote: '入場憑電子入場證加護照，兩者缺一不可；電子入場證要存離線。',
  },
  {
    id: 'train-ic3830', day: 4, kind: 'train', label: 'IC 3830 克拉科夫 → 樂斯拉夫',
    detail: '10/27 16:45 Kraków Główny 發車', stepPattern: 'IC 3830',
    publicNote: '車票在 PKP Intercity App 的票券清單，出發前先存離線。',
  },
  {
    id: 'train-ic260', day: 5, kind: 'train', label: 'IC 260 樂斯拉夫 → 波茲南',
    detail: '10/28 19:10 Wrocław Główny 發車', stepPattern: 'IC 260',
    publicNote: '車票在 PKP Intercity App 的票券清單，出發前先存離線。',
  },
  {
    id: 'train-eic8104', day: 6, kind: 'train', label: 'EIC 8104 波茲南 → 華沙',
    detail: '10/29 17:40 Poznań Główny 發車', stepPattern: 'EIC 8104',
    publicNote: '車票在 PKP Intercity App 的票券清單，出發前先存離線。',
  },
  {
    id: 'flight-back', day: 8, kind: 'flight', label: '回程機票',
    detail: 'QR 260／QR 818／BR 872（10/31–11/1）',
    publicNote: '報到與登機都要出示護照。',
  },
];

/** 住宿的訂房代號也能填，但只在私人資料區出現（住宿本身的資料見 trip.js 的 stay）。 */
export const stayPrivateSlotId = stayId => `stay-${stayId}`;
