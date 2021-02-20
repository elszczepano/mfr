/*
* Copyright © 2021 Dominik Szczepaniak, MIT License.
*/

import anyTest, { TestInterface } from 'ava';

import StringGenerator from '@src/drivers/generators/StringGenerator';

import { generateRandomString } from '@src/utils/utils';

const test: TestInterface<{
	expectedResult: string;
}> = anyTest;

test.beforeEach( t => {
	t.context.expectedResult = generateRandomString( 20 );
} );

test( 'generate(): Should generate a proper result', t => {
	const generator: StringGenerator = new StringGenerator( { pattern: t.context.expectedResult } );

	const result: string = generator.generate();

	t.is( result, t.context.expectedResult );
} );
