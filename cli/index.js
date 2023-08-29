const { Command } = require('commander');

const program = new Command();

program.command('test')
    .action(() => {
        console.log('test');
    });

program.parse();