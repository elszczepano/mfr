/*
* Copyright © 2021 Dominik Szczepaniak, MIT License.
*/

import anyTest, { TestInterface } from 'ava';
import sinon from 'sinon';

import RandomDriver from '@src/drivers/RandomDriver';
import { IDriverOptions } from '@src/drivers/Driver';

import { generateRandomString } from '@src/utils/utils';

const test: TestInterface<{
	expectedResult: string;
	prefix: string;
	postfix: string;
	generator: {
		generate: sinon.SinonStub;
	};
}> = anyTest;

test.beforeEach( t => {
	t.context.expectedResult = generateRandomString( 20 );
	t.context.prefix = generateRandomString( 5 );
	t.context.postfix = generateRandomString( 5 );
	t.context.generator = {
		generate: sinon.stub().returns( t.context.expectedResult )
	};
} );

test( 'run(): Should throw an error if an appendix is set to "all" and a "prefixPattern" is missing', t => {
	const { postfix } = t.context;

	const options: IDriverOptions = { appendix: 'all', postfixPattern: postfix };

	const error: Error = t.throws( () => {
		// eslint-disable-next-line no-new
		new RandomDriver( t.context.generator, options );
	} );

	t.is( error.message, 'Prefix pattern function has to be provided!' );
} );

test( 'getFilename(): Should throw an error if an appendix is set to "prefix" and a "prefixPattern"" is missing', t => {
	const options: IDriverOptions = { appendix: 'prefix' };

	const error: Error = t.throws( () => {
		// eslint-disable-next-line no-new
		new RandomDriver( t.context.generator, options );
	} );

	t.is( error.message, 'Prefix pattern function has to be provided!' );
} );

test( 'getFilename(): Should throw an error if an appendix is set to "all" and a "postfixPattern" is missing', t => {
	const { prefix } = t.context;

	const options: IDriverOptions = { appendix: 'all', prefixPattern: prefix };

	const error: Error = t.throws( () => {
		// eslint-disable-next-line no-new
		new RandomDriver( t.context.generator, options );
	} );

	t.is( error.message, 'Postfix pattern function has to be provided!' );
} );

test( 'getFilename(): Should throw an error if an appendix is set to "postfix" and a "postfixPattern" is missing', t => {
	const options: IDriverOptions = { appendix: 'postfix' };

	const error: Error = t.throws( () => {
		// eslint-disable-next-line no-new
		new RandomDriver( t.context.generator, options );
	} );

	t.is( error.message, 'Postfix pattern function has to be provided!' );
} );

test( 'getFilename(): Should return a filename with a prefix', t => {
	const { prefix, expectedResult } = t.context;

	const options: IDriverOptions = { appendix: 'prefix', prefixPattern: prefix };

	const driver: RandomDriver = new RandomDriver( t.context.generator, options );

	const filename: string = driver.getFilename();

	t.is( filename, `${ prefix }${ expectedResult }` );
} );

test( 'getFilename(): Should return a filename with a postfix', t => {
	const { postfix, expectedResult } = t.context;

	const options: IDriverOptions = { appendix: 'postfix', postfixPattern: postfix };

	const driver: RandomDriver = new RandomDriver( t.context.generator, options );

	const filename: string = driver.getFilename();

	t.is( filename, `${ expectedResult }${ postfix }` );
} );

test( 'getFilename(): Should return a filename with a prefix and a postfix', t => {
	const { postfix, prefix, expectedResult } = t.context;

	const options: IDriverOptions = { appendix: 'all', postfixPattern: postfix, prefixPattern: prefix };

	const driver: RandomDriver = new RandomDriver( t.context.generator, options );

	const filename: string = driver.getFilename();

	t.is( filename, `${ prefix }${ expectedResult }${ postfix }` );
} );

test( 'getFilename(): Should accept a function as a "prefixPattern"', t => {
	const { prefix, expectedResult } = t.context;

	const options: IDriverOptions = { appendix: 'prefix', prefixPattern: () => prefix };

	const driver: RandomDriver = new RandomDriver( t.context.generator, options );

	const filename: string = driver.getFilename();

	t.is( filename, `${ prefix }${ expectedResult }` );
} );

test( 'getFilename(): Should accept a function as a "postfixPattern"', t => {
	const { postfix, expectedResult } = t.context;

	const options: IDriverOptions = { appendix: 'postfix', postfixPattern: () => postfix };

	const driver: RandomDriver = new RandomDriver( t.context.generator, options );

	const filename: string = driver.getFilename();

	t.is( filename, `${ expectedResult }${ postfix }` );
} );
