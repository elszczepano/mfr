/*
* Copyright © 2021 Dominik Szczepaniak, MIT License.
*/

import anyTest, { TestInterface } from 'ava';
import sinon from 'sinon';

import StringDriver, { IStringDriverOptions } from '@src/drivers/StringDriver';

import { generateRandomString } from '@src/utils/utils';

const test: TestInterface<{
	pattern: string;
	prefix: string;
	postfix: string;
	generator: {
		generate: sinon.SinonStub;
	};
}> = anyTest;

test.beforeEach( t => {
	t.context.pattern = generateRandomString( 20 );
	t.context.prefix = generateRandomString( 5 );
	t.context.postfix = generateRandomString( 5 );
	t.context.generator = {
		generate: sinon.stub().returns( t.context.pattern )
	};
} );

test( 'getFilename(): Should throw an error if an appendix is not defined', t => {
	const options: IStringDriverOptions = { pattern: t.context.pattern };

	const error: Error = t.throws( () => {
		// eslint-disable-next-line no-new
		new StringDriver( t.context.generator, options );
	} );

	t.is( error.message, 'Appendix variant has to be defined!' );
} );

test( 'getFilename(): Should throw an error if an appendix is set to "none"', t => {
	const options: IStringDriverOptions = { pattern: t.context.pattern, appendix: 'none' };

	const error: Error = t.throws( () => {
		// eslint-disable-next-line no-new
		new StringDriver( t.context.generator, options );
	} );

	t.is( error.message, 'Appendix cannot be set to "none"!' );
} );

test( 'getFilename(): Should throw an error if an appendix is set to "all" and a "prefixPattern" is missing', t => {
	const { pattern, postfix } = t.context;

	const options: IStringDriverOptions = { pattern, appendix: 'all', postfixPattern: postfix };

	const error: Error = t.throws( () => {
		// eslint-disable-next-line no-new
		new StringDriver( t.context.generator, options );
	} );

	t.is( error.message, 'Prefix pattern function has to be provided!' );
} );

test( 'getFilename(): Should throw an error if an appendix is set to "prefix" and a "prefixPattern" is missing', t => {
	const { pattern } = t.context;

	const options: IStringDriverOptions = { pattern, appendix: 'prefix' };

	const error: Error = t.throws( () => {
		// eslint-disable-next-line no-new
		new StringDriver( t.context.generator, options );
	} );

	t.is( error.message, 'Prefix pattern function has to be provided!' );
} );

test( 'getFilename(): Should throw an error if an appendix is set to "all" and a "postfixPattern" is missing', t => {
	const { pattern, prefix } = t.context;

	const options: IStringDriverOptions = { pattern, appendix: 'all', prefixPattern: prefix };

	const error: Error = t.throws( () => {
		// eslint-disable-next-line no-new
		new StringDriver( t.context.generator, options );
	} );

	t.is( error.message, 'Postfix pattern function has to be provided!' );
} );

test( 'getFilename(): Should throw an error if an appendix is set to "postfix" and a "postfixPattern" is missing', t => {
	const { pattern } = t.context;

	const options: IStringDriverOptions = { pattern, appendix: 'postfix' };

	const error: Error = t.throws( () => {
		// eslint-disable-next-line no-new
		new StringDriver( t.context.generator, options );
	} );

	t.is( error.message, 'Postfix pattern function has to be provided!' );
} );

test( 'getFilename(): Should return a filename with a prefix', t => {
	const { pattern, prefix } = t.context;

	const options: IStringDriverOptions = { pattern, appendix: 'prefix', prefixPattern: prefix };

	const driver: StringDriver = new StringDriver( t.context.generator, options );

	const filename: string = driver.getFilename();

	t.is( filename, `${ prefix }${ pattern }` );
} );

test( 'getFilename(): Should return a filename with a postfix', t => {
	const { pattern, postfix } = t.context;

	const options: IStringDriverOptions = { pattern, appendix: 'postfix', postfixPattern: postfix };

	const driver: StringDriver = new StringDriver( t.context.generator, options );

	const filename: string = driver.getFilename();

	t.is( filename, `${ pattern }${ postfix }` );
} );

test( 'getFilename(): Should return a filename with a prefix and a postfix', t => {
	const { pattern, postfix, prefix } = t.context;

	const options: IStringDriverOptions = { pattern, appendix: 'all', postfixPattern: postfix, prefixPattern: prefix };

	const driver: StringDriver = new StringDriver( t.context.generator, options );

	const filename: string = driver.getFilename();

	t.is( filename, `${ prefix }${ pattern }${ postfix }` );
} );

test( 'getFilename(): Should accept a function as a "prefixPattern"', t => {
	const { pattern, prefix } = t.context;

	const options: IStringDriverOptions = { pattern, appendix: 'prefix', prefixPattern: () => prefix };

	const driver: StringDriver = new StringDriver( t.context.generator, options );

	const filename: string = driver.getFilename();

	t.is( filename, `${ prefix }${ pattern }` );
} );

test( 'getFilename(): Should accept a function as a "postfixPattern"', t => {
	const { pattern, postfix } = t.context;

	const options: IStringDriverOptions = { pattern, appendix: 'postfix', postfixPattern: () => postfix };

	const driver: StringDriver = new StringDriver( t.context.generator, options );

	const filename: string = driver.getFilename();

	t.is( filename, `${ pattern }${ postfix }` );
} );
