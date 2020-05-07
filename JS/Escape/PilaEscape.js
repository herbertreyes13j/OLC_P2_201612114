var PilaEscape= (function(){
    var instancia;


    class PilaEscape{
        constructor(){
            this.inicio=null;
            this.ultimo=null;
        }

        push(nueva) {


            //Console.WriteLine("ingresando a la pila variable: '" + nueva.nombre + "' con un valor de: " + nueva.valor.valor);
            if (this.inicio == null) {
                this.inicio = nueva;
                this.ultimo = nueva;
    
            } else {
                nueva.anterior=this.ultimo;
                this.ultimo = nueva;
    
            }
    
            return true;
        }

         pop() {
            if (this.inicio == null) {
                return null;
            } //la pila esta vacia  
    
           var devolver = this.ultimo; //se devuelve el ultimo insertado
            this.ultimo = this.ultimo.anterior; //se reescribe el ultimo 
            if (this.ultimo == null) {
                this.inicio = null;
            }
            return devolver;
        }
        obtener(tipo) {

            var actual = this.ultimo; //el nodo actual siempre es el ultimo de la pila
            while (actual != null) {
                if (actual.tipo==tipo|| tipo=="all") {
                    return actual;
                }
                actual = actual.anterior;
            }
            return null;
        }


  
        
        reiniciar() {
            this.inicio=null;
            this.ultimo=null;
        }

        

 
    }



    function crearInstancia(){
        return new PilaEscape();
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