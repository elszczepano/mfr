/*
* Copyright © 2021 Dominik Szczepaniak, MIT License.
*/

import { MakeDirectoryOptions, PathLike, promises as fs, constants } from 'fs';
import path from 'path';

import { IDriver, IDriverOptions, IDriverConstructor, IGeneratorConstructor, IGenerator } from './drivers/Driver';

import RandomDriver from './drivers/RandomDriver';
import StringDriver from './drivers/StringDriver';

import StringGenerator from './drivers/generators/StringGenerator';
import UuidGenerator from './drivers/generators/UuidGenerator';

export interface IEngineOptions extends IDriverOptions {
	mode: string;
	formats?: string[] | string;
	sourcePath: string;
	destinationPath: string;
	pattern?: string;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Driver = {
	generator: IGeneratorConstructor;
	driver: IDriverConstructor;
}

type BufferEncoding = 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'latin1' | 'binary' | 'hex';

export interface IFileSystem {
	readdir(
		path: PathLike,
		options?: { encoding: BufferEncoding | null; withFileTypes?: false; } | BufferEncoding | null
	): Promise<string[]>;
	copyFile( src: PathLike, dst: PathLike, flags?: number ): Promise<void>;
	access( path: PathLike, mode?: number ): Promise<void>;
	mkdir( path: PathLike, options?: number | string | MakeDirectoryOptions | null ): Promise<void>;
}

export default class Engine {
	private readonly _driversRegistry: Map<string, Driver> = new Map();

	public constructor(
		additionalDrivers: Driver[] = [],
		private readonly _fileSystem: IFileSystem = fs
	) {
		const drivers: Driver[] = [
			{ generator: UuidGenerator, driver: RandomDriver },
			{ generator: StringGenerator, driver: StringDriver },
			...additionalDrivers
		];

		for ( const driver of drivers ) {
			this._driversRegistry.set( driver.driver.driverName, driver );
		}
	}

	public async run( options: IEngineOptions ): Promise<void> {
		await this._validateOptions( options ?? {} );

		const driver: Driver = this._driversRegistry.get( options.mode ) as Driver;
		const DriverConstructor: IDriverConstructor = driver.driver;
		const GeneratorConstructor: IGeneratorConstructor = driver.generator;

		const generator: IGenerator = new GeneratorConstructor( options );
		const driverInstance: IDriver = new DriverConstructor( generator, options );
		const files: string[] = await this._fileSystem.readdir( options.sourcePath ) || [];

		const formats: string[] | undefined = typeof options.formats === 'string' ? [ options.formats ] : options.formats;

		const filteredFiles: string[] = files.filter( file => {
			const fileFormat: string | undefined = path.extname( file );

			if ( !fileFormat ) {
				return false;
			}

			if ( !formats ) {
				return true;
			}

			return formats.includes( fileFormat );
		} );

		for ( const file of filteredFiles ) {
			const { ext } = path.parse( file );
			const newFileName: string = driverInstance.getFilename();

			const destinationPath: string = `${ options.destinationPath }/${ newFileName }${ ext }`;

			await this._fileSystem.copyFile( `${ options.sourcePath }/${ file }`, destinationPath );
		}
	}

	private async _validateOptions( options: IEngineOptions ): Promise<void> {
		if ( !options.mode ) {
			this._exit( 'The mode has to be specified!' );
		}

		if ( !this._driversRegistry.get( options.mode ) ) {
			this._exit( 'Invalid mode!' );
		}

		await this._checkDirectory( options.sourcePath, 'sourcePath' );
		await this._checkDirectory( options.destinationPath, 'destinationPath', true );
	}

	private async _checkDirectory( directory: string, variableName: string, create: boolean = false ): Promise<void> {
		if ( !directory ) {
			this._exit( `The ${ variableName } has to be specified!` );
		}

		try {
			await this._fileSystem.access( directory, constants.F_OK );
		} catch ( error ) {
			if ( create ) {
				await this._fileSystem.mkdir( directory, { recursive: true } );

				return;
			}

			this._exit( `The ${ variableName } doesn't exist or you don't have enough permissions!` );
		}
	}

	private _exit( message: string ): void {
		throw new Error( message );
	}
}
