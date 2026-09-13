const builtInFontMap = {
    'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e',
    'f': 'f', 'g': 'g', 'h': 'h', 'i': 'i', 'j': 'j',
    'k': 'k', 'l': 'l', 'm': 'm', 'n': 'n', 'o': 'o',
    'p': 'p', 'q': 'q', 'r': 'r', 's': 's', 't': 't',
    'u': 'u', 'v': 'v', 'w': 'w', 'x': 'x', 'y': 'y', 'z': 'z',
    'A': 'a', 'B': 'b', 'C': 'c', 'D': 'd', 'E': 'e',
    'F': 'f', 'G': 'g', 'H': 'h', 'I': 'i', 'J': 'j',
    'K': 'k', 'L': 'l', 'M': 'm', 'N': 'n', 'O': 'o',
    'P': 'p', 'Q': 'q', 'R': 'r', 'S': 's', 'T': 't',
    'U': 'u', 'V': 'v', 'W': 'w', 'X': 'x', 'Y': 'y', 'Z': 'z',

    '𝗮': 'a', '𝗯': 'b', '𝗰': 'c', '𝗱': 'd', '𝗲': 'e',
    '𝗳': 'f', '𝗴': 'g', '𝗵': 'h', '𝗶': 'i', '𝗷': 'j',
    '𝗸': 'k', '𝗹': 'l', '𝗺': 'm', '𝗻': 'n', '𝗼': 'o',
    '𝗽': 'p', '𝗾': 'q', '𝗿': 'r', '𝘀': 's', '𝘁': 't',
    '𝘂': 'u', '𝘃': 'v', '𝘄': 'w', '𝘅': 'x', '𝘆': 'y', '𝘇': 'z',
    '𝗔': 'a', '𝗕': 'b', '𝗖': 'c', '𝗗': 'd', '𝗘': 'e',
    '𝗙': 'f', '𝗚': 'g', '𝗛': 'h', '𝗜': 'i', '𝗝': 'j',
    '𝗞': 'k', '𝗟': 'l', '𝗠': 'm', '𝗡': 'n', '𝗢': 'o',
    '𝗣': 'p', '𝗤': 'q', '𝗥': 'r', '𝗦': 's', '𝗧': 't',
    '𝗨': 'u', '𝗩': 'v', '𝗪': 'w', '𝗫': 'x', '𝗬': 'y', '𝗭': 'z',

    '𝘢': 'a', '𝘣': 'b', '𝘤': 'c', '𝘥': 'd', '𝘦': 'e',
    '𝘧': 'f', '𝘨': 'g', '𝘩': 'h', '𝘪': 'i', '𝘫': 'j',
    '𝘬': 'k', '𝘭': 'l', '𝘮': 'm', '𝘯': 'n', '𝘰': 'o',
    '𝘱': 'p', '𝘲': 'q', '𝘳': 'r', '𝘴': 's', '𝘵': 't',
    '𝘶': 'u', '𝘷': 'v', '𝘸': 'w', '𝘹': 'x', '𝘺': 'y', '𝘻': 'z',
    '𝘈': 'a', '𝘉': 'b', '𝘊': 'c', '𝘋': 'd', '𝘌': 'e',
    '𝘍': 'f', '𝘎': 'g', '𝘏': 'h', '𝘐': 'i', '𝘑': 'j',
    '𝘒': 'k', '𝘓': 'l', '𝘔': 'm', '𝘕': 'n', '𝘖': 'o',
    '𝘗': 'p', '𝘘': 'q', '𝘙': 'r', '𝘚': 's', '𝘛': 't',
    '𝘜': 'u', '𝘝': 'v', '𝘞': 'w', '𝘟': 'x', '𝘠': 'y', '𝘡': 'z',

    '𝙖': 'a', '𝙗': 'b', '𝙘': 'c', '𝙙': 'd', '𝙚': 'e',
    '𝙛': 'f', '𝙜': 'g', '𝙝': 'h', '𝙞': 'i', '𝙟': 'j',
    '𝙠': 'k', '𝙡': 'l', '𝙢': 'm', '𝙣': 'n', '𝙤': 'o',
    '𝙥': 'p', '𝙦': 'q', '𝙧': 'r', '𝙨': 's', '𝙩': 't',
    '𝙪': 'u', '𝙫': 'v', '𝙬': 'w', '𝙭': 'x', '𝙮': 'y', '𝙯': 'z',
    '𝘼': 'a', '𝘽': 'b', '𝘾': 'c', '𝘿': 'd', '𝙀': 'e',
    '𝙁': 'f', '𝙂': 'g', '𝙃': 'h', '𝙄': 'i', '𝙅': 'j',
    '𝙆': 'k', '𝙇': 'l', '𝙈': 'm', '𝙉': 'n', '𝙊': 'o',
    '𝙋': 'p', '𝙌': 'q', '𝙍': 'r', '𝙎': 's', '𝙏': 't',
    '𝙐': 'u', '𝙑': 'v', '𝙒': 'w', '𝙓': 'x', '𝙔': 'y', '𝙕': 'z',

    '𝕒': 'a', '𝕓': 'b', '𝕔': 'c', '𝕕': 'd', '𝕖': 'e',
    '𝕗': 'f', '𝕘': 'g', '𝕙': 'h', '𝕚': 'i', '𝕛': 'j',
    '𝕜': 'k', '𝕝': 'l', '𝕞': 'm', '𝕟': 'n', '𝕠': 'o',
    '𝕡': 'p', '𝕢': 'q', '𝕣': 'r', '𝕤': 's', '𝕥': 't',
    '𝕦': 'u', '𝕧': 'v', '𝕨': 'w', '𝕩': 'x', '𝕪': 'y', '𝕫': 'z',
    '𝔸': 'a', '𝔹': 'b', 'ℂ': 'c', '𝔻': 'd', '𝔼': 'e',
    '𝔽': 'f', '𝔾': 'g', 'ℍ': 'h', '𝕀': 'i', '𝕁': 'j',
    '𝕂': 'k', '𝕃': 'l', '𝕄': 'm', 'ℕ': 'n', '𝕆': 'o',
    'ℙ': 'p', 'ℚ': 'q', 'ℝ': 'r', '𝕊': 's', '𝕋': 't',
    '𝕌': 'u', '𝕍': 'v', '𝕎': 'w', '𝕏': 'x', '𝕐': 'y', 'ℤ': 'z',

    '𝒶': 'a', '𝒷': 'b', '𝒸': 'c', '𝒹': 'd', 'ℯ': 'e',
    '𝒻': 'f', 'ℊ': 'g', '𝒽': 'h', '𝒾': 'i', '𝒿': 'j',
    '𝓀': 'k', '𝓁': 'l', '𝓂': 'm', '𝓃': 'n', 'ℴ': 'o',
    '𝓅': 'p', '𝓆': 'q', '𝓇': 'r', '𝓈': 's', '𝓉': 't',
    '𝓊': 'u', '𝓋': 'v', '𝓌': 'w', '𝓍': 'x', '𝓎': 'y', '𝓏': 'z',
    '𝒜': 'a', 'ℬ': 'b', '𝒞': 'c', '𝒟': 'd', 'ℰ': 'e',
    'ℱ': 'f', '𝒢': 'g', 'ℋ': 'h', 'ℐ': 'i', '𝒥': 'j',
    '𝒦': 'k', 'ℒ': 'l', 'ℳ': 'm', '𝒩': 'n', '𝒪': 'o',
    '𝒫': 'p', '𝒬': 'q', 'ℛ': 'r', '𝒮': 's', '𝒯': 't',
    '𝒰': 'u', '𝒱': 'v', '𝒲': 'w', '𝒳': 'x', '𝒴': 'y', '𝒵': 'z',

    '𝓪': 'a', '𝓫': 'b', '𝓬': 'c', '𝓭': 'd', '𝓮': 'e',
    '𝓯': 'f', '𝓰': 'g', '𝓱': 'h', '𝓲': 'i', '𝓳': 'j',
    '𝓴': 'k', '𝓵': 'l', '𝓶': 'm', '𝓷': 'n', '𝓸': 'o',
    '𝓹': 'p', '𝓺': 'q', '𝓻': 'r', '𝓼': 's', '𝓽': 't',
    '𝓾': 'u', '𝓿': 'v', '𝔀': 'w', '𝔁': 'x', '𝔂': 'y', '𝔃': 'z',
    '𝓐': 'a', '𝓑': 'b', '𝓒': 'c', '𝓓': 'd', '𝓔': 'e',
    '𝓕': 'f', '𝓖': 'g', '𝓗': 'h', '𝓘': 'i', '𝓙': 'j',
    '𝓚': 'k', '𝓛': 'l', '𝓜': 'm', '𝓝': 'n', '𝓞': 'o',
    '𝓟': 'p', '𝓠': 'q', '𝓡': 'r', '𝓢': 's', '𝓣': 't',
    '𝓤': 'u', '𝓥': 'v', '𝓦': 'w', '𝓧': 'x', '𝓨': 'y', '𝓩': 'z',

    '𝔞': 'a', '𝔟': 'b', '𝔠': 'c', '𝔡': 'd', '𝔢': 'e',
    '𝔣': 'f', '𝔤': 'g', '𝔥': 'h', '𝔦': 'i', '𝔧': 'j',
    '𝔨': 'k', '𝔩': 'l', '𝔪': 'm', '𝔫': 'n', '𝔬': 'o',
    '𝔭': 'p', '𝔮': 'q', '𝔯': 'r', '𝔰': 's', '𝔱': 't',
    '𝔲': 'u', '𝔳': 'v', '𝔴': 'w', '𝔵': 'x', '𝔶': 'y', '𝔷': 'z',
    '𝔄': 'a', '𝔅': 'b', 'ℭ': 'c', '𝔇': 'd', '𝔈': 'e',
    '𝔉': 'f', '𝔊': 'g', 'ℌ': 'h', 'ℑ': 'i', '𝔍': 'j',
    '𝔎': 'k', '𝔏': 'l', '𝔐': 'm', '𝔑': 'n', '𝔒': 'o',
    '𝔓': 'p', '𝔔': 'q', 'ℜ': 'r', '𝔖': 's', '𝔗': 't',
    '𝔘': 'u', '𝔙': 'v', '𝔚': 'w', '𝔛': 'x', '𝔜': 'y', 'ℨ': 'z',

    'ⓐ': 'a', 'ⓑ': 'b', 'ⓒ': 'c', 'ⓓ': 'd', 'ⓔ': 'e',
    'ⓕ': 'f', 'ⓖ': 'g', 'ⓗ': 'h', 'ⓘ': 'i', 'ⓙ': 'j',
    'ⓚ': 'k', 'ⓛ': 'l', 'ⓜ': 'm', 'ⓝ': 'n', 'ⓞ': 'o',
    'ⓟ': 'p', 'ⓠ': 'q', 'ⓡ': 'r', 'ⓢ': 's', 'ⓣ': 't',
    'ⓤ': 'u', 'ⓥ': 'v', 'ⓦ': 'w', 'ⓧ': 'x', 'ⓨ': 'y', 'ⓩ': 'z',

    'ａ': 'a', 'ｂ': 'b', 'ｃ': 'c', 'ｄ': 'd', 'ｅ': 'e',
    'ｆ': 'f', 'ｇ': 'g', 'ｈ': 'h', 'ｉ': 'i', 'ｊ': 'j',
    'ｋ': 'k', 'ｌ': 'l', 'ｍ': 'm', 'ｎ': 'n', 'ｏ': 'o',
    'ｐ': 'p', 'ｑ': 'q', 'ｒ': 'r', 'ｓ': 's', 'ｔ': 't',
    'ｕ': 'u', 'ｖ': 'v', 'ｗ': 'w', 'ｘ': 'x', 'ｙ': 'y', 'ｚ': 'z',
    'Ａ': 'a', 'Ｂ': 'b', 'Ｃ': 'c', 'Ｄ': 'd', 'Ｅ': 'e',
    'Ｆ': 'f', 'Ｇ': 'g', 'Ｈ': 'h', 'Ｉ': 'i', 'Ｊ': 'j',
    'Ｋ': 'k', 'Ｌ': 'l', 'Ｍ': 'm', 'Ｎ': 'n', 'Ｏ': 'o',
    'Ｐ': 'p', 'Ｑ': 'q', 'Ｒ': 'r', 'Ｓ': 's', 'Ｔ': 't',
    'Ｕ': 'u', 'Ｖ': 'v', 'Ｗ': 'w', 'Ｘ': 'x', 'Ｙ': 'y', 'Ｚ': 'z',

    'ᴀ': 'a', 'ʙ': 'b', 'ᴄ': 'c', 'ᴅ': 'd', 'ᴇ': 'e',
    'ғ': 'f', 'ɢ': 'g', 'ʜ': 'h', 'ɪ': 'i', 'ᴊ': 'j',
    'ᴋ': 'k', 'ʟ': 'l', 'ᴍ': 'm', 'ɴ': 'n', 'ᴏ': 'o',
    'ᴘ': 'p', 'ǫ': 'q', 'ʀ': 'r', 's': 's', 'ᴛ': 't',
    'ᴜ': 'u', 'ᴠ': 'v', 'ᴡ': 'w', 'x': 'x', 'ʏ': 'y', 'ᴢ': 'z',

    'ᵃ': 'a', 'ᵇ': 'b', 'ᶜ': 'c', 'ᵈ': 'd', 'ᵉ': 'e',
    'ᶠ': 'f', 'ᵍ': 'g', 'ʰ': 'h', 'ⁱ': 'i', 'ʲ': 'j',
    'ᵏ': 'k', 'ˡ': 'l', 'ᵐ': 'm', 'ⁿ': 'n', 'ᵒ': 'o',
    'ᵖ': 'p', 'ᵠ': 'q', 'ʳ': 'r', 'ˢ': 's', 'ᵗ': 't',
    'ᵘ': 'u', 'ᵛ': 'v', 'ʷ': 'w', 'ˣ': 'x', 'ʸ': 'y', 'ᶻ': 'z',
};

function normalizeText(text) {
    if (!text) return '';
    let result = '';
    for (const char of text) {
        result += builtInFontMap[char] || char;
    }
    return result;
}

function normalizeCommand(text) {
    if (!text) return '';
    const prefix = global.prefix || '.';
    let cleanText = text;
    if (cleanText.startsWith(prefix)) {
        cleanText = cleanText.slice(prefix.length);
    }
    return normalizeText(cleanText);
}

function extractCommand(text) {
    if (!text) return '';
    const prefix = global.prefix || '.';
    let cleanText = text;
    if (cleanText.startsWith(prefix)) {
        cleanText = cleanText.slice(prefix.length);
    }
    const parts = cleanText.split(/ +/);
    const command = parts[0] || '';
    return normalizeText(command);
}

function normalizeJarvisMessage(text) {
    if (!text) return '';
    return normalizeText(text);
}

function extractJarvisCommand(text) {
    if (!text) return '';
    const normalized = normalizeText(text);
    const lowerText = normalized.toLowerCase();

    const jarvisKeywords = ['jarvis', 'jarvs', 'jar', 'jvis', 'ᴊᴀʀᴠɪs', 'ᴊᴀʀᴠꜱ'];
    for (const keyword of jarvisKeywords) {
        if (lowerText.includes(keyword)) {
            const cleanText = normalized.replace(new RegExp(keyword, 'gi'), '').trim();
            return cleanText;
        }
    }
    return normalized;
}

function isJarvisMention(text) {
    if (!text) return false;
    const normalized = normalizeText(text);
    const lowerText = normalized.toLowerCase();

    const jarvisKeywords = ['jarvis', 'jarvs', 'jar', 'jvis', 'ᴊᴀʀᴠɪs', 'ᴊᴀʀᴠꜱ'];
    return jarvisKeywords.some(keyword => lowerText.includes(keyword));
}

module.exports = {
    normalizeText,
    normalizeCommand,
    extractCommand,
    normalizeJarvisMessage,
    extractJarvisCommand,
    isJarvisMention,
    builtInFontMap
};