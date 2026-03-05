const parse = require("../src/parser.js").parse;

describe('Parser Failing Tests', () => {
  test('should handle multiplication and division before addition and subtraction', () => {
    expect(parse("2 + 3 * 4")).toBe(14); // 2 + (3 * 4) = 14
    expect(parse("10 - 6 / 2")).toBe(7); // 10 - (6 / 2) = 7
    expect(parse("5 * 2 + 3")).toBe(13); // (5 * 2) + 3 = 13
    expect(parse("20 / 4 - 2")).toBe(3); // (20 / 4) - 2 = 3
  });

  test('should handle multiplication and division before addition with more cases', () => {
    expect(parse("1 + 2 * 5")).toBe(11); // 1 + (2 * 5) = 11
    expect(parse("20 - 10 / 5")).toBe(18); // 20 - (10 / 5) = 18
    expect(parse("3 * 3 + 1")).toBe(10); // (3 * 3) + 1 = 10
    expect(parse("50 / 5 - 5")).toBe(5); // (50 / 5) - 5 = 5
  });
  test('should handle exponentiation with highest precedence', () => {
    expect(parse("2 + 3 ** 2")).toBe(11); // 2 + (3 ** 2) = 11
    expect(parse("2 * 3 ** 2")).toBe(18); // 2 * (3 ** 2) = 18
    expect(parse("10 - 2 ** 3")).toBe(2); // 10 - (2 ** 3) = 2
  });

  test('should handle exponentiation with arrow operator and highest precedence', () => {
    expect(parse("2 + 3 ↑ 2")).toBe(11); // 2 + (3 ↑ 2) = 11
    expect(parse("2 * 3 ↑ 2")).toBe(18); // 2 * (3 ↑ 2) = 18
    expect(parse("10 - 2 ↑ 3")).toBe(2); // 10 - (2 ↑ 3) = 2
  });

  test('should handle exponentiation with more precedence cases', () => {
    expect(parse("1 + 2 ** 3")).toBe(9); // 1 + (2 ** 3) = 9
    expect(parse("5 * 2 ** 2")).toBe(20); // 5 * (2 ** 2) = 20
    expect(parse("20 - 3 ** 2")).toBe(11); // 20 - (3 ** 2) = 11
  });
  test('should handle right associativity for exponentiation', () => {
    expect(parse("2 ** 3 ** 2")).toBe(512); // 2 ** (3 ** 2) = 2 ** 9 = 512
    expect(parse("3 ** 2 ** 2")).toBe(81); // 3 ** (2 ** 2) = 3 ** 4 = 81
  });

  test('should handle right associativity with arrow operator', () => {
    expect(parse("2 ↑ 3 ↑ 2")).toBe(512); // 2 ↑ (3 ↑ 2) = 2 ↑ 9 = 512
    expect(parse("3 ↑ 2 ↑ 2")).toBe(81); // 3 ↑ (2 ↑ 2) = 3 ↑ 4 = 81
  });

  test('should handle right associativity with more cases', () => {
    expect(parse("2 ** 2 ** 3")).toBe(256); // 2 ** (2 ** 3) = 2 ** 8 = 256
    expect(parse("4 ** 2 ** 2")).toBe(256); // 4 ** (2 ** 2) = 4 ** 4 = 256
  });
  test('should handle mixed operations with correct precedence', () => {
    expect(parse("1 + 2 * 3 - 4")).toBe(3); // 1 + (2 * 3) - 4 = 3
    expect(parse("15 / 3 + 2 * 4")).toBe(13); // (15 / 3) + (2 * 4) = 13
    expect(parse("10 - 3 * 2 + 1")).toBe(5); // 10 - (3 * 2) + 1 = 5
  });

  test('should handle mixed operations with more complex precedence', () => {
    expect(parse("2 + 3 * 4 - 5")).toBe(9); // 2 + 12 - 5 = 9
    expect(parse("20 / 4 + 3 * 2")).toBe(11); // (20/4) + (3*2) = 5 + 6 = 11
    expect(parse("5 - 2 * 2 + 1")).toBe(2); // 5 - 4 + 1 = 2
  });
  test('should handle expressions with exponentiation precedence', () => {
    expect(parse("2 ** 3 + 1")).toBe(9); // (2 ** 3) + 1 = 9
    expect(parse("3 + 2 ** 4")).toBe(19); // 3 + (2 ** 4) = 19
    expect(parse("2 * 3 ** 2 + 1")).toBe(19); // 2 * (3 ** 2) + 1 = 19
  });

  test('should handle expressions with exponentiation and arrow operator', () => {
    expect(parse("2 ↑ 3 + 1")).toBe(9); // (2 ↑ 3) + 1 = 9
    expect(parse("3 + 2 ↑ 4")).toBe(19); // 3 + (2 ↑ 4) = 19
    expect(parse("2 * 3 ↑ 2 + 1")).toBe(19); // 2 * (3 ↑ 2) + 1 = 19
  });

  test('should handle more exponentiation precedence cases', () => {
    expect(parse("5 ** 2 - 10")).toBe(15); // (5 ** 2) - 10 = 25 - 10 = 15
    expect(parse("2 + 3 ** 2 * 2")).toBe(20); // 2 + ((3 ** 2) * 2) = 2 + 18 = 20
  });
  test('should handle various realistic calculations with correct precedence', () => {
    expect(parse("1 + 2 * 3")).toBe(7); // 1 + (2 * 3) = 7
    expect(parse("6 / 2 + 4")).toBe(7); // (6 / 2) + 4 = 7
    expect(parse("2 ** 2 + 1")).toBe(5); // (2 ** 2) + 1 = 5
    expect(parse("10 / 2 / 5")).toBe(1); // (10 / 2) / 5 = 1
    expect(parse("100 - 50 + 25")).toBe(75); // (100 - 50) + 25 = 75
    expect(parse("2 * 3 + 4 * 5")).toBe(26); // (2 * 3) + (4 * 5) = 26
  });

  test('should handle more realistic calculations', () => {
    expect(parse("5 + 3 * 2")).toBe(11); // 5 + (3 * 2) = 11
    expect(parse("12 / 3 - 2")).toBe(2); // (12 / 3) - 2 = 2
    expect(parse("2 ** 4 - 6")).toBe(10); // (2 ** 4) - 6 = 10
    expect(parse("3 * 3 + 2 * 2")).toBe(13); // (3 * 3) + (2 * 2) = 13
    expect(parse("20 - 5 - 5")).toBe(10); // (20 - 5) - 5 = 10
  });

  test('should handle complex precedence chains', () => {
    expect(parse("1 + 2 * 3 ** 2")).toBe(19); // 1 + (2 * (3 ** 2)) = 1 + 18 = 19
    expect(parse("2 ** 3 * 2 + 1")).toBe(17); // ((2 ** 3) * 2) + 1 = 16 + 1 = 17
    expect(parse("10 / 2 + 3 * 4")).toBe(17); // (10/2) + (3*4) = 5 + 12 = 17
  });

  describe('Floating point number tests', () => {
    test('should handle additive operations with floats (left associative)', () => {
      expect(parse("2.5 + 3.5")).toBeCloseTo(6.0);
      expect(parse("10.5 - 2.5")).toBeCloseTo(8.0);
      expect(parse("1.5 + 2.5 + 3.5")).toBeCloseTo(7.5); // (1.5 + 2.5) + 3.5 = 7.5
      expect(parse("10.5 - 3.5 - 2.0")).toBeCloseTo(5.0); // (10.5 - 3.5) - 2.0 = 5.0
    });

    test('should handle more additive operations with floats', () => {
      expect(parse("1.1 + 2.2")).toBeCloseTo(3.3);
      expect(parse("5.5 - 1.5")).toBeCloseTo(4.0);
      expect(parse("0.5 + 0.5 + 0.5")).toBeCloseTo(1.5);
      expect(parse("10.0 - 2.5 - 2.5")).toBeCloseTo(5.0);
    });

    test('should handle multiplicative operations with floats (left associative)', () => {
      expect(parse("2.5 * 4.0")).toBeCloseTo(10.0);
      expect(parse("10.0 / 2.5")).toBeCloseTo(4.0);
      expect(parse("8.0 / 2.0 / 2.0")).toBeCloseTo(2.0); // (8.0 / 2.0) / 2.0 = 2.0
      expect(parse("2.5 * 2.0 * 2.0")).toBeCloseTo(10.0); // (2.5 * 2.0) * 2.0 = 10.0
    });

    test('should handle more multiplicative operations with floats', () => {
      expect(parse("1.5 * 2.0")).toBeCloseTo(3.0);
      expect(parse("9.0 / 3.0")).toBeCloseTo(3.0);
      expect(parse("6.0 / 2.0 / 3.0")).toBeCloseTo(1.0); // (6.0 / 2.0) / 3.0 = 1.0
      expect(parse("0.5 * 0.5 * 4.0")).toBeCloseTo(1.0); // (0.5 * 0.5) * 4.0 = 1.0
    });

    test('should handle exponentiation with floats (right associative)', () => {
      expect(parse("2.0 ** 3.0")).toBeCloseTo(8.0);
      expect(parse("2.0 ** 2.0 ** 3.0")).toBeCloseTo(256.0); // 2.0 ** (2.0 ** 3.0) = 2.0 ** 8.0 = 256.0
      expect(parse("3.0 ** 2.0 ** 2.0")).toBeCloseTo(81.0); // 3.0 ** (2.0 ** 2.0) = 3.0 ** 4.0 = 81.0
    });

    test('should handle more exponentiation with floats', () => {
      expect(parse("1.5 ** 2.0")).toBeCloseTo(2.25);
      expect(parse("2.5 ** 2.0")).toBeCloseTo(6.25);
      expect(parse("2.0 ↑ 3.0")).toBeCloseTo(8.0);
      expect(parse("2.0 ↑ 2.0 ↑ 3.0")).toBeCloseTo(256.0); // 2.0 ↑ (2.0 ↑ 3.0) = 256.0
    });

    test('should handle mixed operations with floats respecting precedence', () => {
      expect(parse("2.5 + 3.0 * 2.0")).toBeCloseTo(8.5); // 2.5 + (3.0 * 2.0) = 8.5
      expect(parse("10.0 - 6.0 / 2.0")).toBeCloseTo(7.0); // 10.0 - (6.0 / 2.0) = 7.0
      expect(parse("2.0 + 3.0 ** 2.0")).toBeCloseTo(11.0); // 2.0 + (3.0 ** 2.0) = 11.0
      expect(parse("2.5 * 3.0 ** 2.0")).toBeCloseTo(22.5); // 2.5 * (3.0 ** 2.0) = 22.5
    });

    test('should handle more mixed operations with floats', () => {
      expect(parse("1.5 + 2.5 * 2.0")).toBeCloseTo(6.5); // 1.5 + (2.5 * 2.0) = 6.5
      expect(parse("8.0 - 4.0 / 2.0")).toBeCloseTo(6.0); // 8.0 - (4.0 / 2.0) = 6.0
      expect(parse("1.0 + 2.0 ** 3.0")).toBeCloseTo(9.0); // 1.0 + (2.0 ** 3.0) = 9.0
      expect(parse("3.5 * 2.0 ** 2.0")).toBeCloseTo(14.0); // 3.5 * (2.0 ** 2.0) = 14.0
    });

    test('should handle scientific notation with proper precedence', () => {
      expect(parse("1e1 + 2e1 * 2e0")).toBeCloseTo(50.0); // 10 + (20 * 2) = 50
      expect(parse("1e2 - 5e1")).toBeCloseTo(50.0); // 100 - 50 = 50
      expect(parse("2e0 ** 1e1")).toBeCloseTo(1024.0); // 2 ** 10 = 1024
    });

    test('should handle more scientific notation with precedence', () => {
      expect(parse("2e1 + 3e0 * 2e0")).toBeCloseTo(26.0); // 20 + (3 * 2) = 26
      expect(parse("1e3 / 1e2")).toBeCloseTo(10.0); // 1000 / 100 = 10
      expect(parse("3e0 ** 2e0")).toBeCloseTo(9.0); // 3 ** 2 = 9
    });

    test('should handle complex expressions with floats', () => {
      expect(parse("1.5 + 2.5 * 3.0 - 2.0")).toBeCloseTo(7.0); // 1.5 + (2.5 * 3.0) - 2.0 = 7.0
      expect(parse("15.0 / 3.0 + 2.0 * 4.5")).toBeCloseTo(14.0); // (15.0 / 3.0) + (2.0 * 4.5) = 14.0
      expect(parse("2.0 ** 3.0 + 1.5")).toBeCloseTo(9.5); // (2.0 ** 3.0) + 1.5 = 9.5
    });

    test('should handle more complex expressions with floats', () => {
      expect(parse("2.5 + 3.5 * 2.0 - 1.0")).toBeCloseTo(8.5); // 2.5 + (3.5 * 2.0) - 1.0 = 2.5 + 7.0 - 1.0 = 8.5
      expect(parse("20.0 / 4.0 + 1.5 * 3.0")).toBeCloseTo(9.5); // (20.0/4.0) + (1.5*3.0) = 5.0 + 4.5 = 9.5
      expect(parse("3.0 ** 2.0 - 2.5")).toBeCloseTo(6.5); // (3.0 ** 2.0) - 2.5 = 9.0 - 2.5 = 6.5
    });

    test('should handle edge cases with floats and all operators', () => {
      expect(parse("1.0 + 2.0 * 3.0 ** 2.0")).toBeCloseTo(19.0); // 1.0 + (2.0 * (3.0 ** 2.0)) = 1.0 + 18.0 = 19.0
      expect(parse("2.0 ↑ 3.0 * 2.0 + 1.5")).toBeCloseTo(17.5); // ((2.0 ↑ 3.0) * 2.0) + 1.5 = 16.0 + 1.5 = 17.5
    });
  });
});
