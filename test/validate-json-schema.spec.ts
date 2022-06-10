import fs from 'fs';
import path from 'path';
import Ajv, { ValidateFunction } from 'ajv';
import betterAjvErrors from 'better-ajv-errors';
import metadataSchema from '../schema/metadata.schema.json';
import bookshelfSchema from '../schema/bookshelf.schema.json';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidByJsonSchema(validateFn: ValidateFunction): R;
    }
  }
}

const ajv = new Ajv({ allErrors: true });
const validateMetadata = ajv.compile(metadataSchema);
const validateBookshelf = ajv.compile(bookshelfSchema);

expect.extend({
  toBeValidByJsonSchema(received: string, validateFn: ValidateFunction) {
    const data = JSON.parse(received);
    const valid = validateFn(data);
    if (valid) {
      return {
        message: () => `excepted data not to be valid`,
        pass: true,
      };
    } else {
      const output = betterAjvErrors(metadataSchema, data, validateMetadata.errors || [], { indent: 2 });
      return {
        message: () => `excepted data to be valid\n\n${output}`,
        pass: false,
      };
    }
  },
});

describe('validate metadata data using json schema', () => {
  const fileList: string[] = fs.readdirSync(path.join('data', 'metadata'));
  test.each(fileList.filter((x) => x.endsWith('.json')).map((x) => [x]))(
    'metadata file "%s" should be valid',
    (filename) => {
      const file = fs.readFileSync(path.join('data', 'metadata', filename), 'utf-8');
      expect(file).toBeValidByJsonSchema(validateMetadata);
    }
  );
});

describe('validate bookshelf data using json schema', () => {
  const fileList: string[] = fs.readdirSync(path.join('data', 'bookshelf'));
  test.each(fileList.filter((x) => x.endsWith('.json')).map((x) => [x]))(
    'bookshelf file "%s" should be valid',
    (filename) => {
      const file = fs.readFileSync(path.join('data', 'bookshelf', filename), 'utf-8');
      expect(file).toBeValidByJsonSchema(validateBookshelf);
    }
  );
});
