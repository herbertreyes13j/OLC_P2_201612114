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

">="                return 'Tok_mayori'
"<="                return 'Tok_menori'
"==="               return 'Tok_igualr'
"=="                return 'Tok_igual'
"++"                return 'Tok_inc'
"--"                return 'Tok_dec'
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
"!="                return 'Tok_diferente'
"&"                 return 'Tok_and'
"|"                 return 'Tok_or'
"^"                 return 'Tok_xor'

"?"                 return 'Tok_pre'
":"                 return 'Tok_bipunto'
"$"                 return 'Tok_dolar'

\"[^\"]*\"              { yytext = yytext.substr(1,yyleng-2); return 'Tok_string'; }
[0-9]+\b                return 'Tok_entero';
[0-9]+("."[0-9]+)?\b    return 'Tok_doble';



([a-zA-Z])[a-zA-Z0-9"-"]*".j" return 'Tok_Nombre';
([a-zA-Z_])[a-zA-Z0-9_]* return 'Tok_ID';

\'.\'                    return 'Tok_caracter';


<<EOF>>				return 'EOF';
.					{ console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
                                          L_Error.getInstance().insertar(new N_Error("Lexico","Caracter: \" "+yytext+"\" no es valido" ,yylloc.first_line,yylloc.first_column));
                                          return null; }

/lex

%{


function AST_Node(tag, value,fila,columna){

    this.tag = tag;
    this.value = value;
    this.fila=fila;
    this.columna=columna;

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
%right 'Tok_asigna1'
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
%right 'Tok_not' UMINUS
%left PRE_ACCESO



%start S

%% /* Definición de la gramática */

S: SENTENCIAS EOF {return $1};

SENTENCIAS: SENTENCIAS SENTENCIA{$1.addChilds($2); $$=$1;}
        
        |   SENTENCIA{$$= new AST_Node("SENTENCIAS","SENTENCIAS",this._$.first_line,@1.last_column);
                      $$.addChilds($1);} ;
                    

SENTENCIA : IMPORT {$$=$1}
           |DECLARACION_1 Tok_pyc{$$=$1}
           |DECLARACION_2 Tok_pyc{$$=$1}
           |ASIGNACION Tok_pyc{$$=$1}
           |BLOQUE{$$=$1}
           |IF{$$=$1}
           |SWITCH{$$=$1}
           |BREAK Tok_pyc{$$=$1}
           |WHILE{$$=$1}
           |DO_WHILE Tok_pyc{$$=$1}
           |CONTINUE Tok_pyc{$$=$1}
           |RETURN Tok_pyc{$$=$1}
           |FUNCION{$$=$1}
           |LLAMADA Tok_pyc{$$=$1}
           |PRINT{$$=$1}
           |THROW{$$=$1}
           |TRY_CATCH{$$=$1}
           |STRUCTURA Tok_pyc{$$=$1}
           |FOR{$$=$1}
           |ACCESOS Tok_pyc{$$=$1}
           |ASIGNACION_ARREGLO Tok_pyc{$$=$1}
           |ASIGNACION error {L_Error.getInstance().insertar(new N_Error("Sintactico","Error Recuperado: Falta signo: ;",this._$.first_line,@1.last_column));}
           |LLAMADA error {L_Error.getInstance().insertar(new N_Error("Sintactico","Error Recuperado: Falta signo: ;",this._$.first_line,@1.last_column));}
           |ACCESOS error {L_Error.getInstance().insertar(new N_Error("Sintactico","Error Recuperado: Falta signo: ;",this._$.first_line,@1.last_column));}
           |ASIGNACION_ARREGLO error {L_Error.getInstance().insertar(new N_Error("Sintactico","Error Recuperado: Falta signo: ;",this._$.first_line,@1.last_column));}
           |DO_WHILE error {L_Error.getInstance().insertar(new N_Error("Sintactico","Error Recuperado: Falta signo: ;",this._$.first_line,@1.last_column));}
           |BREAK error {L_Error.getInstance().insertar(new N_Error("Sintactico","Error Recuperado: Falta signo: ;",this._$.first_line,@1.last_column));}
           |CONTINUE error {L_Error.getInstance().insertar(new N_Error("Sintactico","Error Recuperado: Falta signo: ;",this._$.first_line,@1.last_column));}
           |RETURN error {L_Error.getInstance().insertar(new N_Error("Sintactico","Error Recuperado: Falta signo: ;",this._$.first_line,@1.last_column));}                      
           |DECLARACION_1 error {L_Error.getInstance().insertar(new N_Error("Sintactico","Error Recuperado: Falta signo: ;",this._$.first_line,@1.last_column));}
           |DECLARACION_2 error {L_Error.getInstance().insertar(new N_Error("Sintactico","Error Recuperado: Falta signo: ;",this._$.first_line,@1.last_column));}
           |STRUCTURA error {L_Error.getInstance().insertar(new N_Error("Sintactico","Error Recuperado: Falta signo: ;",this._$.first_line,@1.last_column));};


ASIGNACION_ARREGLO: ACCESO_ARREGLO Tok_asigna1 EXP {$$= new AST_Node("ASIGNACION_ARREGLO","ASIGNACION_ARREGLO",this._$.first_line,@2.last_column);
                                                    $$.addChilds($1,$3) };

IMPORT : Tok_import L_NOMBRES {$$= new AST_Node("IMPORT","IMPORT",this._$.first_line,@1.last_column); $$.addChilds($2)};

L_NOMBRES : L_NOMBRES Tok_coma Tok_Nombre {$1.addChilds(new AST_Node("NOMBRE",$3,this._$.first_line,@3.first_column)); $$=$1;}
          |  Tok_Nombre{$$= new AST_Node("NOMBRES","NOMBRES",this._$.first_line,@1.first_column);
                        $$.addChilds(new AST_Node("NOMBRE",$1,this._$.first_line,@1.last_column));};

TIPO:  Tok_integer{$$=new AST_Node("TIPO","integer",this._$.first_line,@1.last_column);} 
      |Tok_char   {$$=new AST_Node("TIPO","char",this._$.first_line,@1.last_column);}
      |Tok_double {$$=new AST_Node("TIPO","double",this._$.first_line,@1.last_column);}
      |Tok_boolean{$$=new AST_Node("TIPO","boolean",this._$.first_line,@1.last_column);}
      |Tok_ID     {$$=new AST_Node("TIPO",$1,this._$.first_line,@1.last_column);}
      |Tok_integer Tok_cor1 Tok_cor2{$$=new AST_Node("ARREGLO",$1,this._$.first_line,@1.last_column);}
      |Tok_char Tok_cor1 Tok_cor2{$$=new AST_Node("ARREGLO",$1,this._$.first_line,@1.last_column);}
      |Tok_double Tok_cor1 Tok_cor2{$$=new AST_Node("ARREGLO",$1,this._$.first_line,@1.last_column);}
      |Tok_boolean Tok_cor1 Tok_cor2{$$=new AST_Node("ARREGLO",$1,this._$.first_line,@1.last_column);}
      |Tok_ID Tok_cor1 Tok_cor2{$$=new AST_Node("ARREGLO",$1,this._$.first_line,@1.last_column);};

ID_LIST: ID_LIST Tok_coma Tok_ID {$1.addChilds(new AST_Node("ID",$3,this._$.first_line,@3.first_column)); $$=$1;}
        | Tok_ID {$$= new AST_Node("ID_LIST","ID_LIST"); $$.addChilds(new AST_Node("ID",$1,this._$.first_line,@1.first_column))};

DECLARACION_1: TIPO ID_LIST  {$$= new AST_Node("DECLARACION5","DECLARACION5",this._$.first_line,@1.first_column); $$.addChilds($1,$2)}
              |TIPO ID_LIST Tok_asigna1 EXP{$$=new AST_Node("DECLARACION1","DECLARACION1",this._$.first_line,@1.first_column); $$.addChilds($1,$2,$4);};
             // | error {L_Error.getInstance().insertar(new N_Error("Sintactico",yytext,this._$.first_line,this._$.first_column));};

DECLARACION_2: Tok_var Tok_ID Tok_asigna2 EXP  {$$=new AST_Node("DECLARACION2","DECLARACION2",this._$.first_line,@1.last_column); $$.addChilds(new AST_Node("id",$2,this._$.first_line,@2.last_column),$4);}
              |Tok_const Tok_ID Tok_asigna2 EXP  {$$=new AST_Node("DECLARACION3","DECLARACION3",this._$.first_line,@1.last_column); $$.addChilds(new AST_Node("id",$2,this._$.first_line,@2.last_column),$4);}
              |Tok_global Tok_ID Tok_asigna2 EXP {$$=new AST_Node("DECLARACION4","DECLARACION4",this._$.first_line,@1.last_column); $$.addChilds(new AST_Node("id",$2,this._$.first_line,@2.last_column),$4);};
             // | error {L_Error.getInstance().insertar(new N_Error("Sintactico",yytext,this._$.first_line,this._$.first_column));};

ASIGNACION: Tok_ID Tok_asigna1 EXP {$$=new AST_Node("ASIGNACION","ASIGNACION",this._$.first_line,@1.last_column); 
                                            $$.addChilds(new AST_Node("id",$1,this._$.first_line,@1.last_column),$3);}
            |ACCESOS Tok_asigna1 EXP {$$= new AST_Node("ASIGNACION","ASIGNACION",this._$.first_line,@1.last_column);
                                            $$.addChilds($1,$3)};   


BLOQUE: Tok_llav1 SENTENCIAS Tok_llav2{$$= new AST_Node("BLOQUE","BLOQUE",this._$.first_line,@1.last_column); $$.addChilds($2)}
        |Tok_llav1 Tok_llav2{$$= new AST_Node("BLOQUE","BLOQUE",this._$.first_line,@1.last_column);};

IF: Tok_if Tok_par1 EXP Tok_par2 BLOQUE    {$$= new AST_Node("IF","IF",this._$.first_line,@1.last_column);$$.addChilds($3,$5)}
    |Tok_if Tok_par1 EXP Tok_par2 BLOQUE ELIF  {$$= new AST_Node("IF","IF",this._$.first_line,@1.last_column); $$.addChilds($3,$5,$6);}
    |Tok_if Tok_par1 EXP Tok_par2 BLOQUE Tok_else BLOQUE {$$= new AST_Node("IF","IF",this._$.first_line,@1.last_column); var aux = new AST_Node("ELSE","ELSE",this._$.first_line,@6.last_column); aux.addChilds($7);$$.addChilds($3,$5,aux)};

ELIF: ELIF Tok_else Tok_if Tok_par1 EXP Tok_par2 BLOQUE {var aux = new AST_Node("ELIF","ELIF",this._$.first_line,@1.last_column);aux.addChilds($5,$7);$1.addChilds(aux);$$=$1;}
     |Tok_else Tok_if Tok_par1 EXP Tok_par2 BLOQUE {$$ = new AST_Node("ELIF","ELIF",this._$.first_line,@1.last_column);var aux2 = new AST_Node("ELIF","ELIF",this._$.first_line,@1.last_column);aux2.addChilds($4,$6);$$.addChilds(aux2)}
     | ELIF Tok_else BLOQUE       {var aux = new AST_Node("ELSE","ELSE",this._$.first_line,@2.last_column);aux.addChilds($3); $1.addChilds(aux);$$=$1;};


SWITCH: Tok_switch Tok_par1 EXP Tok_par2 Tok_llav1 CASOS Tok_llav2 {$$= new AST_Node("SWITCH","SWITCH",this._$.first_line,@1.last_column);$$.addChilds($3,$6)}
       |Tok_switch Tok_par1 EXP Tok_par2 Tok_llav1 CASOS DEFAULT Tok_llav2 {$$= new AST_Node("SWITCH","SWITCH",this._$.first_line,@1.last_column);$$.addChilds($3,$6,$7)};


CASOS: CASOS CASO {$1.addChilds($2);$$=$1;}
      |CASO{$$=new AST_Node("CASOS","CASOS",this._$.first_line,@1.last_column);$$.addChilds($1);};

CASO: Tok_case EXP Tok_bipunto SENTENCIAS   {$$= new AST_Node("CASO","CASO",this._$.first_line,@1.last_column); $$.addChilds($2,$4);};

DEFAULT: Tok_default Tok_bipunto SENTENCIAS {$$=new AST_Node("DEFAULT","DEFAULT",this._$.first_line,@1.last_column);$$.addChilds($3);};

BREAK: Tok_break {$$=new AST_Node("BREAK","BREAK",this._$.first_line,@1.last_column)};

WHILE: Tok_while Tok_par1 EXP Tok_par2 BLOQUE{$$=new AST_Node("WHILE","WHILE",this._$.first_line,@1.last_column); $$.addChilds($3,$5)};

DO_WHILE: Tok_do BLOQUE Tok_while Tok_par1 EXP Tok_par2 {$$=new AST_Node("DO_WHILE","DO_WHILE",this._$.first_line,@1.last_column);$$.addChilds($2,$5)};

CONTINUE: Tok_continue{$$= new AST_Node("CONTINUE","CONTINUE",this._$.first_line,@1.last_column)};

RETURN: Tok_return EXP{$$= new AST_Node("RETURN","RETURN",this._$.first_line,@1.last_column);$$.addChilds($2)}

        |Tok_return {$$= new AST_Node("RETURN","RETURN",this._$.first_line,@1.last_column)};

FUNCION:  TIPO Tok_ID Tok_par1 PARAMETROS Tok_par2 BLOQUE {$$=new AST_Node("FUNCION","FUNCION",this._$.first_line,@1.last_column);$$.addChilds($1,new AST_Node("id",$2,this._$.first_line,@2.last_column),$4,$6);}
        | Tok_void Tok_ID Tok_par1 PARAMETROS Tok_par2 BLOQUE{$$=new AST_Node("FUNCION","FUNCION",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("TIPO",$1,this._$.first_line,@1.last_column),new AST_Node("id",$2,this._$.first_line,@2.last_column),$4,$6);};

PARAMETROS: PARAMETROS Tok_coma PARAMETRO{$1.addChilds($3);$$=$1;}
           |PARAMETRO {$$=new AST_Node("PARAMETROS","PARAMETROS",this._$.first_line,@1.last_column);$$.addChilds($1);};


PARAMETRO: TIPO Tok_ID {$$=new AST_Node("PARAMETRO","PARAMETRO",this._$.first_line,@1.last_column);$$.addChilds($1,new AST_Node("id",$2,this._$.first_line,@2.last_column))}
           | {$$=new AST_Node("VACIO","VACIO",this._$.first_line,@1.last_column);};

LLAMADA: Tok_ID Tok_par1 L_LLAMADA Tok_par2{$$= new AST_Node("LLAMADA","LLAMADA",this._$.first_line,@1.last_column      );
                                            $$.addChilds(new AST_Node("id",$1,this._$.first_line,@1.last_column),$3);} ;

L_LLAMADA: L_LLAMADA Tok_coma P_LLAMADA {$1.addChilds($3);$$=$1;}
          |P_LLAMADA {$$= new AST_Node("PARAMETROS","PARAMETROS",this._$.first_line,@1.last_column);$$.addChilds($1)};


P_LLAMADA: Tok_dolar Tok_ID {$$=new AST_Node("VALOR","VALOR",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("id",$2,this._$.first_line,@2.last_column));}
          |EXP {$$=$1}
          |Tok_ID Tok_asigna1 EXP {$$= new AST_Node("ASIGNACION","ASIGNACION",this._$.first_line,@1.last_column);
                                   $$.addChilds(new AST_Node("id",$1,this._$.first_line,@1.last_column),$2);}
          |{$$= new AST_Node("VACIO","VACIO",this._$.first_line,@1.last_column)};

PRINT: Tok_print Tok_par1 EXP Tok_par2 Tok_pyc {$$= new AST_Node("PRINT","PRINT",this._$.first_line,@1.last_column); $$.addChilds($3);}
      |Tok_print Tok_par1 EXP Tok_par2 {$$= new AST_Node("PRINT","PRINT",this._$.first_line,@1.last_column); $$.addChilds($3);};

THROW: Tok_throw Tok_strc LLAMADA Tok_pyc {$$= new AST_Node("THROW","THROW",this._$.first_line,@1.last_column);
                                        $$.addChilds($3)};

TRY_CATCH: Tok_try BLOQUE Tok_catch Tok_par1 Tok_ID Tok_ID Tok_par2 BLOQUE
           {$$=new AST_Node("TRY_CATCH","TRY_CATCH",this._$.first_line,@1.last_column);
            $$.addChilds($2,new AST_Node("id",$5,this._$.first_line,@5.last_column),new AST_Node("id",$6,this._$.first_line,@6.last_column),$8)};

ACCESOS: Tok_ID Tok_punto LACCESOS              {$$=new AST_Node("ACCESOS","ACCESOS",this._$.first_line,@1.last_column);
                                                 $$.addChilds(new AST_Node("id",$1,this._$.first_line,@1.last_column),$3)}
         |ACCESO_ARREGLO Tok_punto LACCESOS     {$$=new AST_Node("ACCESOS","ACCESOS",this._$.first_line,@1.last_column);
                                                 $$.addChilds($1,$3)}
         |LLAMADA Tok_punto LACCESOS            {$$=new AST_Node("ACCESOS","ACCESOS",this._$.first_line,@1.last_column);
                                                 $$.addChilds($1,$3)};

LACCESOS:LACCESOS Tok_punto ACCESO {$1.addChilds($3);$$=$1}
        |ACCESO {$$=new AST_Node("ACCESOS","ACCESOS",this._$.first_line,@1.last_column);$$.addChilds($1)};  

ACCESO: Tok_ID          {$$=new AST_Node("id",$1,this._$.first_line,@1.last_column)}
        |LLAMADA        {$$=$1}
        |ACCESO_ARREGLO {$$=$1} ;


FOR: Tok_for Tok_par1 INICIO Tok_pyc FCONDICION Tok_pyc FINAL Tok_par2 BLOQUE {$$=new AST_Node("FOR","FOR",this._$.first_line,@1.last_column);
                                                                              $$.addChilds($3,$5,$7,$9)};

INICIO: DECLARACION_1{$$=new AST_Node("INICIO","INICIO",this._$.first_line,@1.last_column);$$.addChilds($1)}
       |ASIGNACION{$$=new AST_Node("INICIO","INICIO",this._$.first_line,@1.last_column);$$.addChilds($1)}
       |{$$=new AST_Node("INICIO","INICIO",this._$.first_line,@1.last_column);};

FCONDICION:EXP {$$=new AST_Node("CONDICION","CONDICION",this._$.first_line,@1.last_column);$$.addChilds($1);}
        |{$$=new AST_Node("CONDICION","CONDICION",this._$.first_line,@1.last_column);} ;

FINAL: EXP {$$=new AST_Node("FINAL","FINAL",this._$.first_line,@1.last_column);$$.addChilds($1)}
      |ASIGNACION {$$=new AST_Node("FINAL","FINAL",this._$.first_line,@1.last_column);$$.addChilds($1)}
      |{$$=new AST_Node("FINAL","FINAL",this._$.first_line,@1.last_column);};

STRUCTURA: Tok_define Tok_ID Tok_as Tok_cor1 LISTA_ATRIBUTOS Tok_cor2 
           {$$=new AST_Node("ESTRUCTURA","ESTRUCTURA,this._$.first_line,@1.last_column"); $$.addChilds(new AST_Node("id",$2,this._$.first_line,@2.last_column),$5);};

LISTA_ATRIBUTOS: LISTA_ATRIBUTOS Tok_coma ATRIBUTO {$1.addChilds($3);$$=$1}
                |ATRIBUTO{$$=new AST_Node("ATRIBUTOS","ATRIBUTOS",this._$.first_line,@1.last_column);$$.addChilds($1)};

ATRIBUTO: TIPO Tok_ID  {$$=new AST_Node("ATRIBUTO","ATRIBUTO",this._$.first_line,@1.last_column);$$.addChilds($1,new AST_Node("id",$2,this._$.first_line,@2.last_column));}
         |ASIGNACION   {$$=new AST_Node("ATRIBUTO","ATRIBUTO",this._$.first_line,@1.last_column);$$.addChilds($1)}
         |ASIGNACION_ARREGLO {$$=new AST_Node("ATRIBUTO","ATRIBUTO",this._$.first_line,@1.last_column);$$.addChilds($1)};


EXP: EXP Tok_mas EXP                    {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_menos EXP                  {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_por EXP                    {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_div EXP                    {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_pot EXP                    {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_mod EXP                    {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |Tok_menos EXP %prec UMINUS         {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("op",$1,this._$.first_line,@1.last_column),$2);}
    |EXP Tok_diferente EXP              {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_igual EXP                  {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_igualr EXP                 {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_mayor EXP                  {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_menor EXP                  {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_mayori EXP                 {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_menori EXP                 {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_and EXP                    {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2),this._$.first_line,@2.last_column,$3);}
    |EXP Tok_or EXP                     {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |Tok_not EXP                        {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds(new AST_Node("op",$1,this._$.first_line,@1.last_column),$2);}
    |EXP Tok_xor EXP                    {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |Tok_ID Tok_inc                     {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds(new AST_Node("id",$1),new AST_Node("op",$2,this._$.first_line,@2.last_column));}
    |Tok_ID Tok_dec                     {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds(new AST_Node("id",$1),new AST_Node("op",$2,this._$.first_line,@2.last_column));}
    |Tok_par1 EXP Tok_par2              {$$=$2}
    |Tok_par1 Tok_char Tok_par2 EXP     {$$= new AST_Node("EXP","EXP",this._$.first_line,@4.last_column);var aux=new AST_Node("CASTEO","CASTEO",this._$.first_line,@1.last_column); aux.addChilds(new AST_Node("TIPO",$2,this._$.first_line,@1.last_column),$4); $$.addChilds(aux);}
    |Tok_par1 Tok_integer Tok_par2 EXP  {$$= new AST_Node("EXP","EXP",this._$.first_line,@4.last_column);var aux=new AST_Node("CASTEO","CASTEO",this._$.first_line,@1.last_column); aux.addChilds(new AST_Node("TIPO",$2,this._$.first_line,@1.last_column),$4); $$.addChilds(aux);}
    |Tok_par1 Tok_double Tok_par2 EXP   {$$= new AST_Node("EXP","EXP",this._$.first_line,@4.last_column);var aux=new AST_Node("CASTEO","CASTEO",this._$.first_line,@1.last_column); aux.addChilds(new AST_Node("TIPO",$2,this._$.first_line,@1.last_column),$4); $$.addChilds(aux);}
    |LLAMADA                            {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds($1)}
    |ACCESOS                            {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds($1)}
    |Tok_strc INCIALIZACION_ARREGLO     {$$=new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds($2)}
    |LISTA                              {$$=new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds($1)}
    |ACCESO_ARREGLO %prec PRE_ACCESO    {$$=new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds($1)}
    |Tok_string                         {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("string",$1,this._$.first_line,@1.last_column));}
    |Tok_entero                         {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("integer",$1,this._$.first_line,@1.last_column));}
    |Tok_doble                          {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("double",$1,this._$.first_line,@1.last_column));}
    |Tok_caracter                       {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("char",$1,this._$.first_line,@1.last_column));}
    |Tok_true                           {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("true",$1,this._$.first_line,@1.last_column));}
    |Tok_false                          {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("false",$1,this._$.first_line,@1.last_column));}
    |Tok_null                           {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("null",$1,this._$.first_line,@1.last_column));}
    |Tok_ID                             {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("id",$1,this._$.first_line,@1.last_column));}
    |INSTANCIA                          {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds($1);};


ACCESO_ARREGLO:Tok_ID Tok_cor1 EXP Tok_cor2 {$$= new AST_Node("ACCESO_ARREGLO","ACCESO_ARREGLO",this._$.first_line,@1.last_column);
                                            $$.addChilds(new AST_Node("id",$1,this._$.first_line,@1.last_column),$3)}
              |LLAMADA Tok_cor1 EXP Tok_cor2 {$$=new AST_Node("ACCESO_LLAMADA","ACCESO_LLAMADA,this._$.first_line,@1.last_column");
                                             $$.addChilds($1,$3);};

INCIALIZACION_ARREGLO: Tok_ID Tok_cor1 EXP Tok_cor2 {$$=new AST_Node("INICIALIZACION","INICIALIZACION",this._$.first_line,@1.last_column);
                                                        $$.addChilds(new AST_Node("TIPO",$1,this._$.first_line,@1.last_column),$3)} 
                      | Tok_integer Tok_cor1 EXP Tok_cor2{$$=new AST_Node("INICIALIZACION","INICIALIZACION",this._$.first_line,@1.last_column);
                                                         $$.addChilds(new AST_Node("TIPO","integer",this._$.first_line,@1.last_column),$3)} 
                      |Tok_char Tok_cor1 EXP Tok_cor2   {$$=new AST_Node("INICIALIZACION","INICIALIZACION",this._$.first_line,@1.last_column);
                                                        $$.addChilds(new AST_Node("TIPO","char",this._$.first_line,@1.last_column),$3)}
                      |Tok_double Tok_cor1 EXP Tok_cor2 {$$=new AST_Node("INICIALIZACION","INICIALIZACION",this._$.first_line,@1.last_column);
                                                        $$.addChilds(new AST_Node("TIPO","double",this._$.first_line,@1.last_column),$3)}
                      |Tok_boolean Tok_cor1 EXP Tok_cor2{$$=new AST_Node("INICIALIZACION","INICIALIZACION",this._$.first_line,@1.last_column);
                                                        $$.addChilds(new AST_Node("TIPO","boolean",this._$.first_line,@1.last_column),$3)}; 

LISTA: Tok_llav1 ELEMENTOS Tok_llav2 {$$= new AST_Node("LISTA","LISTA",this._$.first_line,@1.last_column); $$.addChilds($2)};

ELEMENTOS: ELEMENTOS Tok_coma EXP {$1.addChilds($3);$$=$1;}
          |EXP {$$=new AST_Node("ELEMENTOS","ELEMENTOS",this._$.first_line,@1.last_column);$$.addChilds($1);};

INSTANCIA: Tok_strc LLAMADA{$$= new AST_Node("INSTANCIA","INSTANCIA",this._$.first_line,@1.last_column);$$.addChilds($2)};

TERNARIO: Tok_pre;

