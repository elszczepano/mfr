/*
* Copyright © 2021 Dominik Szczepaniak, MIT License.
*/

import { promises as fs } from 'fs';
import path from 'path';

import anyTest, { TestInterface } from 'ava';
import { validate } from 'uuid';
import rimraf from 'rimraf';

import MFR, { IOptions } from '@src';
import { generateRandomString } from '@src/utils/utils';

const test: TestInterface<{
	sourcePath: string;
	destinationPath: string;
	mfr: MFR;
}> = anyTest;

test.beforeEach( t => {
	t.context.sourcePath = 'tests/assets/test-directory';
	t.context.destinationPath = `tests/assets/destination-${ generateRandomString( 10 ) }`;
	t.context.mfr = new MFR();
} );

test.afterEach( async t => {
	await rimraf( t.context.destinationPath, () => {} );
} );

test( 'Should rename files properly in random mode', async t => {
	const { sourcePath, destinationPath, mfr } = t.context;

	const options: IOptions = {
		mode: 'random',
		prefixPattern: 'img_',
		appendix: 'prefix',
		sourcePath,
		destinationPath
	};

	await mfr.run( options );

	const files: string[] = await fs.readdir( destinationPath );

	for ( const file of files ) {
		const { name } = path.parse( file );
		const [ prefix, uuid ] = name.split( '_' );

		t.is( prefix, 'img' );
		t.is( validate( uuid ), true );
	}
} );

test( 'Should rename files properly in string mode', async t => {
	const { sourcePath, destinationPath, mfr } = t.context;

	const options: IOptions = {
		mode: 'string',
		pattern: '_img',
		prefixPattern: () => generateRandomString( 10 ),
		appendix: 'prefix',
		sourcePath,
		destinationPath
	};

	await mfr.run( options );

	const files: string[] = await fs.readdir( destinationPath );

	for ( const file of files ) {
		const { name } = path.parse( file );
		const [ prefix, pattern ] = name.split( '_' );

		t.is( typeof prefix, 'string' );
		t.is( prefix.length, 10 );
		t.is( pattern, 'img' );
	}
} );
