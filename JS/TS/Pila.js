class Pila{
    constructor(ambito){
        this.size=2;
        this.inicio=null;
        this.fin=null;
        this.ambito=ambito;
    }

    reiniciar(){
        this.size=2;
        this.inicio=null;
        this.fin=null;
    }

    push(nueva)
    {
        if (this.existe(nueva.nombre)) return false;

        //Console.WriteLine("ingresando a la pila variable: '" + nueva.nombre + "' con un valor de: " + nueva.valor.valor);
        if (this.inicio == null)
        {
            this.inicio = nueva;
            this.fin = nueva;
        
        }
        else
        {
            nueva.anterior=this.fin;
            this.fin.siguiente=nueva;
            this.fin = nueva;
           
        }
        this.size++;

        return true;
    }
    pop()
    {
        if (this.size == 0) { return null; } //la pila esta vacia  

        var devolver = ultimo; //se devuelve el ultimo insertado
        this.fin = this.fin.anterior; //se reescribe el ultimo 
        if (this.fin == null) this.inicio = null;
        this.size--; //se disminuye el tamaño
        return devolver;
    }

    vaciarPila()
    {
        while (!this.fin.nombre=="$$" && !this.fin.nombre()=="$") { var aux = pop(); }//vaciar hasta $ o $$
        pop();
    }
    existe(nombre){
        if(nombre=="$$"||nombre=="$") return false;
        var actual = this.fin;

        while(actual!=null){
            if(actual.nombre.toUpperCase()==nombre.toUpperCase()){
                console.log(actual.nombre.toUpperCase());
                console.log(nombre.toUpperCase());
                console.log('aca esta malo')
                return true;
            }
            actual = actual.anterior;
        }

        return false;

    }

    obtener(nombre)
    {
        var actual = this.fin; //el nodo actual siempre es el ultimo de la pila
        if (actual==null)return null; 
            
        
        for (var i = 0; i < this.size-2; i++)
        {
            if (actual.nombre.toUpperCase()==nombre.toUpperCase())
            {
                return actual;   
            }
            else if (actual.nombre=="$$") return null;
            actual = actual.anterior;
        }
        return null;
    }
}