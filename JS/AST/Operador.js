
class Operador{
    constructor(interprete){
        this.interprete=interprete;
    }

    ejecutar(raiz,pila,metodo){
        var Resultado1=null;
        var Resultado2=null;
        var Resultado=null;
        var cambio=0;
        switch (raiz.tag) {
            case "EXP":
                if (raiz.childs.length==3) {
                    Resultado1=this.ejecutar(raiz.childs[0],pila,metodo);
                    Resultado2=this.ejecutar(raiz.childs[2],pila,metodo);
                    var op = raiz.childs[1].value;
                    console.log(op);
                    switch (op) {
                        case "+":
                            return this.suma(Resultado1,Resultado2,raiz.childs[1].fila,raiz.childs[1].columna,metodo); 
                        case "-":
                        case "*":
                        case "/":
                            return this.aritmetico(Resultado1,Resultado2,raiz.childs[1].fila,raiz.childs[1].columna,op,metodo);
                        case "%":
                            return this.modulo(Resultado1,Resultado2,raiz.childs[1].fila,raiz.childs[1].columna,metodo);
                        case "==":
                        case "!=":
                            return this.igualdad(Resultado1,Resultado2,raiz.childs[1].fila,raiz.childs[1].columna,op,metodo);
                        case ">":
                        case ">=":
                        case "<":
                        case "<=":
                            return this.relacional(Resultado1,Resultado2,raiz.childs[1].fila,raiz.childs[1].columna,op,metodo);
                        case "&&":
                        case "||":
                        case "^":
                            return this.logigicos(Resultado1,Resultado2,raiz.childs[1].fila,raiz.childs[1].columna,op,metodo);
                        default:
                            break;  
                    }
                }else if(raiz.childs.length==2){
                    if(raiz.childs[0].value=="!"){
                        Resultado=this.ejecutar(raiz.childs[1],pila,metodo);
                        if(Resultado.tipo=="boolean"){
                            var aux= Resultado.etqV;
                            Resultado.etqV=Resultado.etqF;
                            Resultado.etqF=aux;
                            return Resultado;
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico",Resultado.tipo +" no es compatible con operacion !",raiz.childs[1].fila,raiz.childs[1].columna));
                            Resultado.tipo="error";
                            return Resultado;
                        }
                    }else if(raiz.childs[1].value=="++" ||raiz.childs[1].value=="--"){
                        var opera;
                        if(raiz.childs[1].value=="++"){
                            opera="+";
                        }else{
                            opera="-";
                        }
                        Resultado=this.ejecutar(raiz.childs[0],pila,metodo);
                        if(Resultado.tipo=="error"){
                            return Resultado;
                        }else if(Resultado.tipo=="double" || Resultado.tipo=="integer"|| Resultado.tipo=="char"){
                            var temp = Generador.getInstance().getTemp();
                            Resultado.codigo+=Generador.getInstance().make3d(opera,Resultado.tmp,"1",temp);
                            Resultado.tmp=temp;
                            metodo.temporales.push(Resultado.tmp);
                            return Resultado;
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico","No es posible "+raiz.childs[1].value + " con tipo de dato : "+Resultado.tipo,raiz.childs[1].fila,raiz.childs[1].columna));
                            Resultado.tipo="error";
                            return Resultado;
                        }
                    }else{
                        var nueva= Generador.getInstance().getTemp();
                        Resultado=this.ejecutar(raiz.childs[1],pila,metodo);
                        Resultado.codigo+=Generador.getInstance().makenegativo(Resultado.tmp,nueva);
                        Resultado.tmp=nueva;
                        return Resultado;
                        

                    }
                }else{
                    return this.ejecutar(raiz.childs[0],pila,metodo);
                }
                
                break;
                case "id":
                Resultado= new Nodo3D();
                var tmpx;               
                var simbolo=null;

                simbolo=pila.obtener(raiz.value);
                if(simbolo==null){
                    simbolo=this.interprete.global.obtener(raiz.value);
                }   

                if(simbolo!=null){
                    console.log('El simbolo')
                    console.log(simbolo);
                    if(simbolo.referencia==false || metodo===null ||metodo.nombre=="principal"){
                        tmpx= Generador.getInstance().getTemp();
                        Resultado.codigo= Generador.getInstance().getfromP(tmpx,simbolo.apuntador);
                        Resultado.tmp= Generador.getInstance().getTemp();
                        Resultado.codigo+= Generador.getInstance().getfromStack(tmpx,Resultado.tmp);
                        Resultado.tipo=simbolo.tipo;
                        if(Resultado.tipo=="string"){
                            Resultado.necesitareferencia=true;
                        }
                        Resultado.comentario=simbolo.nombre;
                    }else{
                        console.log("Haciendo por referencia");
                        tmpx=Generador.getInstance().getTemp();
                        Resultado.codigo=Generador.getInstance().getfromP(tmpx,simbolo.apuntador);
                        var aux= Generador.getInstance().getTemp();
                        Resultado.tmp=Generador.getInstance().getTemp();
                        Resultado.codigo+=Generador.getInstance().getfromStack(tmpx,aux);
                        Resultado.codigo+=Generador.getInstance().getfromStack(aux,Resultado.tmp);
                        Resultado.tipo=simbolo.tipo;
                        Resultado.comentario=simbolo.nombre;
                        Resultado.necesitareferencia=true;
                        console.log('eL RESULTADO');
                        console.log(Resultado);
                    }

                    if(!(metodo===null || metodo===undefined||metodo.nombre=="principal")){
                        metodo.temporales.push(Resultado.tmp);
                    }
                    
                    return Resultado;
                }else{
                    L_Error.getInstance().insertar(new N_Error("Semantico","Variable \""+raiz.value+"\" no existe",raiz.fila,raiz.columna));
                    Resultado.tipo="error";
                    return Resultado;
                }
     
                
                case "integer":
                    Resultado= new Nodo3D();
                    Resultado.tmp=raiz.value;
                    Resultado.comentario=raiz.value;
                    if(raiz.value.includes(".")){
                        Resultado.tipo="double";
                    }else{
                        Resultado.tipo="integer";
                    }
                    
                    return Resultado;
                
                case "true":
                Resultado= new Nodo3D();
                Resultado.etqV = Generador.getInstance().getEtq();
                Resultado.etqF = Generador.getInstance().getEtq();
                Resultado.tipo = "boolean";
                Resultado.codigo = Generador.getInstance().jmpcondicional("1","==","1",Resultado.etqV);
                Resultado.codigo+= Generador.getInstance().jmpincondicional(Resultado.etqF);
                Resultado.tmp="1";
                Resultado.comentario=raiz.value;
                return Resultado;

                
                case "false":
                Resultado= new Nodo3D();
                Resultado.etqV = Generador.getInstance().getEtq();
                Resultado.etqF = Generador.getInstance().getEtq();
                Resultado.tipo = "boolean";
                Resultado.codigo = Generador.getInstance().jmpcondicional("1","<>","1",Resultado.etqV);
                Resultado.codigo+= Generador.getInstance().jmpincondicional(Resultado.etqF);
                Resultado.tmp="0";
                Resultado.comentario=raiz.value;
                return Resultado;

                case "string":
                    Resultado = new Nodo3D();
                    Resultado.tmp = Generador.getInstance().getTemp();
                    Resultado.tipo = "string";
                    Resultado.codigo = Generador.getInstance().getpunteroh(Resultado.tmp);
                    raiz.value = raiz.value.replace("\"", "");
                    for(var n=0;n<raiz.value.length;n++){
                        Resultado.codigo+=Generador.getInstance().changeheap("H",raiz.value.charCodeAt(n));
                        Resultado.codigo+=Generador.getInstance().incheap("1");   
                    }
                    Resultado.comentario=raiz.value;
                    Resultado.codigo+=Generador.getInstance().changeheap("H","-1");
                    Resultado.codigo+=Generador.getInstance().incheap("1");
                    if(!(metodo===null || metodo===undefined||metodo.nombre=="principal")){
                        metodo.temporales.push(Resultado.tmp);
                    }
                return Resultado;
                case "null":
                    Resultado= new Nodo3D();
                    Resultado.tmp=-11000000000;
                    Resultado.tipo="null";
                    Resultado.comentario="null";
                return Resultado;

                case "char":
                    Resultado=new Nodo3D();
                    Resultado.tipo="char";
                    raiz.value=raiz.value.replace("'","");
                    raiz.value=raiz.value.replace("'","");
                    Resultado.comentario=raiz.value;
                    Resultado.tmp=raiz.value.charCodeAt(0);
                return Resultado;
                case "LLAMADA":          
                    return this.interprete.llamada(raiz,pila,metodo);
                case "LISTA":
                    Resultado = new Nodo3D();
                    Resultado.tipo="lista";
                    var elementos=[];
                    raiz.childs[0].childs.forEach(element => {
                       var aux= this.ejecutar(element,pila,metodo);
                       elementos.push(aux);
                       Resultado.codigo+=aux.codigo;
                    });
                    Resultado.tmp=Generador.getInstance().getTemp();
                    Resultado.codigo+=Generador.getInstance().getpunteroh(Resultado.tmp);
                    Resultado.codigo+=Generador.getInstance().changeheap(Resultado.tmp,elementos.length);
                    Resultado.codigo+=Generador.getInstance().incheap(elementos.length+1);
                    
                    var aux = Generador.getInstance().getTemp();
                    Resultado.codigo+=Generador.getInstance().make3d("+",Resultado.tmp,"1",aux);
                    elementos.forEach(element => {
                        Resultado.codigo+=Generador.getInstance().changeheap(aux,element.tmp);
                        Resultado.codigo+=Generador.getInstance().make3d("+",aux,"1",aux);
                    });
                    return Resultado;
                case "INICIALIZACION":
                    return this.interprete.inicializacion(raiz,pila,metodo);

                case "INSTANCIA":

                return this.interprete.instancia(raiz.childs[0].childs[0].value,pila);

                case "ACCESO_ARREGLO":
                    Resultado=this.interprete.accesoarreglo(raiz,pila,metodo);
                    Resultado.codigo+=Generador.getInstance().getheap(Resultado.tmp,Resultado.tmp);
                    return Resultado;
            default:
                break;
        }

    }

        logigicos(R1,R2,fila,columna,op){
            var tipo1 = R1.tipo;
            var tipo2 = R2.tipo;
            var res = new Nodo3D();
            console.log(tipo1,tipo2);
            if(tipo1=="error"||tipo2=="error"){
                res.tipo="error";
                return res;
            }
            console.log(tipo1,tipo2)
            if(tipo1=="boolean" && tipo2=="boolean"){
                if(op=="&&"){
                    console.log('and')
                    res.codigo=R1.codigo;
                    res.codigo+=R1.etqV+":\n";
                    res.codigo+=R2.codigo;
                    res.etqV=R2.etqV;
                    res.etqF=R1.etqF+":"+R2.etqF;
                    res.tipo="boolean";
                    return res;
                }else if(op=="^"){
                    var etq2= Generador.getInstance().getEtq();
                    var etq1=Generador.getInstance().getEtq();
                    var etq3= Generador.getInstance().getEtq();
                    var etq4=Generador.getInstance().getEtq();
                    res.codigo=R1.codigo;
                    res.codigo+=R1.etqF+": \n";
                    res.codigo+=R2.codigo;
                    res.codigo+=R2.etqF+': \n';
                    res.codigo+=Generador.getInstance().jmpincondicional(etq1);
                    res.codigo+=R2.etqV+":\n";
                    res.codigo+=Generador.getInstance().jmpincondicional(etq2);
                    res.codigo+=R1.etqV+':\n';
                    R2.codigo=R2.codigo.replace(R2.etqV,etq3);
                    R2.codigo.replace(R2.etqF,etq4);
                    R2.etqV=etq3;
                    R2.etqF=etq4;
                    res.codigo+=R2.codigo;
                    res.codigo+=R2.etqV+":\n";
                    res.codigo+=Generador.getInstance().jmpincondicional(etq1);
                    res.codigo+=R2.etqF+":\n";
                    res.codigo+=Generador.getInstance().jmpincondicional(etq2);
                    res.tipo="boolean";
                    res.etqV=etq2;
                    res.etqF=etq1;
                    return res;
                
                }else{
                    res.codigo=R1.codigo;
                    res.codigo+=R1.etqF+":\n";
                    res.codigo+=R2.codigo;
                    res.etqV=R1.etqV+":"+R2.etqV;
                    res.etqF=R2.etqF;
                    res.tipo="boolean";
                    return res;
                }

            }else{
                L_Error.getInstance().insertar(new Error("Semantico","No es posible operacion entre: "+tipo1 +' '+op +' '+tipo2,fila,columna));
                res.tipo="error";
                return res;
            }


        }

        sumarstrings(R1,R2,metodo){
            var res = new Nodo3D();
            var temp0=Generador.getInstance().getTemp();
            res.tmp=temp0;
            res.codigo=R1.codigo+R2.codigo;
            res.codigo+=Generador.getInstance().getpunteroh(temp0);
            res.tipo="string";
            res.codigo+=this.procesarcadena(R1.tmp,R1.comentario);
            res.codigo+=this.procesarcadena(R2.tmp,R2.comentario)
            res.codigo += Generador.getInstance().changeheap('H','-1');
            res.codigo += Generador.getInstance().incheap('1');
            res.comentario = R1.comentario + R2.comentario;
            if(!(metodo===null || metodo===undefined||metodo.nombre=="principal")){
                metodo.temporales.push(Resultado.tmp);
            }
             return res;
        }

        aritmetico(R1,R2,fila,columna,op,metodo){
            
            var tipo1 = R1.tipo;
            var tipo2 = R2.tipo;
            var res = new Nodo3D();
            res.tipo=this.gettipo(tipo1,tipo2);
            if(tipo1=="error"||tipo2=="error"){
                res.tipo="error";
                return res;
            }
            if(tipo1=="error"){
                L_Error.getInstance().insertar(new Error("Semantico","No es posible operacion entre: "+tipo1 +' '+op +' '+tipo2,fila,columna));
                    res.tipo="error";
                    return res;
            }else{
                if(op=="/")res.tipo="double";
                res.tmp=Generador.getInstance().getTemp();
                if(!(metodo===null || metodo===undefined||metodo.nombre=="principal")){
                    metodo.temporales.push(Resultado.tmp);
                }
                res.codigo=R1.codigo+R2.codigo;
                res.codigo+=Generador.getInstance().makecomentario("Realizando operacion: "+R1.tmp+" "+op+" "+R2.tmp);
                res.codigo+=Generador.getInstance().make3d(op,R1.tmp,R2.tmp,res.tmp);
                return res;
            }


        }

        modulo(R1,R2,fila,columna,metodo){
            var tipo1 = R1.tipo;
            var tipo2 = R2.tipo;
            var res = new Nodo3D();
            if(tipo1=="error"||tipo2=="error"){
                res.tipo="error";
                return res;
            }
            if(tipo1=="integer" && tipo2=="integer"){
                res.tipo="integer";
                res.tmp=Generador.getInstance().getTemp();
                metodo.temporales.push(res.tmp);
                res.codigo=R1.codigo+R2.codigo;
                res.codigo+=Generador.getInstance().makecomentario("Realizando operacion: "+R1.tmp+"+"+R2.tmp);
                res.codigo+=Generador.getInstance().make3d("%",R1.tmp,R2.tmp,res.tmp);
                return res;
            }else{
                L_Error.getInstance().insertar(new Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                res.tipo="error";
                return res;
            }


        }

        potencia(R1,R2,fila,columna,metodo){
            var tipo1 = R1.tipo;
            var tipo2 = R2.tipo;
            var res = new Nodo3D();
            if(tipo1=="error"||tipo2=="error"){
                res.tipo="error";
                return res;
            }
            if(tipo1=="integer" && tipo2=="integer"){
                res.tipo="integer";
                res.tmp=Generador.getInstance().getTemp();
                res.codigo=R1.codigo+R2.codigo;
                res.codigo+=Generador.getInstance().makecomentario("Realizando operacion: "+R1.tmp+"+"+R2.tmp);
                res.codigo+=Generador.getInstance().make3d("%",R1.tmp,R2.tmp,res.tmp);
                metodo.temporales.push(res.tmp);
                return res;
            }else{
                L_Error.getInstance().insertar(new Error("Semantico","No es posible operacion entre: "+tipo1 +' ^^ '+tipo2,fila,columna));
                res.tipo="error";
                return res;
            }
        }

        relacional(R1,R2,fila,columna,op){
            var tipo1 = R1.tipo;
            var tipo2 = R2.tipo;
            var res = new Nodo3D();
            if(tipo1=="error"||tipo2=="error"){
                res.tipo="error";
                return res;
            }
            if(this.verificarrelacional(tipo1,tipo2)){
                res.etqV=Generador.getInstance().getEtq();
                res.etqF=Generador.getInstance().getEtq();
                res.codigo+=R1.codigo+R2.codigo;
                res.codigo+=Generador.getInstance().jmpcondicional(R1.tmp,op,R2.tmp,res.etqV);
                res.codigo+=Generador.getInstance().jmpincondicional(res.etqF);
                res.tipo="boolean";
                return res;
            }else{
                L_Error.getInstance().insertar(new Error("Semantico","No es posible operacion entre: "+tipo1 +' '+op+' '+tipo2,fila,columna));
                res.tipo="error";
                return res;
            }



        }

        igualdad(R1,R2,fila,columna,op){
            if(tipo1=="error"||tipo2=="error"){
                res.tipo="error";
                return res;
            }
            var tipo1 = R1.tipo;
            var tipo2 = R2.tipo;
            var res = new Nodo3D();
            if(tipo1=="string" && tipo2=="string"){
                var temp1=R1.tmp;
                var temp2=R2.tmp;
                var aux1=Generador.getInstance().getTemp();
                var aux2=Generador.getInstance().getTemp();
                var etq0=Generador.getInstance().getEtq();
                var etq1=Generador.getInstance().getEtq();
                var etq2=Generador.getInstance().getEtq();
                var etq3=Generador.getInstance().getEtq();
                var codigo="";
                codigo+=Generador.getInstance().getheap(temp1,aux1);
                codigo+=Generador.getInstance().getheap(temp2,aux2);

                res.etqV=Generador.getInstance().getEtq();
                res.etqF=Generador.getInstance().getEtq();
                if(op=="!=")op="<>";
                
                codigo+=etq0+":\n";
                codigo+=Generador.getInstance().jmpcondicional(aux1,"<>","-1",etq1);
                codigo+=Generador.getInstance().jmpincondicional(etq2);
                codigo+=etq1+":\n";
                if(op=="=="){
                    codigo+=Generador.getInstance().jmpcondicional(aux1,"==",aux2,etq3);
                    codigo+=Generador.getInstance().jmpincondicional(res.etqF);
                    codigo+=etq3+':\n';
                    codigo+=Generador.getInstance().make3d("+",temp1,"1",temp1);
                    codigo+=Generador.getInstance().getheap(temp1,aux1);
                    codigo+=Generador.getInstance().make3d("+",temp2,"1",temp2);
                    codigo+=Generador.getInstance().getheap(temp2,aux2);
                    codigo+=Generador.getInstance().jmpincondicional(etq0);
                    codigo+=etq2+": \n";
                    codigo+=Generador.getInstance().jmpcondicional(aux2,"==","-1",res.etqV);
                    codigo+=Generador.getInstance().jmpincondicional(res.etqF);
                }else{
                    codigo+=Generador.getInstance().jmpcondicional(aux1,"<>",aux2,res.etqV);
                    codigo+=Generador.getInstance().jmpincondicional(etq3);
                    codigo+=etq3+':\n';
                    codigo+=Generador.getInstance().make3d("+",temp1,"1",temp1);
                    codigo+=Generador.getInstance().getheap(temp1,aux1);
                    codigo+=Generador.getInstance().make3d("+",temp2,"1",temp2);
                    codigo+=Generador.getInstance().getheap(temp2,aux2);
                    codigo+=Generador.getInstance().jmpincondicional(etq0);
                    codigo+=etq2+": \n";
                    codigo+=Generador.getInstance().jmpcondicional(aux2,"==","-1",res.etqF);
                    codigo+=Generador.getInstance().jmpincondicional(res.etqV);
                }

                res.codigo=R1.codigo+R2.codigo;
                res.codigo+=codigo;
                res.tipo="boolean";
                return res;
            }else if(this.verificarigualdad(tipo1,tipo2)){
                res.etqV=Generador.getInstance().getEtq();
                res.etqF=Generador.getInstance().getEtq();
                res.codigo+=R1.codigo+R2.codigo;
                res.codigo+=Generador.getInstance().jmpcondicional(R1.tmp,op,R2.tmp,res.etqV);
                res.codigo+=Generador.getInstance().jmpincondicional(res.etqF);
                res.tipo="boolean";
                return res;
            }else{
                L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' '+op+' '+tipo2,fila,columna));
                res.tipo="error";
                return res;
            }


        }

        verificarrelacional(tipo1,tipo2){
            switch(tipo1){
                case "integer":
                    switch(tipo2){
                        case "integer":
                        case "double":
                        case "char":
                            return true;
                        default:
                            return false;
                    }
                case "double":
                    switch(tipo2){
                        case "integer":
                        case "double":
                        case "char":
                            return true;
                        default: return false;

                    }
                case "char":
                    switch(tipo2){
                        case "integer":
                        case "double":
                        case "char":
                            return true;
                        default: return false;
                    }

            }
        }
        verificarigualdad(tipo1,tipo2){
            switch(tipo1){
                case "integer":
                    switch(tipo2){
                        case "integer":
                        case "double":
                        case "char":
                            return true;
                        default:
                            return false;
                    }
                case "double":
                    switch(tipo2){
                        case "integer":
                        case "double":
                        case "char":
                            return true;
                        default: return false;

                    }
                case "char":
                    switch(tipo2){
                        case "integer":
                        case "double":
                        case "char":
                            return true;
                        default: return false;
                    }
                case "boolean":
                    switch(tipo2){
                        case "boolean":
                            return true;
                        default: return false;
                    }
            }
        }


        suma(R1,R2,fila,columna,metodo){
            var tipo1 = R1.tipo;
            var tipo2 = R2.tipo;
            var res = new Nodo3D();
            
            switch(tipo1){
                case "integer":
                case "double":
                    switch(tipo2){
                        case "string":
                            R1.codigo=R1.codigo+R2.codigo;
                            R2.codigo="";
                            R1=this.castearnumero(R1);
                            res.tipo="string";
                            return this.sumarstrings(R1,R2,metodo);
                        default:
                            res.tipo=this.gettipo(tipo1,tipo2);
                            if(res.tipo=="error"){
                                n = new N_Error("Semantico", "No es posible operacion " + tipo1 + " + " + tipo2, fila, columna);
                                res.Valor = n;
                                L_Error.getInstance().insertar(n);
                                return res;
                            }else{
                                res.tmp=Generador.getInstance().getTemp();
                                if(!(metodo===null || metodo===undefined||metodo.nombre=="principal")){
                                    metodo.temporales.push(res.tmp);
                                } 
                                res.codigo=R1.codigo+R2.codigo;
                                res.codigo+=Generador.getInstance().makecomentario("Realizando operacion: "+R1.tmp+"+"+R2.tmp);
                                res.codigo+=Generador.getInstance().make3d("+",R1.tmp,R2.tmp,res.tmp);
                                return res;
                            }
                    }

                case "string":
                    switch(tipo2){
                        case "string":
                            return this.sumarstrings(R1,R2);
                        case "integer":
                        case "double":
                            R1.codigo=R1.codigo+R2.codigo;
                            R2.codigo="";
                            R2=this.castearnumero(R2);
                            res.tipo="string";
                            return this.sumarstrings(R1,R2);
                        
                        case "char":
                            console.log('lo hace');
                            var valor=R2.tmp;
                            R2.tmp = Generador.getInstance().getTemp();
                            R2.tipo = "string";
                            R2.codigo+= Generador.getInstance().makecomentario("Convirtiendo char en String");
                            R2.codigo+= Generador.getInstance().getpunteroh(R2.tmp);
                            R2.codigo+= Generador.getInstance().changeheap("H",valor);
                            R2.codigo+=Generador.getInstance().incheap("1");   
                            R2.codigo+=Generador.getInstance().changeheap("H","-1");
                            R2.codigo+=Generador.getInstance().incheap("1");
                            return this.sumarstrings(R1,R2);
                        case "boolean":
                            var value=R2.tmp;
                            R2.tmp = Generador.getInstance().getTemp();
                            R2.tipo = "string";
                            R2.codigo =Generador.getInstance().makecomentario("Conviertiendo booleano a String")
                            R2.codigo += Generador.getInstance().getpunteroh(R2.tmp);
                            
                            if(value=="1"){
                                value="true";   
                            }else{
                                value="false";
                            }
                            for(var n=0;n<value.length;n++){
                                R2.codigo+=Generador.getInstance().changeheap("H",value.charCodeAt(n));
                                R2.codigo+=Generador.getInstance().incheap("1");   
                            }
                            R2.comentario=value;
                            R2.codigo+=Generador.getInstance().changeheap("H","-1");
                            R2.codigo+=Generador.getInstance().incheap("1");
                            return this.sumarstrings(R1,R2);
                    }
                    break;
                case "char":
                    switch(tipo2){
                        case "string":
                            var valor=R1.tmp;
                            R1.tmp = Generador.getInstance().getTemp();
                            R1.tipo = "string";
                            R1.codigo = Generador.getInstance().getpunteroh(R1.tmp);
                            R1.codigo+= Generador.getInstance().changeheap("H",valor);
                            R1.codigo+=Generador.getInstance().incheap("1");   
                            R1.codigo+=Generador.getInstance().changeheap("H","-1");
                            R1.codigo+=Generador.getInstance().incheap("1");
                            return this.sumarstrings(R1,R2);
                        case "char":
                            var valor=R1.tmp;
                            R1.tmp = Generador.getInstance().getTemp();
                            R1.tipo = "string";
                            R1.codigo = Generador.getInstance().getpunteroh(R1.tmp);
                            R1.codigo+= Generador.getInstance().changeheap("H",valor);
                            R1.codigo+=Generador.getInstance().incheap("1");   
                            R1.codigo+=Generador.getInstance().changeheap("H","-1");
                            R1.codigo+=Generador.getInstance().incheap("1");
                            valor=R2.tmp;
                            R2.tmp = Generador.getInstance().getTemp();
                            R2.tipo = "string";
                            R2.codigo = Generador.getInstance().getpunteroh(R2.tmp);
                            R2.codigo+= Generador.getInstance().changeheap("H",valor);
                            R2.codigo+=Generador.getInstance().incheap("1");   
                            R2.codigo+=Generador.getInstance().changeheap("H","-1");
                            R2.codigo+=Generador.getInstance().incheap("1");
                            return this.sumarstrings(R1,R2);
                        
                            default:
                                res.tipo=this.gettipo(tipo1,tipo2);
                                if(res=="error"){
                                    n = new N_Error("Semantico", "No es posible operacion " + tipo1 + " + " + tipo2, fila, columna);
                                    res.Valor = n;
                                    L_Error.getInstance().insertar(n);
                                    return res;
                                }else{
                                    res.tmp=Generador.getInstance().getTemp();
                                    res.codigo=R1.codigo+R2.codigo;
                                    res.codigo+=Generador.getInstance().makecomentario("Realizando operacion: "+R1.tmp+"+"+R2.tmp);
                                    res.codigo+=Generador.getInstance().make3d("+",R1.tmp,R2.tmp,res.tmp);
                                    return res;
                                }
                    }
                    case "boolean":
                        switch(tipo2){
                            case "string":
                                var value=R1.tmp;    
                                R1.tmp = Generador.getInstance().getTemp();
                                R1.tipo = "string";
                                R1.codigo = Generador.getInstance().getpunteroh(R1.tmp);
                                
                                if(value=="1"){
                                    value="true";
                                }else{
                                    value="false";
                                }
                                for(var n=0;n<value.length;n++){
                                    R1.codigo+=Generador.getInstance().changeheap("H",value.charCodeAt(n));
                                    R1.codigo+=Generador.getInstance().incheap("1");   
                                }
                                R1.comentario=value;
                                R1.codigo+=Generador.getInstance().changeheap("H","-1");
                                R1.codigo+=Generador.getInstance().incheap("1");
                                return this.sumarstrings(R1,R2);

                                default:
                                    n = new N_Error("Semantico", "No es posible operacion " + tipo1 + " + " + tipo2, fila, columna);
                                    res.Valor = n;
                                    res.tipo="error";
                                    L_Error.getInstance().insertar(n);
                                    return res;
                        }
            }
            
        }

        gettipo(tipo1,tipo2){
   
            switch(tipo1){
                case "integer":
                    switch(tipo2){
                        case "double":
                            return "double";
                        case "integer":
                        case "char":
                            return "integer";
                        default: return "error";
                    }
                    
                case "double":
                    switch(tipo2){
                        case "double":
                        case "integer":
                        case "char":
                            return "integer";
                        default: return "error";
                    }

                case "char":
                    switch(tipo2){
                        case "double":
                            return "double";
                        case "integer":
                        case "char":
                            return "integer";
                        default: return "error";
                    }
                default: return "error";
            }
        }

        castearnumero(R1){
            var temp0=Generador.getInstance().getTemp();
            var temp1=Generador.getInstance().getTemp();
            R1.codigo+=Generador.getInstance().makecomentario("Procesando casteo de "+R1.tmp);
            R1.codigo+=Generador.getInstance().makeasignacion(R1.tmp,temp0);
            R1.codigo+=Generador.getInstance().getfromP(temp1,(this.pilaactual.size+2));
            R1.codigo+=Generador.getInstance().changestack(temp1,temp0);
            R1.codigo+=Generador.getInstance().incP(this.pilaactual.size);
            R1.codigo+=Generador.getInstance().makecall('obtenerCadena_');
            R1.codigo+=Generador.getInstance().getfromStack('P',temp0);
            R1.codigo+=Generador.getInstance().make3d('+',temp0,'4',temp0);
            R1.codigo+=Generador.getInstance().decP(this.pilaactual.size);
            R1.tmp=temp0;
            return R1;
        }

        procesarcadena(temporal,nombre_cad){
            var codigo="";
            var temp1 = Generador.getInstance().getTemp();
            var temp2 = Generador.getInstance().getTemp();
            var etq0 = Generador.getInstance().getEtq();
            var etq1 = Generador.getInstance().getEtq();
            var etq2 = Generador.getInstance().getEtq();
            codigo+=Generador.getInstance().makecomentario("Procesando cadena: "+nombre_cad);
            codigo+=Generador.getInstance().makeasignacion(temporal,temp1);
            codigo+=Generador.getInstance().getheap(temp1,temp2);
            codigo+=etq0+":\n";
            codigo+=Generador.getInstance().jmpcondicional(temp2,"<>","-1",etq1);
            codigo+=Generador.getInstance().jmpincondicional(etq2);
            codigo+=etq1+":\n";
            codigo+=Generador.getInstance().changeheap('H',temp2);
            codigo+=Generador.getInstance().incheap('1');
            codigo+=Generador.getInstance().make3d("+",temp1,"1",temp1);
            codigo+=Generador.getInstance().getheap(temp1,temp2);
            codigo+=Generador.getInstance().jmpincondicional(etq0);
            codigo+=etq2+": \n";
            return codigo;
        }
    }
