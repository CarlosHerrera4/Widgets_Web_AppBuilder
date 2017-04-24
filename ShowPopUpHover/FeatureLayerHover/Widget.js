define(['dojo/_base/declare', 'jimu/BaseWidget', 'esri/layers/FeatureLayer', 'esri/tasks/QueryTask', 'esri/tasks/query', 'esri/symbols/SimpleFillSymbol', 'esri/symbols/SimpleLineSymbol', 'esri/renderers/SimpleRenderer', 'esri/graphic', 'esri/lang', 'esri/Color', 'dojo/number', 'dojo/dom-style',
'dijit/TooltipDialog', 'dijit/popup', 'dojo/domReady!'],
  function(declare, BaseWidget, FeatureLayer, QueryTask, Query,
        SimpleFillSymbol, SimpleLineSymbol,
        SimpleRenderer, Graphic, esriLang,
        Color, number, domStyle,
        TooltipDialog, dijitPopup) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here

      baseClass: 'jimu-widget-customwidget',
      southCarolinaCounties: null,

      postCreate: function() {
         this.inherited(arguments);
         console.log('postCreate');
       },

      startup: function() {
        this.inherited(arguments);
        console.log('startup');
       },

      onOpen: function(){
         console.log('onOpen');
         var urlService = this.config.inPanelVar.params.app_id;
         var contador = this.config.inPanelVar.params.count;

         //var southCarolinaCounties = new FeatureLayer(urlService, {
         this.southCarolinaCounties = new FeatureLayer(urlService, {
          mode: FeatureLayer.MODE_SNAPSHOT,
          outFields: ["*"]
         });

         var symbol = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([255,255,255,0.35]),
            4
          ),
          new Color([125,125,125,0.35])
         );
         this.southCarolinaCounties.setRenderer(new SimpleRenderer(symbol));
         this.map.addLayer(this.southCarolinaCounties);

         this.map.infoWindow.resize(245,125);

         dialog = new TooltipDialog({
          id: "tooltipDialog" + Math.random(),
          style: "position: absolute; width: 250px; font: normal normal normal 10pt Helvetica;z-index:100"
         });
         dialog.startup();

         var highlightSymbol = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([255,0,0]), 3
          ),
          new Color([125,125,125,0.35])
         );

        //close the dialog when the mouse leaves the highlight graphic

          this.map.graphics.enableMouseEvents();
          this.map.graphics.on("mouse-out", closeDialog);

        //listen for when the onMouseOver event fires on the countiesGraphicsLayer
        //when fired, create a new graphic with the geometry from the event.graphic and add it to the maps graphics layer

           var tabfields = this.config.inPanelVar.params.tablefields;
           var tablabels = this.config.inPanelVar.params.tablelabels;

           var t = "<b>"+tablabels[0]+"</b>:  ${"+tabfields[0]+"}<br>";
           for (i=1; i < tabfields.length; i++) {
               var t = t + "<b>"+tablabels[i]+"</b>:  ${"+tabfields[i]+"}<br>";
           };

           this.southCarolinaCounties.on("mouse-over", function(evt){
              var content = esriLang.substitute(evt.graphic.attributes,t);
              var highlightGraphic = new Graphic(evt.graphic.geometry,highlightSymbol);
              //this.graphics.add(highlightGraphic);
                highlightGraphic.draw();
              dialog.setContent(content);

              domStyle.set(dialog.domNode, "opacity", 0.85);
              dijitPopup.open({
                popup: dialog,
                x: evt.pageX,
                y: evt.pageY
              });

              var queryTask = new QueryTask(urlService);
              var query = new Query();
              query.returnGeometry = false;
              query.outFields = ["*"];
          });


        function closeDialog() {
          map.graphics.clear();
          dijitPopup.close(dialog);
        }

       },

      onClose: function(){
            this.map.removeLayer(this.southCarolinaCounties);
          dijitPopup.close(dialog);
      //   console.log('onClose');
      },

      // onMinimize: function(){
      //   console.log('onMinimize');
      // },

      // onMaximize: function(){
      //   console.log('onMaximize');
      // },

      // onSignIn: function(credential){
      //   /* jshint unused:false*/
      //   console.log('onSignIn');
      // },

      // onSignOut: function(){
      //   console.log('onSignOut');
      // }

      // onPositionChange: function(){
      //   console.log('onPositionChange');
      // },

      // resize: function(){
      //   console.log('resize');
      // }

      //methods to communication between widgets:

    });
  });
