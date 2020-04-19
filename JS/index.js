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
    '<button onclick="final(editor'+numberTabs+')"></button>'+' </div>')
    $('#tabs .menu .tab').tab({});

  }
  $("#tab-" + tn).click();
}

function final(id){
    alert(id.value);
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