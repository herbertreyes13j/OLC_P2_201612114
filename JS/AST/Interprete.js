class Interprete{
  constructor(){
    this.global = new Pila("global");
    this.mglobal = [];
  }

  analizar(raiz){

    this.primerapasada(raiz);
    this.traductor3D(raiz,this.global);

  }
  
  primerapasada(raiz){
    var nodo;
    if(raiz===undefined || raiz===null)return;
    for(var i =0; i<raiz.childs.length;i++){
      if(raiz.childs[i] === null || raiz.childs[i] === undefined) continue;
      switch(raiz.childs[i].tag){
        case "FUNCION":
            var metodo = new Metodo();
            nodo=raiz.childs[i];
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
  }

  traductor3D(raiz,pila,metodo){
    var nodo;
    var op;
    var valor;
    var s;
    if(raiz===undefined || raiz===null)return;
    for(var i =0; i<raiz.childs.length;i++){
      if(raiz.childs[i] === null || raiz.childs[i] === undefined) continue;
      switch(raiz.childs[i].tag){
        case "DECLARACION1":
           nodo=raiz.childs[i];
           var tipo;
           if(nodo.childs[0].tag=="TIPO"){
            tipo=nodo.childs[0].value;
           }else{

           }
        op = new Operador(pila,this.global);
        var valor = op.ejecutar(nodo.childs[2]);
        console.log(valor);
        for(var j=0; j < nodo.childs[1].childs.length;j++){
          s = new Simbolo(nodo.childs[1].childs[j].value,valor.tipo,pila.ambito,
               pila.size,false,pila.ambito);
          if(!pila.push(s)){
            L_Error.getInstance().insertar(new Error("Semantico","Variable \""+s.nombre+"\" ya esta definida",
                                           nodo.childs[1].childs[j].fila,nodo.childs[1].childs[j].columna));
          };
        }
        break;
      }
    }
  }

  verificarmetodo(m,fila,columna){
    var metodo;
    for(var i=0;i<this.mglobal.length;i++){
      metodo=this.mglobal[i];
      if(metodo.nombre==m.nombre){
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

}
