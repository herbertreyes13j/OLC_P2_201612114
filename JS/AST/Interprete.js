
class Interprete{
  constructor(){
    this.global = new Pila("global");
    this.mglobal = [];
    this.estructuras=[];
    Generador.getInstance().reiniciar();
  }

  analizar(raiz){

    this.primerapasada(raiz);
    return this.traductor3D(raiz,this.global,null);

  }
  
  primerapasada(raiz){
    var nodo;

    if(raiz===undefined || raiz===null)return;

      
      switch(raiz.tag){
        case "RAIZ":
        this.primerapasada(raiz.childs[0]);
        break;

        case "SENTENCIAS":
          for(var i =0; i<raiz.childs.length;i++){
            if(raiz.childs[i] === null || raiz.childs[i] === undefined) continue;
            this.primerapasada(raiz.childs[i]);
          }
        break;
        case "FUNCION":
            var metodo = new Metodo();
            nodo=raiz;
            metodo.nombre=nodo.childs[1].value;
            if(nodo.childs[0].tag=="TIPO"){
              metodo.tipo=nodo.childs[0].value;
            }else{
              metodo.tipo='arr_'+nodo.childs[0].value;
            }

            for(var j=0;j<nodo.childs[2].childs.length;j++){
              var parametro=nodo.childs[2].childs[j];
              if(parametro.tag=="VACIO"){
                break;
              }
              var tipo;
              if(parametro.childs[0].tag=="TIPO"){
                tipo=parametro.childs[0].value;
              }else{
                tipo='arr_'+parametro.childs[0].value;
              }
              var s = new Simbolo(parametro.childs[1].value,tipo,"","","","");
              metodo.parametros.push(s);
            }

            metodo.hijos=nodo.childs[3];
            this.verificarmetodo(metodo,nodo.fila,nodo.columna);
        break;
      }
    
  }

  traductor3D(raiz,pila,metodo){
    var nodo;
    var op;
    var valor;
    var s;
    var codigo="";
    if(raiz===undefined || raiz===null)return;


      switch(raiz.tag){
        case "RAIZ":
       
        var aux=this.traductor3D(raiz.childs[0],pila,metodo); 
        var etq=Generador.getInstance().getEtq();

        Generador.getInstance().addprincipal(Generador.getInstance().jmpincondicional(etq));
        aux+=Generador.getInstance().makecall("principal");
        aux+=Generador.getInstance().getprincipal();
        aux+=Generador.getInstance().getAux3d();
        aux+=Generador.getInstance().getNativos();
        codigo=Generador.getInstance().getencabezado();
        codigo+=aux;
        codigo+=etq+':\n';
        console.log(codigo);
        return codigo;
        case "SENTENCIAS":
          
          for(var i =0; i<raiz.childs.length;i++){
            if(raiz.childs[i] === null || raiz.childs[i] === undefined) continue;
            
            codigo+=this.traductor3D(raiz.childs[i],pila,metodo);
          }
        break;
        case "BLOQUE":
          
          for(var i =0; i<raiz.childs.length;i++){
            if(raiz.childs[i] === null || raiz.childs[i] === undefined) continue;
            
            codigo+=this.traductor3D(raiz.childs[i],pila,metodo);
          }
        break;
        case "DECLARACION1":
           nodo=raiz;
           var tipo;
           if(nodo.childs[0].tag=="TIPO"){
            tipo=nodo.childs[0].value;
           }else{
              if(nodo.childs[0].tag=="ARREGLO"){
                tipo = "arreglo";
              }
           }
        op = new Operador(this);
        var valor = op.ejecutar(nodo.childs[2],pila,metodo);
        console.log(valor);
        for(var j=0; j < nodo.childs[1].childs.length;j++){
          var ref;
          if(this.esprimtivo(valor.tipo)){
              ref=false;
          }else{
              ref=true;
          }
          if(this.esprimtivo(tipo)||tipo=="string"){
            
            s = new Simbolo(nodo.childs[1].childs[j].value,valor.tipo,pila.ambito,
              pila.size,ref,pila.ambito);
         
          }else if (tipo=="arreglo"){
            tipo="arr_"+nodo.childs[0].value.toLowerCase();
            if(valor.tipo=="lista"){
              var temp = Generador.getInstance().getTemp();
              valor.codigo+=Generador.getInstance().getfromP(temp,pila.size);
              valor.codigo+=Generador.getInstance().changestack(temp,valor.tmp);
            }else{
              
              var temp= Generador.getInstance().getTemp();
              valor.codigo+=Generador.getInstance().getfromP(temp,pila.size);
              valor.codigo+=Generador.getInstance().changestack(temp,valor.tmp);
            }
            s = new Simbolo(nodo.childs[1].childs[j].value,tipo,pila.ambito,pila.size,ref,pila.ambito);
          }else{
            var est = this.obtenerestructura(tipo);
            if(est==null){

            }
            s = new Simbolo(nodo.childs[1].childs[j].value,tipo,pila.ambito,pila.size,ref,pila.ambito);
          }
         
          if(!pila.push(s)){
            L_Error.getInstance().insertar(new N_Error("Semantico","Variable \""+s.nombre+"\" ya esta definida",
                                           nodo.childs[1].childs[j].fila,nodo.childs[1].childs[j].columna));
          }else{
            codigo+=Generador.getInstance().makecomentario("Asignacion de Variable \""+s.nombre+"\"");
            codigo+=Generador.getInstance().makecomentario("Codigo 3D Previo");
            codigo+=valor.codigo;
            var etq=Generador.getInstance().getTemp();
            codigo+=Generador.getInstance().makecomentario("Asignando apuntador, y asignar valor del temporal a Stack");
            codigo+=Generador.getInstance().getfromP(etq,s.apuntador);
            codigo+=Generador.getInstance().changestack(etq,valor.tmp);
          }
        }
        return codigo;
        
        case "ASIGNACION":
          op = new Operador(this);
          var id=raiz.childs[0].value;
          valor=op.ejecutar(raiz.childs[1],pila,metodo);
          var simbolo=null;
          simbolo=pila.obtener(id);
          if(simbolo==null){
            simbolo=this.global.obtener(id);
          }
          if(simbolo!=null){
            if(simbolo.referencia &&!(metodo===null || metodo.nombre=="principal")){
              codigo+=valor.codigo;
              console.log("Haciendo por referencia");
              var tmpx=Generador.getInstance().getTemp();
              codigo+=Generador.getInstance().getfromP(tmpx,simbolo.apuntador);
              var aux= Generador.getInstance().getTemp();
              var tempo=Generador.getInstance().getTemp();
              codigo+=Generador.getInstance().getfromStack(tmpx,aux);
              codigo+=Generador.getInstance().changestack(aux,valor.tmp);
            }else{
              codigo+=Generador.getInstance().makecomentario("Haciendo Asignacion de: "+id);
              codigo+=valor.codigo;
              var etq=Generador.getInstance().getTemp();
              codigo+=Generador.getInstance().getfromP(etq,simbolo.apuntador);
              codigo+=Generador.getInstance().changestack(etq,valor.tmp);
            }
            //Recordar verificar tipos y la gran
            
          }else{
            //Error
          }
          return codigo;

        case "IF":
            op = new Operador(this);
            var valor=op.ejecutar(raiz.childs[0],pila,metodo);

            if(valor.tipo=="boolean"){
              var salida=Generador.getInstance().getEtq();
              codigo+=Generador.getInstance().makecomentario("Codigo de IF");
              codigo+=valor.codigo;
              codigo+=valor.etqV+":\n";
              codigo+=this.traductor3D(raiz.childs[1],pila,metodo);
              codigo+=Generador.getInstance().makecomentario("Ir a etiqueta de Salida");
              codigo+=Generador.getInstance().jmpincondicional(salida);
              codigo+=valor.etqF+":\n"; 
              if(raiz.childs.length==3){
                if(raiz.childs[2].tag=="ELSE"){
                  codigo+=Generador.getInstance().makecomentario("Codigo de ELSE");
                  codigo+=this.traductor3D(raiz.childs[2].childs[0],pila,metodo);
                  codigo+=Generador.getInstance().jmpincondicional(salida);
                }else{
                  raiz.childs[2].childs.forEach(nodo => {
                    if(nodo.value=="ELIF"){
                      op = new Operador(this);
                      valor=op.ejecutar(nodo.childs[0],pila,metodo);
                      if(valor.tipo=="boolean"){
                        codigo+=Generador.getInstance().makecomentario("Codigo de ELIF");
                        codigo+=valor.codigo;
                        codigo+=valor.etqV+":\n";
                        codigo+=this.traductor3D(nodo.childs[1],pila,metodo);
                        codigo+=Generador.getInstance().makecomentario("Ir a etiqueta de Salida");
                        codigo+=Generador.getInstance().jmpincondicional(salida);
                        codigo+=valor.etqF+":\n"; 
                      }else{
                        L_Error.getInstance().insertar(new N_Error("Semantico","Tipo :"+valor.tipo +" no es una expresion valida para el elif",
                        nodo.childs[0].fila,nodo.childs[0].columna));
                      }
                    }else{
                      codigo+=Generador.getInstance().makecomentario("Codigo de ELSE    ");
                      codigo+=this.traductor3D(nodo.childs[0],pila,metodo);
                      codigo+=Generador.getInstance().jmpincondicional(salida);
                    }
                  });
                }
              

              }
              codigo+=salida+":\n";
            }else{
              L_Error.getInstance().insertar(new N_Error("Semantico","Tipo :"+valor.tipo +" no es una expresion valida para el if",
              raiz.childs[0].fila,raiz.childs[0].columna));
            }


          return codigo;

        case 'LLAMADA':
            var resp=this.llamada(raiz,pila,metodo);
        return resp.codigo;

        case "RETURN":
            if(raiz.childs[0]===undefined || raiz.childs[0]===null){
              codigo+=Generador.getInstance().jmpincondicional(metodo.etiqueta);
            }else{
              op = new Operador(this);
              codigo+=Generador.getInstance().makecomentario("Codigo de Return");
              var resultado=op.ejecutar(raiz.childs[0],pila,metodo);
              codigo+=resultado.codigo;
              codigo+=Generador.getInstance().makecomentario("Asignando valor de Return al return de metodo");
              var temporal=Generador.getInstance().getTemp();
              codigo+=Generador.getInstance().getfromP(temporal,"1");
              codigo+=Generador.getInstance().changestack(temporal,resultado.tmp);
              codigo+=Generador.getInstance().jmpincondicional(metodo.etiqueta);
            }
            metodo.temporales=[];
            return codigo;
        case "PRINT":
        nodo=raiz;
        op = new Operador(this);

        var valor= op.ejecutar(nodo.childs[0],pila,metodo);
        if(valor.tipo=="error"){
          return codigo;
        }
        codigo+=Generador.getInstance().makecomentario("Codigo 3D Funcion Print");
        console.log(valor);
        codigo+=Generador.getInstance().makecomentario("Codigo Generado de la Expresion \""+valor.comentario+"\"");
       

        if(valor.tipo=="boolean"){
          console.log(valor);
              var salida=Generador.getInstance().getEtq();
              valor.tmp = Generador.getInstance().getTemp();
              valor.tipo = "string";
              valor.codigo+=Generador.getInstance().makecomentario("Conviertiendo booleano a String")
              valor.codigo+=valor.etqV+":\n"
              valor.codigo += Generador.getInstance().getpunteroh(valor.tmp);
              var value="true";
              for(var n=0;n<value.length;n++){
                valor.codigo+=Generador.getInstance().changeheap("H",value.charCodeAt(n));
                valor.codigo+=Generador.getInstance().incheap("1");   
            }
              valor.codigo+=Generador.getInstance().changeheap("H","-1");
              valor.codigo+=Generador.getInstance().incheap("1");
              valor.codigo+=Generador.getInstance().jmpincondicional(salida);
              value="false";
              valor.codigo+=valor.etqF+":\n";
              valor.codigo += Generador.getInstance().getpunteroh(valor.tmp);
              for(var n=0;n<value.length;n++){
                valor.codigo+=Generador.getInstance().changeheap("H",value.charCodeAt(n));
                valor.codigo+=Generador.getInstance().incheap("1");   
              }
              valor.codigo+=Generador.getInstance().changeheap("H","-1");
              valor.codigo+=Generador.getInstance().incheap("1");
              valor.codigo+=Generador.getInstance().jmpincondicional(salida);
              valor.codigo+=salida+": \n";
            
        }
        codigo+=valor.codigo;
        var ambito=pila.size;
        //Cambiar ambito

        var temp1=Generador.getInstance().getTemp();
        var temp2= Generador.getInstance().getTemp();
        codigo+=Generador.getInstance().getfromP(temp1,ambito);
        codigo+=Generador.getInstance().make3d("+",temp1,"0",temp2);
        codigo+=Generador.getInstance().changestack(temp2,valor.tmp);
        codigo+=Generador.getInstance().make3d("+",temp1,"1",temp2);
        codigo+=Generador.getInstance().changestack(temp2,'1');
        codigo+=Generador.getInstance().incP(ambito);
 
          switch(valor.tipo){
            case "integer":
              codigo+=Generador.getInstance().makecall("print_int_");
            break;
  
            case "char":
            codigo+=Generador.getInstance().makecall("print_char_");
            break;
            case "double":
              codigo+=Generador.getInstance().makecall("print_decimal_");
            break;
  
            case "string":
            codigo+=Generador.getInstance().makecall("print_string_");
            break;
          }

        


        codigo+=Generador.getInstance().decP(ambito);
        return codigo;  
      
        case "SWITCH":
          console.log(raiz);
          op = new Operador(this);
          valor=op.ejecutar(raiz.childs[0],pila,metodo);
          var aux,etqV,etqF;
          var escape = Generador.getInstance().getEtq();
          PilaEscape.getInstance().push(new NodoEscape(escape,"","switch"));
          codigo+=Generador.getInstance().makecomentario("Inicio de Switch");
          codigo+=valor.codigo;
          raiz.childs[1].childs.forEach(element => {
            op= new Operador(this);
            aux=op.ejecutar(element.childs[0],pila,metodo);
            if(aux.tipo==valor.tipo){
              codigo+=Generador.getInstance().makecomentario("CASE: "+aux.comentario);
              codigo+=aux.codigo;
              etqV=Generador.getInstance().getEtq();
              etqF=Generador.getInstance().getEtq();
              codigo+=Generador.getInstance().jmpcondicional(valor.tmp,"==",aux.tmp,etqV);
              codigo+=Generador.getInstance().jmpincondicional(etqF);
              codigo+=etqV+":\n";
              codigo+=this.traductor3D(element.childs[1],pila,metodo);
              codigo+=etqF+":\n";
            }else{

            }
          });
          if(raiz.childs.length==3){
            codigo+=Generador.getInstance().makecomentario("Default");
            codigo+=this.traductor3D(raiz.childs[2].childs[0],pila,metodo);
          }
          PilaEscape.getInstance().pop();
          codigo+=escape+":\n";
        return codigo;

        case "BREAK":
          var ne = PilaEscape.getInstance().obtener("all");
          if(ne!=null){
            codigo+=Generador.getInstance().makecomentario("Break");
            codigo+=Generador.getInstance().jmpincondicional(ne.etqSalida);
          }
        return codigo;

        case "CONTINUE":
          var ne = PilaEscape.getInstance().obtener("while");
          if(ne!=null){
            codigo+=Generador.getInstance().makecomentario("Continue");
            codigo+=Generador.getInstance().jmpincondicional(ne.etqEntrada);
          }
        return codigo;

        case "WHILE":
          op = new Operador(this);
          valor=op.ejecutar(raiz.childs[0],pila,metodo);
          var entrada=Generador.getInstance().getEtq();
          var salida=Generador.getInstance().getEtq();
          PilaEscape.getInstance().push(new NodoEscape(salida,entrada,"while"));
          //Validar error booleano
          codigo+=Generador.getInstance().makecomentario("WHILE");
          codigo+=entrada+":\n";
          codigo+=valor.codigo;
          codigo+=valor.etqV+":\n";
          codigo+=this.traductor3D(raiz.childs[1],pila,metodo);
          codigo+=Generador.getInstance().jmpincondicional(entrada);
          codigo+=valor.etqF+":\n";
          codigo+=Generador.getInstance().jmpincondicional(salida);
          codigo+=salida+":\n";
          PilaEscape.getInstance().pop();

        return codigo;

        case "DO_WHILE":
          op = new Operador(this);
          valor=op.ejecutar(raiz.childs[1],pila,metodo);
          var entrada=Generador.getInstance().getEtq();
          var salida=Generador.getInstance().getEtq();
          PilaEscape.getInstance().push(new NodoEscape(salida,entrada,"while"));
          //Validar error booleano
          codigo+=Generador.getInstance().makecomentario("DO WHILE");
          codigo+=Generador.getInstance().jmpincondicional(valor.etqV);
          codigo+=entrada+":\n";
          codigo+=valor.codigo;
          codigo+=valor.etqV+":\n";
          codigo+=this.traductor3D(raiz.childs[0],pila,metodo);
          codigo+=Generador.getInstance().jmpincondicional(entrada);
          codigo+=valor.etqF+":\n";
          codigo+=Generador.getInstance().jmpincondicional(salida);
          codigo+=salida+":\n";
          PilaEscape.getInstance().pop();

        return codigo;
          
        case "ESTRUCTURA":
          var id = raiz.childs[0].value;
          op = new Operador(this);
          
          codigo+="proc strc_"+id.toLowerCase() +" begin \n";
          var est=new Estructura(id);
          var posp=Generador.getInstance().getTemp();
          var posh=Generador.getInstance().getTemp();
          codigo+=Generador.getInstance().getfromP(posp,"0");
          codigo+=Generador.getInstance().getfromStack(posp,posh);
          codigo+=Generador.getInstance().incheap(raiz.childs[1].childs.length);
          var aux=Generador.getInstance().getTemp();
          var cuenta=0;
          raiz.childs[1].childs.forEach(element => {
            if(element.childs[0].value=="DECLARACION"){
              valor=op.ejecutar(element.childs[0].childs[2],pila,metodo);
              var at = new Atributo(element.childs[0].childs[1].value,cuenta,element.childs[0].childs[0].value);
              est.insertar(at);
              codigo+=Generador.getInstance().makecomentario("Atributo por Defecto");
              codigo+=valor.codigo;
              codigo+=Generador.getInstance().make3d("+",posh,cuenta,aux);
              codigo+=Generador.getInstance().changeheap(aux,valor.tmp);
              
              cuenta++;
            }else{
              var at = new Atributo(element.childs[1].value,cuenta,element.childs[0].value);
              codigo+=Generador.getInstance().make3d("+",posh,cuenta,aux);
              switch(at.tipo){
                case "integer":
                case "boolean":
                  codigo+=Generador.getInstance().changeheap(aux,0);
                  break;
                case "double":
                  codigo+=Generador.getInstance().changeheap(aux,'0.0');
                  break;
                case "char":
                  codigo+=Generador.getInstance().changeheap(aux,'\0');
                  break;
                default:
                  codigo+=Generador.getInstance().changeheap(aux,-11000000000);
                  break;
              }
              est.insertar(at);
              cuenta++;
            }
          });

        
        codigo+="end\n\n"
        Generador.getInstance().agregarAux(codigo);
        codigo="";  
        return codigo;  

        case "ASIGNACION_ARREGLO":
          return this.asignacionarreglo(raiz,pila,metodo);
      }

    

      

    
    return codigo;
  }

  asignacionarreglo(raiz,pila,metodo){
    
    var op  = new Operador(this);
    var codigo="";
    var temp1 = Generador.getInstance().getTemp();
    var res1 = this.accesoarreglo(raiz.childs[0],pila,metodo);
    var res2 = op.ejecutar(raiz.childs[1],pila,metodo);
    codigo+=res1.codigo;
    codigo+=res2.codigo;
    codigo+=Generador.getInstance().makecomentario("Haciendo asignacion de arreglo");
    console.log('ANALIZANDO');
    console.log(res2);
    codigo+=Generador.getInstance().changeheap(res1.tmp,res2.tmp);
    return codigo;
    


  }

  accesoarreglo(raiz,pila,metodo){
    
    if(raiz.childs[0].tag=="id"){
      var simbolo=null;
      var operador=new Operador(this);
      var indice= operador.ejecutar(raiz.childs[1]);
      var Resultado= new Nodo3D();
      simbolo=pila.obtener(raiz.childs[0].value);

      if(simbolo==null)simbolo=this.global.obtener(raiz.childs[0].value);

      if(simbolo==null){
        //error
      }
      console.log('simbolo');
      console.log(simbolo);
      if(simbolo.tipo.includes("arr_")){
        var temp = Generador.getInstance().getTemp();
        Resultado.tmp= Generador.getInstance().getTemp();
        Resultado.codigo=Generador.getInstance().getfromP(temp,simbolo.apuntador);
        Resultado.codigo+=Generador.getInstance().getfromStack(temp,temp);
        Resultado.codigo+=Generador.getInstance().make3d("+",temp,"1",temp);
        Resultado.codigo+=Generador.getInstance().make3d("+",temp,indice.tmp,Resultado.tmp);
        Resultado.tipo=simbolo.tipo.replace("arr_","");
        return Resultado; 
        
      }else{
        //Error
      }

    }else{

    }
  }
  

  inicializacion(raiz,pila,metodo){
    var tipo = raiz.childs[0].value;
    var op = new Operador(this);
    var res=op.ejecutar(raiz.childs[1],pila,metodo);
    var defecto="";
    switch(tipo){
      case "double":
        defecto="0.0";
      break;
      case "integer":
      case "boolean":
        defecto="0";
        break;
      case "char":
        defecto='\0';
        break;
      default:
        defecto="-11000000000"
        break;
    }
    
    console.log(defecto);
    var codigo="";
    var Resultado= new Nodo3D();
    Resultado.tmp=Generador.getInstance().getTemp();
    codigo+=res.codigo;
    codigo+=Generador.getInstance().getpunteroh(Resultado.tmp);
    codigo+=Generador.getInstance().changeheap(Resultado.tmp,res.tmp);
    codigo+=Generador.getInstance().incheap(res.tmp);
    codigo+=Generador.getInstance().incheap(1);

    var aux = Generador.getInstance().getTemp();
    var aux2= Generador.getInstance().getTemp();
    codigo+=Generador.getInstance().make3d("+",Resultado.tmp,"1",aux);
    codigo+=Generador.getInstance().make3d("+",aux,res.tmp,aux2);
    var sentencias=Generador.getInstance().changeheap(aux,defecto);
    sentencias+=Generador.getInstance().make3d("+",aux,"1",aux);
    codigo+=Generador.getInstance().generar_while(aux,"<",aux2,sentencias);

    Resultado.codigo=codigo;
    Resultado.tipo="arr_"+tipo;
    return Resultado;
    
    


  }
  accesos(raiz,pila,metodo){
    var Resultado = new Nodo3D();
    var simbolo;
    if(raiz.childs[0].tag=="id"){
      simbolo=pila.obtener(raiz.childs[0].value);
      if(simbolo==null){
        this.global.obtener(raiz.childs[0].value);
      }
    }

    console.log(typeof simbolo);

    array.forEach(element => {
      
    });

  }

  instancia(id,pila){
    
    var Resultado = new Nodo3D();
    var metodo= this.obtenerestructura(id);
    if(metodo==null){

    }
    Resultado.codigo+=Generador.getInstance().makecomentario("INICIANDO INSTANCIA DE "+id);
    Resultado.tmp = Generador.getInstance().getTemp();
    Resultado.codigo+=Generador.getInstance().getpunteroh(Resultado.tmp);
    var aux = Generador.getInstance().getTemp();
    Resultado.codigo+=Generador.getInstance().getfromP(aux,pila.size);
    Resultado.codigo+=Generador.getInstance().changestack(aux,Resultado.tmp);
    Resultado.codigo+=Generador.getInstance().incP(pila.size);
    Resultado.codigo+=Generador.getInstance().makecall("strc_"+id.toLowerCase());
    Resultado.codigo+=Generador.getInstance().decP(pila.size);

    Resultado.tipo=id.toLowerCase();
    return Resultado;
  }


  verificarmetodo(m,fila,columna){
    var metodo;
    for(var i=0;i<this.mglobal.length;i++){
      metodo=this.mglobal[i];
      if(metodo.nombre.toUpperCase()==m.nombre.toUpperCase()){
        if(metodo.parametros.length==m.parametros.length){
          var iguales=true;
          for(var j=0;j<m.parametros.length;j++){
            if(m.parametros[j].tipo!=metodo.parametros[i].tipo){
              iguales=false;
            }
          }
          if(iguales){
            if(metodo.tipo==m.tipo){
              L_Error.getInstance().insertar(new N_Error("Sintactico","Metodo \""+m.nombre+"\" ya existe",fila,columna));
              return;
            }
        }
      }
    }
    
  }
  this.mglobal.push(m);
}

obtenermetodo(id,parametros,simbolos){
  var retorno=null;
  var nuevalista=[];
  var nuevoparametro=[];
     this.mglobal.forEach(metodo => {
       if(id.toUpperCase()==metodo.nombre.toUpperCase()){

        var iguales=true;
         if(metodo.parametros.length==parametros.length){
          if(simbolos.length>0){
            for (let index = 0; index < metodo.parametros.length; index++) {
                  var cuenta=0;
                  var encontro=false;
                  simbolos.forEach(element => {
          
                    if(element.nombre.toUpperCase()==metodo.parametros[index].nombre.toUpperCase() && element.tipo==metodo.parametros[index].tipo){
               
                      nuevalista.push(simbolos[cuenta]);
                      nuevoparametro.push(parametros[cuenta]);
                      encontro=true;
                    }
                    cuenta++;
                  }); 
                  if(encontro==false){iguales=false;};
            }
          }else{
            for (let index = 0; index < metodo.parametros.length; index++) {
              if(metodo.parametros[index].tipo!=parametros[index].tipo){
                  iguales=false;
              }
            }
          }
          
          if(iguales){
            if(simbolos.length>0 && simbolos.length==metodo.parametros.length){
              for (let index = 0; index < parametros.length; index++) {
                parametros[index] = nuevoparametro[index]; 
              }
              retorno= metodo;
            }else if(simbolos.length==0 && parametros.length==metodo.parametros.length){
              retorno= metodo;

            }else{
              console.log('ERROR GRAVE CON METODOS');
            }
            
          }else{
            console.log('error');
          }
         }
       }
     });
     return retorno;
}

llamada(raiz,pila,metodo){
  var id = raiz.childs[0].value;
  var codigo="";
  var parametros=[];
  var op = new Operador(this);
  var temporales=[];
  var codigoparametros="";
  var simbolos=[];
  raiz.childs[1].childs.forEach(nodo => {
    
    var cuentanombre=0;
    var cuentaparametro=0;
    if(nodo.tag=="ASIGNACION"){
      var resultado=op.ejecutar(nodo.childs[1],pila,metodo);
      parametros.push(resultado);
      var s= new Simbolo(nodo.childs[0].value,resultado.tipo,"","",false,"");
      simbolos.push(s);
      codigoparametros+=resultado.codigo;
      cuentanombre++;
    }else if(nodo.tag=="VALOR"){
      var resultado=op.ejecutar(nodo.childs[0],pila,metodo);
      resultado.necesitareferencia=false;
      parametros.push(resultado);
      codigoparametros+=resultado.codigo;
      cuentaparametro++;  
    }else{
      var resultado=op.ejecutar(nodo,pila,metodo);
      parametros.push(resultado);
      codigoparametros+=resultado.codigo;
      cuentaparametro++;  
    }
     
  });



  var metodo_actual = this.obtenermetodo(id,parametros,simbolos);

  if(metodo_actual===null || metodo_actual===undefined){

  }else{
    if(!metodo_actual.traducido){
      var p= new Pila(metodo_actual.nombre);
      for (let index = 0; index < metodo_actual.parametros.length; index++) {
        var ref;
        if(this.esprimtivo(metodo_actual.parametros[index].tipo)){
          ref=false;

        }else if (simbolos.length>1){
          ref = false;
        }else if(parametros[index].tipo=="string" && parametros[index].necesitareferencia==false){
          ref = false;
          console.log(parametros[index]);   
        }
        else{
          ref=true;
        }
        console.log('referencia');
        console.log(ref);
        p.push(new Simbolo(metodo_actual.parametros[index].nombre,metodo_actual.parametros[index].tipo,"",
        p.size,ref,metodo_actual.nombre));
        id=id+"_"+metodo_actual.parametros[index].tipo;
      }
      metodo_actual.nombre_traducido=id;
      metodo_actual.etiqueta=Generador.getInstance().getEtq();
      metodo_actual.traducido=true;
      var codtrad = "proc "+id +" begin\n";
      codtrad+=this.traductor3D(metodo_actual.hijos,p,metodo_actual);
      codtrad+=metodo_actual.etiqueta+": \n";
      codtrad=codtrad+"end\n\n"
      Generador.getInstance().agregarAux(codtrad);
      
    }

  
    var cuentavariables;

    if(metodo===null|| metodo.nombre=="principal"){
      cuentavariables=pila.size+1;
    }else{
      cuentavariables=pila.size+1+metodo_actual.temporales.length;
    }
    codigo+=codigoparametros;
    var cuenta;
    var conteo=0;
    if(!(metodo===null|| metodo.nombre=="principal")){
      codigo+=Generador.getInstance().makecomentario("Reservando Temporales");

      var aux= Generador.getInstance().getTemp();
      console.log('temporales')
      console.log(metodo.temporales);
      metodo.temporales.forEach(element => {
        codigo+=Generador.getInstance().makecomentario("Guardando el valor en posicion de Reserva");
        codigo+=Generador.getInstance().getfromP(aux,pila.size+conteo);
        codigo+=Generador.getInstance().changestack(aux,metodo.temporales[conteo]);   
        conteo++;
      });
     
    }

    
   

    var cuentan=2;
    codigo+=Generador.getInstance().makecomentario("Simulando cambio de ambito");
    cuenta=Generador.getInstance().getTemp();
    codigo+=Generador.getInstance().getfromP(cuenta,cuentavariables);
    var cuentita=0;
    parametros.forEach(element => {
      
      if(simbolos.length>0){
        codigo+=Generador.getInstance().makecomentario("Guardando el valor de parametro en la posicion de llamada");
        codigo+=Generador.getInstance().make3d("+",cuenta,"1",cuenta);
        codigo+=Generador.getInstance().changestack(cuenta,element.tmp);
      }else if(element.tipo=="string" && element.necesitareferencia==false){
        codigo+=Generador.getInstance().makecomentario("Guardando el valor de parametro en la posicion de llamada");
        codigo+=Generador.getInstance().make3d("+",cuenta,"1",cuenta);
        codigo+=Generador.getInstance().changestack(cuenta,element.tmp);
      }
      else if(this.esprimtivo(element.tipo)){
        codigo+=Generador.getInstance().makecomentario("Guardando el valor de parametro en la posicion de llamada");
        codigo+=Generador.getInstance().make3d("+",cuenta,"1",cuenta);
        codigo+=Generador.getInstance().changestack(cuenta,element.tmp);
      }else{
        var auxiliar= Generador.getInstance().getTemp();
        var nombre=metodo_actual.parametros[cuentita].nombre;
        var simbolo=pila.obtener(nombre);
        codigo+=Generador.getInstance().make3d("+",cuenta,"1",cuenta);
        codigo+=Generador.getInstance().getfromP(auxiliar,simbolo.apuntador);
        codigo+=Generador.getInstance().changestack(cuenta,auxiliar);
      }
      //codigo+=Generador.getInstance().makecomentario("Obteniendo codigo de parametro");
      //codigo+=element.codigo;
      cuentita++;
      cuentan++;
    });



    codigo+=Generador.getInstance().makecomentario("Cambio de ambito");
    codigo+=Generador.getInstance().incP(pila.size+conteo);
    codigo+=Generador.getInstance().makecall(metodo_actual.nombre_traducido);
    var tempretorno,aux;
    aux=Generador.getInstance().getTemp();
    tempretorno=Generador.getInstance().getTemp();
    
    codigo+=Generador.getInstance().getfromP(aux,"1");
    codigo+=Generador.getInstance().getfromStack(aux,tempretorno);
    codigo+=Generador.getInstance().decP(pila.size+conteo);
    if(!(metodo===null|| metodo.nombre=="principal")){
      codigo+=Generador.getInstance().makecomentario("Recuperando Temporales");
      var conteo=0;
      metodo.temporales.forEach(element => {
        codigo+=Generador.getInstance().getfromP(cuenta,pila.size+conteo);
        codigo+=Generador.getInstance().getfromStack(cuenta,element);
        conteo++;
      });
      metodo.temporales.push(tempretorno);
      
    }

    var resultado= new Nodo3D();
    resultado.tmp=tempretorno;
    resultado.codigo=codigo;
    resultado.tipo=metodo_actual.tipo;

    return resultado;
    

  }
}

  esprimtivo(tipo){
    switch(tipo){
      case "integer":
      case "double":
      case "boolean":
      case "char":
        return true;
      default: return false;
    }
  }

  obtenerestructura(nombre){
    var retorno=null;
    this.estructuras.forEach(element => {
      if(element.nombre.toUpperCase()==nombre.toUpperCase()){
        retorno=element;
        return element;
      }
    });
    return retorno;
  }

  insertarestructura(estructura){
    this.estructuras.forEach(element => {
      if(element.nombre.toUpperCase()==estructura.nombre.toUpperCase()){
        return false;
      }   
    });

    this.estructuras.push(estructura);
    return true;
  }
}

