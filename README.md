# What is MFR?

MFR stands for Mass File Rename. It's a Node.js tool to rename all files inside the selected directory.

## Usage

The simplest usage of MFR looks as in the code sample:

```javascript
import MFR from 'mfr';

const mfr = new MFR();

await mfr.run( options );
```

MFR also supports TypeScript:

```typescript

import MFR from 'mfr';

const mfr: MFR = new MFR();

await mfr.run( options );
```

## Options

MFR needs to be configured to work properly:

* **REQUIRED**: `mode: string` - determines the library mode. Basically, there are 2 modes:
    * `random` - file names are [uuid]( https://en.wikipedia.org/wiki/Universally_unique_identifier )s,
	* `string` - file names base on the provided `pattern`.
* **REQUIRED**: `sourcePath: string` - the path to the source directory.
* **REQUIRED**: `destinationPath: string` - the destination path. The directory will be created if not exists.
* **OPTIONAL**: `formats: string | string[]` - the file format or array of formats. Only files with provided formats will be renamed. If not provided, all files will be renamed.
* **OPTIONAL**: `pattern: string` - the pattern for the `string` mode. **REQUIRED** if the `string` is selected.
* **OPTIONAL**: `appendix: 'prefix' | 'postfix' | 'all' | 'none'` - determines if generated names should have prefixes and postfixes. Basically set to `none`.
* **OPTIONAL**: `prefixPattern: string | function` - pattern for the prefix. **REQUIRED** if the `appendix` option is set to `prefix` or `all`.
* **OPTIONAL**: `postfixPattern: string | function` - pattern for the postfix. **REQUIRED** if the `appendix` option is set to `postfix` or `all`.

## Custom drivers and generators

To create an additional MFR behavior or modify the existing one, you can use drivers and generators.

Generators are responsible for returning only the core file name, without prefixes and postfixes.

```typescript
import { IGenerator, IOptions } from 'mfr';

class CustomGenerator implements IGenerator {
	// Options are available as a constructor parameter.
	public constructor( private readonly _options: IOptions ) {}

	public generate(): string {}
}
```

Drivers should use generators for creating the full file name ( without extension ) with a prefix and a postfix.
Also, additional input/options validation should be added here.

```typescript
import { Driver, IGenerator, IOptions, IDriver } from 'mfr';

// If you'd like to keep the original appendix validation mechanism extend the Driver class.
// Otherwise, extend the IDriver interface.
export default class CustomDriver extends Driver {
	// Specify a unique driver name.
	public static driverName: string = 'custom';

	public constructor(
		// Generatoris available as the first constructor parameter.
		generator: IGenerator,
		// Options are available as the second constructor parameter.
		options: IOptions
	) {
		super( generator, options );
	}

	// The method should return the full file name without the extension.
	public getFilename(): string {}
}
```

You can also add custom properties to the provided `options` if you need.

After creating your custom driver and generator, you need to provide it to MFR.

```typescript
import MFR from 'mfr';

import { CustomGenerator, CustomDriver } from './some-destination';

const mfr: MFR = new MFR( [ { driver: CustomDriver, generator: CustomGenerator } ] );

await mfr.run( { mode: 'custom' } );
```

You can also use custom file system instead of the native Node.js module.

```typescript
import MFR from 'mfr';

import customFileSystem from './some-destination';

const mfr: MFR = new MFR( [], customFileSystem );
```
## CLI

MFR supports also the CLI version. To run MFR in the CLI mode install it first using `npm install -g mfr`.
Then you will be able to run MFR via the `mfr` command:

```
Usage: -m <mode> -s <source> -d <destination>

Options:
      --help            Show help                                      [boolean]
      --version         Show version number                            [boolean]
  -m, --mode            Application mode                     [string] [required]
  -s, --source          Source path                          [string] [required]
  -d, --destination     Destiatnion path                     [string] [required]
  -f, --formats         Handled formats                                  [array]
  -p, --pattern         Pattern                                         [string]
  -a, --appendix        Appendix                                        [string]
      --pre, --prefix   Prefix pattern                                  [string]
      --pos, --postfix  Prefix patern                                   [string]
```

---

Noticed a bug or a problem? Report it on [GitHub repository](https://github.com/elszczepano/mfr/issues).
Before contribute please check the `CONTRIBUTING.md` file.
