/*
* Copyright © 2021 Dominik Szczepaniak, MIT License.
*/

export interface IGenerator {
	generate(): string;
	generate( options: IDriverOptions ): string;
}

export interface IDriver {
	getFilename(): string;
}

export interface IDriverConstructor { new( ...args: unknown[] ): IDriver; driverName: string; }
export interface IGeneratorConstructor { new( ...args: unknown[] ): IGenerator; }

type Appendix = 'prefix' | 'postfix' | 'all' | 'none';
type AppendixPattern = string | ( () => string );

export interface IDriverOptions extends Record<string, unknown> {
	appendix?: Appendix;
	postfixPattern?: AppendixPattern;
	prefixPattern?: AppendixPattern;
}

export abstract class Driver implements IDriver {
	protected readonly _options: IDriverOptions;

	public constructor(
		protected readonly _generator: IGenerator,
		options: IDriverOptions
	) {
		const { appendix, postfixPattern, prefixPattern } = options;

		if ( appendix && [ 'prefix', 'all' ].includes( appendix ) && !prefixPattern ) {
			throw new Error( 'Prefix pattern function has to be provided!' );
		}

		if ( appendix && [ 'postfix', 'all' ].includes( appendix ) && !postfixPattern ) {
			throw new Error( 'Postfix pattern function has to be provided!' );
		}

		this._options = { appendix: 'none', ...options };
	}

	public abstract getFilename(): string;

	protected _getPrefix(): string {
		const { prefixPattern, appendix } = this._options;

		if ( appendix && ![ 'prefix', 'all' ].includes( appendix ) ) {
			return '';
		}

		return typeof prefixPattern === 'function' ? prefixPattern() : prefixPattern ?? '';
	}

	protected _getPostfix(): string {
		const { postfixPattern, appendix } = this._options;

		if ( appendix && ![ 'postfix', 'all' ].includes( appendix ) ) {
			return '';
		}

		return typeof postfixPattern === 'function' ? postfixPattern() : postfixPattern ?? '';
	}
}
