/*
* Copyright © 2021 Dominik Szczepaniak, MIT License.
*/

import { validate } from 'uuid';

import test from 'ava';

import UuidGenerator from '@src/drivers/generators/UuidGenerator';

test( 'generate(): Should generate a valid uuid', t => {
	const generator: UuidGenerator = new UuidGenerator();

	const result: string = generator.generate();

	t.is( validate( result ), true );
} );
