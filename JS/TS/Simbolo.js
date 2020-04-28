class Simbolo{
    constructor(nombre,tipo,visibilidad,apuntador,referencia,ambito){
        this.nombre=nombre;
        this.tipo=tipo;
        this.visibilidad=visibilidad;
        this.apuntador=apuntador;
        this.referencia=referencia;
        this.siguiente=null;
        this.anterior=null;
        this.ambito=ambito;
    }
}