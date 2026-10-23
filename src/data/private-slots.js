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
    detail: 'HX 283／QR 815／QR 259（10/24–10/25）',
    publicNote: '入境與登機都要出示護照。',
  },
  {
    id: 'train-eip5300', day: 2, kind: 'train', label: 'EIP 1306 華沙西站 → 克拉科夫',
    detail: '10/25 15:45 Warszawa Zachodnia 發車；第 1 車，24、26 號', stepPattern: 'EIP 1306',
    publicNote: '車票在 PKP Intercity App 的票券清單，出發前先存離線。',
  },
  {
    id: 'auschwitz-guide', day: 3, kind: 'ticket', label: 'Auschwitz 英文導覽入場證',
    detail: '10/26 10:30 個人 educator 導覽，2 人', stepPattern: '導覽',
    publicNote: '入場憑電子入場證加護照，兩者缺一不可；電子入場證要存離線。',
  },
  {
    id: 'bus-lajkonik-out', day: 3, kind: 'ticket', label: 'Lajkonik 去程巴士',
    detail: '10/26 08:25 Kraków MDA 下層 D9 → 09:50 Muzeum Auschwitz，2 張全票', stepPattern: 'Lajkonik · 克拉科夫',
    publicNote: '上車出示列印票或手機票（螢幕至少 4 吋）；發車前 15 分鐘到站牌。',
  },
  {
    id: 'bus-lajkonik-in', day: 3, kind: 'ticket', label: 'Lajkonik 回程巴士',
    detail: '10/26 15:30 Muzeum Auschwitz → 16:55 Kraków MDA，2 張全票', stepPattern: '回程巴士返克拉科夫',
    publicNote: '上車出示列印票或手機票（螢幕至少 4 吋）；發車前 15 分鐘（15:15）到站牌。',
  },
  {
    id: 'wieliczka-tour', day: 4, kind: 'ticket', label: 'Wieliczka 鹽礦英文團',
    detail: '10/27 09:00 Tourist Route（English）', stepPattern: 'Wieliczka 鹽礦',
    publicNote: '票券 PDF 隨付款確認信附上，先存離線；依票面提早到 Daniłowicz 礦井入口。',
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
