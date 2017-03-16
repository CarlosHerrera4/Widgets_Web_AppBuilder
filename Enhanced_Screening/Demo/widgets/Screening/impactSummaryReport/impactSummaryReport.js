///////////////////////////////////////////////////////////////////////////
// Copyright © 2016 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

var muestra_datos = [];

define([
  'dojo/_base/declare',
  'dojo/text!./impactSummaryReport.html',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/Evented',
  'jimu/BaseWidget',
  'dojo/on',
  'dojo/dom-class',
  'dojo/dom-attr',
  'esri/geometry/geometryEngine',
  'esri/geometry/Polyline',
  'esri/SpatialReference',
  'esri/graphic',
  'dojo/dom-construct',
  'esri/tasks/query',
  'esri/tasks/QueryTask',
  'dojo/Deferred',
  '../geometryUtils',
  '../conversionUtils',
  '../fieldSelectorPopup/fieldSelectorPopup',
  'esri/lang',
  'jimu/utils',
  'dojo/query',
  'dojo/number',
  'dojo/promise/all',
  'dojo/dom'
], function (
  declare,
  template,
  _WidgetsInTemplateMixin,
  lang,
  array,
  Evented,
  BaseWidget,
  on,
  domClass,
  domAttr,
  GeometryEngine,
  Polyline,
  SpatialReference,
  Graphic,
  domConstruct,
  Query,
  QueryTask,
  Deferred,
  geometryUtils,
  conversionUtils,
  fieldSelectorPopup,
  esriLang,
  jimuUtils,
  query,
  dojoNumber,
  all,
  dom
) {
  return declare([BaseWidget, _WidgetsInTemplateMixin, Evented], {

    // Set base class for custom impactSummaryReport widget
    baseClass: 'jimu-widget-screening-impactSummaryReport',

    templateString: template,

    _standardUnitData: [], // to store standard area/square-kilometer of intersected feature
    _metricUnitData: [], // to store metric miles/kilometer of intersected feature
    _printCompleteData: {}, // to store complete data needed for print dijit
    _printData: {}, // to store filtered data needed for print dijit
    _standardUnitInfo: [], // to store area of features in standard unit
    _metricUnitInfo: [], // to store area of features in metric unit
    _intersectFeatureCount: 0, //to store the count of features intersected to AOI
    isExceedingMaxRecordCount: false, //flag to set if intersecting features exceeds maxRecordCount


    constructor: function (options) {
      this._standardUnitData = [];
      this._metricUnitData = [];
      this._printCompleteData = {};
      this._printData = {};
      this._standardUnitInfo = [];
      this._metricUnitInfo = [];
      this._intersectFeatureCount = 0;
      lang.mixin(this, options);
    },

    postCreate: function () {
      this.own(on(this.impactSummaryLayerMaxRecordHint, "click", lang.hitch(this, function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        this.emit("showMessage", this.nls.reportsTab.unableToAnalyzeText);
      })));
    },

    /**
     * This function is used to set the layer title, attach events
     * and generate layer details by calling its functions
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    generateReport: function (bufferGeometry) {
      debugger
      var deferred, cutterPolylineArr;
      this._assignSelectedUnitToConfigObject();
      deferred = new Deferred();
      this._setAttributeToFeatureLayerContainer();
      this._setFeatureLayerTitle();
      this._attachEventToLayerTitle();
      // this function is used to get the array of feature object id within AOI
      this._getIntersectingFeaturesCount(bufferGeometry).then(lang.hitch(this,
        function (intersectingFeatureIds) {
          //Don't analyze if exceedingMaxRecordCount
          if (this.isExceedingMaxRecordCount) {
            //Set the count of all intersecting features
            this._setFeatureLayerIntersectFeatureCount(intersectingFeatureIds.length);
            this._pushDataInPrintDataObj(this.configuredLayerLabel, null, null);
            this._printData = {};
            this._printData = lang.clone(this._printCompleteData);
            domAttr.set(this.impactSummaryLayerDetailContainer,
              "innerHTML", this.nls.reportsTab.unableToAnalyzeText);
            domClass.add(this.impactSummaryLayerDetailContainer,
              "esriCTLayerDetailCenterText");
            //remove disable class from layer section container
            domClass.remove(this.layerTitleAndFieldParentContainer, "esriCTLayerSectionDisabled");
            // Once all the geometry operations are performed and
            // report is generated resolve the deferred.
            deferred.resolve(this._getReportLayerDetails([]));
          } else {
            // this function is used to get the features in chunks within AOI
            this._getFeatureByChunks(intersectingFeatureIds, bufferGeometry).then(lang.hitch(this,
              function (intersectFeatureArr) {
                var featureIntersectResultArr;
                featureIntersectResultArr = [];
                //Set the count of all intersecting features
                this._setFeatureLayerIntersectFeatureCount(intersectFeatureArr.length);
                // Check if any features are intersecting else set no result found
                if (intersectFeatureArr.length > 0) {
                  // In case of polygon and polyline get cut/within geometry features
                  // and for points directly used the intersected features
                  if (this.featureLayer.geometryType === "esriGeometryPolyline" ||
                    this.featureLayer.geometryType === "esriGeometryPolygon") {
                    cutterPolylineArr = this._polygonToPolyline(bufferGeometry);
                    featureIntersectResultArr =
                      this._getCutOrWithInFeatures(cutterPolylineArr,
                        intersectFeatureArr, bufferGeometry);
                  } else {
                    featureIntersectResultArr = intersectFeatureArr;
                  }
                  //create detailed report
                  this._createLayerDetails(featureIntersectResultArr,
                    this.featureLayer.geometryType);

                  //display only configured fields in report
                  this._displayConfiguredField(this.configuredField);
                  this._filterPrintDataObjAccToConfiguredFields(this.configuredField);
                  // remove disable class from layer field icon container which
                  // indicates that layer has finished processing
                  domClass.remove(this.impactSummaryLayerField,
                    "esriCTImpactSummaryLayerFieldIconDisabled");
                } else {
                  this._pushDataInPrintDataObj(this.configuredLayerLabel, null, null);
                  this._printData = {};
                  this._printData = lang.clone(this._printCompleteData);
                  domAttr.set(this.impactSummaryLayerDetailContainer,
                    "innerHTML", this.nls.reportsTab.noDetailsAvailableText);
                  domClass.add(this.impactSummaryLayerDetailContainer,
                    "esriCTLayerDetailCenterText");
                }
                //remove disable class from layer section container
                domClass.remove(this.layerTitleAndFieldParentContainer,
                  "esriCTLayerSectionDisabled");
                // Once all the geometry operations are performed and
                // report is generated resolve the deferred.
                deferred.resolve(this._getReportLayerDetails(featureIntersectResultArr));

                // Muestro mis datos
                debugger
                this.muestramisdatos();
              }));
          }
        }));

      return deferred.promise;

    },

    /* Función muestra mis datos
    */
    muestramisdatos: function() {
      n_datos  = muestra_datos.length;
      var aea = dom.byId(informe);
      for (i=0; i<=n_datos; n++) {
         aea.innerHTML = "<p>El número de puntos que están dentro del buffer es: " + muestra_datos[i].n_entidades + "</p><br>";
      }
    },

    /**
     * This function returns the reportDetails object
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _getReportLayerDetails: function (featureIntersectResultArr) {
      var nueva_cosa = {}


      var reportLayerDetails = {};
      reportLayerDetails.id = this.id;
      reportLayerDetails.featureLayerId = this.featureLayer.id;
      reportLayerDetails.features = featureIntersectResultArr;
      //set info for printing/reporting
      reportLayerDetails.printInfo = {};
      reportLayerDetails.printInfo.isExceedingMaxRecordCount = this.isExceedingMaxRecordCount;
      reportLayerDetails.printInfo.featureCount = this._intersectFeatureCount;
      reportLayerDetails.printInfo.info = this._printData;
      reportLayerDetails.printInfo.standardUnitInfo = this._standardUnitInfo;
      reportLayerDetails.printInfo.metricUnitInfo = this._metricUnitInfo;
      reportLayerDetails.printInfo.geometryType = this.featureLayer.geometryType;

      nueva_cosa.n_entidades = this._intersectFeatureCount;
      nueva_cosa.capa = this._printData.title;
      nueva_cosa.tipo_geometria = this.featureLayer.geometryType;
      muestra_datos.push(nueva_cosa);

      return reportLayerDetails;
    },

    /**
     * This function is used to set the selected unit to config unit property
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _assignSelectedUnitToConfigObject: function () {
      if (domClass.contains(query(".esriCTStandardUnitAreaContainer")[0], "esriCTHidden")) {
        this.config.areaUnits = "Metric";
      } else {
        this.config.areaUnits = "Standard";
      }
    },

    /**
     * This function is used to set the featureLayerID attr in parent container of layer row
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _setAttributeToFeatureLayerContainer: function () {
      domAttr.set(this.impactSummaryLayerContainer, "featureLayerID", this.featureLayer.id);
    },

    /**
     * This function is used to set the name of layer
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _setFeatureLayerTitle: function () {
      if (!this.configuredLayerLabel) {
        this.configuredLayerLabel = this.featureLayer.name;
      }
      domAttr.set(this.impactSummaryLayerTitle, "innerHTML", this.configuredLayerLabel);
      domAttr.set(this.impactSummaryLayerTitle, "title", this.configuredLayerLabel);
    },

    /**
     * This function is used to attach click event to layer row
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _attachEventToLayerTitle: function () {
      this.own(on(this.layerTitleAndFieldParentContainer, "click",
        lang.hitch(this, function (evt) {
          if (domClass.contains(evt.target, "esriCTImpactSummaryLayerFieldIcon")) {
            //open field selector widget if the icon is not disabled
            if (!domClass.contains(this.impactSummaryLayerField,
              "esriCTImpactSummaryLayerFieldIconDisabled")) {
              this._createFieldSelectorPopupWidget();
            }
          } else {
            //open layer details section only if layer has finished processing
            if (!domClass.contains(this.layerTitleAndFieldParentContainer,
              "esriCTLayerSectionDisabled")) {
              this._showOrHideLayerDetailsContainer();
            }
          }
        })));
    },

    /**
     * This function is used create field selector widget for layer section
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _createFieldSelectorPopupWidget: function () {
      if (!this._fieldSelectorWidget) {
        this._fieldSelectorWidget = new fieldSelectorPopup({
          outFields: this.configuredField,
          popupTitle: this.configuredLayerLabel,
          fieldTitle: this.nls.reportsTab.selectReportFieldTitle,
          nls: this.nls,
          appConfig: this.appConfig
        });
        on(this._fieldSelectorWidget, "onFieldSelectComplete", lang.hitch(this,
          function (selectedFields) {
            this._filterFieldsForReport(selectedFields);
          }));
        this._fieldSelectorWidget.startup();
      } else {
        this._fieldSelectorWidget.onFieldsSelectorClick();
      }
    },

    /**
     * This function is used filter the configured fields array as per user selection
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _filterFieldsForReport: function (selectedFields) {
      var cloneFields = lang.clone(this.configuredField), fieldName;
      for (fieldName in this.configuredField) {
        if (selectedFields.indexOf(fieldName) <= -1) {
          delete cloneFields[fieldName];
        }
      }
      //Hide all configured fields in report tab before selecting nad showing the checked fields
      this._hideAllConfiguredFields();
      this._displayConfiguredField(cloneFields);
      this._filterPrintDataObjAccToConfiguredFields(cloneFields);
      this.emit("printDataUpdated",
        { "id": this.id, "printData": this._printData });
    },

    /**
     * This function is used to show/hide the layer details
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _showOrHideLayerDetailsContainer: function () {
      domClass.toggle(this.layerTitleAndFieldParentContainer, "esriCTBoldFont");
      domClass.toggle(this.impactSummaryLayerDetailContainer, "esriCTHidden");
      if (domClass.contains(this.layerSectionIcon, "esriCTLayerPanelExpand")) {
        domClass.replace(this.layerSectionIcon, "esriCTLayerPanelCollapse",
          "esriCTLayerPanelExpand");
      } else {
        domClass.replace(this.layerSectionIcon, "esriCTLayerPanelExpand",
          "esriCTLayerPanelCollapse");
      }
    },

    /**
     * This function is used to get the features count that intersects the AOI
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _getIntersectingFeaturesCount: function (bufferGeometry) {
      var deferred, shapeFileIntersectFeatureArr, intersectGeometry, i;
      deferred = new Deferred();
      if (this.isFeatureCollectionLayer) {
        shapeFileIntersectFeatureArr = [];
        if (this.featureLayer.graphics.length > 0) {
          for (i = 0; i < this.featureLayer.graphics.length; i++) {
            intersectGeometry =
              GeometryEngine.intersects(bufferGeometry,
                this.featureLayer.graphics[i].geometry);
            if (intersectGeometry) {
              shapeFileIntersectFeatureArr.push(this.featureLayer.graphics[i]);
            }
          }
        }
        deferred.resolve(shapeFileIntersectFeatureArr);
      } else {
        var queryObj, queryTask, appliedFilters;
        queryObj = new Query();
        queryTask = new QueryTask(this.featureLayer.url);
        appliedFilters = this.featureLayer.getDefinitionExpression();
        if (appliedFilters) {
          queryObj.where = appliedFilters;
        }
        queryObj.geometry = bufferGeometry;
        queryTask.executeForIds(queryObj, lang.hitch(this, function (objectIDArr) {
          if (!objectIDArr || objectIDArr.length === 0) {
            deferred.resolve([]);
          } else {
            //if length of features exceeding maxRecordCount show icon indicating unable to analyze
            if (objectIDArr.length > this.maxFeaturesForAnalysis) {
              domClass.remove(this.impactSummaryLayerMaxRecordHint, "esriCTHidden");
              domClass.add(this.impactSummaryLayerTitle, "esriCTLayerTitleOverrideWidth");
              this.isExceedingMaxRecordCount = true;
              this.emit("exceedingMaxRecordCount");
            }
            deferred.resolve(objectIDArr);
          }
        }));
      }
      return deferred.promise;
    },

    /**
     * This function is used to get the features in chunks
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _getFeatureByChunks: function (intersectingFeatureIds, bufferGeometry) {
      var deferredList, deferred, chunkArr, chunkSize;
      deferred = new Deferred();
      deferredList = [];
      chunkArr = [];
      chunkSize = this.featureLayer.maxRecordCount;
      if (this.isFeatureCollectionLayer) {
        deferredList.push(this._getIntersectFeature(intersectingFeatureIds, bufferGeometry));
      } else {
        while (intersectingFeatureIds.length > 0) {
          deferredList.push(this._getIntersectFeature(intersectingFeatureIds.splice(0, chunkSize),
            bufferGeometry));
        }
      }
      all(deferredList).then(lang.hitch(this, function (featuresArr) {
        var intersectingFeatures;
        intersectingFeatures = [];
        array.forEach(featuresArr, lang.hitch(this, function (features) {
          intersectingFeatures = intersectingFeatures.concat(features);
        }));
        deferred.resolve(intersectingFeatures);
      }));
      return deferred.promise;
    },

    /**
     * This function is used to get the features that intersects the AOI
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _getIntersectFeature: function (intersectingFeatureIds, bufferGeometry) {
      var deferred, shapeFileIntersectFeatureArr, i, intersectGeometry, queryTask,
        queryObj;
      deferred = new Deferred();
      if (this.isFeatureCollectionLayer) {
        shapeFileIntersectFeatureArr = [];
        if (this.featureLayer.graphics.length > 0) {
          for (i = 0; i < this.featureLayer.graphics.length; i++) {
            intersectGeometry =
              GeometryEngine.intersects(bufferGeometry,
                this.featureLayer.graphics[i].geometry);
            if (intersectGeometry) {
              shapeFileIntersectFeatureArr.push(this.featureLayer.graphics[i]);
            }
          }
        }
        deferred.resolve(shapeFileIntersectFeatureArr.splice(0, this.maxFeaturesForAnalysis));
      } else {
        queryObj = new Query();
        queryObj.outFields = ["*"];
        queryObj.returnGeometry = true;
        queryObj.objectIds = intersectingFeatureIds;
        queryObj.outSpatialReference = bufferGeometry.spatialReference;
        queryTask = new QueryTask(this.featureLayer.url);
        queryTask.execute(queryObj, lang.hitch(this, function (featureSet) {
          if (featureSet.features) {
            deferred.resolve(featureSet.features);
          } else {
            deferred.resolve([]);
          }
        }), lang.hitch(this, function () {
          deferred.resolve([]);
        }));
      }
      return deferred.promise;
    },

    /**
     * This function is used to set the count of features that intersects the AOI
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _setFeatureLayerIntersectFeatureCount: function (intersectFeatureLength) {
      this._intersectFeatureCount = dojoNumber.format(intersectFeatureLength);
      //remove the loading icon from count div and set the features count
      domClass.remove(this.impactSummaryLayerFeatureCount, "esriCTLoadingIcon");
      domAttr.set(this.impactSummaryLayerFeatureCount,
        "innerHTML", "(" + this._intersectFeatureCount + ")");
      domAttr.set(this.impactSummaryLayerFeatureCount,
        "title", "(" + this._intersectFeatureCount + ")");
    },

    /**
     * This function is used to get feature that cuts the AOI
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _getCutOrWithInFeatures: function (cutterPolylineArr, intersectFeatureArr, bufferGeometry) {
      var featureIntersectResultArr, graphic, isFeatureWithIn;
      featureIntersectResultArr = [];
      for (var j = 0; j < cutterPolylineArr.length; j++) {
        for (var i = 0; i < intersectFeatureArr.length; i++) {
          var cutFeature =
            GeometryEngine.cut(intersectFeatureArr[i].geometry, cutterPolylineArr[j]);
          if (cutFeature.length > 0) {
            var cutIndex = 1;
            if (GeometryEngine.within(bufferGeometry, intersectFeatureArr[i].geometry)) {
              cutIndex = 0;
            }
            graphic = new Graphic(cutFeature[cutIndex], null,
              intersectFeatureArr[i].attributes);
            featureIntersectResultArr.push(graphic);
          } else {
            isFeatureWithIn =
              GeometryEngine.within(intersectFeatureArr[i].geometry, bufferGeometry);
            if (isFeatureWithIn) {
              graphic = new Graphic(intersectFeatureArr[i].geometry, null,
                intersectFeatureArr[i].attributes);
              featureIntersectResultArr.push(graphic);
            }
          }
        }
      }
      return featureIntersectResultArr;
    },

    /**
     * This function is used to convert polygon AOI to polyline
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _polygonToPolyline: function (polygon) {
      var cutterPolylineArr, polyline, i, pathArr, j;
      cutterPolylineArr = [];
      // Set spatial reference of the polygon
      polyline = new Polyline(new SpatialReference({
        wkid: 102100
      }));
      for (j = 0; j < polygon.rings.length; j++) {
        pathArr = [];
        for (i = 0; i < polygon.rings[j].length; i++) {
          pathArr.push(polygon.rings[j][i]);
        }
        polyline.addPath(pathArr);
      }
      cutterPolylineArr.push(polyline);
      return cutterPolylineArr;
    },

    /**
     * This function is used to get the formatted attribute
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _updateFormattedAttribute: function (intersectFeatureArr) {
      var formatedAttrs, unitData;
      array.forEach(intersectFeatureArr, lang.hitch(this, function (intersectedFeature, i) {
        formatedAttrs = this._getFormatedAttrs(
          lang.clone(intersectedFeature.attributes),
          this.featureLayer.fields,
          this.featureLayer.typeIdField,
          this.featureLayer.types,
          null
        );
        intersectFeatureArr[i].setAttributes(formatedAttrs);
        array.forEach(this.featureLayer.fields, lang.hitch(this, function (field) {
          var fieldValue;
          if (!(intersectFeatureArr[i].attributes.hasOwnProperty(field.name))) {
            intersectFeatureArr[i].attributes[field.name] =
              this.nls.reportsTab.noDataText;
          }
          if (intersectFeatureArr[i].attributes.hasOwnProperty(field.name)) {
            fieldValue = intersectFeatureArr[i].attributes[field.name];
            if (fieldValue === undefined || fieldValue === "" || fieldValue === null) {
              intersectFeatureArr[i].attributes[field.name] =
                this.nls.reportsTab.noDataText;
            } else if (lang.trim(fieldValue.toString()) === "") {
              intersectFeatureArr[i].attributes[field.name] =
                this.nls.reportsTab.noDataText;
            }
          }
        }));
        switch (this.featureLayer.geometryType) {
          case "esriGeometryPolygon":
            unitData = geometryUtils.getAreaOfGeometry(intersectedFeature.geometry);
            this._standardUnitData.push(unitData.acres);
            this._metricUnitData.push(unitData.squareKilometer);
            break;
          case "esriGeometryPolyline":
            unitData = geometryUtils.getLengthOfGeometry(intersectedFeature.geometry);
            this._standardUnitData.push(unitData.miles);
            this._metricUnitData.push(unitData.kilometers);
            break;
        }
      }));
      return intersectFeatureArr;
    },

    /**
     * This function is used to get the formatted attribute
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _getAreaLengthCountDetails: function (detailsObj) {
      switch (detailsObj.geometryType) {
        case "esriGeometryPolygon":
          return this._calculatePolygonArea(detailsObj);
        case "esriGeometryPolyline":
          return this._calculatePolylineLength(detailsObj);
        case "esriGeometryPoint":
          return this._calculatePointCount(detailsObj);
      }
    },

    /**
     * This function is used to get the field text
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _getFieldText: function (currentFieldObj, fieldName) {
      if (currentFieldObj.label) {
        return currentFieldObj.label;
      } else if (currentFieldObj.alias) {
        return currentFieldObj.alias;
      } else {
        return fieldName;
      }
    },

    /**
     * This function is used to get the templated node
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _createTemplateNode: function (currentFieldObj, fieldName) {
      var templateNode;
      templateNode = domConstruct.create("div", {
        "class": "esriCTTemplateNode esriCTHidden"
      }, this.impactSummaryLayerDetailContainer);
      domAttr.set(templateNode,
        "fieldLabel", currentFieldObj.label);
      domAttr.set(templateNode,
        "fieldAlias", currentFieldObj.alias);
      domAttr.set(templateNode,
        "fieldName", fieldName);
      return templateNode;
    },

    /**
     * This function is used to perform the aggregation
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _getDistinctValue: function (detailsObj) {
      switch (detailsObj.geometryType) {
        case "esriGeometryPolygon":
          return this._sumUp(detailsObj.featureDetailsObject,
            'fieldAreaAcres', 'fieldDistinctValue');
        case "esriGeometryPolyline":
          return this._sumUp(detailsObj.featureDetailsObject,
            'fieldLengthMiles', 'fieldDistinctValue');
        case "esriGeometryPoint":
          return this._sumUp(detailsObj.featureDetailsObject, 'fieldCount', 'fieldDistinctValue');
      }
    },

    /**
     * This function is used to create and add the distinct node & its value
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _addDistinctDataInNode: function (detailsObj) {
      var fieldDistinctStandardUnitData, fieldDistinctMetricUnitData, key;
      if (detailsObj.key === this.nls.reportsTab.noDataText) {
        key = "<i>" + this.nls.reportsTab.noDataText + "<i>";
      } else {
        key = detailsObj.key;
      }
      fieldDistinctStandardUnitData = domConstruct.create("div", {
        "class": "esriCTFieldDistinctData",
        "innerHTML": key +
        " (" + detailsObj.fieldCountOrAreaOrLengthText + " : " +
        dojoNumber.format(detailsObj.fieldStandardUnitArea) + detailsObj.fieldStandardUnitText + ")"
      }, detailsObj.templateNode);
      if (detailsObj.geometryType !== "esriGeometryPoint") {
        domClass.add(fieldDistinctStandardUnitData,
          "esriCTFieldDistinctStandardUnitData");

        fieldDistinctMetricUnitData = domConstruct.create("div", {
          "class": "esriCTFieldDistinctData esriCTFieldDistinctMetricUnitData",
          "innerHTML": key +
          " (" + detailsObj.fieldCountOrAreaOrLengthText + " : " +
          dojoNumber.format(detailsObj.fieldMetricUnitArea) + detailsObj.fieldMetricUnitText + ")"
        }, detailsObj.templateNode);

        if (this.config.areaUnits === "Metric") {
          domClass.add(fieldDistinctStandardUnitData, "esriCTHidden");
        } else {
          domClass.add(fieldDistinctMetricUnitData, "esriCTHidden");
        }
      }
    },

    /**
     * This function is used to create layer details
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _createLayerDetails: function (intersectFeatureArr, geometryType) {
      var fieldCount, j, templateNode, featureDetailsObject, fieldData, fieldDistinctValueDetails,
        fieldAliasNode, fieldCountOrAreaOrLengthText, fieldStandardUnitText,
        fieldMetricUnitText, fieldStandardUnitArea, fieldMetricUnitArea, currentFieldObj,
        currentFieldText, fieldName, configuredFieldLength, detailsObj;

      fieldCount = 0;
      configuredFieldLength = Object.keys(this.configuredField).length;
      intersectFeatureArr = this._updateFormattedAttribute(intersectFeatureArr);
      this._pushDataInPrintDataObj(this.configuredLayerLabel, null, null);

      for (fieldName in this.configuredField) {
        currentFieldObj = this.configuredField[fieldName];
        templateNode = this._createTemplateNode(currentFieldObj, fieldName);
        currentFieldText = this._getFieldText(currentFieldObj, fieldName);
        this._printCompleteData.cols.push(currentFieldText);
        // field alias node & name
        fieldAliasNode = domConstruct.create("div", {
          "class": "esriCTFieldAlias",
          "innerHTML": currentFieldText
        }, templateNode);
        featureDetailsObject = {};
        for (j = 0; j < intersectFeatureArr.length; j++) {
          detailsObj = {};
          detailsObj.templateNode = templateNode;
          detailsObj.intersectFeatureArr = intersectFeatureArr;
          detailsObj.featureIndex = j;
          detailsObj.fieldCount = fieldCount;
          detailsObj.configuredFieldLength = configuredFieldLength;
          detailsObj.geometryType = geometryType;
          fieldData = intersectFeatureArr[j].attributes[fieldName];
          featureDetailsObject["feature" + j] = {};
          featureDetailsObject["feature" + j]["field" + fieldCount] = {};
          detailsObj.featureDetailsObject = featureDetailsObject;
          if (fieldData || fieldData === 0) {
            this._pushDataInPrintDataObj(null, j, fieldData);
            detailsObj.isEmptyField = false;
          } else {
            this._pushDataInPrintDataObj(null, j, "");
            detailsObj.isEmptyField = true;
          }
          featureDetailsObject = this._getAreaLengthCountDetails(detailsObj);
          featureDetailsObject["feature" + j]["field" + fieldCount].fieldDistinctValue =
            fieldData;
        }
        fieldDistinctValueDetails = this._getDistinctValue(detailsObj);
        // field data
        for (var key in fieldDistinctValueDetails) {
          if (fieldDistinctValueDetails.hasOwnProperty(key)) {
            switch (geometryType) {
              case "esriGeometryPolygon":
                fieldCountOrAreaOrLengthText = this.nls.reportsTab.featureAreaText;
                fieldStandardUnitArea = conversionUtils.honourPopupRounding(2,
                  fieldDistinctValueDetails[key]);
                fieldMetricUnitArea =
                  conversionUtils.honourPopupRounding(2,
                    conversionUtils.acresToSquareKilometer(fieldDistinctValueDetails[key]));
                fieldStandardUnitText = " " + this.nls.units.acres.abbreviation;
                fieldMetricUnitText = " " + this.nls.units.squareKilometer.abbreviation;
                break;
              case "esriGeometryPolyline":
                fieldCountOrAreaOrLengthText = this.nls.reportsTab.featureLengthText;
                fieldStandardUnitArea = conversionUtils.honourPopupRounding(2,
                  fieldDistinctValueDetails[key]);
                fieldMetricUnitArea =
                  conversionUtils.honourPopupRounding(2,
                    conversionUtils.milesToKilometer(fieldDistinctValueDetails[key]));
                fieldStandardUnitText = " " + this.nls.units.miles.abbreviation;
                fieldMetricUnitText = " " + this.nls.units.kilometer.abbreviation;
                break;
              case "esriGeometryPoint":
                fieldCountOrAreaOrLengthText = this.nls.reportsTab.featureCountText;
                fieldStandardUnitArea = fieldDistinctValueDetails[key];
                fieldStandardUnitText = "";
                break;
            }
            detailsObj.key = key;
            detailsObj.fieldCountOrAreaOrLengthText = fieldCountOrAreaOrLengthText;
            detailsObj.fieldStandardUnitArea = fieldStandardUnitArea;
            detailsObj.fieldStandardUnitText = fieldStandardUnitText;
            detailsObj.fieldMetricUnitArea = fieldMetricUnitArea;
            detailsObj.fieldMetricUnitText = fieldMetricUnitText;
            this._addDistinctDataInNode(detailsObj);
          }
        }
        fieldCount++;
      }
    },

    /**
     * This function is used to calculate the area of polygon data
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _calculatePolygonArea: function (detailsObj) {
      if (!detailsObj.isEmptyField) {
        // polygon area acres
        detailsObj.featureDetailsObject
        ["feature" + detailsObj.featureIndex]["field" + detailsObj.fieldCount].fieldAreaAcres =
          this._standardUnitData[detailsObj.featureIndex];
      }
      // print data acres & square kilometer
      if (this._printCompleteData.cols.length === detailsObj.configuredFieldLength) {
        this._standardUnitInfo.push(this._standardUnitData[detailsObj.featureIndex]);
        this._metricUnitInfo.push(this._metricUnitData[detailsObj.featureIndex]);
      }
      return detailsObj.featureDetailsObject;
    },

    /**
     * This function is used to calculate the length of polyline data
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _calculatePolylineLength: function (detailsObj) {
      if (!detailsObj.isEmptyField) {
        // polyline length miles
        detailsObj.featureDetailsObject
        ["feature" + detailsObj.featureIndex]["field" + detailsObj.fieldCount].fieldLengthMiles =
          this._standardUnitData[detailsObj.featureIndex];
      }
      // print data miles & kilometers
      if (this._printCompleteData.cols.length === detailsObj.configuredFieldLength) {
        this._standardUnitInfo.push(this._standardUnitData[detailsObj.featureIndex]);
        this._metricUnitInfo.push(this._metricUnitData[detailsObj.featureIndex]);
      }
      return detailsObj.featureDetailsObject;
    },

    /**
     * This function is used to calculate the count of point data
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _calculatePointCount: function (detailsObj) {
      if (!detailsObj.isEmptyField) {
        detailsObj.featureDetailsObject
        ["feature" + detailsObj.featureIndex]["field" + detailsObj.fieldCount].fieldCount = 1;
      }
      if (this._printCompleteData.cols.length === detailsObj.configuredFieldLength) {
        this._standardUnitInfo.push(1);
        this._metricUnitInfo.push(1);
      }
      return detailsObj.featureDetailsObject;
    },

    /**
     * This function is used to push data in print data obj needed for print dijit
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _pushDataInPrintDataObj: function (featureTitle, rowIndex, fieldData) {
      if (featureTitle) {
        this._printCompleteData = {};
        this._standardUnitInfo = [];
        this._metricUnitInfo = [];
        this._printCompleteData.title = featureTitle;
        this._printCompleteData.rows = [];
        this._printCompleteData.cols = [];
      } else {
        if (fieldData === this.nls.reportsTab.noDataText) {
          fieldData = "<i>" + fieldData + "</i>";
        }
        if (this._printCompleteData.rows[rowIndex]) {
          this._printCompleteData.rows[rowIndex].push(fieldData);
        } else {
          this._printCompleteData.rows.push([]);
          this._printCompleteData.rows[rowIndex].push(fieldData);
        }
      }
    },

    /**
     * @param {object} obj Arbitrarily nested object that must contain the
     * given propName and groupPropName at some level
     * @param {string} propName The property to be summed up
     * @param {string} groupPropName The property to group by
     * @param {object} This is used internally for recursion, feel free to pass
     * in an object with existing totals, but a default one is provided
     * @return {object} An object keyed by by the groupPropName where the value
     * is the sum of all properties with the propName for that group
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _sumUp: function (obj, propName, groupPropName, totals) {
      totals = totals || {};
      for (var prop in obj) {
        if (prop === propName) {
          if (!totals[obj[groupPropName]]) {
            totals[obj[groupPropName]] = 0;
          }
          totals[obj[groupPropName]] += obj[propName];
        } else if (typeof obj[prop] === 'object') {
          this._sumUp(obj[prop], propName, groupPropName, totals);
        }
      }
      return totals;
    },

    /**
     * This function is used to display the configured field
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _displayConfiguredField: function (configuredField) {
      var fieldName;
      if (configuredField && Object.keys(configuredField).length > 0) {
        //hide no fields selected message container
        domClass.add(this.noFieldsSelectedContainer, "esriCTHidden");
        for (fieldName in configuredField) {
          query("[fieldname='" + fieldName + "']",
            this.impactSummaryLayerDetailContainer).removeClass("esriCTHidden");
        }
      } else {
        domClass.remove(this.noFieldsSelectedContainer, "esriCTHidden");
      }
    },

    /**
     * This function is used to hide all the fields container
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _hideAllConfiguredFields: function () {
      query("[fieldname]", this.impactSummaryLayerDetailContainer).addClass("esriCTHidden");
    },

    /**
     * This function is used to filter the print data object acc to configured fields
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _filterPrintDataObjAccToConfiguredFields: function (configuredField) {
      var i, k, isFieldConfigured, standardUnitAreaContainer,
        metricUnitAreaContainer, fieldName;
      standardUnitAreaContainer = query(".esriCTStandardUnitAreaContainer")[0];
      metricUnitAreaContainer = query(".esriCTMetricUnitAreaContainer")[0];
      this._printData = {};
      this._printData = lang.clone(this._printCompleteData);
      for (i = this._printData.cols.length - 1; i >= 0; --i) {
        isFieldConfigured = false;
        for (fieldName in configuredField) {
          switch (this._printData.cols[i]) {
            case configuredField[fieldName].label:
              isFieldConfigured = true;
              break;
            case configuredField[fieldName].alias:
              isFieldConfigured = true;
              break;
            case fieldName:
              isFieldConfigured = true;
              break;
          }
        }
        if (!isFieldConfigured) {
          this._printData.cols.splice(i, 1);
          for (k = 0; k < this._printData.rows.length; k++) {
            this._printData.rows[k].splice(i, 1);
          }
        }
      }
    },

    /**
     * This function is used to get the formatted attributes
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _getFormatedAttrs: function (attrs, fields, typeIdField, types, popupInfo) {
      function getFormatInfo(fieldName) {
        if (popupInfo && esriLang.isDefined(popupInfo.fieldInfos)) {
          for (var i = 0, len = popupInfo.fieldInfos.length; i < len; i++) {
            var f = popupInfo.fieldInfos[i];
            if (f.fieldName === fieldName) {
              return f.format;
            }
          }
        }
        return null;
      }
      var aliasAttrs = {};
      array.forEach(fields, lang.hitch(this, function (_field, i) {
        if (!attrs[_field.name]) {
          return;
        }
        var isCodeValue = !!(_field.domain && _field.domain.type === 'codedValue');
        var isDate = _field.type === "esriFieldTypeDate";
        var isTypeIdField = typeIdField && (_field.name === typeIdField);
        var fieldAlias = _field.name;

        if (fields[i].type === "esriFieldTypeDate") {
          aliasAttrs[fieldAlias] = jimuUtils.fieldFormatter.getFormattedDate(
            attrs[_field.name], getFormatInfo(_field.name)
          );
        } else if (fields[i].type === "esriFieldTypeDouble" ||
          fields[i].type === "esriFieldTypeSingle" ||
          fields[i].type === "esriFieldTypeInteger" ||
          fields[i].type === "esriFieldTypeSmallInteger") {
          aliasAttrs[fieldAlias] = this._getFormattedNumber(
            attrs[_field.name], getFormatInfo(_field.name)
          );
        }
        if (isCodeValue) {
          aliasAttrs[fieldAlias] = jimuUtils.fieldFormatter.getCodedValue(
            _field.domain, attrs[_field.name]
          );
        } else if (isTypeIdField) {
          aliasAttrs[fieldAlias] = jimuUtils.fieldFormatter.getTypeName(
            attrs[_field.name], types
          );
        } else if (!isCodeValue && !isDate && !isTypeIdField) {
          // Not A Date, Domain or Type Field
          // Still need to check for codedType value
          aliasAttrs[fieldAlias] = fieldAlias in aliasAttrs ?
            aliasAttrs[fieldAlias] : attrs[_field.name];
          aliasAttrs[fieldAlias] = this._getCodeValueFromTypes(
            _field,
            typeIdField,
            types,
            attrs,
            aliasAttrs
          );
        }
      }));
      return aliasAttrs;
    },

    /**
     * This function is used to get the formatted number
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _getFormattedNumber: function (num, format) {
      if (typeof num === 'number') {
        var decimalStr = num.toString().split('.')[1] || "",
          decimalLen = decimalStr.length;
        num = jimuUtils.localizeNumberByFieldInfo(num, {
          format: {
            places: (format && typeof format.places === 'number') ?
              parseInt(format.places, 10) : decimalLen,
            digitSeparator: format && format.digitSeparator
          }
        });
        return num || "";
      }
      return num;
    },

    /**
     * This function is used to get the coded value from types
     * @memberOf Screening/impactSummaryReport/impactSummaryReport
     */
    _getCodeValueFromTypes: function (field, typeIdField, types, obj, aliasAttrs) {
      var codeValue = null;
      if (typeIdField && types && types.length > 0) {
        var typeChecks = array.filter(types, lang.hitch(this, function (item) {
          // value of typeIdField has been changed above
          return item.name === obj[typeIdField];
        }));
        var typeCheck = (typeChecks && typeChecks[0]) || null;
        if (typeCheck && typeCheck.domains &&
          typeCheck.domains[field.name] && typeCheck.domains[field.name].codedValues) {
          codeValue = jimuUtils.fieldFormatter.getCodedValue(
            typeCheck.domains[field.name],
            obj[field.name]
          );
        }
      }
      var fieldAlias = field.name;
      var _value = codeValue !== null ? codeValue : aliasAttrs[fieldAlias];
      return _value || isFinite(_value) ? _value : "";
    }
  });
});
