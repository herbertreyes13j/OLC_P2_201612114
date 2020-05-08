class Nodo3D{
    constructor(){
        this.tmp = "";
        this.codigo="";
        this.tipo="";
        this.etqV="";
        this.etqF="";
        this.comentario="";
        this.dimensiones=0;
        this.op_rel="";
        this.necesitareferencia=false;
    }

    setComentario(c1,c2,c3){
        this.comentario=c1+c2+c3;
    }
     addCodigo(){
        for (var i = 0; i < arguments.length; i++) {
            this.codigo+=arguments[i];
        }
     }
}