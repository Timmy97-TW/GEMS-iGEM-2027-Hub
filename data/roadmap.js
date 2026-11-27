// Roadmap: the core tasks of each pipeline, their dates and status. Read by assets/core.js on roadmap.html.
// Public: no names and no blocker text here (those are on the private meeting dashboard).
// st: todo | doing | stuck | done. set: true when a lead set the status by hand, false when it comes from the weekly form.
// last: the last Saturday someone wrote about the task. nE / nP: entries and people so far.
// Built by attribution-tools/core/build-core.js on 2026-11-27. Do not edit by hand: change the Roadmap tab of the Core Sheet.
const ROADMAP = {
 "mock": true,
 "asof": "2027-04-24",
 "weeks": ["2026-11-28","2026-12-05","2026-12-12","2026-12-19","2026-12-26","2027-01-02","2027-01-09","2027-01-16","2027-01-23","2027-01-30","2027-02-13","2027-02-20","2027-02-27","2027-03-06","2027-03-13","2027-03-20","2027-03-27","2027-04-03","2027-04-10","2027-04-17","2027-04-24"],
 "tasks": [
  {"id":"T0001","pl":"all","t":{"zh":"主題研究與每週閱讀","en":"Topic research and weekly reading"},"n":"N03","s":"2026-11-29","e":"2027-01-02","st":"done","set":true,"last":"2027-01-09","nE":131,"nP":30},
  {"id":"T0002","pl":"all","t":{"zh":"Topic Card 與題目漏斗","en":"Topic Cards and the topic funnel"},"n":"N04","s":"2027-01-02","e":"2027-01-30","st":"done","set":false,"last":"2027-01-30","nE":63,"nP":27},
  {"id":"T0003","pl":"all","t":{"zh":"PK 與定題紀錄","en":"Topic PK and Decision Record"},"n":"N04","s":"2027-01-16","e":"2027-01-30","st":"done","set":false,"last":"2027-01-30","nE":42,"nP":25},
  {"id":"T0004","pl":"all","t":{"zh":"密集訓練與安全考","en":"Intensive training and safety exam"},"n":"N05","s":"2027-02-13","e":"2027-03-07","st":"done","set":false,"last":"2027-03-13","nE":56,"nP":26},
  {"id":"T0005","pl":"all","t":{"zh":"Roadmap v1 與範圍閘門","en":"Roadmap v1 and the scope gate"},"n":"N07","s":"2027-03-01","e":"2027-03-13","st":"done","set":false,"last":"2027-03-20","nE":32,"nP":21},
  {"id":"T0006","pl":"all","t":{"zh":"期中外部 review","en":"Mid-year external review"},"n":"N16","s":"2027-05-24","e":"2027-06-19","st":"todo","set":false,"last":null,"nE":0,"nP":0},
  {"id":"T0007","pl":"all","t":{"zh":"Mock judging 三次","en":"Mock judging ×3"},"n":"N33","s":"2027-09-11","e":"2027-10-09","st":"todo","set":false,"last":null,"nE":0,"nP":0},
  {"id":"T0101","pl":"wet","t":{"zh":"序列與 Construct 設計","en":"Sequence and construct design"},"n":"N09","s":"2027-03-13","e":"2027-03-27","st":"done","set":false,"last":"2027-04-03","nE":15,"nP":10},
  {"id":"T0102","pl":"wet","t":{"zh":"IDT 訂單","en":"IDT order"},"n":"N10","s":"2027-03-27","e":"2027-04-01","st":"done","set":false,"last":"2027-04-10","nE":10,"nP":6},
  {"id":"T0103","pl":"wet","t":{"zh":"選殖與定序確認","en":"Cloning and sequence verification"},"n":null,"s":"2027-04-03","e":"2027-05-29","st":"stuck","set":false,"last":"2027-04-24","nE":28,"nP":9},
  {"id":"T0104","pl":"wet","t":{"zh":"表現與量測 Runs","en":"Expression and measurement runs"},"n":null,"s":"2027-05-01","e":"2027-08-28","st":"doing","set":false,"last":"2027-04-24","nE":3,"nP":3},
  {"id":"T0105","pl":"wet","t":{"zh":"Safety Form v1","en":"Safety Form v1"},"n":"N15","s":"2027-05-24","e":"2027-06-16","st":"todo","set":false,"last":null,"nE":0,"nP":0},
  {"id":"T0106","pl":"wet","t":{"zh":"實驗結果與圖定稿","en":"Results and final figures"},"n":"N27","s":"2027-08-14","e":"2027-09-15","st":"todo","set":false,"last":null,"nE":0,"nP":0},
  {"id":"T0201","pl":"dry","t":{"zh":"Project Card 與模型計畫","en":"Project Card and model plan"},"n":"N07","s":"2027-03-06","e":"2027-03-20","st":"done","set":false,"last":"2027-03-27","nE":18,"nP":14},
  {"id":"T0202","pl":"dry","t":{"zh":"序列設計輸入","en":"Sequence design input"},"n":"N09","s":"2027-03-13","e":"2027-03-27","st":"done","set":false,"last":"2027-04-03","nE":8,"nP":5},
  {"id":"T0203","pl":"dry","t":{"zh":"模型 v0","en":"Model v0"},"n":null,"s":"2027-03-20","e":"2027-05-29","st":"stuck","set":false,"last":"2027-04-24","nE":27,"nP":7},
  {"id":"T0204","pl":"dry","t":{"zh":"模型擬合實驗數據","en":"Fit the model to lab data"},"n":null,"s":"2027-06-01","e":"2027-08-28","st":"todo","set":false,"last":null,"nE":0,"nP":0},
  {"id":"T0205","pl":"dry","t":{"zh":"軟體與 repo 發布","en":"Software and repo release"},"n":"N30","s":"2027-08-14","e":"2027-09-29","st":"todo","set":false,"last":null,"nE":0,"nP":0},
  {"id":"T0301","pl":"hp","t":{"zh":"HP Roadmap 與利害關係人地圖","en":"HP roadmap and stakeholder map"},"n":"N07","s":"2027-03-06","e":"2027-03-27","st":"done","set":false,"last":"2027-04-03","nE":24,"nP":15},
  {"id":"T0302","pl":"hp","t":{"zh":"訪談與紀錄","en":"Interviews and write-ups"},"n":null,"s":"2027-03-20","e":"2027-08-28","st":"doing","set":false,"last":"2027-04-24","nE":16,"nP":5},
  {"id":"T0303","pl":"hp","t":{"zh":"教育活動","en":"Education programme"},"n":null,"s":"2027-04-17","e":"2027-06-26","st":"doing","set":false,"last":"2027-04-24","nE":6,"nP":5},
  {"id":"T0304","pl":"hp","t":{"zh":"IHP 故事線","en":"IHP storyline"},"n":"N22","s":"2027-04-10","e":"2027-08-21","st":"doing","set":false,"last":"2027-04-24","nE":5,"nP":4},
  {"id":"T0305","pl":"hp","t":{"zh":"同意書全數結清","en":"All consent cleared"},"n":"N25","s":"2027-07-01","e":"2027-09-08","st":"todo","set":false,"last":null,"nE":0,"nP":0},
  {"id":"T0401","pl":"wiki","t":{"zh":"Wiki 站台與事實 v1","en":"Wiki site and facts v1"},"n":"N14","s":"2027-05-01","e":"2027-06-15","st":"doing","set":false,"last":"2027-04-24","nE":3,"nP":3},
  {"id":"T0402","pl":"wiki","t":{"zh":"宣傳影片","en":"Promotion video"},"n":"N20","s":"2027-06-01","e":"2027-07-29","st":"todo","set":false,"last":null,"nE":0,"nP":0},
  {"id":"T0403","pl":"wiki","t":{"zh":"主視覺定稿","en":"Key visual"},"n":"N22","s":"2027-06-15","e":"2027-08-21","st":"todo","set":false,"last":null,"nE":0,"nP":0},
  {"id":"T0404","pl":"wiki","t":{"zh":"全站最後推送與 Wiki Freeze","en":"Last full push and Wiki Freeze"},"n":"N31","s":"2027-08-28","e":"2027-10-06","st":"todo","set":false,"last":null,"nE":0,"nP":0},
  {"id":"T0405","pl":"wiki","t":{"zh":"簡報影片","en":"Presentation video"},"n":"N32","s":"2027-09-01","e":"2027-10-13","st":"todo","set":false,"last":null,"nE":0,"nP":0}
 ]
};
