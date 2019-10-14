import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { jsonStringify } from './json-stringify';

const VERSION = '1.0.0';

const helpMessage = `\
Usage:
  $ json-stringify <input>: stringify default exported object of \`input\` .js file

Options:
  --raw, -r: output raw json file (not formatted)
  --out, -o: specify output path
  --stdout : output to stdout
`;

function help() {
  console.log(helpMessage);
  process.exit(1);
}

function version() {
  console.log(VERSION);
  process.exit(1);
}

export async function main() {
  const { argv } = yargs.options({
    v: { type: 'boolean', alias: 'version', default: false },
    h: { type: 'boolean', alias: 'help', default: false },
    r: { type: 'boolean', alias: 'raw', default: false },
    o: { type: 'string', alias: 'out' },
    stdout: { type: 'boolean', default: false }
  });

  if (argv.v) {
    version();
  }

  if (argv._.length !== 1 || argv.h) {
    help();
  }

  const readFile = path.relative(__dirname, path.resolve(process.cwd(), argv._[0]));
  const basename =
    readFile.slice(-3) === '.ts'
      ? path.basename(readFile, '.ts')
      : path.basename(readFile, '.js');

  const usePrettier = !argv.r;
  const outputPath = argv.o || `${basename}.json`;

  const jsObject = require(readFile);

  const jsonString = jsonStringify(jsObject, usePrettier);

  if (argv.stdout) {
    process.stdout.write(jsonString);
  } else {
    await new Promise((resolve, reject) => {
      fs.writeFile(outputPath, jsonString, e => {
        if (e) {
          reject(e);
        }
        resolve();
      });
    });
  }
}
