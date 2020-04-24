
var numberTabs = 1;

$(document).on('ready', function() {
  $('#tabs .menu .tab').tab({});
  appendTab('tabs', 'Tab 1');
});

function closeLoad(e) {
  $("#" + 'loader-' + e).removeClass('active');
}

$(document).on('click', '#tAdd', function() {
  appendTab('tabs');
});

$(document).on('click', '.btnx', function(e) {
  deleteTab('tabs', e.target.id.replace('btnx-', ''));
});

function appendTab(tab, nombre, contenido) {
  var t = $("#" + tab + " .tabsName");
  var tt = $("#" + tab);
  //var tl = t.find('.item').length;
  var n = (!!nombre ? nombre : ("tab " + (numberTabs).toString()));
  var tn = (!!nombre ? nombre.replace(/\s/g, '') : ("tab" + (numberTabs).toString()));
  contenido = !!contenido ? contenido : 'Content ' + tn;
  numberTabs++;
  if (!$("#tab-" + tn).length) {

    t.find('#tAdd').remove();
    t.append('<a class="item tab" data-tab="' + tn + '" id="tab-' + tn + '">' + n + ' <i class="close icon btnx" id="btnx-' + tn + '"></i></a>')
      .append('<a class="item tabx" id="tAdd"><i class="add square icon"></i></a>');

    tt.append('<div class="ui tab tabc segment" data-tab="' + tn + '" id="tab-c-' + tn + '">'+'<textarea id="editor'+numberTabs+'"></textarea>' + 
    '<br><button onclick="final(veditor'+numberTabs+',consola'+numberTabs+')">Analizar</button><br>'+'<br><textarea id="consola'+numberTabs+'"></textarea>'+' </div>')
    $('#tabs .menu .tab').tab({});

    var script= document.createElement("script");
    script.innerHTML="var veditor"+numberTabs+" = CodeMirror.fromTextArea(document.getElementById('editor"+numberTabs+"'), {"+
      'mode: "javascript",'+
      'lineNumbers: true,'+
  '});'+
  '\nveditor'+numberTabs+'.save()';
    console.log(script);
    document.head.appendChild(script);

  }
  $("#tab-" + tn).click();
}

function final(id,consola){
    alert(id.getValue());
    consola.value='';
    L_Error.getInstance().reiniciar();
    try{
      var resultado= gramatica.parse(id.getValue()); 
      consola.value=L_Error.getInstance().getErrores();
       console.log(resultado);
       console.log(imprimir(resultado));
    }catch(error){
        consola.value=L_Error.getInstance().getErrores();
        console.log(error);
    }
}

function imprimir(raiz){
  var texto ="";
  var contador=1;
  texto+="digraph G{ \nNode[shape=BOX]\n";
  texto+="Node0[label=\"" + escapar(raiz.tag +" | "+raiz.value) + "\"];\n";

  recorrido("Node0",raiz);

  texto+= "}";

  return texto;

  function recorrido(padre,hijos){
    if(hijos === undefined || hijos === null) return;

    //console.log(typeof hijos);

    if(typeof hijos=="string")return;
    for(var i=0;i<hijos.childs.length;i++){
      console.log(typeof hijos.childs[i].tag);
      if(typeof hijos.childs[i].tag=="undefined")continue;
     var nombrehijo= "Node"+contador;
      texto+=nombrehijo+"[label=\"" + escapar(hijos.childs[i].tag +" | "+hijos.childs[i].value) + "\"];\n";
      texto+=padre+"->"+nombrehijo+";\n";
      contador++;
        recorrido(nombrehijo,hijos.childs[i]);
    }
    
  }

  function escapar(cadena) {
    cadena = cadena.replace("\\", "\\\\");
    cadena = cadena.replace("\"", "\\\"");
    return cadena;
}


}

function deleteTab(tab, nombre) {
    var n = nombre;
    var tt = $("#" + tab + " .tabsName");
    var tl = tt.find('.item').length;
    var t = $("#tab-" + n);
    var tc = $("#tab-c-" + n);
    if (!!n) {
      $('.small.modal').modal({
        closable: false,
        onDeny: function() {
          //alert('No!');
          //return false;
        },
        onApprove: function() {
          t.remove();
          tc.remove();
          if (tl > 0) {
            var tb = $("#" + tab + " div a.tab")[tl - 4];
            console.log(tb)
            $(tb.click());            
            var u ="#"+tb.id;
            console.log(u);
            location.href=u;
          }
          $('#tabs .menu .tab').tab({});
        }
      }).modal('show');
    }
  }
  //--------------------------------------