#!/usr/bin/env node
/*
* Copyright © 2021 Dominik Szczepaniak, MIT License.
*/

import chalk from 'chalk';
import yargs from 'yargs';

import MFR from '../Engine';

interface IOptions extends Record<string, unknown> {
	mode: string;
	source: string;
	destination: string;
	formats?: string[];
	pattern?: string;
	appendix?: 'prefix' | 'postfix' | 'all' | 'none';
	prefix?: string;
	postfix?: string;
}

// @ts-ignore - issue with typings
const options: IOptions = yargs
	.usage( 'Usage: -m <mode> -s <source> -d <destination>' )
	.option( 'm', { alias: 'mode', describe: 'Application mode', type: 'string', demandOption: true } )
	.option( 's', { alias: 'source', describe: 'Source path', type: 'string', demandOption: true } )
	.option( 'd', { alias: 'destination', describe: 'Destiatnion path', type: 'string', demandOption: true } )
	.option( 'f', { alias: 'formats', describe: 'Handled formats', type: 'array' } )
	.option( 'p', { alias: 'pattern', describe: 'Pattern', type: 'string' } )
	.option( 'a', { alias: 'appendix', describe: 'Appendix', type: 'string' } )
	.option( 'pre', { alias: 'prefix', describe: 'Prefix pattern', type: 'string' } )
	.option( 'pos', { alias: 'postfix', describe: 'Prefix patern', type: 'string' } )
	.argv;

( async function() {
	try {
		const mfr: MFR = new MFR();

		const { mode, source, destination, formats, pattern, appendix, prefix, postfix } = options;

		await mfr.run( {
			mode,
			sourcePath: source,
			destinationPath: destination,
			formats,
			pattern,
			appendix,
			prefixPattern: prefix,
			postfixPattern: postfix
		} );

		chalk.green.bold( 'Done!' );
	} catch ( error ) {
		chalk.red.bold( 'Rename operation failed. An unexpected error occurred!', error );
	}
}() );
