import yargs from 'yargs/yargs';
import { DisplayCommand } from './commands';

export function cli(processArgs: string[]) {
    yargs(processArgs)
        .usage('Usage $0 <command>')
        .command(
            'display <deviceType> <url>',
            'display a single rendition of the URL',
            (yargs) => {
                yargs
                    .positional('deviceType', {
                        describe: 'The type of screen connected to your device',
                        type: 'string',
                    })
                    .positional('url', {
                        describe: 'URL to display',
                        type: 'string',
                    });
            },
            (args: DisplayArgs) => {
                const displayCommand = new DisplayCommand();
                displayCommand.display(args.deviceType, args.url);
            }
        )
        .demandCommand(1, 'No command specified - you must specify a command')
        .help().argv;
}

interface DisplayArgs {
    deviceType: string;
    url: string;
}
