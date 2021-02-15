import { add, sub } from './counter';

describe('測試增加', () => {
  test('1+1', () => {
    const result = add(1);
    const ans = 2;
    expect(result).toEqual(ans);
  });

  test('10+1', () => {
    const result = add(10);
    const ans = 11;
    expect(result).toEqual(ans);
  });
});

describe('測試減少', () => {
  test('1-1', () => {
    const result = sub(1);
    const ans = 0;
    expect(result).toEqual(ans);
  });

  test('10-1', () => {
    const result = sub(10);
    const ans = 9;
    expect(result).toEqual(ans);
  });
});
