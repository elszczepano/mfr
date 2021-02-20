/*
* Copyright © 2021 Dominik Szczepaniak, MIT License.
*/

import { Driver, IGenerator, IDriverOptions } from './Driver';

export default class RandomDriver extends Driver {
	public static driverName: string = 'random';

	public constructor(
		generator: IGenerator,
		options: IDriverOptions
	) {
		super( generator, options );
	}

	public getFilename(): string {
		const prefix: string = this._getPrefix();
		const postfix: string = this._getPostfix();

		return `${ prefix }${ this._generator.generate() }${ postfix }`;
	}
}
