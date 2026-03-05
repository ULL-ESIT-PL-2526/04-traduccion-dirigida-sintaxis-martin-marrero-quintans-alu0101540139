/* Lexer */
%lex
%%
\s+                                        { /* skip whitespace */;          }
"//"[^\n]*                                 { /* skip single-line comment */; }
[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?        { return 'NUMBER';                }
"**"                                       { return '**';                    }
"↑"                                        { return '↑';                     }
"+"                                        { return '+';                     }
"-"                                        { return '-';                     }
"*"                                        { return '*';                     }
"/"                                        { return '/';                     }
<<EOF>>                                    { return 'EOF';                   }
.                                          { return 'INVALID';               }
/lex


/* Parser */
%start L
%token NUMBER

%%

L
    : E EOF
        { return $E; }
    ;

E
    : E opad T
        { $$ = operate($opad, $1, $3); }
    | T
        { $$ = $1; }
    ;

T
    : T opmu R
        { $$ = operate($opmu, $1, $3); }
    | R
        { $$ = $1; }
    ;

R
    : F opow R
        { $$ = operate($opow, $1, $3); }
    | F
        { $$ = $1; }
    ;

F
    : NUMBER
        { $$ = convert($1); }
    ;

opad
    : '+'
        { $$ = '+'; }
    | '-'
        { $$ = '-'; }
    ;

opmu
    : '*'
        { $$ = '*'; }
    | '/'
        { $$ = '/'; }
    ;

opow
    : '**'
        { $$ = '**'; }
    | '↑'
        { $$ = '↑'; }
    ;

%%

function convert(value) {
    return Number(value);
}

function operate(op, left, right) {
    switch (op) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/': return left / right;
        case '**':
        case '↑': return Math.pow(left, right);
    }
}
