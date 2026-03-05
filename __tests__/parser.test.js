/**
 * Jest tests for the Jison parser
 * 
 */
const parse = require("../src/parser.js").parse;

describe('Parser Tests', () => {
  describe('Basic number parsing', () => {
    test('should parse single numbers', () => {
      expect(parse("42")).toBe(42);
      expect(parse("0")).toBe(0);
      expect(parse("123")).toBe(123);
    });

    test('should parse single numbers with varied values', () => {
      expect(parse("1")).toBe(1);
      expect(parse("999")).toBe(999);
      expect(parse("5")).toBe(5);
    });

    test('should parse floats and scientific notation', () => {
      expect(parse("2.35")).toBeCloseTo(2.35);
      expect(parse("2.35e-3")).toBeCloseTo(0.00235);
      expect(parse("2.35e+3")).toBeCloseTo(2350);
      expect(parse("2.35E-3")).toBeCloseTo(0.00235);
      expect(parse("23")).toBe(23); // integer still works
    });

    test('should parse various float formats', () => {
      expect(parse("0.5")).toBeCloseTo(0.5);
      expect(parse("1.5")).toBeCloseTo(1.5);
      expect(parse("3.14159")).toBeCloseTo(3.14159);
      expect(parse("1e5")).toBeCloseTo(100000);
      expect(parse("5E-2")).toBeCloseTo(0.05);
    });
  });

  describe('Basic arithmetic operations', () => {
    test('should handle addition', () => {
      expect(parse("3 + 5")).toBe(8);
      expect(parse("10 + 20")).toBe(30);
      expect(parse("0 + 1")).toBe(1);
    });

    test('should handle addition with various values', () => {
      expect(parse("1 + 1")).toBe(2);
      expect(parse("100 + 50")).toBe(150);
      expect(parse("2 + 3 + 4")).toBe(9);
    });

    test('should handle subtraction', () => {
      expect(parse("10 - 3")).toBe(7);
      expect(parse("1 - 2")).toBe(-1);
      expect(parse("0 - 5")).toBe(-5);
    });

    test('should handle subtraction with various values', () => {
      expect(parse("5 - 2")).toBe(3);
      expect(parse("100 - 1")).toBe(99);
      expect(parse("0 - 0")).toBe(0);
    });

    test('should handle multiplication', () => {
      expect(parse("3 * 4")).toBe(12);
      expect(parse("7 * 8")).toBe(56);
      expect(parse("0 * 10")).toBe(0);
    });

    test('should handle multiplication with various values', () => {
      expect(parse("2 * 2")).toBe(4);
      expect(parse("5 * 5")).toBe(25);
      expect(parse("10 * 1")).toBe(10);
    });

    test('should handle division', () => {
      expect(parse("15 / 3")).toBe(5);
      expect(parse("20 / 4")).toBe(5);
      expect(parse("1 / 2")).toBe(0.5);
    });

    test('should handle division with various values', () => {
      expect(parse("10 / 2")).toBe(5);
      expect(parse("8 / 4")).toBe(2);
      expect(parse("3 / 4")).toBeCloseTo(0.75);
    });

    test('should handle exponentiation', () => {
      expect(parse("2 ** 3")).toBe(8);
      expect(parse("3 ** 2")).toBe(9);
      expect(parse("5 ** 0")).toBe(1);
      expect(parse("10 ** 1")).toBe(10);
    });

    test('should handle exponentiation with arrow operator', () => {
      expect(parse("2 ↑ 3")).toBe(8);
      expect(parse("3 ↑ 2")).toBe(9);
      expect(parse("4 ↑ 2")).toBe(16);
      expect(parse("2 ↑ 10")).toBe(1024);
    });

    test('should handle exponentiation with various values', () => {
      expect(parse("2 ** 4")).toBe(16);
      expect(parse("2 ** 5")).toBe(32);
      expect(parse("10 ** 2")).toBe(100);
    });
  });

  describe('Operator precedence and associativity', () => {
    test('should handle left associativity for same precedence operations', () => {
      expect(parse("10 - 4 - 3")).toBe(3); // (10 - 4) - 3 = 3
      expect(parse("7 - 5 - 1")).toBe(1);  // (7 - 5) - 1 = 1
      expect(parse("20 / 4 / 2")).toBe(2.5); // (20 / 4) / 2 = 2.5
      expect(parse("8 / 2 / 2")).toBe(2);   // (8 / 2) / 2 = 2
    });

    test('should handle left associativity with addition/subtraction chains', () => {
      expect(parse("5 + 3 - 2")).toBe(6); // (5 + 3) - 2 = 6
      expect(parse("20 - 5 - 5")).toBe(10); // (20 - 5) - 5 = 10
      expect(parse("1 + 2 + 3 + 4 + 5")).toBe(15); // left-to-right
    });

    test('should handle right associativity for exponentiation', () => {
      expect(parse("2 ** 3 ** 2")).toBe(512); // 2 ** (3 ** 2) = 2 ** 9 = 512
      expect(parse("2 ↑ 3 ↑ 2")).toBe(512); // 2 ↑ (3 ↑ 2) = 2 ↑ 9 = 512
      expect(parse("3 ** 2 ** 2")).toBe(81); // 3 ** (2 ** 2) = 3 ** 4 = 81
    });
  });

  describe('Complex expressions', () => {
    test('should handle multiple operations of same precedence', () => {
      expect(parse("1 + 2 + 3 + 4")).toBe(10);    // ((1 + 2) + 3) + 4 = 10
      expect(parse("2 * 3 * 4")).toBe(24);        // (2 * 3) * 4 = 24
      expect(parse("100 - 20 - 10 - 5")).toBe(65); // ((100 - 20) - 10) - 5 = 65
    });

    test('should handle very long expression chains', () => {
      expect(parse("1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1")).toBe(10);
      expect(parse("2 * 2 * 2 * 2")).toBe(16); // (((2 * 2) * 2) * 2) = 16
      expect(parse("100 - 10 - 10 - 10 - 10")).toBe(60);
    });

    test('should handle mixed precedence with multiple chains', () => {
      expect(parse("1 + 2 * 3 + 4")).toBe(11); // 1 + (2 * 3) + 4 = 11
      expect(parse("2 * 3 + 4 * 5 + 6")).toBe(32); // (2 * 3) + (4 * 5) + 6 = 32
    });
  });

  describe('Edge cases', () => {
    test('should handle expressions with extra whitespace', () => {
      expect(parse("  3   +   5  ")).toBe(8);
      expect(parse("\t2\t*\t4\t")).toBe(8);
      expect(parse("1+2")).toBe(3);  // no spaces
    });

    test('should handle expressions with various whitespace patterns', () => {
      expect(parse("10  -  3")).toBe(7);
      expect(parse("  100  /  2  ")).toBe(50);
      expect(parse("2**3")).toBe(8); // no spaces with operator
    });

    test('should ignore single-line comments', () => {
      expect(parse("1 + 2 // add two numbers")).toBe(3);
      expect(parse("5//comment")).toBe(5);
      expect(parse("2 * 3 // 6\n+ 1")).toBe(7); // comment ends at newline
    });

    test('should handle comments in various positions', () => {
      expect(parse("10 - 3 // subtract 3")).toBe(7);
      expect(parse("// comment\n5")).toBe(5); // comment at start, then expression
      expect(parse("3 + 4 // this is a comment")).toBe(7);
    });

    test('should handle zero in operations', () => {
      expect(parse("0 + 0")).toBe(0);
      expect(parse("0 - 0")).toBe(0);
      expect(parse("0 * 100")).toBe(0);
      expect(parse("5 + 0")).toBe(5);
      expect(parse("10 - 0")).toBe(10);
    });

    test('should handle zero with more operations', () => {
      expect(parse("0 * 0")).toBe(0);
      expect(parse("100 + 0")).toBe(100);
      expect(parse("50 - 0")).toBe(50);
      expect(parse("0 + 5 + 10")).toBe(15);
    });

    test('should handle division by zero', () => {
      expect(parse("5 / 0")).toBe(Infinity);
      expect(parse("0 / 0")).toBe(NaN);
    });

    test('should handle division by zero in expressions', () => {
      expect(parse("10 / 0")).toBe(Infinity);
      expect(parse("1 / 0 + 5")).toBe(Infinity);
    });

    test('should handle negative results', () => {
      expect(parse("3 - 5")).toBe(-2);
      expect(parse("0 - 10")).toBe(-10);
      expect(parse("2 * 3 - 10")).toBe(-4);  // (2 * 3) - 10 = -4
    });

    test('should handle more negative results', () => {
      expect(parse("5 - 10")).toBe(-5);
      expect(parse("1 - 1 - 1")).toBe(-1); // (1 - 1) - 1 = -1
      expect(parse("0 - 0 - 5")).toBe(-5);
    });

    test('should handle decimal results', () => {
      expect(parse("5 / 2")).toBe(2.5);
      expect(parse("7 / 4")).toBe(1.75);
      expect(parse("1 / 3")).toBeCloseTo(0.3333333333333333);
    });

    test('should handle more decimal results', () => {
      expect(parse("1 / 4")).toBe(0.25);
      expect(parse("3 / 2")).toBeCloseTo(1.5);
      expect(parse("10 / 3")).toBeCloseTo(3.3333333333333333);
    });

    test('should handle large numbers', () => {
      expect(parse("999 + 1")).toBe(1000);
      expect(parse("1000000 / 1000")).toBe(1000);
      expect(parse("99 ** 2")).toBe(9801);
    });

    test('should handle more large numbers', () => {
      expect(parse("5000 + 5000")).toBe(10000);
      expect(parse("100000 / 10")).toBe(10000);
      expect(parse("10 ** 3")).toBe(1000);
    });
  });

  describe('Input validation and error cases', () => {
    test('should handle invalid input gracefully', () => {
      // These should throw errors or be handled by the parser
      expect(() => parse("")).toThrow();
      expect(() => parse("abc")).toThrow();
      expect(() => parse("3 +")).toThrow();
      expect(() => parse("+ 3")).toThrow();
      expect(() => parse("3 + + 4")).toThrow();
      // decimal numbers are now supported, so this should not throw
      expect(parse("3.5")).toBeCloseTo(3.5);
    });

    test('should handle more invalid input cases', () => {
      expect(() => parse("2 *")).toThrow();
      expect(() => parse("/ 10")).toThrow();
      expect(() => parse("5 ** ")).toThrow();
      expect(() => parse("1 2 3")).toThrow(); // Missing operators
    });

    test('should handle incomplete expressions', () => {
      expect(() => parse("3 +")).toThrow();
      expect(() => parse("* 5")).toThrow();
      expect(() => parse("3 4")).toThrow(); // Missing operator
    });

    test('should handle more incomplete expressions', () => {
      expect(() => parse("5 -")).toThrow();
      expect(() => parse("2 ** ")).toThrow();
      expect(() => parse("( 5 )")).toThrow(); // Parentheses not supported yet
    });
  });

  describe('Regression tests', () => {
    test('should match examples from index.js', () => {
      expect(parse("1 - 2")).toBe(-1);
      expect(parse("10 - 4 - 3")).toBe(3);
      expect(parse("7 - 5 - 1")).toBe(1);
    });

    test('should handle mixed integer and float operations', () => {
      expect(parse("2 + 3.5")).toBeCloseTo(5.5);
      expect(parse("10.5 - 2")).toBeCloseTo(8.5);
      expect(parse("3 * 2.5")).toBeCloseTo(7.5);
      expect(parse("8 / 2.0")).toBe(4);
    });

    test('should handle all operators together', () => {
      expect(parse("2 + 3 * 4 - 5 / 2 ** 2")).toBeCloseTo(12.75); // 2 + (3 * 4) - (5 / (2 ** 2)) = 2 + 12 - 1.25 = 12.75
      expect(parse("1 + 2 * 3 - 4 / 2")).toBeCloseTo(5); // 1 + (2 * 3) - (4 / 2) = 1 + 6 - 2 = 5
      expect(parse("10 / 2 + 3 ** 2 - 1")).toBeCloseTo(13); // (10 / 2) + (3 ** 2) - 1 = 5 + 9 - 1 = 13
    });
  });

});