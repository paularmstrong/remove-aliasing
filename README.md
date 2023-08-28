# remove-aliasing

Remove import path aliasing from your application.

## Usage

```sh
npx remove-aliasing [options] <directory>
```

## Example

```sh
npx remove-aliasing@latest --root="src/" --prefix="@/" src/
```

### Input

```tsx
import { Foo } from '~/components/Foo';
import * as Bar from '~/api/shared/services/bar';
```

### Output

```tsx
import { Foo } from '../../components/Foo';
import * as Bar from '../../api/shared/services/bar';
```

## Options

| Option        | Alias | Type      | Description                                                    | Required |
| ------------- | ----- | --------- | -------------------------------------------------------------- | -------- |
| `--root`      | `-r`  | `string`  | Directory that serves as the root of aliased files             | ✅       |
| `--prefix`    | `-p`  | `string`  | Import path prefix, if any                                     |          |
| `--parser`    |       | `string`  | Parser to use when reading files. Default `tsx`                |          |
| `--dry-run`   |       | `boolean` | Do not actually write, just see what will happen               |          |
| `--verbosity` | `-v`  | `number`  | Show more information about the transform process. Default `0` |          |
| `--version`   |       |           | Show the program version                                       |          |

## License

MIT License

Copyright (c) 2023 Paul Armstrong

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
