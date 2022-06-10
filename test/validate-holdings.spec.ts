import fs from 'fs';
import path from 'path';

interface Holding {
  code: string;
  isbn: string;
}

interface Bookshelf {
  holdings: Holding[];
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeUniqueByCode(): R;
    }
  }
}

expect.extend({
  toBeUniqueByCode(received: { countMap: Map<string, number>; nonUniqueSet: Set<string> }) {
    if (received.nonUniqueSet.size > 0) {
      const errors: string[] = [];
      received.nonUniqueSet.forEach((code) => {
        errors.push(`holding code "${code}" is duplicated ${received.countMap.get(code)} times`);
      });
      return {
        message: () => `excepted holding codes to be unique, messages:\n\n` + errors.map((x) => `- ${x}`).join('\n'),
        pass: false,
      };
    }
    return {
      message: () => `excepted holding codes not to be unique`,
      pass: true,
    };
  },
});

test('holdings should have unique code', () => {
  const fileList: string[] = fs.readdirSync(path.join('data', 'bookshelf'));
  fileList
    .filter((x) => x.endsWith('.json'))
    .forEach((filename) => {
      const file = fs.readFileSync(path.join('data', 'bookshelf', filename), 'utf-8');
      const data: Bookshelf = JSON.parse(file);
      const countMap = new Map<string, number>();
      const nonUniqueSet = new Set<string>();
      data.holdings.forEach(({ code }) => {
        const count = countMap.get(code) || 0;
        countMap.set(code, count + 1);
        if (count > 0) {
          nonUniqueSet.add(code);
        }
      });
      expect({ countMap, nonUniqueSet }).toBeUniqueByCode();
    });
});
