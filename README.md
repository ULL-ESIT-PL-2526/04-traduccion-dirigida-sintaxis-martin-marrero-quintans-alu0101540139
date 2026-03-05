Martín José Marrero Quintans


# Syntax Directed Translation with Jison

Jison is a tool that receives as input a Syntax Directed Translation and produces as output a JavaScript parser  that executes
the semantic actions in a bottom up ortraversing of the parse tree.
 

## Compile the grammar to a parser

See file [grammar.jison](./src/grammar.jison) for the grammar specification. To compile it to a parser, run the following command in the terminal:
``` 
➜  jison git:(main) ✗ npx jison grammar.jison -o parser.js
```

## Use the parser

After compiling the grammar to a parser, you can use it in your JavaScript code. For example, you can run the following code in a Node.js environment:

```
➜  jison git:(main) ✗ node                                
Welcome to Node.js v25.6.0.
Type ".help" for more information.
> p = require("./parser.js")
{
  parser: { yy: {} },
  Parser: [Function: Parser],
  parse: [Function (anonymous)],
  main: [Function: commonjsMain]
}
> p.parse("2*3")
6
```

## Theoric questions:

### Question 1: Analysis of three arithmetic expressions

Given the grammar for syntax-directed translation, analyze the following three phrases:
- `4.0-2.0*3.0`
- `2**3**2`
- `7-4/2`

#### 1.1 Derivations

**Expression 1: `4.0-2.0*3.0`**

```
expressions
  ⇒ expression EOF
  ⇒ expression OP term EOF
  ⇒ expression OP NUMBER EOF      (term ⇒ NUMBER)
  ⇒ expression OP 3.0 EOF
  ⇒ (expression OP term) OP 3.0 EOF
  ⇒ (expression OP NUMBER) OP 3.0 EOF  (term ⇒ NUMBER)
  ⇒ (expression OP 2.0) OP 3.0 EOF
  ⇒ (expression OP term) OP 2.0 OP 3.0 EOF
  ⇒ (expression OP NUMBER) OP 2.0 OP 3.0 EOF  (term ⇒ NUMBER)
  ⇒ (term OP NUMBER) OP 2.0 OP 3.0 EOF
  ⇒ (NUMBER OP NUMBER) OP 2.0 OP 3.0 EOF      (term ⇒ NUMBER)
  ⇒ (4.0 OP NUMBER) OP 2.0 OP 3.0 EOF
  ⇒ (4.0 - 2.0) * 3.0 EOF
```

**Expression 2: `2**3**2`**

```
expressions
  ⇒ expression EOF
  ⇒ expression OP term EOF
  ⇒ expression OP NUMBER EOF
  ⇒ expression OP 2 EOF
  ⇒ (expression OP term) OP 2 EOF
  ⇒ (expression OP NUMBER) OP 2 EOF
  ⇒ (expression OP 3) OP 2 EOF
  ⇒ (expression OP term) OP 3 OP 2 EOF
  ⇒ (expression OP NUMBER) OP 3 OP 2 EOF
  ⇒ (term OP NUMBER) OP 3 OP 2 EOF
  ⇒ (NUMBER OP NUMBER) OP 3 OP 2 EOF
  ⇒ (2 ** 3) ** 2 EOF
```

**Expression 3: `7-4/2`**

```
expressions
  ⇒ expression EOF
  ⇒ expression OP term EOF
  ⇒ expression OP NUMBER EOF
  ⇒ expression OP 2 EOF
  ⇒ (expression OP term) OP 2 EOF
  ⇒ (expression OP NUMBER) OP 2 EOF
  ⇒ (expression OP 4) OP 2 EOF
  ⇒ (expression OP term) OP 4 OP 2 EOF
  ⇒ (expression OP NUMBER) OP 4 OP 2 EOF
  ⇒ (term OP NUMBER) OP 4 OP 2 EOF
  ⇒ (NUMBER OP NUMBER) OP 4 OP 2 EOF
  ⇒ (7 - 4) / 2 EOF
```

#### 1.2 Parse Trees

**Expression 1: `4.0-2.0*3.0`**

```
                    expressions
                        │
                   expression EOF
                        │
                   expression OP term
                    /     │     └─ term
                   /      │         └─ NUMBER (3.0)
                  /       │
              expression  OP (*)
               /     │
          expression OP term
           /     │     └─ NUMBER (2.0)
          /      │
         term   OP (-)
         │
       NUMBER (4.0)
```

**Expression 2: `2**3**2`**

```
                    expressions
                        │
                   expression EOF
                        │
                   expression OP term
                    /     │     └─ term
                   /      │         └─ NUMBER (2)
                  /       │
              expression  OP (**)
               /     │
          expression OP term
           /     │     └─ NUMBER (3)
          /      │
         term   OP (**)
         │
       NUMBER (2)
```

**Expression 3: `7-4/2`**

```
                    expressions
                        │
                   expression EOF
                        │
                   expression OP term
                    /     │     └─ term
                   /      │         └─ NUMBER (2)
                  /       │
              expression  OP (/)
               /     │
          expression OP term
           /     │     └─ NUMBER (4)
          /      │
         term   OP (-)
         │
       NUMBER (7)
```

#### 1.3 Order of Semantic Action Evaluation

**Expression 1: `4.0-2.0*3.0`** → Result: **6.0** (not **2.0**)

Order of semantic actions (bottom-up evaluation):
```
1. NUMBER (4.0)       → $$ = 4.0
2. NUMBER (2.0)       → $$ = 2.0
3. operate('-', 4.0, 2.0) → $$ = 2.0  [FIRST OPERATION]
4. NUMBER (3.0)       → $$ = 3.0
5. operate('*', 2.0, 3.0) → $$ = 6.0  [SECOND OPERATION]
```

The subtraction is evaluated **before** the multiplication due to left-associativity.

**Expression 2: `2**3**2`** → Result: **64** (not **512**)

Order of semantic actions (bottom-up evaluation):
```
1. NUMBER (2)         → $$ = 2
2. NUMBER (3)         → $$ = 3
3. operate('**', 2, 3) → $$ = 8      [FIRST OPERATION]
4. NUMBER (2)         → $$ = 2
5. operate('**', 8, 2) → $$ = 64     [SECOND OPERATION]
```

The first exponentiation (2**3) is evaluated **before** the second (result**2) due to left-associativity.

**Expression 3: `7-4/2`** → Result: **1.5** (not **5**)

Order of semantic actions (bottom-up evaluation):
```
1. NUMBER (7)         → $$ = 7
2. NUMBER (4)         → $$ = 4
3. operate('-', 7, 4) → $$ = 3       [FIRST OPERATION]
4. NUMBER (2)         → $$ = 2
5. operate('/', 3, 2) → $$ = 1.5     [SECOND OPERATION]
```

The subtraction is evaluated **before** the division due to left-associativity.

