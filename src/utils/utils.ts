/*
* Copyright © 2021 Dominik Szczepaniak, MIT License.
*/

import crypto from 'crypto';

export function generateRandomString( length: number ): string {
	return crypto.randomBytes( length / 2 ).toString( 'hex' );
}
