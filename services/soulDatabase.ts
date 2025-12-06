
import { LifePathData, YearCodeData, HDData, MBTIData, TrapData, TrapMode, EnergyType, Question } from '../types';

export const LifePathDB: Record<number, LifePathData> = {
  1: {
    archetype: "開疆闢土的武士 / 創始者",
    desire: "獨立自主、從無到有的創造、被他人尊重的領導地位。",
    positive: "原創性強、有魄力、獨立、能夠單獨作業、目標導向。",
    shadow: [
      "固執自我、猜忌心重、無法信任他人。",
      "害怕依賴，卻又過度自我中心，導致人際孤立。",
      "急於表達自我，缺乏耐性，容易因主觀而受傷。"
    ],
    fix: "學習「依靠」與「合作」。真正的獨立不是拒絕他人，而是能與他人良性互動。"
  },
  2: {
    archetype: "最稱職的綠葉 / 協調者",
    desire: "深度的連結、和諧的關係、被需要的感覺。",
    positive: "敏感細膩、擅長分析細節、配合度高、能夠察覺他人的需求（讀空氣）。",
    shadow: [
      "委曲求全，為了和諧而犧牲真實的自己。",
      "依賴心重，缺乏主見，容易受他人情緒影響。",
      "內心有許多「為反對而反對」的情緒，因為覺得自己沒有被重視。"
    ],
    fix: "學習「劃清界線」。真愛是對自己誠實，學會說「不」，才能建立健康的關係。"
  },
  3: {
    archetype: "赤子之心的小天使 / 藝術家",
    desire: "無拘無束的表達、充滿創意與變化的生活、被看見與被讚賞。",
    positive: "樂觀、多才多藝、溝通能力強、能將快樂帶給他人。",
    shadow: [
      "任性、情緒化、像長不大的孩子。",
      "容易分散注意力，什麼都想玩但缺乏深度。",
      "害怕無聊與沉重，遇到壓力傾向逃避或用表面的快樂來掩飾。"
    ],
    fix: "學習「深度與專注」。將發散的創意落實為具體的作品，並學會面對負面情緒。"
  },
  4: {
    archetype: "孕育萬物的大地之母 / 建設者",
    desire: "建立穩固的秩序、安全感、規律與結構。",
    positive: "務實、執行力強、有責任感、擅長組織與規劃、值得信賴。",
    shadow: [
      "極度缺乏安全感，因此死守規則，缺乏彈性。",
      "內心充滿恐懼，對於「改變」感到焦慮。",
      "容易自我封閉，過度重視物質保障而忽略心靈需求。"
    ],
    fix: "學習「放下控制」。安全感來自內在的穩定，而非外在的物質或規則。"
  },
  5: {
    archetype: "異軍突起的黑馬 / 冒險家",
    desire: "絕對的自由、打破框架、體驗未知的世界、感官的滿足。",
    positive: "適應力強、口才好、有冒險精神、能快速連結不同資源。",
    shadow: [
      "博而不精，喜新厭舊，無法給予承諾。",
      "為了追求自由而犧牲責任，甚至傷害親密關係。",
      "容易迷失在感官慾望或混亂的生活中，找不到方向（盲、茫、忙）。"
    ],
    fix: "學習「承諾」。真正的自由不是逃避責任，而是在承諾中找到心靈的自由。"
  },
  6: {
    archetype: "無條件愛你的大天使 / 療癒者",
    desire: "完美的愛、和諧的家庭/團隊、被感謝與被需要。",
    positive: "充滿愛心、負責任、有療癒他人的能力、重視美感與承諾。",
    shadow: [
      "完美主義，用高標準批判自己與他人。",
      "過度付出（犧牲奉獻），然後覺得委屈：「為什麼我做這麼多，你們都不懂？」",
      "容易介入他人的因果，把別人的問題攬在自己身上。"
    ],
    fix: "學習「先愛自己」。只有自己圓滿了，給出的愛才是無條件的，而非索求回報。"
  },
  7: {
    archetype: "幸運之神眷顧的智者 / 探究者",
    desire: "挖掘真理、保有獨立的思考空間、不隨波逐流。",
    positive: "邏輯分析力強、直覺敏銳、有哲學思考能力、幸運（Lucky 7）。",
    shadow: [
      "多疑、孤僻、不信任他人，容易切斷與人的連結。",
      "腦袋想太多，導致行動癱瘓，或是變得憤世嫉俗。",
      "逃避現實，活在自己的理論世界裡，害怕面對「庸俗」的日常。"
    ],
    fix: "學習「開放與信任」。接受真理有多種面貌，並願意分享你的智慧。"
  },
  8: {
    archetype: "心想事成的召喚者 / 實業家",
    desire: "掌握力量、資源、權力，在世俗世界取得具體的成功。",
    positive: "商業頭腦好、執行力強、有領袖風範、能將夢想顯化為現實。",
    shadow: [
      "控制狂，這源於內心對「失控」的恐懼。",
      "過度重視金錢與名利，忽略了人情與心靈。",
      "誠實課題：為了達到目的可能不擇手段，或隱藏真實意圖。"
    ],
    fix: "學習「誠實與放手」。真正的力量來自於內心的豐盛，而非外在的掌控。"
  },
  9: {
    archetype: "大愛行者 / 夢想家",
    desire: "服務大眾、提升人類意識、圓滿的智慧。",
    positive: "慈悲、無私、想像力豐富、能夠跨越界線連結眾人。",
    shadow: [
      "不切實際，活在空想中，缺乏落地的執行力。",
      "容易因為無法拯救所有人而感到挫敗或憂鬱。",
      "雖有大愛，但在個人的一對一關係中卻可能顯得疏離或冷漠。"
    ],
    fix: "學習「落地」。將遠大的夢想拆解為具體的行動，從照顧身邊的人開始。"
  },
  11: {
    archetype: "卓越數：精神領袖 / 改革者",
    desire: "成為精神領袖或改革者，渴望帶來突破性的改變。",
    positive: "直覺極強，具備雙倍的創造力與領導力（1+1）。",
    shadow: [
      "人生常伴隨巨大的考驗與大起大落。",
      "容易在極度自信與極度自卑中擺盪。",
      "承受過多他人的期待，導致神經緊張。"
    ],
    fix: "學習「平衡靈性與現實」。作為通道，保持謙卑，讓更高的能量流經你。"
  },
  22: {
    archetype: "卓越數：築夢大師 / 實踐者",
    desire: "完成不可能的任務，將巨大的夢想落地執行。",
    positive: "能將靈性理想與現實物質完美結合，擁有巨大的顯化力量。",
    shadow: [
      "容易因為壓力過大而崩潰，身體與精神難以負荷。",
      "對細節過於執著，可能變成工作狂。",
      "如果無法達成目標，會產生強烈的自我毀滅感。"
    ],
    fix: "學習「授權與放鬆」。你不需要一個人扛起整個世界，信任宇宙的安排。"
  },
  33: {
    archetype: "卓越數：普世導師 / 療癒大師",
    desire: "成為眾人的療癒導師，無條件的奉獻。",
    positive: "極度慈悲，擁有超越常人的愛與理解力。",
    shadow: [
      "容易因為背負眾生之苦而耗竭，失去自我邊界。",
      "可能陷入殉道者情結，認為受苦是高尚的。",
      "過於情緒化，難以在混亂中保持中心。"
    ],
    fix: "學習「無為而治」。你的存在本身就是療癒，無需刻意作為。"
  }
};

export const YearCodeDB: Record<number, YearCodeData> = {
  4: {
    fear: "【害怕示弱、害怕不被需要】",
    subconscious: "你潛意識覺得「如果不燃燒自己照亮別人，我就沒有價值」。",
    career: ["容易變成全能工具人，責任全扛。", "做得半死功勞卻是別人的，或是過勞。", "幫了忙還被嫌棄，有無力感。"],
    relationship: ["過度付出，忘了自己也需要溫暖。", "對男性能量（父親/丈夫/老闆）感到糾結。"]
  },
  5: {
    fear: "【害怕混亂、情緒內耗】",
    subconscious: "潛意識極度渴望完美與潔淨，對「瑕疵」和「情緒波動」感到焦慮。",
    career: ["完美主義作祟，糾結細節錯失良機。", "把職場問題情緒化，內心上演焦慮劇場。", "對女性主管/同事易生心結。"],
    relationship: ["情緒界線模糊，易被情緒勒索。", "對親密關係有潔癖，容不下一粒沙。"]
  },
  6: {
    fear: "【害怕犯規、自我囚禁】",
    subconscious: "潛意識裡有一把尺，對自己要求極高，導致「畫地自限」。",
    career: ["墨守成規，有創意卻不敢打破框架。", "易陷入行政流程、合約糾紛。", "外表嚴肅武裝，導致距離感。"],
    relationship: ["鑽牛角尖，小事覺得被「控制」或「不尊重」。", "感情易糾纏不清，想斷斷不掉。"]
  },
  7: {
    fear: "【害怕被誤解、內心多疑】",
    subconscious: "潛意識覺得「沒人真正懂我」，所以築起高牆。",
    career: ["易招口舌是非，好意變惡意。", "做事不被認可，覺得職場有小人。", "多疑，不信他人讚美。"],
    relationship: ["心牆太高，渴望親密卻說傷人的話。", "易因一句話冷戰，關閉溝通大門。"]
  },
  8: {
    fear: "【害怕失敗、思慮過載】",
    subconscious: "大腦運轉太快，導致「焦慮未來」而癱瘓了「現在」。",
    career: ["計畫完美，執行卡關（想完風險就不敢動）。", "過度鑽牛角尖導致失眠、神經衰弱。", "常覺得「選錯路」，猶豫不決。"],
    relationship: ["充滿不安全感，預設對方會背叛或離開。"]
  },
  9: {
    fear: "【害怕看清現實、判斷失焦】",
    subconscious: "潛意識容易被「感覺」牽著走，而忽略了「現實」。",
    career: ["文書、合約、細節易出錯吃悶虧。", "太重人情被表象迷惑，做錯決策。", "覺得懷才不遇，風格不被主流接受。"],
    relationship: ["自我感動的付出，愛上不該愛的人。", "易有爛桃花或多角關係糾葛。"]
  },
  0: {
    fear: "【害怕壓力、慣性逃避】",
    subconscious: "潛意識想當個孩子，但現實逼你長大，讓你很痛苦。",
    career: ["有才華但缺鬥志，遇壓就想逃。", "覺得心累，對競爭環境適應不良。", "因懶散拖延讓機會溜走。"],
    relationship: ["太過依賴，怕吵架而一味配合，失去自我。", "情緒管理較弱，像孩子需人哄。"]
  },
  1: {
    fear: "【害怕失序、教條主義】",
    subconscious: "潛意識對「標準答案」有執著，無法接受脫軌。",
    career: ["非黑即白，對人嚴苛，氣氛僵。", "堅持SOP與環境格格不入，被認難搞。", "易有文書契約或考運麻煩。"],
    relationship: ["家裡當法庭，講道理多過講感情。", "對伴侶挑剔，要求符合「標準」。"]
  },
  2: {
    fear: "【害怕失去掌控、衝動行事】",
    subconscious: "潛意識對「金錢」與「掌控權」有極深的不安。",
    career: ["剛愎自用，不聽勸導致損失。", "行動力強但瞎忙，缺乏長遠規劃。", "對錢看重卻又因情緒亂花錢。"],
    relationship: ["掌控欲太強，不順意就爆發。", "過於現實計算，缺乏溫情。"]
  },
  3: {
    fear: "【害怕空虛、慾望填不滿】",
    subconscious: "潛意識有個填不滿的黑洞，一直在追逐下一個目標。",
    career: ["目標太發散，看似忙碌卻無累積。", "眼高手低，對現狀永遠不滿。", "追求新鮮感頻繁換跑道。"],
    relationship: ["總覺得關係「少了點什麼」，易受外在誘惑。", "愛得越深，痛得越深。"]
  }
};

export const HDEnergyDB: Record<EnergyType, HDData> = {
  [EnergyType.TYPE_A]: {
    role: "發起者 (Manifestor)",
    mechanism: "封閉且具衝擊力的能量場。像砲彈，天生要來「發起」行動、創造影響。",
    alarm: "【憤怒】。當覺得被阻擋、被控制時。",
    fixCommand: "【練習「告知」(To Inform)】",
    details: [
      "放下「請求許可」的念頭，你不需要被允許。",
      "但在行動前，先跟受影響的人說：「我現在要做這件事。」",
      "學會告知，原本的阻力會瞬間變成助力。"
    ]
  },
  [EnergyType.TYPE_B]: {
    role: "建造者與引導者 (Generator / Projector)",
    mechanism: "開放、包容或聚焦。來「回應」世界，或「引導」他人。",
    alarm: "【挫敗】或【苦澀】。主動發起碰壁時覺得無力；付出不被珍惜時覺得苦澀。",
    fixCommand: "【練習「等待」(Wait to Respond / Invite)】",
    details: [
      "停止主動推銷自己。你的光芒是「吸引」來的，不是「追」來的。",
      "回到中心，把技能與狀態修好。",
      "相信能量場。對的人與機會會主動來敲門。"
    ]
  },
  [EnergyType.TYPE_C]: {
    role: "情緒權威與多變者 (Emotional / Manifesting Generator)",
    mechanism: "動態的、起伏的能量。天生帶有情緒波浪，直覺需要時間過濾。",
    alarm: "【衝動後的後悔】。",
    fixCommand: "【練習「冷卻」(Emotional Clarity)】",
    details: [
      "對所有重大決定設下「三天緩衝期」。",
      "覺得「非做不可」時，告訴自己：「停！三天後如果還想做，那才是真的。」",
      "允許自己反反覆覆，那是釐清真相的過程。慢即是快。"
    ]
  }
};

export const MBTIDB: Record<string, MBTIData> = {
  ISTJ: { strengths: "踏實可靠、邏輯清晰", blindspots: "太過保守，害怕改變", advice: "試著接受「不確定性」，不要讓規則綁死你。" },
  ISFJ: { strengths: "溫柔體貼、極度忠誠", blindspots: "過度犧牲，不敢拒絕", advice: "學會說「不」，你的價值不需要靠討好來證明。" },
  INFJ: { strengths: "洞察力強、富有同理心", blindspots: "過度理想化，易內耗", advice: "接受世界的不完美，把高標準稍微放低一點。" },
  INTJ: { strengths: "策略大師、獨立思考", blindspots: "太過理性冷漠，顯傲慢", advice: "試著展現一點溫暖，人際關係也是一種資源。" },
  ISTP: { strengths: "冷靜實幹、技術高超", blindspots: "不善溝通情感，難以捉摸", advice: "試著多表達內心想法，別人不是你肚子裡的蛔蟲。" },
  ISFP: { strengths: "活在當下、溫和友善", blindspots: "過度敏感，缺乏長遠規劃", advice: "不要太在意別人評價，為未來做一點點計畫。" },
  INFP: { strengths: "治癒系、創意豐富", blindspots: "情緒起伏大，易自我憐憫", advice: "把你的感覺轉化為行動，不要只停留在腦海裡。" },
  INTP: { strengths: "邏輯鬼才、求知慾強", blindspots: "生活自理差，忽略現實", advice: "多與真實世界互動，把你的理論落地。" },
  ESTP: { strengths: "行動力強、適應力高", blindspots: "衝動魯莽，忽視後果", advice: "行動前多想三秒鐘，不要為了追求刺激而冒險。" },
  ESFP: { strengths: "表演慾強、帶給人快樂", blindspots: "缺乏專注，逃避嚴肅", advice: "快樂很重要，但責任感會讓你更有魅力。" },
  ENFP: { strengths: "充滿熱情、感染力強", blindspots: "三分鐘熱度，過度承諾", advice: "試著把一件事做完，再開始下一件。" },
  ENTP: { strengths: "聰明機智、創新思維", blindspots: "愛爭辯，忽視他人感受", advice: "贏了辯論輸了感情不划算，試著多傾聽。" },
  ESTJ: { strengths: "天生領導、講求效率", blindspots: "控制欲強，缺乏彈性", advice: "放鬆一點，不是每個人都要照你的方式做。" },
  ESFJ: { strengths: "熱心助人、重視和諧", blindspots: "過度在意他人眼光", advice: "做你自己喜歡的事，而不是別人期待你做的事。" },
  ENFJ: { strengths: "天生導師、激勵人心", blindspots: "過度介入他人生活", advice: "給別人一點空間，相信他們能處理好自己的人生。" },
  ENTJ: { strengths: "戰略眼光、果斷執行", blindspots: "冷酷無情，只看結果", advice: "多一點同理心，你的團隊會更願意為你賣命。" }
};

export const TrapDB: Record<TrapMode, TrapData> = {
  [TrapMode.FIGHT]: {
    mode: "戰鬥/掌控模式 (The Fight Trap)",
    behavior: "啟動「審判者 (J)」與「思考 (T)」的負面迴圈。",
    reaction: [
      "變得強勢、急躁，試圖掌控一切細節。",
      "過度講求邏輯與道理，忽略他人的感受。",
      "咄咄逼人，不允許失控，對自己和別人都極度嚴苛。"
    ],
    analysis: "你試圖用「掌控」來掩飾內心的不安。你以為只要夠兇、夠強勢，事情就會好轉。但結果往往是製造更多敵人，讓自己孤立無援。你的強勢，其實是在呼救。"
  },
  [TrapMode.FLIGHT]: {
    mode: "逃避/冷處理模式 (The Flight Trap)",
    behavior: "啟動「感知者 (P)」與「情感 (F)」的負面迴圈。",
    reaction: [
      "選擇逃避、冷處理，不想面對衝突。",
      "躲進自己的洞穴，轉移注意力（滑手機、睡覺）。",
      "表現出不在乎的樣子，但內心其實非常受傷。"
    ],
    analysis: "你試圖用「逃避」來換取一時的平靜。你以為只要不看，問題就不存在。但問題像滾雪球一樣越滾越大，最後變成巨大的焦慮。你的冷漠，其實是在保護受傷的自己。"
  }
};

// Rigorous Question Bank (Sampled from 100, selecting top 20 most rigorous)
export const QuizQuestions: Question[] = [
  // E vs I (1-5)
  { id: 1, dimension: 'EI', text: '在社交場合中，你通常覺得自己是...', optionA: { text: '精力充沛，喜歡和很多人互動', value: 'E' }, optionB: { text: '被動參與，需要時間安靜獨處', value: 'I' } },
  { id: 2, dimension: 'EI', text: '遇到問題時，你更傾向於...', optionA: { text: '找人聊聊，邊說邊想', value: 'E' }, optionB: { text: '自己先思考清楚再說', value: 'I' } },
  { id: 3, dimension: 'EI', text: '你比較喜歡哪種工作環境？', optionA: { text: '熱鬧、可以隨時與同事交流', value: 'E' }, optionB: { text: '安靜、擁有獨立的空間', value: 'I' } },
  { id: 4, dimension: 'EI', text: '參加大型聚會後，你的感覺是？', optionA: { text: '意猶未盡，甚至還想續攤', value: 'E' }, optionB: { text: '精疲力盡，需要趕快回家充電', value: 'I' } },
  { id: 5, dimension: 'EI', text: '你認識新朋友的方式通常是...', optionA: { text: '主動出擊，自我介紹', value: 'E' }, optionB: { text: '等待別人來找你，或經人介紹', value: 'I' } },

  // S vs N (6-10)
  { id: 6, dimension: 'SN', text: '你更重視...', optionA: { text: '實際的經驗和眼前的事實', value: 'S' }, optionB: { text: '未來的可能性和潛在的模式', value: 'N' } },
  { id: 7, dimension: 'SN', text: '聽別人說話時，你比較在意...', optionA: { text: '具體的細節和步驟', value: 'S' }, optionB: { text: '整體的含義和言外之意', value: 'N' } },
  { id: 8, dimension: 'SN', text: '做計畫時，你傾向於...', optionA: { text: '列出具體清單，按部就班', value: 'S' }, optionB: { text: '先構思大方向，細節再說', value: 'N' } },
  { id: 9, dimension: 'SN', text: '你比較相信...', optionA: { text: '被驗證過的經驗', value: 'S' }, optionB: { text: '自己的直覺或靈感', value: 'N' } },
  { id: 10, dimension: 'SN', text: '對於「創新」，你的看法是？', optionA: { text: '實用才重要，不要天馬行空', value: 'S' }, optionB: { text: '創意本身就很有價值，即使不實用', value: 'N' } },

  // T vs F (11-15)
  { id: 11, dimension: 'TF', text: '做決定時，你更看重...', optionA: { text: '邏輯、公平和客觀標準', value: 'T' }, optionB: { text: '人情、和諧與對他人的影響', value: 'F' } },
  { id: 12, dimension: 'TF', text: '當朋友向你訴苦時，你的第一反應是...', optionA: { text: '分析問題，提供解決方案', value: 'T' }, optionB: { text: '同理感受，給予情感支持', value: 'F' } },
  { id: 13, dimension: 'TF', text: '如果你必須解僱一名員工，你會...', optionA: { text: '依據績效和規則，公事公辦', value: 'T' }, optionB: { text: '感到非常痛苦，擔心對方的感受', value: 'F' } },
  { id: 14, dimension: 'TF', text: '你認為哪種讚美更讓你開心？', optionA: { text: '你很聰明、很有能力', value: 'T' }, optionB: { text: '你很善良、很善解人意', value: 'F' } },
  { id: 15, dimension: 'TF', text: '在爭論中，你更在乎...', optionA: { text: '誰才是真理/事實', value: 'T' }, optionB: { text: '不要傷了彼此的和氣', value: 'F' } },

  // J vs P (16-20)
  { id: 16, dimension: 'JP', text: '對於週末的安排，你通常...', optionA: { text: '事先計畫好行程', value: 'J' }, optionB: { text: '隨心所欲，看當天心情', value: 'P' } },
  { id: 17, dimension: 'JP', text: '工作時，你習慣...', optionA: { text: '先完成工作，再休息', value: 'J' }, optionB: { text: '在壓力下衝刺，甚至拖到最後一刻', value: 'P' } },
  { id: 18, dimension: 'JP', text: '你比較喜歡的生活方式是...', optionA: { text: '井然有序，有規律', value: 'J' }, optionB: { text: '充滿彈性，隨機應變', value: 'P' } },
  { id: 19, dimension: 'JP', text: '面對突發的改變，你會...', optionA: { text: '感到焦慮，希望能照計畫走', value: 'J' }, optionB: { text: '覺得刺激，很快就能適應', value: 'P' } },
  { id: 20, dimension: 'JP', text: '做完一件事後，你會...', optionA: { text: '立刻打勾，享受完成的感覺', value: 'J' }, optionB: { text: '覺得還有改進空間，保持開放', value: 'P' } },
];
