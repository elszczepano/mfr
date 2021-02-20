/*
* Copyright © 2021 Dominik Szczepaniak, MIT License.
*/

import { v4 as uuidv4 } from 'uuid';

import { IGenerator } from '../Driver';

export default class UuidGenerator implements IGenerator {
	public generate(): string {
		return uuidv4();
	}
}
