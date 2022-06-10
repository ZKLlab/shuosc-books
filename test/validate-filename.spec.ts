import fs from 'fs';
import path from 'path';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeFilenameValid(prefix: string, prefixName: string): R;
    }
  }
}

expect.extend({
  toBeFilenameValid(received: string, prefix: string, prefixName: string) {
    const errors: string[] = [];
    const prefixValid = received.startsWith(`${prefix}__`);
    if (prefixValid) {
      const name = received.slice(prefix.length + 2, -5);
      if (name.startsWith('_') || name.includes('___')) {
        errors.push(`should not include more than two consecutive underscores`);
      }
      if (name.endsWith('_')) {
        errors.push(`should not end with underscore ("_")`);
      }
      if (!/^[\u4E00-\u9FA5A-Za-z\d_]+$/.test(name)) {
        errors.push(`should only contain simplified Chinese characters, ASCII letters, digits and underscores ("_")`);
      }
    } else {
      errors.push(`should start with ${prefixName} followed by two underscores ("__")`);
    }
    if (errors.length === 0) {
      return {
        message: () => `excepted filename ${received} not to be valid`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `excepted filename ${received} to be valid, messages:\n\n` + errors.map((x) => `- ${x}`).join('\n'),
        pass: false,
      };
    }
  },
});

describe('validate metadata filename', () => {
  const fileList: string[] = fs.readdirSync(path.join('data', 'metadata'));
  test.each(fileList.filter((x) => x.endsWith('.json')).map((x) => [x]))(
    'metadata filename "%s" should be valid',
    (filename) => {
      const file = fs.readFileSync(path.join('data', 'metadata', filename), 'utf-8');
      const data = JSON.parse(file);
      expect(filename).toBeFilenameValid(data.isbn, 'isbn');
    }
  );
});

describe('validate bookshelf filename', () => {
  const fileList: string[] = fs.readdirSync(path.join('data', 'bookshelf'));
  test.each(fileList.filter((x) => x.endsWith('.json')).map((x) => [x]))(
    'bookshelf filename "%s" should be valid',
    (filename) => {
      const file = fs.readFileSync(path.join('data', 'bookshelf', filename), 'utf-8');
      const data = JSON.parse(file);
      expect(filename).toBeFilenameValid(data.id, 'id');
    }
  );
});
