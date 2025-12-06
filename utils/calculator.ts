
import { EnergyType, TrapMode, AnswerMap, UserProfile, MBTIData } from '../types';
import { LifePathDB, YearCodeDB, HDEnergyDB, TrapDB, MBTIDB } from '../services/soulDatabase';

// --- Basic Calculations ---

export const calculateLifePath = (dateStr: string): number => {
  const digits = dateStr.replace(/\D/g, '').split('').map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    const currentSumStr = sum.toString();
    sum = currentSumStr.split('').reduce((a, b) => a + parseInt(b), 0);
  }
  return sum;
};

export const calculateYearCode = (dateStr: string): number => {
  const yearStr = dateStr.split('-')[0];
  const lastDigit = parseInt(yearStr.charAt(yearStr.length - 1));
  return lastDigit;
};

export const calculatePersonalYear = (birthDateStr: string): number => {
    const currentYear = new Date().getFullYear();
    const parts = birthDateStr.split('-');
    const month = parseInt(parts[1]);
    const day = parseInt(parts[2]);
    
    let sum = currentYear + month + day;
    while (sum > 9) {
        const sumStr = sum.toString();
        sum = sumStr.split('').reduce((a, b) => a + parseInt(b), 0);
    }
    return sum;
}

export const calculateAge = (birthDateStr: string): number => {
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export const determineHDType = (lifePath: number): EnergyType => {
  if ([1, 8, 9].includes(lifePath)) {
    return EnergyType.TYPE_A; // Initiator Energy
  } else if ([3, 5].includes(lifePath)) {
    return EnergyType.TYPE_C; // Fluid Energy
  } else {
    return EnergyType.TYPE_B; // Builder/Guide Energy
  }
};

export const calculateMBTI = (answers: AnswerMap): string => {
  const scores: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  Object.values(answers).forEach(val => { if (scores[val] !== undefined) scores[val]++; });
  const E_I = scores['E'] >= scores['I'] ? 'E' : 'I';
  const S_N = scores['S'] >= scores['N'] ? 'S' : 'N';
  const T_F = scores['T'] >= scores['F'] ? 'T' : 'F';
  const J_P = scores['J'] >= scores['P'] ? 'J' : 'P';
  return `${E_I}${S_N}${T_F}${J_P}`;
};

export const determineTrapMode = (mbti: string): TrapMode => {
  if (!mbti) return TrapMode.FLIGHT;
  const lastChar = mbti.toUpperCase().charAt(3);
  const thirdChar = mbti.toUpperCase().charAt(2);
  // J or T types tend to Control/Fight
  if (lastChar === 'J' || thirdChar === 'T') return TrapMode.FIGHT;
  return TrapMode.FLIGHT; 
};

// --- AI Prompt Generation (The Behavioral Profiler Engine) ---

export const generateMBTIAssessmentPrompt = (name: string): string => {
  return `
  【指令】
  你是「LifeOS 行為校準官」。你的任務是透過簡短的對話，判定客戶(${name})的 MBTI 人格類型。
  
  【執行規則】
  1. **不要直接問**「你是 E 還是 I？」。這很無聊。
  2. **使用情境題**：問他在壓力下、社交後、做決定時的真實反應。一次只問一個問題。
  3. **保持神秘感與專業**：你的語氣是冷靜、觀察入微的。像是在調整一台精密儀器。
  4. **判定邏輯**：你需要收集足夠資訊來判斷四個維度 (E/I, S/N, T/F, J/P)。
  5. **終止協議 (Secret Protocol)**：
     當你已經有 80% 以上把握確認他的四個維度時，請在最後一句話輸出特殊代碼：
     <<<MBTI:XXXX>>> 
     (將 XXXX 替換為判斷結果，如 INTJ, ESFP)。
     **一旦輸出此代碼，不要再說任何話，直接結束。**

  【開場白】
  請用這句話開場：「系統校準啟動。${name}，為了精確讀取你的原始代碼，我需要觀察你在極端狀態下的反應。準備好了嗎？告訴我，當你感覺徹底精疲力盡時，你第一直覺是想找人說話宣洩，還是躲進房間徹底切斷與世界的連結？」
  `;
};

// Helper to determine tone based on MBTI
const getToneInstruction = (mbti: string): string => {
    if (!mbti) return "溫暖、專業、具有洞察力。";
    
    const isT = mbti.includes('T');
    const isF = mbti.includes('F');
    const isJ = mbti.includes('J');
    const isP = mbti.includes('P');

    let baseTone = "";
    
    if (isT) {
        baseTone += "你的語氣必須**邏輯嚴密、像外科醫生一樣精準**。少用情緒形容詞，多用因果推論。這個客戶只相信邏輯，不相信雞湯。";
    } else if (isF) {
        baseTone += "你的語氣必須**充滿共情、溫暖且包容**。像一位深知他受過傷的療癒師。多關注他的感受，讓他覺得被接納。";
    }

    if (isJ) {
        baseTone += " 說話要有結構，給出明確的結論，不要模稜兩可。";
    } else if (isP) {
        baseTone += " 說話可以保留彈性，引導他探索可能性，不要給予太死的框架。";
    }

    return baseTone;
};

export const generateSystemPrompt = (profile: UserProfile): string => {
    const lp = LifePathDB[profile.lifePathNumber];
    const yc = YearCodeDB[profile.yearCode];
    const trap = profile.trapMode ? TrapDB[profile.trapMode] : TrapDB[TrapMode.FLIGHT];
    const hd = HDEnergyDB[profile.hdType];
    const mbtiData = profile.mbti ? MBTIDB[profile.mbti] : { strengths: "", blindspots: "", advice: "" };
    
    const personalYear = calculatePersonalYear(profile.birthDate);
    const age = calculateAge(profile.birthDate);
    const toneInstruction = getToneInstruction(profile.mbti || "");

    // Age Context Injection
    let ageContext = "";
    if (age < 30) ageContext = "他正處於生命的探索期，對未來迷惘，渴望證明自己。";
    else if (age < 40) ageContext = "他正處於人生建立期(土星回歸後)，面臨成家立業與自我實現的巨大壓力。";
    else if (age < 50) ageContext = "他正處於中年轉折點，可能面臨熱情消退或尋求更深層意義的階段。";
    else ageContext = "他處於成熟期，思考的是傳承與生命的最終價值。";

    return `
    【核心指令】
    你現在是「LifeOS 首席行為側寫師」。你的任務是為客戶 ${profile.name} 進行一場深度的靈魂手術。
    
    【關鍵差異化因子 (The Differentiators)】
    為了避免讓客戶覺得「每個人的結果都一樣」，你必須嚴格執行以下變數的排列組合：
    1. **客戶 MBTI (${profile.mbti}) 語氣濾鏡**：${toneInstruction} (這非常重要，必須讓客戶覺得這種說話方式很對他的頻率)
    2. **生命階段鎖定**：客戶今年 ${age} 歲，處於流年 ${personalYear}。${ageContext} 請將分析結合這個年齡層特有的焦慮（如：30歲的焦慮是沒成就，40歲的焦慮是沒意義）。
    3. **獨特衝突公式**：請嚴格執行以下「關鍵字撞擊」：
       - 他的**靈魂渴望**是「${lp.desire}」。
       - 但他的**潛意識恐懼**是「${yc.fear}」。
       - **請生成一個具體的矛盾場景**：描述當「渴望 ${lp.desire}」遇到「恐懼 ${yc.fear}」時，他在現實生活中會發生什麼慘案？(例如：想當國王卻怕負責任)。

    【溝通策略：先同理，再拆解】
    1. **認同初衷 (Validation)**：「${profile.name}，我看懂你的設計了。我知道你一直以來都在試圖保護/追求...（結合 LP 渴望）。這沒有錯，這是你的原廠設定。」
    2. **揭示代價 (The Cost)**：「但是，因為你潛意識裡有一個【${yc.fear}】的機制在作祟，導致你為了保護自己，反而付出了沉重的代價...（描述 MBTI 的盲點 ${mbtiData.blindspots}）。」
    3. **系統解釋 (The Mechanism)**：「這不是你個性不好，這是系統衝突。你的【人類圖 ${hd.role}】設計原本是要讓你 ${hd.mechanism}，但你卻因為恐懼而進入了【${trap.mode}】，導致系統過熱/當機。」
    
    【行動指南 (Actionable Steps) - 重要！】
    在分析的最後，請給出一個**「立刻可以做的小行動」**。
    - **規則**：不要講大道理（如「你要多愛自己」），要給**具體步驟**（如「今天晚上回家，把手機關機半小時，只做一件自己喜歡的事」）。
    - 結合流年 ${personalYear} 的建議。
    
    【流派數據庫 (Reference Data - Do not quote directly, translate to insights)】
    - **Life Path (${profile.lifePathNumber})**: 原型 ${lp.archetype}。陰影：${lp.shadow[0]}。
    - **Year Code (${profile.yearCode})**: ${yc.subconscious}。職場卡點：${yc.career[0]}。感情卡點：${yc.relationship[0]}。
    - **Human Design**: 類型 ${hd.role}。非自己主題 ${hd.alarm}。
    - **MBTI (${profile.mbti})**: ${mbtiData.blindspots}。

    【第一則訊息格式】
    **不要**一次給出長篇大論。請給出一個**強而有力的開場**（約 100 字）。
    1. 叫名字。
    2. 運用「冷讀術」直接點出他現在最痛苦的一個狀態（結合流年與恐懼）。
    3. 用一句話告訴他：「我知道為什麼會這樣，這不是你的錯。」
    4. 停頓，等待他回應想聽更多。

    Let's begin. Speak Traditional Chinese (Taiwan). Use Markdown for bolding key insights.
    `;
};
