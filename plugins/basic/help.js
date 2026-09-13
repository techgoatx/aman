const { cmd, commands } = require('../../command.js');
const settings = require('../../settings.js');

cmd({
    pattern: 'help',
    alias: ['h'],
    category: 'basic',
    description: '📝 Gᴇᴛ ʜᴇʟᴘ ғᴏʀ ᴀɴʏ ᴄᴏᴍᴍᴀɴᴅ',
    react: '📝',
    type: 'public'
}, async (sock, msg, args, context) => {
    try {
        const { from, reply } = context;
        const prefix = settings.prefix;

        if (!args || args.length === 0) {
            let text = `📝 ${settings.botname} Help Menu\n\n`;
            const cats = {};
            commands.forEach(c => {
                const cat = c.category || 'others';
                if (!cats[cat]) cats[cat] = [];
                cats[cat].push(c.pattern?.[0] || c.pattern);
            });
            for (const [cat, cmds] of Object.entries(cats)) {
                text += `*${cat.toUpperCase()}*\n`;
                text += cmds.map(c => `  ${prefix}${c}`).join('\n');
                text += '\n\n';
            }
            text += `${settings.poweredBy}\n`;
            text += `_Use ${prefix}help <command> for details_`;
            await reply(text);
            return;
        }

        const name = args[0].toLowerCase();
        const cmd = commands.find(c => {
            const p = Array.isArray(c.pattern) ? c.pattern : [c.pattern];
            const a = Array.isArray(c.alias) ? c.alias : (c.alias ? [c.alias] : []);
            return [...p, ...a].includes(name);
        });

        if (!cmd) {
            await reply(`❌ Command "${name}" not found.`);
            return;
        }

        const p = Array.isArray(cmd.pattern) ? cmd.pattern[0] : cmd.pattern;
        const a = Array.isArray(cmd.alias) ? cmd.alias : (cmd.alias ? [cmd.alias] : []);
        let detail = `📝 *${p.toUpperCase()}*\n\n`;
        detail += `📋 ${cmd.description}\n\n`;
        detail += `📌 Usage: ${prefix}${p}\n`;
        if (a.length) detail += `🔗 Aliases: ${a.map(x => `${prefix}${x}`).join(', ')}\n`;
        detail += `📂 Category: ${cmd.category || 'general'}\n`;
        detail += `\n${settings.poweredBy}`;
        await reply(detail);
    } catch (err) {
        console.error('Help error:', err.message);
        await context.reply(`❌ ${err.message}`);
    }
});