var Generador = (function(){
    var instancia;
    class Generador3D{
        constructor(){
            this.codigo3D="";
            this.aux3D="";
            this.tmp =0;
            this.etq=0;
            this.etiquetas="";
            this.codeprincipal="";
        }

        getencabezado(){
            var encabezado="";
            encabezado+='var '+this.getetiquetas();
            encabezado+='var Stack[];\n';
            encabezado+='var Heap[];\n';
            encabezado+='var P = 0;\n';
            encabezado+='var H = 0;\n';
            return encabezado;
        }

        anidaretiqueta(etq){
            if(this.etiquetas==""){
         
                this.etiquetas=etq;
               
            }else{
             
                this.etiquetas+=","+etq
          
            }
            
        }

        getetiquetas(){

            return this.etiquetas+";\n";
        }

        getCode3D(){
            return this.codigo3D;
        }

        setCode3D(codigo){
            this.codigo3D=codigo;
        }

        add3DCode(entrada){
            this.codigo3D+=entrada+"\n";
        }

        agregarAux(entrada){
            this.aux3D+=entrada;
        }

        getAux3d(){
            return this.aux3D;
        }

        reiniciarAux3D(){
            this.aux3D="";
        }

        getTemp() {
            var temp = this.tmp;
            this.tmp++;
            this.anidaretiqueta("t"+temp);
            return "t" + temp;
        }

        changestack(pos,asignacion) {
            return "stack[" + pos + "] = " + asignacion + ";\n";
        }

        getfromStack(posicion,temporal) {
            return temporal + " = Stack[" + posicion + "];\n";
        }

        changeheap(pos, valor) {
            return "Heap[" + pos + "] = " + valor + ";\n";
        }
    
        getheap(pos, valor) {
            return valor + " = Heap[" + pos + "];\n";
        }
    
        incheap(inc) {
            return "H = H + " + inc + ";\n";
        }

        getpunteroh(etq) {
            return etq + " = H;\n";
        }

        getfromP(temporal,apuntador){
            return temporal +"= P+"+apuntador+";\n";
        }

        make3d(op,ins1,ins2,asignacion) {
            return asignacion + " = " + ins1 + " " + op + " " + ins2 + ";\n";
        }
    
        makeasignacion(valor, asignacion) {
            return asignacion + " = " + valor + ";\n";
        }
    
        makecall(name) {
            return "call " + name + ";\n";
        }
    
        
        jmpcondicional(inst1,op, inst2,etqdestino) {
            return "if (" + inst1 + " " + op + " " + inst2 + ") goto " + etqdestino + ";\n";
        }
    
        jmpincondicional(etqdestino) {
            return "goto " + etqdestino + ";\n";
        }
    
        makecomentario(comentario) {
            return "#" + comentario + "\n";
        }

        incP(incremento){
            return 'P=P + '+incremento+';\n';
        }

        decP(decremento){
            return 'P=P - '+decremento+';\n'; 
        }
    
        makenegativo(inst,asignacion) {
            return asignacion + " = - " + inst + ";\n";
        }

        addprincipal(codigo){
            this.codeprincipal+=codigo+"\n";
        }

        getprincipal(){
            return "proc principal begin \n\n"+this.codeprincipal+"end\n\n";
        }

        getEtq() {
           var etiqueta = this.etq;
            this.etq++;
            return "L" + etiqueta;
        }

        printchar() {
            var codigo = "";
            var tmp1 = this.getTemp();
            var tmp2 = this.getTemp();
            var tmp_char = this.getTemp();
            var etqSalida2 = this.getEtq();
    
            codigo += this.make3d("+", "P", "0", tmp1);
            codigo += this.make3d("+", "P", "1", tmp2);
            codigo += this.getfromStack(tmp2, tmp2);
            codigo += this.getfromStack(tmp1, tmp_char);
    
            codigo += "print(\"%c\"," + tmp_char + ");\n";
            codigo += this.jmpcondicional(tmp2, "==", "0", etqSalida2);
    
            codigo += "print(\"%c\", 10);\n";
            codigo += etqSalida2 + ":\n";
         
            return codigo;
        }
    
        printint() {
            var codigo = "";
       
            var tmp1 = this.getTemp();
            var tmp2 = this.getTemp();
            var tmp_char = this.getTemp();
            var salida = this.getEtq();
    
            codigo += this.make3d("+", "P", "0", tmp1);
            codigo += this.make3d("+", "P", "1", tmp2);
            codigo += this.getfromStack(tmp1, tmp2);
            codigo += this.getfromStack(tmp2, tmp_char);
            codigo += "print(\"%i\"," + tmp_char + ");\n";
            codigo += this.jmpcondicional(tmp2, "==", "-1", salida);
            codigo += "print(\"%i\",10);\n";
            codigo += salida + ":\n";
            return codigo;
    
        }
    
        print_string() {
    
            var codigo = "";
    
            var tmp1 = this.getTemp();
            var tmp2 = this.getTemp();
            var tmp_pos = this.getTemp();
            var tmp_char = this.getTemp();
            var etqInicio = this.getEtq();
            var etqSalida = this.getEtq();
            var etqSalida2 = this.getEtq();
    
            codigo += this.make3d("+", "P", "0", tmp1);
            codigo += this.make3d("+", "P", "1", tmp2);
            codigo += this.getfromStack(tmp2, tmp2);
            codigo += this.getfromStack(tmp1, tmp_pos);
            codigo += this.getheap(tmp_pos, tmp_char);
            codigo += etqInicio + ":\n";
            codigo += this.jmpcondicional(tmp_char, "==", "-1", etqSalida);
            codigo += "print(\"%c\"," + tmp_char + ");\n";
            codigo += this.make3d("+", tmp_pos, "1", tmp_pos);
            codigo += this.getheap(tmp_pos, tmp_char);
            codigo += this.jmpincondicional(etqInicio);
            codigo += etqSalida + ":\n";
            codigo += this.jmpcondicional(tmp2, "==", "0", etqSalida2);
    
            codigo += "print(\"%c\", 10);\n";
            codigo += etqSalida2 + ":\n";
     
            return codigo;
        }
    
        print_int() {
            var codigo = "";
            var tmp1 = this.getTemp();
            var tmp2 = this.getTemp();
            var tmp_char = this.getTemp();
            var etqSalida2 = this.getEtq();
    
            codigo += this.make3d("+", "P", "0", tmp1);
            codigo += this.make3d("+", "P", "1", tmp2);
            codigo += this.getfromStack(tmp2, tmp2);
            codigo += this.getfromStack(tmp1, tmp_char);
    
            codigo += "print(\"%i\"," + tmp_char + ");\n";
            codigo += this.jmpcondicional(tmp2, "==", "0", etqSalida2);
    
            codigo += "print(\"%c\", 10);\n";
            codigo += etqSalida2 + ":\n";
         
            return codigo;
        }
    
        print_decimal() {
            var codigo = "";
            var tmp1 = this.getTemp();
            var tmp2 = this.getTemp();
            var tmp_char = this.getTemp();
            var etqSalida2 = this.getEtq();
    
            codigo += this.make3d("+", "P", "0", tmp1);
            codigo += this.make3d("+", "P", "1", tmp2);
            codigo += this.getfromStack(tmp2, tmp2);
            codigo += this.getfromStack(tmp1, tmp_char);
            //codigo += "var_imprimir = " + tmp_char + ";\n";//esta variable solo sirve para assembler
            codigo += "print(\"%d\"," + tmp_char + ");\n";
            codigo += this.jmpcondicional(tmp2, "==", "0", etqSalida2);
            //codigo += "var_imprimir = " + 10 + ";\n";//esta variable solo sirve para assembler
            codigo += "print(\"%c\", 10);\n";
            codigo += etqSalida2 + ":\n";
       
            return codigo;
        }
    
        obtenerCadena() {
            var codigo = "";
            var t47 = this.getTemp();
            var t48 = this.getTemp();
            var t49 = this.getTemp();
            var t50 = this.getTemp();
            var t51 = this.getTemp();
            var t52 = this.getTemp();
            var t53 = this.getTemp();
            var t54 = this.getTemp();
            var t55 = this.getTemp();
            var t56 = this.getTemp();
            var t57 = this.getTemp();
            var t58 = this.getTemp();
            var t59 = this.getTemp();
            var t60 = this.getTemp();
            var t61 = this.getTemp();
            var t62 = this.getTemp();
            var t63 = this.getTemp();
            var t64 = this.getTemp();
            var t65 = this.getTemp();
            var t66 = this.getTemp();
            var t67 = this.getTemp();
            var t68 = this.getTemp();
            var t69 = this.getTemp();
            var t70 = this.getTemp();
            var t71 = this.getTemp();
            var t72 = this.getTemp();
            var t73 = this.getTemp();
            var t74 = this.getTemp();
            var t75 = this.getTemp();
            var t76 = this.getTemp();
            var t77 = this.getTemp();
            var t78 = this.getTemp();
            var t79 = this.getTemp();
            var t80 = this.getTemp();
            var t81 = this.getTemp();
            var t82 = this.getTemp();
            var t83 = this.getTemp();
            var t84 = this.getTemp();
            var t85 = this.getTemp();
            var t86 = this.getTemp();
            var t87 = this.getTemp();
            var t88 = this.getTemp();
            var t89 = this.getTemp();
            var t90 = this.getTemp();
            var t91 = this.getTemp();
            var t92 = this.getTemp();
            var t93 = this.getTemp();
            var t94 = this.getTemp();
            var t95 = this.getTemp();
            var t96 = this.getTemp();
            var t97 = this.getTemp();
            var t98 = this.getTemp();
            var t99 = this.getTemp();
            var t100 = this.getTemp();
            var t101 = this.getTemp();
            var t102 = this.getTemp();
            var t103 = this.getTemp();
            var t104 = this.getTemp();
            var t105 = this.getTemp();
            var t106 = this.getTemp();
            var t107 = this.getTemp();
            var t108 = this.getTemp();
            var t109 = this.getTemp();
            var t110 = this.getTemp();
            var t111 = this.getTemp();
            var t112 = this.getTemp();
            var t113 = this.getTemp();
            var t114 = this.getTemp();
            var t115 = this.getTemp();
            var t116 = this.getTemp();
            var t117 = this.getTemp();
            var t118 = this.getTemp();
            var t119 = this.getTemp();
            var t120 = this.getTemp();
            var t121 = this.getTemp();
            var t122 = this.getTemp();
            var t123 = this.getTemp();
            var t124 = this.getTemp();
            var t125 = this.getTemp();
            var t126 = this.getTemp();
            var t127 = this.getTemp();
            var t128 = this.getTemp();
            var t129 = this.getTemp();
            var t130 = this.getTemp();
            var t131 = this.getTemp();
            var t132 = this.getTemp();
            var t133 = this.getTemp();
            var t134 = this.getTemp();
            var t135 = this.getTemp();
            var t136 = this.getTemp();
            var t137 = this.getTemp();
            var t138 = this.getTemp();
            var t139 = this.getTemp();
            var t140 = this.getTemp();
            var t141 = this.getTemp();
            var t142 = this.getTemp();
            var t143 = this.getTemp();
            var t144 = this.getTemp();
            var t145 = this.getTemp();
            var t146 = this.getTemp();
            var t147 = this.getTemp();
            var t148 = this.getTemp();
            var t149 = this.getTemp();
            var t150 = this.getTemp();
            var t151 = this.getTemp();
            var t152 = this.getTemp();
            var t153 = this.getTemp();
            var t154 = this.getTemp();
            var t155 = this.getTemp();
            var t156 = this.getTemp();
            var t157 = this.getTemp();
            var t158 = this.getTemp();
            var t159 = this.getTemp();
            var t160 = this.getTemp();
            var t161 = this.getTemp();
            var t162 = this.getTemp();
            var t163 = this.getTemp();
            var t164 = this.getTemp();
            var t165 = this.getTemp();
            var t166 = this.getTemp();
            var t167 = this.getTemp();
            var t168 = this.getTemp();
            var t169 = this.getTemp();
            var t170 = this.getTemp();
            var t171 = this.getTemp();
            var t172 = this.getTemp();
            var t173 = this.getTemp();
            var t174 = this.getTemp();
            var t175 = this.getTemp();
            var t176 = this.getTemp();
            var t177 = this.getTemp();
            var t178 = this.getTemp();
            var t179 = this.getTemp();
            var t180 = this.getTemp();
            var t181 = this.getTemp();
            var t182 = this.getTemp();
            var t183 = this.getTemp();
            var t184 = this.getTemp();
            var t185 = this.getTemp();
            var t186 = this.getTemp();
            var t187 = this.getTemp();
            var t188 = this.getTemp();
            var t189 = this.getTemp();
            var t190 = this.getTemp();
            var t191 = this.getTemp();
            var t192 = this.getTemp();
            var t193 = this.getTemp();
            var t194 = this.getTemp();
            var t195 = this.getTemp();
            var t196 = this.getTemp();
            var t197 = this.getTemp();
            var t198 = this.getTemp();
            var t199 = this.getTemp();
            var t200 = this.getTemp();
            var t201 = this.getTemp();
            var t202 = this.getTemp();
            var t203 = this.getTemp();
            var t204 = this.getTemp();
            var t205 = this.getTemp();
            var t206 = this.getTemp();
            var t207 = this.getTemp();
            var t208 = this.getTemp();
            var t209 = this.getTemp();
            var t210 = this.getTemp();
            var t211 = this.getTemp();
            var t212 = this.getTemp();
            var t213 = this.getTemp();
            var t214 = this.getTemp();
            var t215 = this.getTemp();
            var t216 = this.getTemp();
            var t217 = this.getTemp();
            var t218 = this.getTemp();
            var t219 = this.getTemp();
            var t220 = this.getTemp();
            var t221 = this.getTemp();
            var t222 = this.getTemp();
            var t223 = this.getTemp();
            var t224 = this.getTemp();
            var t225 = this.getTemp();
            var t226 = this.getTemp();
            var t227 = this.getTemp();
            var t228 = this.getTemp();
            var t229 = this.getTemp();
            var t230 = this.getTemp();
            var t231 = this.getTemp();
            var t232 = this.getTemp();
            var t233 = this.getTemp();
            var t234 = this.getTemp();
            var t235 = this.getTemp();
            var t236 = this.getTemp();
            var t237 = this.getTemp();
            var t238 = this.getTemp();
            var t239 = this.getTemp();
            var t240 = this.getTemp();
            var t241 = this.getTemp();
            var t242 = this.getTemp();
            var t243 = this.getTemp();
            var t244 = this.getTemp();
            var t245 = this.getTemp();
            var t246 = this.getTemp();
    
            var t247 = this.getTemp();
            var t248 = this.getTemp();
            var t249 = this.getTemp();
            var t250 = this.getTemp();
            var t251 = this.getTemp();
            var t252 = this.getTemp();
            var t253 = this.getTemp();
            var t254 = this.getTemp();
            var t255 = this.getTemp();
            var t256 = this.getTemp();
            var t257 = this.getTemp();
            var t258 = this.getTemp();
            var t259 = this.getTemp();
            var t260 = this.getTemp();
            var t261 = this.getTemp();
            var t262 = this.getTemp();
            var t263 = this.getTemp();
            var t264 = this.getTemp();
            var t265 = this.getTemp();
            var t266 = this.getTemp();
            var t267 = this.getTemp();
            var t268 = this.getTemp();
            var t269 = this.getTemp();
            var t270 = this.getTemp();
            var t271 = this.getTemp();
            var t272 = this.getTemp();
            var t273 = this.getTemp();
            var t274 = this.getTemp();
            var t275 = this.getTemp();
            var t276 = this.getTemp();
            var t277 = this.getTemp();
            var t278 = this.getTemp();
            var t279 = this.getTemp();
            var t280 = this.getTemp();
            var t281 = this.getTemp();
            var t282 = this.getTemp();
            var t283 = this.getTemp();
            var t284 = this.getTemp();
    
            var L4 = this.getEtq();
            var L5 = this.getEtq();
            var L6 = this.getEtq();
            var L7 = this.getEtq();
            var L8 = this.getEtq();
            var L9 = this.getEtq();
            var L10 = this.getEtq();
            var L11 = this.getEtq();
            var L12 = this.getEtq();
            var L13 = this.getEtq();
            var L14 = this.getEtq();
            var L15 = this.getEtq();
            var L16 = this.getEtq();
            var L17 = this.getEtq();
            var L18 = this.getEtq();
            var L19 = this.getEtq();
            var L20 = this.getEtq();
            var L21 = this.getEtq();
            var L22 = this.getEtq();
            var L23 = this.getEtq();
            var L24 = this.getEtq();
            var L25 = this.getEtq();
            var L26 = this.getEtq();
            var L27 = this.getEtq();
            var L28 = this.getEtq();
            var L29 = this.getEtq();
            var L30 = this.getEtq();
            var L31 = this.getEtq();
            var L32 = this.getEtq();
            var L33 = this.getEtq();
            var L34 = this.getEtq();
    
    
            //Reservar espacio para el retorno, no importa si tiene;
            //Reservar espacio para el this
            codigo += this.make3d("+", "P", "1", t48);
            codigo += this.getfromStack(t48, t47);
            //Reservar espacio para los parametros;
            //Generar parametro por valor, tipo decimal_
            //reservar memoria para decimal_ numero;
            codigo += this.make3d("+", "P", "2", t49);
            //Reservar espacio para variables;
            //reservar memoria para decimal_ copia;
            codigo += this.make3d("+", "P", "4", t54);
            codigo += this.changestack(t54, "0");
            //reservar memoria para decimal_ extra;
            codigo += this.make3d("+", "P", "5", t55);
            codigo += this.changestack(t55, "0");
            //reservar memoria para entero contador1;
            codigo += this.make3d("+", "P", "6", t56);
            codigo += this.changestack(t56, "0");
            //reservar memoria para entero digito;
            codigo += this.make3d("+", "P", "7", t57);
            codigo += this.changestack(t57, "0");
            //reservar memoria para decimal_ pivote;
            codigo += this.make3d("+", "P", "8", t58);
            codigo += this.changestack(t58, "0");
            //reservar memoria para decimal_ aux;
            codigo += this.make3d("+", "P", "9", t59);
            codigo += this.changestack(t59, "0");
            //reservar memoria para entero potencia;
            codigo += this.make3d("+", "P", "10", t60);
            codigo += this.changestack(t60, "0");
            //reservar memoria para entero contador1Aux;
            codigo += this.make3d("+", "P", "11", t61);
            codigo += this.changestack(t61, "0");
            //reservar memoria para entero cond;
            codigo += this.make3d("+", "P", "12", t62);
            codigo += this.changestack(t62, "0");
    
            codigo += this.make3d("+", "P", "3", t52);
            //Asignacion igual a la var H
            codigo += this.makeasignacion("H", t51);
            codigo += this.changestack(t52, t51);
            /**
             * AGREGAR LAS DIMENSIONES
             */
            codigo += this.makecomentario("Numero de dimensiones de casteo a cadena;");
            codigo += this.changeheap("H", "1");
            codigo += this.incheap("1");
            // (-) 11111111.1111111\0
            codigo += this.changeheap("H", "19");
            codigo += this.incheap("1");
            codigo += this.getpunteroh(t62);
            codigo += this.makecomentario("Puntero a donde comienza el arreglo ;");
            codigo += this.incheap("1");
            codigo += this.changeheap(t62, "H");
            codigo += this.getpunteroh(t62);
            codigo += this.incheap("1");
            codigo += this.changeheap(t62, "H");
            //reservar memoria para decimal_ flotante;
            codigo += this.make3d("+", "P", "13", t62);
            codigo += this.changestack(t62, "0.0");
            //Asignacion igual a la var numero
            codigo += this.make3d("+", "P", "2", t65);
            codigo += this.getfromStack(t65, t66);
            //Realizar operacion relacional de t66<0
            //Obtener el valor en booleano resultante
            //Por defecto el resultado es uno, se vuelve uno si se cumple la condicion
            codigo += this.makeasignacion("1", t67);
            codigo += this.jmpcondicional(t66, "<", "0", L4);
            codigo += this.makeasignacion("0", t67);
            codigo += L4 + ":\n";
            codigo += this.jmpcondicional(t67, "<>", "0", L5);
            codigo += this.jmpincondicional(L7);
            codigo += L5 + ":\n";
            //Realizar asignacion de decimal_ numero;
            codigo += this.make3d("+", "P", "2", t71);
            //Asignacion igual a la var numero
            codigo += this.make3d("+", "P", "2", t68);
            codigo += this.getfromStack(t68, t69);
            //realizar operacion de - NaN
            codigo += this.makenegativo(t69, t70);
            //Obtener el valor actual de la variable
            codigo += this.makeasignacion(t70, t72);
            codigo += this.changestack(t71, t72);
            //Realizar asignacion de entero heapr;
            codigo += this.changeheap("H", "45");
            codigo += this.incheap("1");
            codigo += this.jmpincondicional(L6);
            codigo += L7 + ":" + L6 + ":\n";
            //Realizar asignacion de decimal_ copia;
            codigo += this.make3d("+", "P", "4", t77);
            //Asignacion igual a la var numero
            codigo += this.make3d("+", "P", "2", t75);
            codigo += this.getfromStack(t75, t76);
            //Obtener el valor actual de la variable
            codigo += this.getfromStack(t77, t78);
            codigo += this.makeasignacion(t76, t78);
            codigo += this.changestack(t77, t78);
            //Realizar asignacion de decimal_ extra;
            codigo += this.make3d("+", "P", "5", t79);
            //Obtener el valor actual de la variable
            codigo += this.makeasignacion("0.0", t80);
            codigo += this.changestack(t79, t80);
            //Realizar asignacion de entero contador1;
            codigo += this.make3d("+", "P", "6", t81);
            //Obtener el valor actual de la variable
            codigo += this.changestack(t81, "0");
            //Realizar asignacion de entero digito;
            codigo += this.make3d("+", "P", "7", t83);
            //Obtener el valor actual de la variable
            codigo += this.changestack(t83, "0");
            //Realizar asignacion de decimal_ pivote;
            codigo += this.make3d("+", "P", "8", t87);
            //Asignacion igual a la var copia
            codigo += this.make3d("+", "P", "4", t85);
            codigo += this.getfromStack(t85, t86);
            //Obtener el valor actual de la variable
            codigo += this.makeasignacion(t86, t88);
            codigo += this.changestack(t87, t88);
            //Realizar asignacion de decimal_ aux;
            codigo += this.make3d("+", "P", "9", t89);
            //Obtener el valor actual de la variable
            codigo += this.changestack(t89, "0.0");
            //Realizar asignacion de entero potencia;
            codigo += this.make3d("+", "P", "10", t91);
            //Obtener el valor actual de la variable
            codigo += this.changestack(t91, "1");
            codigo += L8 + ":\n";
            //Asignacion igual a la var pivote
            codigo += this.make3d("+", "P", "8", t93);
            codigo += this.getfromStack(t93, t94);
            //Realizar operacion relacional de t94>=10
            //Obtener el valor en booleano resultante
            //Por defecto el resultado es uno, se vuelve uno si se cumple la condicion
            codigo += this.makeasignacion("1", t95);
            codigo += this.jmpcondicional(t94, ">=", "10", L10);
            codigo += this.makeasignacion("0", t95);
            codigo += L10 + ":\n";
            codigo += this.jmpcondicional(t95, "==", "0", L12);
            codigo += L11 + ":\n";
            //Realizar asignacion de decimal_ pivote;
            codigo += this.make3d("+", "P", "8", t99);
            //Asignacion igual a la var pivote
            codigo += this.make3d("+", "P", "8", t96);
            codigo += this.getfromStack(t96, t97);
            //realizar operacion de t97/10
            codigo += this.make3d("/", t97, "10", t98);
            //Obtener el valor actual de la variable
            codigo += this.makeasignacion(t98, t100);
            codigo += this.changestack(t99, t100);
            //Asignacion igual a la var contador1
            codigo += this.make3d("+", "P", "6", t101);
            codigo += this.getfromStack(t101, t102);
            //Realizar aumento/decremento
            codigo += this.make3d("+", t102, "1", t102);
            codigo += this.changestack(t101, t102);
            codigo += this.jmpincondicional(L8);
            codigo += L12 + ":" + L9 + ":" + L13 + ":\n";
            //Asignacion igual a la var contador1
            codigo += this.make3d("+", "P", "6", t103);
            codigo += this.getfromStack(t103, t104);
            //Realizar operacion relacional de t104>0
            //Obtener el valor en booleano resultante
            //Por defecto el resultado es uno, se vuelve uno si se cumple la condicion
            codigo += this.makeasignacion("1", t105);
            codigo += this.jmpcondicional(t104, ">", "0", L15);
            codigo += this.makeasignacion("0", t105);
            codigo += L15 + ":\n";
            codigo += this.jmpcondicional(t105, "==", "0", L22);
            codigo += L21 + ":\n";
            //Realizar asignacion de entero contador1Aux;
            codigo += this.make3d("+", "P", "11", t108);
            //Asignacion igual a la var contador1
            codigo += this.make3d("+", "P", "6", t106);
            codigo += this.getfromStack(t106, t107);
            //Obtener el valor actual de la variable
            codigo += this.makeasignacion(t107, t109);
            codigo += this.changestack(t108, t109);
            codigo += L16 + ":\n";
            //Asignacion igual a la var contador1Aux
            codigo += this.make3d("+", "P", "11", t110);
            codigo += this.getfromStack(t110, t111);
            //Realizar operacion relacional de t111>0
            //Obtener el valor en booleano resultante
            //Por defecto el resultado es uno, se vuelve uno si se cumple la condicion
            codigo += this.makeasignacion("1", t112);
            codigo += this.jmpcondicional(t111, ">", "0", L18);
            codigo += this.makeasignacion("0", t112);
            codigo += L18 + ":\n";
            codigo += this.jmpcondicional(t112, "==", "0", L20);
            codigo += L19 + ":\n";
            //Realizar asignacion de entero potencia;
            codigo += this.make3d("+", "P", "10", t116);
            //Asignacion igual a la var potencia
            codigo += this.make3d("+", "P", "10", t113);
            codigo += this.getfromStack(t113, t114);
            //realizar operacion de t114*10
            codigo += this.make3d("*", t114, "10", t115);
            //Obtener el valor actual de la variable
            codigo += this.makeasignacion(t115, t117);
            codigo += this.changestack(t116, t117);
            //Asignacion igual a la var contador1Aux
            codigo += this.make3d("+", "P", "11", t118);
            codigo += this.getfromStack(t118, t119);
            //Realizar aumento/decremento
            codigo += this.makenegativo("1", t125);
            codigo += this.make3d("+", t119, t125, t119);
            codigo += this.changestack(t118, t119);
            codigo += this.jmpincondicional(L16);
            codigo += L20 + ":" + L17 + ":\n";
            //Realizar asignacion de decimal_ aux;
            codigo += this.make3d("+", "P", "9", t125);
            //Asignacion igual a la var copia
            codigo += this.make3d("+", "P", "4", t120);
            codigo += this.getfromStack(t120, t121);
            //Asignacion igual a la var potencia
            codigo += this.make3d("+", "P", "10", t122);
            codigo += this.getfromStack(t122, t123);
            //realizar operacion de t121/t123
            codigo += this.make3d("/", t121, t123, t124);
            //Obtener el valor actual de la variable  
            codigo += this.makeasignacion(t124, t126);
            codigo += this.changestack(t125, t126);
            //Asignacion igual a la var aux
            codigo += this.make3d("+", "P", "9", t127);
            codigo += this.getfromStack(t127, t128);
            //Enviar el puntero como parametro
            codigo += this.make3d("+", "P", "14", t129);
            codigo += this.make3d("+", t129, "0", t130);
            codigo += this.make3d("+", t129, "1", t132);
            codigo += this.changestack(t132, t128);
            //Aumentar ambito
            codigo += this.make3d("+", "P", "14", "P");
            codigo += this.makecall("castearDecimalEntero_");
            codigo += this.getfromStack(t130, t131);
            //Disminuir ambito
            codigo += this.make3d("-", "P", "14", "P");
            //Realizar asignacion de entero digito;
            codigo += this.make3d("+", "P", "7", t133);
            //Obtener el valor actual de la variable
            codigo += this.makeasignacion(t131, t134);
            codigo += this.changestack(t133, t134);
            //Realizar asignacion de decimal_ copia;
            codigo += this.make3d("+", "P", "4", t143);
            //Asignacion igual a la var copia
            codigo += this.make3d("+", "P", "4", t135);
            codigo += this.getfromStack(t135, t136);
            //Asignacion igual a la var digito
            codigo += this.make3d("+", "P", "7", t137);
            codigo += this.getfromStack(t137, t138);
            //Asignacion igual a la var potencia
            codigo += this.make3d("+", "P", "10", t139);
            codigo += this.getfromStack(t139, t140);
            //realizar operacion de t138*t140
            codigo += this.make3d("*", t138, t140, t141);
            //realizar operacion de t136-t141
            codigo += this.make3d("-", t136, t141, t142);
            //Obtener el valor actual de la variable
            codigo += this.makeasignacion(t142, t144);
            codigo += this.changestack(t143, t144);
            //Realizar asignacion de decimal_ extra;
            codigo += this.make3d("+", "P", "5", t153);
            //Asignacion igual a la var extra
            codigo += this.make3d("+", "P", "5", t145);
            codigo += this.getfromStack(t145, t146);
            //Asignacion igual a la var digito
            codigo += this.make3d("+", "P", "7", t147);
            codigo += this.getfromStack(t147, t148);
            //Asignacion igual a la var potencia
            codigo += this.make3d("+", "P", "10", t149);
            codigo += this.getfromStack(t149, t150);
            //realizar operacion de t148*t150
            codigo += this.make3d("*", t148, t150, t151);
            //realizar operacion de t146+t151
            codigo += this.make3d("+", t146, t151, t152);
            //Obtener el valor actual de la variable
            codigo += this.makeasignacion(t152, t154);
            codigo += this.changestack(t153, t154);
            //Realizar asignacion de entero heapr;
            //Asignacion igual a la var digito
            codigo += this.make3d("+", "P", "7", t155);
            codigo += this.getfromStack(t155, t156);
            //realizar operacion de t156+48
            codigo += this.make3d("+", t156, "48", t157);
            codigo += this.changeheap("H", t157);
            codigo += this.incheap("1");
            //Asignacion igual a la var contador1
            codigo += this.make3d("+", "P", "6", t160);
            codigo += this.getfromStack(t160, t161);
            //Realizar aumento/decremento
            codigo += this.makenegativo("1", t163);
            codigo += this.make3d("+", t161, t163, t161);
            codigo += this.changestack(t160, t161);
            //Realizar asignacion de entero potencia;
            codigo += this.make3d("+", "P", "10", t162);
            //Obtener el valor actual de la variable
            codigo += this.makeasignacion("1", t163);
            codigo += this.changestack(t162, t163);
            codigo += this.jmpincondicional(L13);
            codigo += L22 + ":" + L14 + ":\n";
            //Asignacion igual a la var copia
            codigo += this.make3d("+", "P", "4", t164);
            codigo += this.getfromStack(t164, t165);
            //Enviar el puntero como parametro
            codigo += this.make3d("+", "P", "14", t166);
            codigo += this.make3d("+", t166, "0", t167);
            codigo += this.make3d("+", t166, "1", t169);
            codigo += this.changestack(t169, t165);
            //codigo += this.changestack(50, t165);
            //Aumentar ambito
            codigo += this.make3d("+", "P", "14", "P");
            codigo += this.makecall("castearDecimalEntero_");
            codigo += this.getfromStack(t167, t168);
            //Disminuir ambito
            codigo += this.make3d("-", "P", "14", "P");
            //Realizar asignacion de entero digito;
            codigo += this.make3d("+", "P", "7", t170);
            //Obtener el valor actual de la variable
            codigo += this.makeasignacion(t168, t171);
            codigo += this.changestack(t170, t171);
            //Realizar asignacion de entero heapr;
            //Asignacion igual a la var digito
            codigo += this.make3d("+", "P", "7", t172);
            codigo += this.getfromStack(t172, t173);
            //realizar operacion de t156+48
            codigo += this.make3d("+", t173, "48", t174);
            codigo += this.changeheap("H", t174);
            codigo += this.incheap("1");
            //simular cambio ambito
            codigo += this.make3d("+", "P", "26", t179);
            //Enviar parametros
            //Asignacion igual a la var numero
            codigo += this.make3d("+", "P", "2", t177);
            codigo += this.getfromStack(t177, t178);
            codigo += this.make3d("+", t179, "2", t181);
            codigo += this.changestack(t181, t178);
            codigo += this.make3d("+", t179, "1", t180);
            codigo += this.changestack(t180, "0");
            //Aumentar ambito
            codigo += this.make3d("+", "P", "26", "P");
            codigo += this.makecall("obtenerDecimal_");
            //Obtener Retorno  
            codigo += this.getfromStack("P", t179);
            //Disminuir ambito
            codigo += this.make3d("-", "P", "26", "P");
            //Realizar asignacion de decimal_ flotante;
            codigo += this.make3d("+", "P", "13", t206);
            //Obtener el valor actual de la variable
            codigo += this.makeasignacion(t179, t207);
            codigo += this.changestack(t206, t207);
            //Asignacion igual a la var flotante
            codigo += this.make3d("+", "P", "13", t208);
            codigo += this.getfromStack(t208, t209);
            //Realizar operacion relacional de t209>0
            //Obtener el valor en booleano resultante
            //Por defecto el resultado es uno, se vuelve uno si se cumple la condicion
    
            codigo += this.makeasignacion("1", t210);
            codigo += this.jmpcondicional(t209, ">", "0", L23);
            codigo += this.makeasignacion("0", t210);
            codigo += L23 + ":\n";
            codigo += this.jmpcondicional(t210, "<>", "0", L32);
            codigo += this.jmpincondicional(L34);
            codigo += L32 + ":\n";
            //Realizar asignacion de entero heapr;
            codigo += this.changeheap("H", "46");
            codigo += this.incheap("1");
    
            //Realizar asignacion de decimal_ extra;
            codigo += this.make3d("+", "P", "5", t218);
            //Asignacion igual a la var extra
            codigo += this.make3d("+", "P", "5", t213);
            codigo += this.getfromStack(t213, t214);
            //Asignacion igual a la var digito
            codigo += this.make3d("+", "P", "7", t215);
            codigo += this.getfromStack(t215, t216);
            //realizar operacion de t214+t216
            codigo += this.make3d("+", t214, t216, t217);
            //Obtener el valor actual de la variable
            codigo += this.makeasignacion(t217, t219);
            codigo += this.changestack(t218, t219);
            //Realizar asignacion de decimal_ copia;
            codigo += this.make3d("+", "P", "4", t225);
            //Asignacion igual a la var numero
            codigo += this.make3d("+", "P", "2", t220);
            codigo += this.getfromStack(t220, t221);
            //Asignacion igual a la var extra
            codigo += this.make3d("+", "P", "5", t222);
            codigo += this.getfromStack(t222, t223);
            //realizar operacion de t221-t223
            codigo += this.make3d("-", t221, t223, t224);
            //Obtener el valor actual de la variable
            codigo += this.makeasignacion(t224, t226);
            codigo += this.changestack(t225, t226);
            //Realizar asignacion de decimal_ aux;
            codigo += this.make3d("+", "P", "9", t230);
            //Asignacion igual a la var copia
            codigo += this.make3d("+", "P", "4", t227);
            codigo += this.getfromStack(t227, t228);
            //realizar operacion de t228*10
            codigo += this.make3d("*", t228, "10", t229);
            //Obtener el valor actual de la variable
            codigo += this.makeasignacion(t229, t231);
            codigo += this.changestack(t230, t231);
            //Realizar asignacion de entero potencia;
            codigo += this.make3d("+", "P", "10", t232);
            //Obtener el valor actual de la variable
            codigo += this.makeasignacion("1", t233);
            codigo += this.changestack(t232, t233);
            //Asignacion igual a la var aux
            codigo += this.make3d("+", "P", "9", t234);
            codigo += this.getfromStack(t234, t235);
            //Enviar el puntero como parametro
            codigo += this.make3d("+", "P", "14", t236);
            codigo += this.make3d("+", t236, "0", t237);
            codigo += this.make3d("+", t236, "1", t239);
            codigo += this.changestack(t239, t235);
            //Aumentar ambito
            codigo += this.make3d("+", "P", "14", "P");
            codigo += this.makecall("castearDecimalEntero_");
            codigo += this.getfromStack(t237, t238);
            //Disminuir ambito
            codigo += this.make3d("-", "P", "14", "P");
            //Realizar asignacion de entero cond;
            codigo += this.make3d("+", "P", "12", t240);
            //Obtener el valor actual de la variable
            codigo += this.makeasignacion(t238, t241);
            codigo += this.changestack(t240, t241);
            codigo += L24 + ":\n";
            //Asignacion igual a la var cond
            codigo += this.make3d("+", "P", "12", t242);
            codigo += this.getfromStack(t242, t243);
    
            //Realizar operacion relacional de t243!=0
            //Obtener el valor en booleano resultante
            //Por defecto el resultado es uno, se vuelve uno si se cumple la condicion
            codigo += this.makeasignacion("1", t244);
            codigo += this.jmpcondicional(t243, ">", "0", L26);
            codigo += this.makeasignacion("0", t244);
            codigo += L26 + ":\n";
            //Asignacion igual a la var aux
            codigo += this.make3d("+", "P", "9", t245);
            codigo += this.getfromStack(t245, t246);
            //Realizar operacion relacional de t246!=0
            //Obtener el valor en booleano resultante
            //Por defecto el resultado es uno, se vuelve uno si se cumple la condicion
            codigo += this.makeasignacion("1", t247);
            codigo += this.jmpcondicional(t246, ">", "0", L27);
            codigo += this.makeasignacion("0", t247);
            codigo += L27 + ":\n";
            //Realizar operacion logica de t244||t247
            //Obtener el valor en booleano resultante
            //Por defecto el resultado es uno, se vuelve uno si se cumple la condicion
            codigo += this.makeasignacion("1", t248);
            codigo += this.jmpcondicional(t244, ">", "0", L29);
            codigo += this.jmpcondicional(t247, ">", "0", L28);
            codigo += this.makeasignacion("0", t248);
            codigo += L28 + ":" + L29 + ":\n";
            codigo += this.jmpcondicional(t248, "==", "0", L31);
            codigo += L30 + ":\n";
            //Realizar asignacion de entero digito;
            codigo += this.make3d("+", "P", "7", t251);
            //Asignacion igual a la var cond
            codigo += this.make3d("+", "P", "12", t249);
            codigo += this.getfromStack(t249, t250);
            //Obtener el valor actual de la variable
            codigo += this.makeasignacion(t250, t252);
            codigo += this.changestack(t251, t252);
            //Realizar asignacion de entero digito;
            codigo += this.make3d("+", "P", "7", t255);
            //Asignacion igual a la var digito
            codigo += this.make3d("+", "P", "7", t253);
            codigo += this.getfromStack(t253, t254);
            //Obtener el valor actual de la variable
            codigo += this.makeasignacion(t254, t256);
            codigo += this.changestack(t255, t256);
            //Realizar asignacion de entero heapr;
            //Asignacion igual a la var digito
            codigo += this.make3d("+", "P", "7", t257);
            codigo += this.getfromStack(t257, t258);
            //realizar operacion de t156+48
            codigo += this.make3d("+", t258, "48", t260);
            codigo += this.changeheap("H", t260);
            codigo += this.incheap("1");
            //Realizar asignacion de decimal_ aux;
            codigo += this.make3d("+", "P", "9", t266);
            //Asignacion igual a la var aux
            codigo += this.make3d("+", "P", "9", t261);
            codigo += this.getfromStack(t261, t262);
            //Asignacion igual a la var cond
            codigo += this.make3d("+", "P", "12", t263);
            codigo += this.getfromStack(t263, t264);
            //realizar operacion de t262-t264
            codigo += this.make3d("-", t262, t264, t265);
            //Obtener el valor actual de la variable
            codigo += this.makeasignacion(t265, t267);
            codigo += this.changestack(t266, t267);
            //Realizar asignacion de decimal_ aux;
            codigo += this.make3d("+", "P", "9", t271);
            //Asignacion igual a la var aux
            codigo += this.make3d("+", "P", "9", t268);
            codigo += this.getfromStack(t268, t269);
            //realizar operacion de t269*10
            codigo += this.make3d("*", t269, "10", t270);
            //Obtener el valor actual de la variable
            codigo += this.makeasignacion(t270, t272);
            codigo += this.changestack(t271, t272);
            //Asignacion igual a la var aux
            codigo += this.make3d("+", "P", "9", t273);
            codigo += this.getfromStack(t273, t274);
            //Enviar el puntero como parametro
            codigo += this.make3d("+", "P", "14", t275);
            codigo += this.make3d("+", t275, "0", t276);
            codigo += this.make3d("+", t275, "1", t278);
            codigo += this.changestack(t278, t274);
            //Aumentar ambito
            codigo += this.make3d("+", "P", "14", "P");
            codigo += this.makecall("castearDecimalEntero_");
            codigo += this.getfromStack(t276, t277);
            //Disminuir ambito
            codigo += this.make3d("-", "P", "14", "P");
            //Realizar asignacion de entero cond;
            codigo += this.make3d("+", "P", "12", t279);
            //Obtener el valor actual de la variable
            codigo += this.makeasignacion(t277, t280);
            codigo += this.changestack(t279, t280);
            codigo += this.jmpincondicional(L24);
            codigo += L31 + ":" + L25 + ":\n";
            codigo += this.jmpincondicional(L33);
            codigo += L34 + ":" + L33 + ":\n";
    
            //Realizar asignacion de entero heapr;
            codigo += this.changeheap("H", "-1");
            codigo += this.incheap("1");
            //Retorno
            //Asignacion igual a la var resultado
            codigo += this.make3d("+", "P", "3", t283);
            codigo += this.getfromStack(t283, t284);
            codigo += this.changestack("P", t284);
            return codigo;
        }


    
        obtenerDecimal() {
            var codigo = "";
            var t330 = this.getTemp();
            var t331 = this.getTemp();
            var t332 = this.getTemp();
            var t333 = this.getTemp();
            var t334 = this.getTemp();
            var t335 = this.getTemp();
            var t336 = this.getTemp();
            var t337 = this.getTemp();
            var t338 = this.getTemp();
            var t339 = this.getTemp();
    
            codigo += this.make3d("+", "P", "1", t331);
            codigo += this.getfromStack(t331, t330);
            //Reservar espacio para los parametros;
            //Generar parametro por valor, tipo decimal_
            //reservar memoria para decimal_ valor;
            codigo += this.make3d("+", "P", "2", t332);
            //Reservar espacio para variables;
            codigo += this.make3d("+", "P", "4", t335);
            //Enviar parametros
            //Asignacion igual a la var valor
            codigo += this.make3d("+", "P", "2", t333);
            codigo += this.getfromStack(t333, t334);
            codigo += this.make3d("+", t335, "2", t337);
            codigo += this.changestack(t337, t334);
            codigo += this.make3d("+", t335, "3", t337);
            codigo += this.changestack(t337, "1.0");
            /**
             * NO TIENE THIS
             */
            codigo += this.make3d("+", t335, "1", t336);
            codigo += this.changestack(t336, "0");
            //Guardar temporales
            codigo += this.make3d("+", "P", "3", t338);
            codigo += this.changestack(t338, t332);
            //Aumentar ambito
            codigo += this.make3d("+", "P", "4", "P");
            codigo += this.makecall("obtenerModulo_");
            //Obtener Retorno
            codigo += this.getfromStack("P", t335);
            //Disminuir ambito
            codigo += this.make3d("-", "P", "4", "P");
            //Restaurar temporales
            codigo += this.make3d("+", "P", "3", t339);
            codigo += this.getfromStack(t339, t332);
            //Retorno
            codigo += this.changestack("P", t335);
            return codigo;
        }
    
        obtenerModulo() {
            var codigo = "";
            var t340 = this.getTemp();
            var t341 = this.getTemp();
            var t342 = this.getTemp();
            var t343 = this.getTemp();
            var t344 = this.getTemp();
            var t345 = this.getTemp();
            var t346 = this.getTemp();
            var t347 = this.getTemp();
            var t348 = this.getTemp();
            var t349 = this.getTemp();
            var t350 = this.getTemp();
            var t351 = this.getTemp();
            var t352 = this.getTemp();
            var t353 = this.getTemp();
            var t354 = this.getTemp();
            var t355 = this.getTemp();
            var t356 = this.getTemp();
            var t357 = this.getTemp();
    
            var L47 = this.getEtq();
            var L48 = this.getEtq();
            var L49 = this.getEtq();
            var L50 = this.getEtq();
            var L51 = this.getEtq();
    
    
            codigo += this.make3d("+", "P", "1", t341);
            codigo += this.getfromStack(t341, t340);
            //Reservar espacio para los parametros;
            //Generar parametro por valor, tipo decimal
            //reservar memoria para decimal dividendo;
            codigo += this.make3d("+", "P", "2", t342);
            //Generar parametro por valor, tipo decimal
            //reservar memoria para decimal divisor;
            codigo += this.make3d("+", "P", "3", t343);
            //Reservar espacio para variables;
            codigo += L47 + ":\n";
            //Asignacion igual a la var dividendo
            codigo += this.make3d("+", "P", "2", t344);
            codigo += this.getfromStack(t344, t345);
            //Asignacion igual a la var divisor
            codigo += this.make3d("+", "P", "3", t346);
            codigo += this.getfromStack(t346, t347);
            //Realizar operacion relacional de t345>=t347
            //Obtener el valor en booleano resultante
            //Por defecto el resultado es uno, se vuelve uno si se cumple la condicion
            codigo += this.makeasignacion("1", t348);
            codigo += this.jmpcondicional(t345, ">=", t347, L49);
            codigo += this.makeasignacion("0", t348);
            codigo += L49 + ":\n";
            codigo += this.jmpcondicional(t348, "==", "0", L51);
            codigo += L50 + ":\n";
            //Realizar asignacion de decimal dividendo;
            codigo += this.make3d("+", "P", "2", t354);
            //Asignacion igual a la var dividendo
            codigo += this.make3d("+", "P", "2", t349);
            codigo += this.getfromStack(t349, t350);
            //Asignacion igual a la var divisor
            codigo += this.make3d("+", "P", "3", t351);
            codigo += this.getfromStack(t351, t352);
            //realizar operacion de t350-t352
            codigo += this.make3d("-", t350, t352, t353);
            //Obtener el valor actual de la variable
            codigo += this.getfromStack(t354, t355);
            codigo += this.makeasignacion(t353, t355);
            codigo += this.changestack(t354, t355);
            codigo += this.jmpincondicional(L47);
            codigo += L51 + ":" + L48 + ":\n";
            //Retorno
            //Asignacion igual a la var dividendo
            codigo += this.make3d("+", "P", "2", t356);
            codigo += this.getfromStack(t356, t357);
            codigo += this.changestack("P", t357);
            return codigo;
        }
    
        castearDecimalEntero() {
            /**
             * t0 = P + 0 ;posicion donde se encuentra el retorno t1 = P + 1
             * ;posicion donde se encuentra el parametro resultado = 0 ;inicializar
             * el contador en 0 decimal_ = Stack[t1] ;obtener el parametro Lregreso:
             * ;etiqueta que verifica si la condicion se cumple if(decimal_ >= 1)
             * goto Lv ;si es mayor que uno goto Lf Lv: ;etiqueta si es verdadera
             * decimal_ = decimal_ - 1 ;disminuir en 1 resultado = resultado +1
             * ;aumentar en 1 el resultado Lf ;etiqueta si es falso Stack[t0] =
             * resultado ;guardar en la primera posicion el resultado
             */
            var t0 = this.getTemp();
            var t1 = this.getTemp();
            var resultado = this.getTemp();
            var decimal_ = this.getTemp();
            var codigo = "";
            var sentenciasWhile = "";
    
            codigo += this.make3d("+", "P", "0", t0);
            codigo += this.make3d("+", "P", "1", t1);
            codigo += this.makeasignacion("0", resultado);
            codigo += this.getfromStack(t1, decimal_);
    
            sentenciasWhile += this.make3d("-", decimal_, "1", decimal_);
            sentenciasWhile += this.make3d("+", resultado, "1", resultado);
            codigo += this.generar_while(decimal_, ">=", "0.99", sentenciasWhile);
            codigo += this.changestack(t0, resultado);
            return codigo;
        }

        generar_while(exp1,op, exp2, sentencias) {
            var Lregreso = this.getEtq();
            var Lactualizar = this.getEtq();
            var Lv = this.getEtq();
            var Lf = this.getEtq();
            var codigo = "";
    
            codigo += this.makecomentario("Ver si se cumple la condicion");
            //Lregreso: if(condicion) goto Lv;
            codigo += Lregreso + ":\n";
            codigo += this.jmpcondicional(exp1, op, exp2, Lv);
            //goto Lf;
            codigo += this.jmpincondicional(Lf);
            //Lv:
            //<instrucciones>
            codigo += Lv + ":\n";
            codigo += sentencias;
            //goto Lregreso;
            codigo += this.jmpincondicional(Lregreso);
            //Lf:
            //<instrucciones>
            codigo += Lf + ":\n";
            return codigo;
        }

        getNativos() {
            var codigo = "";
            codigo += "proc print_int_ begin\n\n";
            codigo += this.print_int();
            codigo += "end\n\n";
    
            codigo += "proc print_char_ begin\n\n";
            codigo += this.printchar();
            codigo += "end\n\n";
    
            codigo += "proc print_decimal_ begin\n\n";
            codigo += this.print_decimal();
            codigo += "end\n\n";
    
            codigo += "proc print_string_ begin\n\n";
            codigo += this.print_string();
            codigo += "end\n\n";
    
            codigo += "proc obtenerCadena_ begin\n\n";
            codigo += this.obtenerCadena();
            codigo += "end\n\n";
    
            codigo += "proc obtenerDecimal_ begin\n\n";
            codigo += this.obtenerDecimal();
            codigo += "end\n\n";
    
            codigo += "proc castearDecimalEntero_ begin\n\n";
            codigo += this.castearDecimalEntero();
            codigo += "end\n\n";
    
            codigo += "proc obtenerModulo_ begin\n\n";
            codigo += this.obtenerModulo();
            codigo += "end\n\n";
    
            return codigo;
        }


 
        
        reiniciar() {
        this.codigo3D="";
        this.aux3D="";
        this.tmp=0;
        this.etq=0;
        this.etiquetas="";
        this.codeprincipal="";
        }
    }
    function crearInstancia(){
        return new Generador3D();
    }

    return {
        getInstance:function(){
            if(!instancia){
                instancia=crearInstancia()
            }
            return instancia;
        }
    }

})();