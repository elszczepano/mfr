/*
* Copyright © 2021 Dominik Szczepaniak, MIT License.
*/

import { IGenerator } from '../Driver';
import { IStringDriverOptions } from '../StringDriver';

export default class StringGenerator implements IGenerator {
	public constructor( private readonly _options: IStringDriverOptions ) {}

	public generate(): string {
		return this._options.pattern;
	}
}
