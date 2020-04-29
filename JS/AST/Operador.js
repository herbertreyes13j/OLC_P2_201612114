class Operador{
    constructor(pilaactual,pilaglobal){
        this.pilaactual=pilaactual;
        this.pilaglobal=pilaglobal;
    }

    ejecutar(raiz){
        var Resultado1=null;
        var Resultado2=null;
        var Resultado=null;
        var cambio=0;

        switch (raiz.tag) {
            case "EXP":
                if (raiz.childs.length==3) {
                    Resultado1=this.ejecutar(raiz.childs[0]);
                    Resultado2=this.ejecutar(raiz.childs[2]);
                    var op = raiz.childs[1].value;
                    switch (op) {
                        case "+":
                            
                            break;
                    
                        default:
                            break;
                    }
                }else if(raiz.childs.length==2){

                }else{
                    return this.ejecutar(raiz.childs[0]);
                }
                
                break;
                case "ID":
                Resultado= new Nodo3D();
                var tmpx;                var simbolo=null;
                simbolo=this.pilaactual.obtener(raiz.value);
                if(simbolo==null){
                    simbolo=this.pilaglobal.obtener(raiz.value);
                }

                if(s!=null){
                    tmpx= Generador.getInstance().getTemp();
                    Resultado.codigo= Generador.getInstance().getfromP(tmpx,s.apuntador);
                    Resultado.tmp= Generador.getInstance().getTemp();
                    Resultado.codigo+= Generador.getInstance().getfromStack(Resultado.tmp,tmpx);
                    Resultado.tipo=s.tipo;
                    Resultado.comentario=s.nombre;
                    return Resultado;
                }else{
                    L_Error.getInstance().insertar(new Error("Semantico","Variable \""+raiz.value+"\" no existe",raiz.fila,raiz.columna));
                }
                break;
                
                case "integer":
                    Resultado= new Nodo3D();
                    Resultado.tmp=raiz.value;
                    Resultado.comentario=raiz.value;
                    Resultado.tipo="integer";
                    return Resultado;
                
                case "double":
                    Resultado= new Nodo3D();
                    Resultado.tmp=raiz.value;
                    Resultado.comentario=raiz.value;
                    Resultado.tipo="double";
                    return Resultado;
            default:
                break;
        }
    }
}