function asString(value) {
    return typeof value === 'string' ? value.trim() : '';
}

function jidUser(value) {
    return asString(value).split('@')[0].split(':')[0];
}

function jidServer(value) {
    const text = asString(value);
    return text.includes('@') ? text.slice(text.indexOf('@') + 1).toLowerCase() : '';
}

function phoneNumber(value) {
    return jidUser(value).replace(/[^0-9]/g, '');
}

function isPhoneJid(value) {
    const server = jidServer(value);
    return !server || server === 's.whatsapp.net' || server === 'c.us';
}

function sameJid(left, right) {
    const leftText = asString(left);
    const rightText = asString(right);
    if (!leftText || !rightText) return false;

    if (leftText === rightText) return true;

    const leftNumber = phoneNumber(leftText);
    const rightNumber = phoneNumber(rightText);
    return Boolean(leftNumber && rightNumber && isPhoneJid(leftText) && isPhoneJid(rightText) && leftNumber === rightNumber);
}

function configuredNumberMatches(value, configuredNumbers) {
    if (!isPhoneJid(value)) return false;
    const valueNumber = phoneNumber(value);
    if (!valueNumber) return false;

    return configuredNumbers.some((configured) => {
        const configuredNumber = phoneNumber(configured);
        return configuredNumber && valueNumber === configuredNumber;
    });
}

function participantMatchesSender(participant, senderId) {
    if (!participant || !senderId) return false;

    return [participant.id, participant.jid, participant.lid, participant.phoneNumber]
        .filter(Boolean)
        .some((candidate) => sameJid(candidate, senderId) || candidate === senderId);
}

async function findParticipant(sock, chatId, senderId) {
    if (!sock || !chatId?.endsWith('@g.us') || !senderId) return null;

    try {
        const metadata = await sock.groupMetadata(chatId);
        return (metadata?.participants || []).find((participant) =>
            participantMatchesSender(participant, senderId)
        ) || null;
    } catch (error) {
        console.error('[Identity] Could not read group participants:', error.message);
        return null;
    }
}

function participantHasConfiguredNumber(participant, configuredNumbers) {
    if (!participant) return false;

    return [participant.phoneNumber, participant.id, participant.jid]
        .filter((candidate) => candidate && isPhoneJid(candidate))
        .some((candidate) => configuredNumberMatches(candidate, configuredNumbers));
}

module.exports = {
    phoneNumber,
    sameJid,
    configuredNumberMatches,
    findParticipant,
    participantHasConfiguredNumber
};