import compare from './compare';

describe('測試 String', () => {
  test('1 vs b', () => {
    const result = compare('1', 'b');
    const ans = false;
    expect(result).toEqual(ans);
  });

  test('b vs b', () => {
    const result = compare('b', 'b');
    const ans = true;
    expect(result).toEqual(ans);
  });
});

describe('測試 Number', () => {
  test('1 vs -1 ', () => {
    const result = compare(1, -1);
    const ans = false;
    expect(result).toEqual(ans);
  });

  test('0 vs 0 ', () => {
    const result = compare(0, 0);
    const ans = true;
    expect(result).toEqual(ans);
  });

  test('NaN vs NaN ', () => {
    const result = compare(NaN, NaN);
    const ans = true;
    expect(result).toEqual(ans);
  });
});

describe('測試 Array', () => {
  test('[1,2,3] vs [1,2,3] ', () => {
    const result = compare([1, 2, 3], [1, 2, 3]);
    const ans = true;
    expect(result).toEqual(ans);
  });

  test('[2,2,3] vs [1,2,3] ', () => {
    const result = compare([2, 2, 3], [1, 2, 3]);
    const ans = false;
    expect(result).toEqual(ans);
  });
});

describe('測試 Object', () => {
  test('{b: 2, a: 1} vs {a: 1, b: 2} ', () => {
    const result = compare({ b: 2, a: 1 }, { a: 1, b: 2 });
    const ans = true;
    expect(result).toEqual(ans);
  });

  test('{b: 1, a: 2} vs {a: 1, b: 2} ', () => {
    const result = compare({ b: 1, a: 2 }, { a: 1, b: 2 });
    const ans = false;
    expect(result).toEqual(ans);
  });

  test('{b: 1, a: 2, c: { e: 1 }} vs {b: 1, a: 2, c: { e: 1 }} ', () => {
    const result = compare({ b: 1, a: 2, c: { e: 1 } }, { b: 1, a: 2, c: { e: 1 } });
    const ans = false;
    expect(result).toEqual(ans);
  });
});

describe('測試 Function', () => {
  test('fn1 vs fn1 ', () => {
    const fn1 = () => {};
    const result = compare(fn1, fn1);
    const ans = true;
    expect(result).toEqual(ans);
  });

  test('fn1 vs fn2 ', () => {
    const fn1 = () => {};
    const fn2 = () => {};
    const result = compare(fn1, fn2);
    const ans = false;
    expect(result).toEqual(ans);
  });
});

describe('測試 Object vs Array', () => {
  test('[1,2,3] vs {0:1, 1:2, 2:3} ', () => {
    const result = compare([1, 2, 3], { 0: 1, 1: 2, 2: 3 });
    const ans = false;
    expect(result).toEqual(ans);
  });
});

describe('測試 String (Deep)', () => {
  test('1 vs b', () => {
    const result = compare('1', 'b', true);
    const ans = false;
    expect(result).toEqual(ans);
  });

  test('b vs b', () => {
    const result = compare('b', 'b', true);
    const ans = true;
    expect(result).toEqual(ans);
  });
});

describe('測試 Number  (Deep)', () => {
  test('1 vs -1', () => {
    const result = compare(1, -1, true);
    const ans = false;
    expect(result).toEqual(ans);
  });

  test('0 vs 0', () => {
    const result = compare(0, 0, true);
    const ans = true;
    expect(result).toEqual(ans);
  });

  test('NaN vs NaN', () => {
    const result = compare(NaN, NaN);
    const ans = true;
    expect(result).toEqual(ans);
  });
});

describe('測試 Array (Deep)', () => {
  test('[1,2,3] vs [1,2,3] ', () => {
    const result = compare([1, 2, 3], [1, 2, 3], true);
    const ans = true;
    expect(result).toEqual(ans);
  });

  test('[2,2,3] vs [1,2,3] ', () => {
    const result = compare([2, 2, 3], [1, 2, 3], true);
    const ans = false;
    expect(result).toEqual(ans);
  });

  test('[[[1],2,3],2,3] vs [[[1],2,3],2,3] ', () => {
    const result = compare([[[1], 2, 3], 2, 3], [[[1], 2, 3], 2, 3], true);
    const ans = true;
    expect(result).toEqual(ans);
  });

  test('[[[2],2,3],2,3] vs [[[1],2,3],2,3] ', () => {
    const result = compare([[[2], 2, 3], 2, 3], [[[1], 2, 3], 2, 3], true);
    const ans = false;
    expect(result).toEqual(ans);
  });

  test('[[1,2,3],2,3] vs [[[1],2,3],2,3] ', () => {
    const result = compare([[1, 2, 3], 2, 3], [[[1], 2, 3], 2, 3], true);
    const ans = false;
    expect(result).toEqual(ans);
  });
});

describe('測試 Object  (Deep)', () => {
  test('{b: 2, a: 1} vs {a: 1, b: 2} ', () => {
    const result = compare({ b: 2, a: 1 }, { a: 1, b: 2 }, true);
    const ans = true;
    expect(result).toEqual(ans);
  });

  test('{b: 1, a: 2} vs {a: 1, b: 2} ', () => {
    const result = compare({ b: 1, a: 2 }, { a: 1, b: 2 }, true);
    const ans = false;
    expect(result).toEqual(ans);
  });

  test('{b: {c: 1, d: { e: 5}}, a: 1} vs {a: 1, b: {c: 1, d: { e: 5}}} ', () => {
    const result = compare({ b: { c: 1, d: { e: 5 } }, a: 1 }, { a: 1, b: { c: 1, d: { e: 5 } } }, true);
    const ans = true;
    expect(result).toEqual(ans);
  });

  test('{a: {c: 1, d: { e: 5}}, b: 1} vs {a: 1, b: {c: 1, d: { e: 5}}} ', () => {
    const result = compare({ a: { c: 1, d: { e: 5 } }, b: 1 }, { a: 1, b: { c: 1, d: { e: 5 } } }, true);
    const ans = false;
    expect(result).toEqual(ans);
  });
});

describe('測試 Function (Deep)', () => {
  test('fn1 vs fn1 ', () => {
    const fn1 = () => {};
    const result = compare(fn1, fn1, true);
    const ans = true;
    expect(result).toEqual(ans);
  });

  test('fn1 vs fn2 ', () => {
    const fn1 = () => {};
    const fn2 = () => {};
    const result = compare(fn1, fn2, true);
    const ans = false;
    expect(result).toEqual(ans);
  });
});
