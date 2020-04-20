var AST_Tree = {
    root : null,
    setRaiz(node){
        this.root = node;
    }  
};
function AST_Node(tag, value){

    this.tag = tag;
    this.value = value;

    this.childs = [];

    this.addChilds = addChilds;
    this.getSon = getSon;

    function addChilds(){
        for (var i = 0; i < arguments.length; i++) {
            this.childs.push(arguments[i]);
            if (arguments[i]!== null){
                arguments[i].padre = this;
            }
        }
    }  

    function getSon(pos){
        if(pos > this.hijos.length - 1) return null;
        return this.hijos[pos];
    }
 };