 class Metodo {

    constructor(){
    this.nombre = "";
    this.tipo = "";
    this.metodo = null;
    this.parametros=[];
    this.temporales=[];
    this.etqReturn = "";
    this.etiqueta = "";
    this.posInicial = 0;
    this.pila= new Pila();
    this.hijos=null;
    this.traducido=false;
    this.nombretraducido="";
    }


     buscarsim(variable) {
        var s = null;

        s = this.pila.obtener(variable);

        if (s != null) {
            return s;
        }

        return s;
    }

    buscarmetodotrad(nombre,parametros,original) {
        var nt = null;

        nt = traducidas.existe(nombre);

        if (nt != null) {
            if (buscarmetodost(original, parametros)) {
                return null;
            }
            return nt;
        }

        if (clase != null) {
            nt = clase.buscarmetodotrad(nombre, parametros, original);
        } else if (metodo != null) {
            nt = metodo.buscarmetodotrad(nombre, parametros, original);
        }

        return nt;
    }

    insertarmetodo(m) {
        var metodo;
        for(var i=0; i <this.metodos.size();i++){
            metodo=this.metodos.get(i);
            if(metodo.get(i).nombre.equals(m.nombre)){
                if(metodo.get(i).parametros.size()==m.parametros.size()){
                    for(var j=0;j<this.metodos.get(i).parametros.size();j++){
                        if(metodo.parametros.get(i).tipo==m.parametros.get(i).tipo){
                            return;
                        }
                    }
                }
            }
        }
        metodos.add(m);
    }
    /*
    public Metodo buscarmetodo(String nombre, int parametros) {
        Metodo m = null;

        Metodo me;
        for (int i = metodos.size() - 1; i >= 0; i--) {
            me = metodos.get(i);
            if (me.nombre.equals(nombre) && me.parametros.size() == parametros) {
                return me;
            }
        }

        if (clase != null) {
            m = clase.buscarmetodo(nombre, parametros);
        } else if (metodo != null) {
            m = metodo.buscarmetodo(nombre, parametros);

        }

        return m;
    }
    */

    buscarmetodost(nombre,parametros) {

        for(var i = 0; i < this.metodos.size();i++){
            if(this.metodos.get(i).nombre.equals(nombre) &&
               this.metodos.get(i).parametros.size()==parametros &&
               this.metodos.get(i).traducido==false){
                   return true;
               }
        }
        return false;
    }
}
