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
            encabezado+=this.getetiquetas();
            encabezado+='var Stack[];\n';
            encabezado+='var Heap[];\n';
            encabezado+='var P = 0;\n';
            encabezado+='var H = 0;\n';
        }

        anidaretiqueta(etq){
            if(this.etiquetas==""){
                this.etiquetas+=etq;
            }else{
                this.etiquetas+=","+etq
            }
            
        }

        getetiquetas(){
            return this.etiquetas+";";
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

        getfromStack(temporal, posicion) {
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

        getpunteroh(valor) {
            return valor + " = H;\n";
        }

        getfromP(temporal,apuntador){
            return temporal +"= P"+apuntador+";\n";
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
    
        salto_incondicional(etqdestino) {
            return "goto " + etqdestino + ";\n";
        }
    
        makecomentario(comentario) {
            return "#" + comentario + "\n";
        }
    
        makenegativo(inst,asignacion) {
            return asignacion + " = - " + inst1 + ";\n";
        }

        addprincipal(codigo){
            this.codeprincipal+=codigo+"\n";
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