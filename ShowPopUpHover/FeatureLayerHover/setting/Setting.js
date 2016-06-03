
define([
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidgetSetting',
    'dojo/request',
    'dojo/dom-construct',
    'dojo/query',
    'dojo/dom',
    'dojo/on', 
    'dijit/form/ValidationTextBox',
    'dijit/form/NumberTextBox',
    'dijit/form/TextBox',
    'dijit/form/CheckBox'
],
function(declare, _WidgetsInTemplateMixin, BaseWidgetSetting, request,domConstruct,query,dom,on) {

  return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
    baseClass: 'jimu-widget-in-panel-setting',

    startup: function(){
      //the config object is passed in
      this.inherited(arguments);
      var config = this.config;
      //If no configuration, we created it
      config.inPanelVar = config.inPanelVar || {}
      config.inPanelVar.params = config.inPanelVar.params || {}
      
      this.setConfig(this.config);
      
    },

    //Open config
    setConfig: function(config){
        this.config = config;
        var options = config.inPanelVar.params;
        // Load params if exists
        if (options && options.app_id) {
          this.app_id.set('value', options.app_id);
          this.count.set('value', options.count);
        }     
      return this.config;  
    },
 
      
    validateURL: function() {
           var a = 0;
           document.getElementById("contador").innerHTML = a;
           
           //The URL of service
           var murl = document.getElementById("urlLayer").value;
           var myURL = murl + "?f=json";
           
           var myDiv = document.getElementById("showList");
           var newInput = document.createElement("INPUT");
           var newSpace = document.createTextNode("        ");
           var newList = document.createElement("SELECT");
           newInput.id = "myInput";
           newList.id = "mySelect";
           var salto = document.createElement('br');
           myDiv.appendChild(salto);
           myDiv.appendChild(newInput);
           myDiv.appendChild(newSpace);
           myDiv.appendChild(newList);
           
           var http_request = new XMLHttpRequest();
           http_request.onreadystatechange = function() {
               if (http_request.readyState == 4) {
                   var jsonObj = JSON.parse(http_request.responseText);  
                   var num_fields = jsonObj.fields.length;
                   var list_fields = document.getElementById(newList.id);
                   for (var i=num_fields; i>0; i--) {
                       var option = document.createElement('option');
                       option.text = jsonObj.fields[i-1].name;
                       list_fields.add(option,0);
                   }
               }
           }
           http_request.open("GET", myURL, true);
           http_request.send();
        
           document.getElementById("showField").style = "block";
           document.getElementById("addfield").style = "block";
           document.getElementById("myInput").placeholder = "Etiqueta a mostrar";
       },
   
      
    addFields: function() {
            var contadorb = parseInt(document.getElementById("contador").value);
            var contadorc = contadorb + 1;
            document.getElementById("contador").value = contadorc;
                      
            var myDiv = document.getElementById("showList");
            var newList = document.createElement("SELECT");
            var newInput = document.createElement("INPUT");
            var newSpace = document.createTextNode("        ");
            newInput.id = "myInput" + contadorc;
            newList.id = "mySelect" + contadorc;
            var salto = document.createElement('br');
            myDiv.appendChild(salto);
            myDiv.appendChild(newInput);
            myDiv.appendChild(newSpace);
            myDiv.appendChild(newList);
                       
            var murl = document.getElementById("urlLayer").value;
            var myURL = murl + "?f=json";
            
            //Ajax call
            var http_request = new XMLHttpRequest();
            http_request.onreadystatechange = function() {
               if (http_request.readyState == 4) {
                   var jsonObj = JSON.parse(http_request.responseText);  
                   var num_fields = jsonObj.fields.length;
                   var list_fields = document.getElementById(newList.id);
                   for (var i=num_fields; i>0; i--) {
                       var option = document.createElement('option');
                       option.text = jsonObj.fields[i-1].name;
                       list_fields.add(option,0);
                   }
               }    
            }
            http_request.open("GET", myURL, true);
            http_request.send(); 
            
         },

    // Close config
    getConfig: function(){
        var options = this.config.inPanelVar.params;
        options.app_id = this.app_id.get("value");
        options.count = this.count.get("value");
        
        options.tablefields = new Array(options.count);
        options.tablelabels = new Array(options.count);
        
        options.tablefields[0] = document.getElementById("mySelect").value;
        options.tablelabels[0] = document.getElementById("myInput").value;
        for (i=1; i < options.count; i++) {
            options.tablefields[i] = document.getElementById("mySelect" + (i+1)).value;
            options.tablelabels[i] = document.getElementById("myInput" + (i+1)).value;    
        }
        
        return this.config;       
    }
  });
});