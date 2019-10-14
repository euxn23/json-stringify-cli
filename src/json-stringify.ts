import prettier from 'prettier';

export function jsonStringify(jsObject: any, usePrettier: boolean): string {
  const str = JSON.stringify(jsObject);
  return usePrettier ? prettier.format(str, { parser: 'json' }) : str;
}
