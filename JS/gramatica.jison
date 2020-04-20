%lex

%options case-insensitive

%%

\s+											// se ignoran espacios en blanco
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas


"null"              return 'Tok_imprimir' 
"import"            return 'Tok_import' 
"true"              return 'Tok_true'
"switch"            return 'Tok_switch'
"continue"          return 'Tok_continue' 
"private"           return 'Tok_private' 
"define"            return 'Tok_define' 
"try"               return 'Tok_try'
"integer"           return 'Tok_integer' 
"var"               return 'Tok_var'
"false"             return 'Tok_false'
"case"              return 'Tok_case' 
"return"            return 'Tok_return'
"void"              return 'Tok_void'
"as"                return 'Tok_as' 
"catch"             return 'Tok_catch'
"double"            return 'Tok_double'
"const"             return 'Tok_const' 
"if"                return 'Tok_if'
"default"           return 'Tok_default' 
"print"             return 'Tok_print' 
"for"               return 'Tok_for' 
"strc"              return 'Tok_strc' 
"throw"             return 'Tok_throw'
"char"              return 'Tok_char' 
"global"            return 'Tok_global' 
"else"              return 'Tok_else' 
"break"             return 'Tok_break' 
"public"            return 'Tok_public' 
"while"             return 'Tok_while' 
"do"                return 'Tok_do'



","                 return 'Tok_coma'

\"[^\"]*\"              { yytext = yytext.substr(1,yyleng-2); return 'Tok_string'; }
[0-9]+("."[0-9]+)?\b    return 'Tok_double';
[0-9]+\b                return 'Tok_integer';
[a-zA-Z_][_a-zA-Z0-9ñÑ]+ return 'Tok_ID';

\'.\'                    return 'Tok_Char';


<<EOF>>				return 'EOF';
.					{ console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); }

/lex

%{




%}


%start S

%% /* Definición de la gramática */

S: SENTENCIAS EOF {AST_Tree.setRaiz($1)};

SENTENCIAS: SENTENCIAS SENTENCIA{$1.addChilds($2); $$=$1;}
        
        |   SENTENCIA{$$= new AST_Node("SENTENCIAS","SENTENCIAS");
                      $$.addChilds($1);} ;
                    

SENTENCIA : IMPORT {$$=$1};


IMPORT : Tok_import L_NOMBRES {$$= new AST_Node("IMPORT","IMPORT"); $$.addChilds($2)};

L_NOMBRES : L_NOMBRES Tok_coma Tok_Nombre {$1.addChilds(new AST_Node("NOMBRE",$3)); $$=$1;}
          |  Tok_Nombre{$$= new AST_Node("NOMBRES","NOMBRES");
                        $$.addChilds(new AST_Node("NOMBRE",$1));};