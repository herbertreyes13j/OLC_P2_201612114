%lex

%options case-insensitive

%%

\s+											// se ignoran espacios en blanco
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas


"null"              return 'Tok_null' 
"import"            return 'Tok_import' 
"true"              return 'Tok_true'
"switch"            return 'Tok_switch'
"continue"          return 'Tok_continue' 
"private"           return 'Tok_private' 
"define"            return 'Tok_define' 
"try"               return 'Tok_try'
"integer"           return 'Tok_integer' 
"boolean"           return 'Tok_boolean' 
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


";"                 return 'Tok_pyc'
"."                 return 'Tok_punto'
","                 return 'Tok_coma'
"="                 return 'Tok_asigna1'
":="                return 'Tok_asigna2'
"["                 return 'Tok_cor1'
"]"                 return 'Tok_cor2'
"("                 return 'Tok_par1'
")"                 return 'Tok_par2'
"{"                 return 'Tok_llav1'
"}"                 return 'Tok_llav2'
"-"                 return 'Tok_menos'
"!"                 return 'Tok_not'
"^^"                return 'Tok_pot'
"*"                 return 'Tok_por'
"/"                 return 'Tok_div'
"%"                 return 'Tok_mod'
"+"                 return 'Tok_mas'
">"                 return 'Tok_mayor'
"<"                 return 'Tok_menor'
">="                return 'Tok_mayori'
"<="                return 'Tok_menori'
"=="                return 'Tok_igual'
"==="               return 'Tok_igualr'
"!="                return 'Tok_diferente'
"&"                 return 'Tok_and'
"|"                 return 'Tok_or'
"^"                 return 'Tok_xor'
"++"                return 'Tok_inc'
"--"                return 'Tok_dec'
"?"                 return 'Tok_pre'
":"                 return 'Tok_bipunto'
"$"                 return 'Tok_dolar'

\"[^\"]*\"              { yytext = yytext.substr(1,yyleng-2); return 'Tok_string'; }
[0-9]+("."[0-9]+)?\b    return 'Tok_doble';
[0-9]+\b                return 'Tok_entero';


([a-zA-Z])[a-zA-Z0-9"-"]*".j" return 'Tok_Nombre';
([a-zA-Z_])[a-zA-Z0-9_]* return 'Tok_ID';

\'.\'                    return 'Tok_caracter';


<<EOF>>				return 'EOF';
.					{ console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
                                          L_Error.getInstance().insertar(new N_Error("Lexico",yytext,"",""));
                                          return null; }

/lex

%{


function AST_Node(tag, value){

    this.tag = tag;
    this.value = value;

    this.childs = [];

    this.addChilds = addChilds;
    this.getSon = getSon;

    function addChilds(){
        for (var i = 0; i < arguments.length; i++) {
            this.childs.push(arguments[i]);
            if (arguments[i]!== null){
                arguments[i].padre = this;
            }
        }
    }  

    function getSon(pos){
        if(pos > this.hijos.length - 1) return null;
        return this.hijos[pos];
    }
 };
%}
%left 'Tok_char' 'Tok_integer' 'Tok_double'
%right TERNARIO
%left  'Tok_inc' 'Tok_dec'
%left  'Tok_xor'
%left  'Tok_or'
%left  'Tok_and'
%left  'Tok_igual' 'Tok_igualr' 'Tok_diferente'
%nonassoc  'Tok_mayor' 'Tok_menor' 'Tok_menori' 'Tok_mayori'
%left  'Tok_mas' 'Tok_menos'
%left  'Tok_por' 'Tok_div' 'Tok_mod'
%right 'Tok_pot'
%right 'Tok_not'



%start S

%% /* Definición de la gramática */

S: SENTENCIAS EOF {return $1};

SENTENCIAS: SENTENCIAS SENTENCIA{$1.addChilds($2); $$=$1;}
        
        |   SENTENCIA{$$= new AST_Node("SENTENCIAS","SENTENCIAS");
                      $$.addChilds($1);} ;
                    

SENTENCIA : IMPORT {$$=$1}
           |DECLARACION_1{$$=$1}
           |DECLARACION_2{$$=$1}
           |ASIGNACION{$$=$1}
           |BLOQUE{$$=$1}
           |IF{$$=$1}
           |SWITCH{$$=$1}
           |BREAK{$$=$1}
           |WHILE{$$=$1}
           |DO_WHILE{$$=$1}
           |CONTINUE{$$=$1}
           |RETURN{$$=$1}
           |FUNCION{$$=$1}
           |LLAMADA{$$=$1}
           |PRINT{$$=$1}
           |THROW{$$=$1}
           |TRY_CATCH{$$=$1};



IMPORT : Tok_import L_NOMBRES {$$= new AST_Node("IMPORT","IMPORT"); $$.addChilds($2)};

L_NOMBRES : L_NOMBRES Tok_coma Tok_Nombre {$1.addChilds(new AST_Node("NOMBRE",$3)); $$=$1;}
          |  Tok_Nombre{$$= new AST_Node("NOMBRES","NOMBRES");
                        $$.addChilds(new AST_Node("NOMBRE",$1));};

TIPO:  Tok_integer{$$=new AST_Node("TIPO","integer");} 
      |Tok_char   {$$=new AST_Node("TIPO","char");}
      |Tok_double {$$=new AST_Node("TIPO","double");}
      |Tok_boolean{$$=new AST_Node("TIPO","boolean");}
      |Tok_ID     {$$=new AST_Node("TIPO",$1);}
      |TIPO Tok_cor1 Tok_cor2{$$=new AST_Node("ARREGLO",$1);};

ID_LIST: ID_LIST Tok_coma Tok_ID {$1.addChilds(new AST_Node("ID",$3)); $$=$1;}
        | Tok_ID {$$= new AST_Node("ID_LIST","ID_LIST"); $$.addChilds(new AST_Node("ID",$1))};

DECLARACION_1: TIPO ID_LIST Tok_pyc {$$= new AST_Node("DECLARACION5","DECLARACION5"); $$.addChilds($1,$2)}
              |TIPO ID_LIST Tok_asigna1 EXP Tok_pyc {$$=new AST_Node("DECLARACION1","DECLARACION1"); $$.addChilds($1,$2,$4);};
             // | error {L_Error.getInstance().insertar(new N_Error("Sintactico",yytext,this._$.first_line,this._$.first_column));};

DECLARACION_2: Tok_var Tok_ID Tok_asigna2 EXP Tok_pyc {$$=new AST_Node("DECLARACION2","DECLARACION2"); $$.addChilds($2,$4);}
              |Tok_const Tok_ID Tok_asigna2 EXP Tok_pyc {$$=new AST_Node("DECLARACION3","DECLARACION3"); $$.addChilds($2,$4);}
              |Tok_global Tok_ID Tok_asigna2 EXP Tok_pyc {$$=new AST_Node("DECLARACION4","DECLARACION4"); $$.addChilds($2,$4);};
             // | error {L_Error.getInstance().insertar(new N_Error("Sintactico",yytext,this._$.first_line,this._$.first_column));};

ASIGNACION: Tok_ID Tok_asigna1 EXP Tok_pyc {$$=new AST_Node("ASIGNACION1","ASIGNACION1"); $$.addChilds($1,$3);};   


BLOQUE: Tok_llav1 SENTENCIAS Tok_llav2{$$= new AST_Node("BLOQUE","BLOQUE"); $$.addChilds($2)}
        |Tok_llav1 Tok_llav2{$$= new AST_Node("BLOQUE","BLOQUE");};

IF: Tok_if Tok_par1 EXP Tok_par2 BLOQUE    {$$= new AST_Node("IF","IF");$$.addChilds($3,$5)}
    |Tok_if Tok_par1 EXP Tok_par2 BLOQUE ELIF  {$$= new AST_Node("IF","IF"); $$.addChilds($3,$5,$6);}
    |Tok_if Tok_par1 EXP Tok_par2 BLOQUE Tok_else BLOQUE {$$= new AST_Node("IF","IF"); var aux = new AST_Node("ELSE","ELSE"); aux.addChilds($7);$$.addChilds($3,$5,aux)};

ELIF: ELIF Tok_else Tok_if Tok_par1 EXP Tok_par2 BLOQUE {var aux = new AST_Node("ELIF","ELIF");aux.addChilds($5,$7);$1.addChilds(aux);$$=$1;}
     |Tok_else Tok_if Tok_par1 EXP Tok_par2 BLOQUE {$$ = new AST_Node("ELIF","ELIF");var aux2 = new AST_Node("ELIF","ELIF");aux2.addChilds($4,$6);$$.addChilds(aux2)}
     | ELIF Tok_else BLOQUE       {var aux = new AST_Node("ELSE","ELSE");aux.addChilds($3); $1.addChilds(aux);$$=$1;};


SWITCH: Tok_switch Tok_par1 EXP Tok_par2 Tok_llav1 CASOS Tok_llav2 {$$= new AST_Node("SWITCH","SWITCH");$$.addChilds($3,$6)}
       |Tok_switch Tok_par1 EXP Tok_par2 Tok_llav1 CASOS DEFAULT Tok_llav2 {$$= new AST_Node("SWITCH","SWITCH");$$.addChilds($3,$6,$7)};


CASOS: CASOS CASO {$1.addChilds($2);$$=$1;}
      |CASO{$$=new AST_Node("CASOS","CASOS");$$.addChilds($1);};

CASO: Tok_case EXP Tok_bipunto SENTENCIAS   {$$= new AST_Node("CASO","CASO"); $$.addChilds($2,$4);};

DEFAULT: Tok_default Tok_bipunto SENTENCIAS {$$=new AST_Node("DEFAULT","DEFAULT");$$.addChilds($3);};

BREAK: Tok_break Tok_pyc{$$=new AST_Node("BREAK","BREAK")};

WHILE: Tok_while Tok_par1 EXP Tok_par2 BLOQUE{$$=new AST_Node("WHILE","WHILE"); $$.addChilds($3,$5)};

DO_WHILE: Tok_do BLOQUE Tok_while Tok_par1 EXP Tok_par2 Tok_pyc{$$=new AST_Node("DO_WHILE","DO_WHILE");$$.addChilds($2,$5)};


CONTINUE: Tok_continue Tok_pyc{$$= new AST_Node("CONTINUE","CONTINUE")};

RETURN: Tok_return EXP Tok_pyc{$$= new AST_Node("RETURN","RETURN");$$.addChilds($2)}
        |Tok_return Tok_pyc {$$= new AST_Node("RETURN","RETURN")};

FUNCION:  TIPO Tok_ID Tok_par1 PARAMETROS Tok_par2 BLOQUE {$$=new AST_Node("FUNCION","FUNCION");$$.addChilds($1,new AST_Node("id",$2),$4,$6);}
        | Tok_void Tok_ID Tok_par1 PARAMETROS Tok_par2 BLOQUE{$$=new AST_Node("FUNCION","FUNCION");$$.addChilds(new AST_Node("TIPO",$1),new AST_Node("id",$2),$4,$6);};

PARAMETROS: PARAMETROS Tok_coma PARAMETRO{$1.addChilds($3);$$=$1;}
           |PARAMETRO {$$=new AST_Node("PARAMETROS","PARAMETROS");$$.addChilds($1);};


PARAMETRO: TIPO Tok_ID {$$=new AST_Node("PARAMETRO","PARAMETRO");$$.addChilds($1,$2)};

LLAMADA: Tok_ID Tok_par1 L_LLAMADA Tok_par2 Tok_pyc;

L_LLAMADA: L_LLAMADA Tok_coma P_LLAMADA
          |P_LLAMADA;


P_LLAMADA: Tok_dolar Tok_ID
          |Tok_ID
          |Tok_ID Tok_asigna1 EXP;

PRINT: Tok_print Tok_par1 EXP Tok_par2  Tok_pyc
      |Tok_print Tok_par1 EXP Tok_par2;

THROW: Tok_throw EXP Tok_pyc;

TRY_CATCH: Tok_try BLOQUE Tok_catch Tok_par1 Tok_ID Tok_ID Tok_par2 BLOQUE;

ACCESOS: Tok_ID Tok_punto LACCESOS;

LACCESOS: LACCESOS Tok_punto ACCESO
        |ACCESO;

ACCESO: Tok_ID 
        |LLAMADA;

EXP: EXP Tok_mas EXP            {$$= new AST_Node("EXP","EXP");$$.addChilds($1,new AST_Node("op",$2),$3);}
    |EXP Tok_menos EXP            {$$= new AST_Node("EXP","EXP");$$.addChilds($1,new AST_Node("op",$2),$3);}
    |EXP Tok_por EXP            {$$= new AST_Node("EXP","EXP");$$.addChilds($1,new AST_Node("op",$2),$3);}
    |EXP Tok_div EXP            {$$= new AST_Node("EXP","EXP");$$.addChilds($1,new AST_Node("op",$2),$3);}
    |EXP Tok_pot EXP            {$$= new AST_Node("EXP","EXP");$$.addChilds($1,new AST_Node("op",$2),$3);}
    |EXP Tok_mod EXP            {$$= new AST_Node("EXP","EXP");$$.addChilds($1,new AST_Node("op",$2),$3);}
    |Tok_menos EXP              {$$= new AST_Node("EXP","EXP");$$.addChilds(new AST_Node("op",$1),$2);}
    |EXP Tok_diferente EXP            {$$= new AST_Node("EXP","EXP");$$.addChilds($1,new AST_Node("op",$2),$3);}
    |EXP Tok_igual EXP            {$$= new AST_Node("EXP","EXP");$$.addChilds($1,new AST_Node("op",$2),$3);}
    |EXP Tok_igualr EXP            {$$= new AST_Node("EXP","EXP");$$.addChilds($1,new AST_Node("op",$2),$3);}
    |EXP Tok_mayor EXP            {$$= new AST_Node("EXP","EXP");$$.addChilds($1,new AST_Node("op",$2),$3);}
    |EXP Tok_menor EXP            {$$= new AST_Node("EXP","EXP");$$.addChilds($1,new AST_Node("op",$2),$3);}
    |EXP Tok_mayori EXP            {$$= new AST_Node("EXP","EXP");$$.addChilds($1,new AST_Node("op",$2),$3);}
    |EXP Tok_menori EXP            {$$= new AST_Node("EXP","EXP");$$.addChilds($1,new AST_Node("op",$2),$3);}
    |EXP Tok_and EXP            {$$= new AST_Node("EXP","EXP");$$.addChilds($1,new AST_Node("op",$2),$3);}
    |EXP Tok_or EXP            {$$= new AST_Node("EXP","EXP");$$.addChilds($1,new AST_Node("op",$2),$3);}
    |Tok_not EXP                {$$= new AST_Node("EXP","EXP");$$.addChilds(new AST_Node("op",$1),$2);}
    |EXP Tok_xor EXP            {$$= new AST_Node("EXP","EXP");$$.addChilds($1,new AST_Node("op",$2),$3);}
    |Tok_ID Tok_inc             {$$= new AST_Node("EXP","EXP");$$.addChilds(new AST_Node("Tok_string",$1),new AST_Node("op",$2));}
    |Tok_ID Tok_dec             {$$= new AST_Node("EXP","EXP");$$.addChilds(new AST_Node("Tok_string",$1),new AST_Node("op",$2));}
    |Tok_string                 {$$= new AST_Node("EXP","EXP");$$.addChilds(new AST_Node("Tok_string",$1));}
    |Tok_entero                 {$$= new AST_Node("EXP","EXP");$$.addChilds(new AST_Node("integer",$1));}
    |Tok_doble                  {$$= new AST_Node("EXP","EXP");$$.addChilds(new AST_Node("double",$1));}
    |Tok_caracter               {$$= new AST_Node("EXP","EXP");$$.addChilds(new AST_Node("char",$1));}
    |Tok_true                   {$$= new AST_Node("EXP","EXP");$$.addChilds(new AST_Node("true",$1));}
    |Tok_false                  {$$= new AST_Node("EXP","EXP");$$.addChilds(new AST_Node("false",$1));}
    |Tok_null                   {$$= new AST_Node("EXP","EXP");$$.addChilds(new AST_Node("null",$1));}
    |Tok_ID                     {$$= new AST_Node("EXP","EXP");$$.addChilds(new AST_Node("id",$1));}
    |Tok_par1 EXP Tok_par2      {$$=$2}
    |Tok_par1 Tok_char Tok_par2 EXP{$$= new AST_Node("EXP","EXP");var aux=new AST_Node("CASTEO","CASTEO"); aux.addChilds(new AST_Node("TIPO",$2),$4); $$.addChilds(aux);}
    |Tok_par1 Tok_integer Tok_par2 EXP{$$= new AST_Node("EXP","EXP");var aux=new AST_Node("CASTEO","CASTEO"); aux.addChilds(new AST_Node("TIPO",$2),$4); $$.addChilds(aux);}
    |Tok_par1 Tok_double Tok_par2 EXP{$$= new AST_Node("EXP","EXP");var aux=new AST_Node("CASTEO","CASTEO"); aux.addChilds(new AST_Node("TIPO",$2),$4); $$.addChilds(aux);}
    |LLAMADA                    {$$= new AST_Node("EXP","EXP");$$.addChilds($1)}
    |ACCESOS                    {$$= new AST_Node("EXP","EXP");$$.addChilds($1)}
    |Tok_strc Tok_ID Tok_cor1 EXP Tok_cor2
    |LISTA;



LISTA: Tok_llav1 ELEMENTOS Tok_llav2;

ELEMENTOS: ELEMENTOS Tok_coma EXP
          |EXP;


TERNARIO: Tok_pre;