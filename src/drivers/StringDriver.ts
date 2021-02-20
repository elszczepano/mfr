/*
* Copyright © 2021 Dominik Szczepaniak, MIT License.
*/

import { IGenerator, IDriverOptions, Driver } from './Driver';

export interface IStringDriverOptions extends IDriverOptions {
	pattern: string;
}

export default class StringDriver extends Driver {
	public static driverName: string = 'string';

	public constructor(
		generator: IGenerator,
		protected readonly _options: IStringDriverOptions
	) {
		super( generator, _options );
		this._validateOptions();
	}

	public getFilename(): string {
		const prefix: string = this._getPrefix();
		const postfix: string = this._getPostfix();

		return `${ prefix }${ this._generator.generate( this._options ) }${ postfix }`;
	}

	private _validateOptions(): void {
		if ( !this._options.appendix ) {
			throw new Error( 'Appendix variant has to be defined!' );
		}

		if ( this._options.appendix === 'none' ) {
			throw new Error( 'Appendix cannot be set to "none"!' );
		}
	}
}
