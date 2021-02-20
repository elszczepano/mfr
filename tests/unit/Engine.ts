/*
* Copyright © 2021 Dominik Szczepaniak, MIT License.
*/

import anyTest, { TestInterface } from 'ava';
import sinon from 'sinon';

import Engine, { IFileSystem } from '@src/Engine';
import { IDriver, IGenerator } from '@src/drivers/Driver';

import { generateRandomString } from '@src/utils/utils';

class MockDriver implements IDriver {
	public static driverName: string = 'custom';

	public getFilename(): string {
		return 'filename';
	}
}

class MockGenerator implements IGenerator {
	public generate(): string {
		return 'test';
	}
}

const test: TestInterface<{
	sourcePath: string;
	destinationPath: string;
	fileSystemMock: sinon.SinonStubbedInstance<IFileSystem>;
	engine: Engine;
}> = anyTest;

test.beforeEach( t => {
	t.context.sourcePath = generateRandomString( 10 );
	t.context.destinationPath = generateRandomString( 10 );
	t.context.fileSystemMock = {
		readdir: sinon.stub(),
		access: sinon.stub(),
		copyFile: sinon.stub(),
		mkdir: sinon.stub()
	};
	t.context.engine = new Engine( [ { driver: MockDriver, generator: MockGenerator } ], t.context.fileSystemMock );
} );

test( 'run(): Should throw an error if mode is not specified', async t => {
	const { engine, sourcePath, destinationPath } = t.context;

	const error: Error = await t.throwsAsync( async () => {
		// @ts-ignore - Intentionally test.
		await engine.run( { sourcePath, destinationPath } );
	} );

	t.is( error.message, 'The mode has to be specified!' );
} );

test( 'run(): Should throw an error if mode is incorrect', async t => {
	const { engine, sourcePath, destinationPath } = t.context;

	const error: Error = await t.throwsAsync( async () => {
		await engine.run( { mode: 'foo', sourcePath, destinationPath } );
	} );

	t.is( error.message, 'Invalid mode!' );
} );

test( 'run(): Should throw an error if sourcePath is missing', async t => {
	const { engine, destinationPath } = t.context;

	const error: Error = await t.throwsAsync( async () => {
		await engine.run( { mode: 'custom', destinationPath, sourcePath: '' } );
	} );

	t.is( error.message, 'The sourcePath has to be specified!' );
} );

test( 'run(): Should throw an error about invalid sourcePath', async t => {
	const { engine, sourcePath, destinationPath, fileSystemMock } = t.context;

	fileSystemMock.access.onCall( 0 ).throws( new Error() );

	const error: Error = await t.throwsAsync( async () => {
		await engine.run( { mode: 'custom', sourcePath, destinationPath } );
	} );

	t.is( error.message, 'The sourcePath doesn\'t exist or you don\'t have enough permissions!' );
} );

test( 'run(): Should throw an error if destinationPath is missing', async t => {
	const { engine, sourcePath } = t.context;

	const error: Error = await t.throwsAsync( async () => {
		await engine.run( { mode: 'custom', sourcePath, destinationPath: '' } );
	} );

	t.is( error.message, 'The destinationPath has to be specified!' );
} );

test( 'run(): Should create destinationPath if not exists', async t => {
	const { engine, sourcePath, destinationPath, fileSystemMock } = t.context;

	fileSystemMock.access.onCall( 1 ).throws( new Error() );

	await engine.run( { mode: 'custom', destinationPath, sourcePath } );

	sinon.assert.calledOnceWithExactly( fileSystemMock.mkdir, destinationPath, { recursive: true } );

	t.pass();
} );

test( 'run(): Should respect provided formats', async t => {
	const { engine, sourcePath, destinationPath, fileSystemMock } = t.context;

	fileSystemMock.readdir.resolves( [
		'foo.txt',
		'bar.jpg'
	] );

	await engine.run( { mode: 'custom', destinationPath, sourcePath, formats: [ '.txt' ] } );

	sinon.assert.calledOnceWithExactly( fileSystemMock.copyFile, `${ sourcePath }/foo.txt`, `${ destinationPath }/filename.txt` );

	t.pass();
} );

test( 'run(): Should respect provided format', async t => {
	const { engine, sourcePath, destinationPath, fileSystemMock } = t.context;

	fileSystemMock.readdir.resolves( [
		'foo.txt',
		'bar.jpg'
	] );

	await engine.run( { mode: 'custom', destinationPath, sourcePath, formats: '.txt' } );

	sinon.assert.calledOnceWithExactly( fileSystemMock.copyFile, `${ sourcePath }/foo.txt`, `${ destinationPath }/filename.txt` );

	t.pass();
} );

test( 'run(): Should skip files without extension', async t => {
	const { engine, sourcePath, destinationPath, fileSystemMock } = t.context;

	fileSystemMock.readdir.resolves( [
		'foo.txt',
		'bar.jpg',
		'baz'
	] );

	await engine.run( { mode: 'custom', destinationPath, sourcePath } );

	sinon.assert.calledTwice( fileSystemMock.copyFile );

	t.pass();
} );

test( 'run(): Should copy and rename files', async t => {
	const { engine, sourcePath, destinationPath, fileSystemMock } = t.context;

	fileSystemMock.readdir.resolves( [
		'foo.txt',
		'bar.jpg'
	] );

	await engine.run( { mode: 'custom', destinationPath, sourcePath } );

	sinon.assert.calledWithExactly( fileSystemMock.copyFile, `${ sourcePath }/foo.txt`, `${ destinationPath }/filename.txt` );
	sinon.assert.calledWithExactly( fileSystemMock.copyFile, `${ sourcePath }/bar.jpg`, `${ destinationPath }/filename.jpg` );

	t.pass();
} );
