const commands = [];

function cmd(definition, callback) {
    if (typeof definition.pattern === 'string') {
        definition.pattern = [definition.pattern];
    }
    if (typeof definition.alias === 'string') {
        definition.alias = [definition.alias];
    } else if (!definition.alias) {
        definition.alias = [];
    }
    if (!definition.category) {
        definition.category = 'main';
    }
    if (!definition.react) {
        definition.react = '✅';
    }
    if (!definition.type) {
        definition.type = 'public';
    }
    if (!definition.secret) {
        definition.secret = false;
    }

    const command = {
        ...definition,
        execute: callback
    };
    commands.push(command);
    return command;
}

function getCommands(category) {
    if (category) {
        return commands.filter(cmd => cmd.category === category);
    }
    return commands;
}

function findCommand(name) {
    return commands.find(cmd => {
        if (cmd.pattern && cmd.pattern.includes(name)) return true;
        if (cmd.alias && cmd.alias.includes(name)) return true;
        return false;
    });
}

module.exports = { cmd, commands, getCommands, findCommand };