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
define([
  // DOJO classes
  'dojo/_base/declare',
  'dojo/on',
  'dojo/_base/lang',
  'dojo/dom-class',
  'dojo/query',
  'dojo/dom-style',
  'dojo/dom-construct',
  'dojo/_base/array',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/Deferred',
  'dojo/promise/all',
  'dojo/string',
  'dojo/keys',
  'dijit/focus',
  'dojo/dom-attr',
  "dojo/_base/fx",
  // JIMU classes
  'jimu/BaseWidget',
  'jimu/dijit/LoadingIndicator',
  'jimu/portalUtils',
  'jimu/dijit/Message',
  // ESRI classes
  'esri/layers/GraphicsLayer',
  'esri/geometry/geometryEngine',
  'esri/graphic',
  'esri/tasks/BufferParameters',
  'esri/tasks/GeometryService',
  'esri/symbols/jsonUtils',
  'esri/graphicsUtils',
  'jimu/LayerInfos/LayerInfos',
  // Custom Class
  './layerUtil',
  // Custom widgets
  './placename/placename',
  './drawTool/drawTool',
  './shapefile/shapefile',
  './coordinates/coordinates',
  './impactSummaryReport/impactSummaryReport',
  './download/download',
  'dojo/_base/array',
  './conversionUtils',
  './geometryUtils',
  //Report dijit related imports
  './report/Report',
  './report/PageUtils',
  'dojo/number',
  // Class for TemplateMixin
  'dijit/form/NumberTextBox'
], function (
  declare,
  on,
  lang,
  domClass,
  query,
  domStyle,
  domConstruct,
  arrayUtils,
  _WidgetsInTemplateMixin,
  Deferred,
  all,
  string,
  keys,
  focusUtil,
  domAttr,
  fx,
  BaseWidget,
  LoadingIndicator,
  portalUtils,
  Message,
  GraphicsLayer,
  GeometryEngine,
  Graphic,
  BufferParameters,
  GeometryService,
  jsonUtils,
  graphicsUtils,
  LayerInfos,
  layerUtil,
  Placename,
  DrawTool,
  Shapefile,
  Coordinates,
  ImpactSummaryReport,
  DownloadReport,
  array,
  conversionUtils,
  geometryUtils,
  reportDijit,
  pageUtils,
  dojoNumber
) {
  // To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget, _WidgetsInTemplateMixin], {
    baseClass: 'jimu-widget-screening',

    _bufferValue: null, // To store buffer value
    _currentActiveTool: null, // To hold which aoi Widget is open
    _geometryService: null, // To store geometry service's instance
    _loadingIndicator: null, // To store loading indicator's instance
    _aoiGraphicsLayer: null, // To store AOI graphics layer
    _drawnOrSelectedGraphicsLayer: null, // To store drawn or selected graphics layer
    _uploadedShapefileGraphicsLayer: null, // To store uploaded shapefile graphics
    _placenameTool: null, //To hold placenameTool instance
    _drawTool: null, //To hold drawTool instance
    _coordinatesTool: null, //To hold coordinateTool instance
    _downloadFeatureDetailsObj: {}, // to store intersect feature details needed for download
    _printData: {}, //To store data for print of each layer
    _isReportGenerated: false, // Boolean value which indicates wether the report is generated
    // track whether feature count exceeds max record count of layer
    _isExceedingMaxRecordCount: false,
    _panels: {}, // To store the panel nodes
    _currentPanel: null, // To store current visible panel
    _currentPanelName: "", // To store current visible panel name

    postMixInProperties: function () {
      //mixin default nls with widget nls
      this.nls.common = {};
      lang.mixin(this.nls.common, window.jimuNls.common);
    },

    startup: function () {
      var isValidConfig;
      this.inherited(arguments);
      //override the panel styles
      domClass.add(this.domNode.parentElement, "esriCTOverridePanelStyle");
      if (this.appConfig.portalUrl &&
        lang.trim(this.appConfig.portalUrl) !== "") {
        //get portal info to fetch geometry service Url
        portalUtils.getPortalSelfInfo(this.appConfig.portalUrl).then(
          lang.hitch(this, function (portalInfo) {
            //create generate featureCollection form shapeFile url
            this.config.generateFeatureCollectionURL = this.appConfig.portalUrl +
              '/sharing/rest/content/features/generate';
            // get helper-services from portal object
            this.config.helperServices = portalInfo && portalInfo
              .helperServices;
            if (this.config.helperServices && this.config.helperServices
              .geometry) {
              // Initializing geometry service
              this._geometryService =
                new GeometryService(this.config.helperServices.geometry.url);
              // validate if layers are configured then only load the widget
              isValidConfig = this._validateConfiguration();
              if (isValidConfig) {
                this._initLoadingIndicator();
                this._filterLayersFromMap();
                domClass.remove(this.backButtonDiv, "esriCTHidden");
              } else {
                this._displayErrorMessageInWidget();
              }
            } else {
              // Display error message if geometry service is not found
              this._showMessage(this.nls.geometryServicesNotFound);
            }
          }), lang.hitch(this, function () {
            // Display error message if any error occurred while
            // fetching portal info for geometry service
            this._showMessage(this.nls.geometryServicesNotFound);
          }));
      } else {
        // Display error message if portal url is not available
        this._showMessage(this.nls.geometryServicesNotFound);
      }
    },

    /**
     * Display error message if configuration is not valid
     * @memberOf Screening/Widget
     */
    _displayErrorMessageInWidget: function () {
      domClass.add(this.widgetMainContainer, "esriCTHidden");
      domClass.remove(this.errorMessageMainContainer, "esriCTHidden");
    },

    /**
     * Show AOI and drawn or other selected graphics from map on open, if available
     * @memberOf Screening/Widget
     */
    onOpen: function () {
      if (this._drawnOrSelectedGraphicsLayer && this._drawnOrSelectedGraphicsLayer
        .graphics) {
        this._drawnOrSelectedGraphicsLayer.show();
      }
      if (this._aoiGraphicsLayer && this._aoiGraphicsLayer.graphics) {
        this._aoiGraphicsLayer.show();
      }
    },

    /**
     * Hide AOI and drawn or other selected graphics from map on close, if available
     * @memberOf Screening/Widget
     */
    onClose: function () {
      if (this._drawnOrSelectedGraphicsLayer &&
        this._drawnOrSelectedGraphicsLayer.graphics) {
        this._drawnOrSelectedGraphicsLayer.hide();
      }
      if (this._aoiGraphicsLayer && this._aoiGraphicsLayer.graphics) {
        this._aoiGraphicsLayer.hide();
      }
      if (this._drawTool) {
        this._drawTool.deactivateTools();
      }
      if (this._coordinatesTool) {
        this._coordinatesTool.deactivateLocateIcon();
      }
    },

    /**
     * This function is responsible for initializing widget components
     * @memberOf Screening/Widget
     */
    _initWidgetComponents: function () {
      var canDownloadReport;
      this._initTabControl();
      this._attachAllEvents();
      this._disableClearAOIButton();
      this._disableShowReportsButton();
      this._displayConfiguredAreaUnitsText();
      this._createAndAddGraphicsLayer();
      this._displayConfiguredWidgetAOIButton();
      this._setBufferInputs();
      canDownloadReport = this._canDownload();
      //Check if user can download reports in specified format
      if (canDownloadReport) {
        //Create download instance on load
        this._initDownloadWidget();
      } else {
        domClass.add(this.downloadReportBtn, "esriCTHidden");
      }
      //init upload shapeFile for analysis if it is configured
      if (this.config.allowShapefilesUpload) {
        this._initShapeFileForAnalysis();
      }
      //show configured units for AOI
      this._displayConfiguredAOIArea();
      //initialize report dijit for printing
      this._initReportDijit();
      // Hide loading indicator
      this._loadingIndicator.hide();
    },

    /**
     * This function decides wether to show/hide download button
     * based on configuration
     * @memberOf Screening/widget
     */
    _canDownload: function () {
      var canDownloadReport = false;
      //If app is running in iOS device, hide download button
      if (this.isIOS()) {
        canDownloadReport = false;
        return;
      }
      if (this.config.downloadSettings) {
        if (this.config.downloadSettings.type === "cannotDownload") {
          canDownloadReport = false;
        } else if (this.config.downloadSettings.type === "extractDataTask") {
          canDownloadReport = true;
        } else if (this.config.downloadSettings.type === "syncEnable") {
          array.some(this.config.downloadSettings.layers, lang.hitch(this, function (currentLayer) {
            if (currentLayer.allowDownload) {
              canDownloadReport = true;
              return true;
            }
          }));
        }
      } else {
        canDownloadReport = false;
      }
      return canDownloadReport;
    },

    /**
     * This function is used to display configured area units in reports tab
     * @memberOf Screening/Widget
     */
    _displayConfiguredAreaUnitsText: function () {
      if (this.config.areaUnits === "Standard") {
        this._displayMetricUnitsText();
      } else {
        this._displayStandardUnitsText();
      }
    },

    /**
     * This function is used to display metric units
     * @memberOf Screening/Widget
     */
    _displayMetricUnitsText: function () {
      domClass.remove(this.metricAreaUnit, "esriCTHidden");
      domClass.add(this.standardAreaUnit, "esriCTHidden");
    },

    /**
     * This function is used to display standard units
     * @memberOf Screening/Widget
     */
    _displayStandardUnitsText: function () {
      domClass.remove(this.standardAreaUnit, "esriCTHidden");
      domClass.add(this.metricAreaUnit, "esriCTHidden");
    },

    /**
     * Callback function called on receiving searched data from placeName/coordinate widget
     * @param{object} contains selected search data
     * @memberOf Screening/Widget
     */
    onReceiveSearchData: function (data) { // jshint ignore:line
      var selectedGraphics;
      // Show loading indicator
      this._loadingIndicator.show();
      // Check if placename tab is selected else coordinates tab is selected
      if (domClass.contains(this.placenameButton, "esriCTAOIButtonSelected")) {
        // Search will return only one feature, so add this to graphics in array
        selectedGraphics = [data.result.feature];
        // Initiate to create AOI buffer
        this._initToCreateAOIBuffer(selectedGraphics);
      } else if ((domClass.contains(this.coordinatesButton, "esriCTAOIButtonSelected")) &&
        (data.result.feature.geometry.type === "point")) {
        this._coordinatesTool.onStartPointSelected(data.result.feature.geometry);
      }
      // Hide loading indicator
      this._loadingIndicator.hide();
    },

    /**
     * This function used for initializing the loading indicator
     * @memberOf Screening/Widget
     */
    _initLoadingIndicator: function () {
      this._loadingIndicator = new LoadingIndicator({
        hidden: true
      });
      this._loadingIndicator.placeAt(this.domNode.parentNode);
      this._loadingIndicator.startup();
    },

    /**
     * This function is used to validate widget configuration.
     * It checks whether all configured layers are valid/invalid
     */
    _validateConfiguration: function () {
      //Validate if any aoi widget is configured or not
      if (this.config.layers.length === 0 &&
        this.config.showPlacenameWidget === false &&
        this.config.showDrawToolsWidget === false &&
        this.config.showShapefileWidget === false &&
        this.config.showCoordinatesWidget === false) {
        return false;
      }
      return true;
    },

    /**
     * This function is used to create & initialize AOI & Report tab
     * @memberOf Screening/Widget
     */
    _initTabControl: function () {
      domAttr.set(this.aoiLabelContainer, "innerHTML", this.config.aoiTabText);
      domAttr.set(this.reportLabelContainer, "innerHTML", this.config.reportTabText);
      this._panels.aoiTabParentContainer = this.aoiTabParentContainer;
      this._panels.reportTabParentContainer = this.reportTabParentContainer;
      this._currentPanel = this.aoiTabParentContainer;
      this._currentPanelName = "aoiTabParentContainer";
      domStyle.set(this._currentPanel, 'display', 'block');
      domStyle.set(this._currentPanel, 'left', '0px');
    },

    /**
     * This function is to attach events of different dom and callback
     * @memberOf Screening/Widget
     */
    _attachAllEvents: function () {
      //Handle click events of AOI buttons
      this.own(on(this.placenameButton, "click", lang.hitch(this, function () {
        this._onPlacenameButtonClick();
      })));
      this.own(on(this.drawToolsButton, "click", lang.hitch(this, function () {
        this._onDrawToolsButtonClick();
      })));
      this.own(on(this.shapefileButton, "click", lang.hitch(this, function () {
        this._onShapefileButtonClick();
      })));
      this.own(on(this.coordinatesButton, "click", lang.hitch(this, function () {
        this._onCoordinatesButtonClick();
      })));

      this.own(on(this.clearAOIButton, "click", lang.hitch(this, function () {
        this._clearAOI();
      })));
      //attach reports button click
      this.own(on(this.showReportsButton, "click", lang.hitch(this, function () {
        if (!domClass.contains(this.showReportsButton, "jimu-state-disabled")) {
          domClass.add(this.aoiLabelContainer, "esriCTHidden");
          domClass.remove(this.reportLabelContainer, "esriCTHidden");
          this._showPanel("reportTabParentContainer");
          this._onReportTabClick();
        }
      })));
      //attach back button click
      this.own(on(this.backButtonDiv, "click", lang.hitch(this, function () {
        domClass.remove(this.aoiLabelContainer, "esriCTHidden");
        domClass.add(this.reportLabelContainer, "esriCTHidden");
        this._showPanel("aoiTabParentContainer", true);
      })));
      //Handle click events of the standard/metric unit links
      this.own(on(this.metricAreaUnitText, "click", lang.hitch(this, function () {
        this._displayStandardUnitsText();
        this._displayMetricUnitsArea();
        query(".esriCTFieldDistinctMetricUnitData").removeClass("esriCTHidden");
        query(".esriCTFieldDistinctStandardUnitData").addClass("esriCTHidden");
      })));
      this.own(on(this.standardAreaUnitText, "click", lang.hitch(this, function () {
        this._displayMetricUnitsText();
        this._displayStandardUnitsArea();
        query(".esriCTFieldDistinctStandardUnitData").removeClass("esriCTHidden");
        query(".esriCTFieldDistinctMetricUnitData").addClass("esriCTHidden");
      })));
      //Handle click events of report tab buttons
      this.own(on(this.downloadReportBtn, "click", lang.hitch(this, this._onDownloadClick)));
      this.own(on(this.printButton, "click", lang.hitch(this, this._onPrintClick)));
    },

    /**
     * This function is to set maximum height of the AOI tools content containers
     * @memberOf Screening/Widget
     */
    _setMaxHeightOfAOIWidgetContainer: function () {
      var jimuPanelContent, jimuPanelContentInfo, jimuPanelHeight,
        jimuTabHeight, aoiButtonHeight, widgetAndBufferSeparatorHeight,
        aoiBufferChangeParentContainerHeight,
        maxHeightOfAOIWidgetContainer, aoiClearButtonContainerHeight,
        bufferDistanceAndClearAOISeparatorLine;
      // jimu panel content
      jimuPanelContent = this.domNode.parentElement;
      if (!jimuPanelContent) {
        return;
      }
      jimuPanelContentInfo = domStyle.getComputedStyle(
        jimuPanelContent);
      jimuPanelHeight = jimuPanelContentInfo.height;
      jimuPanelHeight = parseInt(jimuPanelHeight, 10);

      jimuTabHeight = 30;
      aoiButtonHeight = 32;
      widgetAndBufferSeparatorHeight = 22;
      aoiBufferChangeParentContainerHeight = 60;
      bufferDistanceAndClearAOISeparatorLine = 22;
      aoiClearButtonContainerHeight = 60;

      // Max height of widget container
      maxHeightOfAOIWidgetContainer = (jimuPanelHeight - (
        jimuTabHeight + aoiButtonHeight +
        widgetAndBufferSeparatorHeight +
        aoiBufferChangeParentContainerHeight +
        bufferDistanceAndClearAOISeparatorLine +
        aoiClearButtonContainerHeight + 25));
      maxHeightOfAOIWidgetContainer = maxHeightOfAOIWidgetContainer +
        "px";
      domStyle.set(this.placenameWidgetContainer, "max-height",
        maxHeightOfAOIWidgetContainer);
      domStyle.set(this.drawToolWidgetContainer, "max-height",
        maxHeightOfAOIWidgetContainer);
      domStyle.set(this.shapefileWidgetContainer, "max-height",
        maxHeightOfAOIWidgetContainer);
      domStyle.set(this.coordinateWidgetContainer, "max-height",
        maxHeightOfAOIWidgetContainer);
    },

    /**
     * This function is to set the max height of impact summary report
     * @memberOf Screening/Widget
     */
    _setMaxHeightOfImpactSummaryReportContainer: function () {
      var jimuPanelContent, jimuPanelContentInfo, jimuPanelHeight, shapeFileContent = 0,
        tabContainerHeader = 40, componentHeight;
      // jimu panel height
      jimuPanelContent = this.domNode.parentElement;
      if (!jimuPanelContent) {
        return;
      }
      jimuPanelContentInfo = domStyle.getComputedStyle(jimuPanelContent);
      jimuPanelHeight = jimuPanelContentInfo.height;
      jimuPanelHeight = parseInt(jimuPanelHeight, 10);
      if (this.config.allowShapefilesUpload) {
        shapeFileContent = this.uploadShapefileAnalysisTableContainer.clientHeight;
      }
      componentHeight = this.unitAreaContainer.clientHeight +
        this.downloadAndPrintTableContainer.clientHeight + tabContainerHeader + shapeFileContent;
      domStyle.set(this.impactSummaryReportContainer, "height",
        jimuPanelHeight - componentHeight + "px");
    },

    /**
     * This function is to show placename tab selected and show its content
     * @memberOf Screening/Widget
     */
    _onPlacenameButtonClick: function () {
      if (domClass.contains(this.placenameWidgetContainer,
        "esriCTHidden")) {
        // Show placename panel
        this._showActiveToolPanel("placename");
      }
      if (this._drawTool) {
        this._drawTool.deactivateTools();
      }
      if (this._coordinatesTool) {
        this._coordinatesTool.deactivateLocateIcon();
      }
    },

    /**
     * This function is to show draw tool tab selected and show its content
     * @memberOf Screening/Widget
     */
    _onDrawToolsButtonClick: function () {
      if (domClass.contains(this.drawToolWidgetContainer,
        "esriCTHidden")) {
        // Show draw tool panel
        this._showActiveToolPanel("drawTool");
        if (this._coordinatesTool) {
          this._coordinatesTool.deactivateLocateIcon();
        }
      }
    },

    /**
     * This function is to show shapefile tab selected and show its content
     * @memberOf Screening/Widget
     */
    _onShapefileButtonClick: function () {
      if (domClass.contains(this.shapefileWidgetContainer,
        "esriCTHidden")) {
        // Show shapefile panel
        this._showActiveToolPanel("shapefile");
      }
      if (this._drawTool) {
        this._drawTool.deactivateTools();
      }
      if (this._coordinatesTool) {
        this._coordinatesTool.deactivateLocateIcon();
      }
    },

    /**
     * This function is to show coordinates tab selected and show its content
     * @memberOf Screening/Widget
     */
    _onCoordinatesButtonClick: function () {
      if (domClass.contains(this.coordinateWidgetContainer,
        "esriCTHidden")) {
        // Show coordinates panel
        this._showActiveToolPanel("coordinates");
      }
      if (this._drawTool) {
        this._drawTool.deactivateTools();
      }
    },

    /**
     * This function is to show active panel
     * @param{string} contains name of the active AOI tool
     * @memberOf Screening/Widget
     */
    _showActiveToolPanel: function (toolName) {
      //first hide/deselect the prev tool and panel
      this._deSelectPreviousAOIButton();
      this._hideAllWidgetContainers();
      //show current tool and its panel
      this._currentActiveTool = toolName;
      switch (toolName) {
        case "placename": // If toolName is placename
          domClass.add(this.placenameButton, "esriCTAOIButtonSelected");
          domClass.replace(this.placenameWidgetContainer, "esriCTVisible", "esriCTHidden");
          break;
        case "drawTool": // If toolName is drawTool
          domClass.add(this.drawToolsButton, "esriCTAOIButtonSelected");
          domClass.replace(this.drawToolWidgetContainer, "esriCTVisible", "esriCTHidden");
          break;
        case "shapefile": // If toolName is shapefile
          domClass.add(this.shapefileButton, "esriCTAOIButtonSelected");
          domClass.replace(this.shapefileWidgetContainer, "esriCTVisible", "esriCTHidden");
          break;
        case "coordinates": // If toolName is coordinates
          domClass.add(this.coordinatesButton, "esriCTAOIButtonSelected");
          domClass.replace(this.coordinateWidgetContainer, "esriCTVisible", "esriCTHidden");
          break;
        default:
          break;
      }
    },

    /**
     * This function is to deselect the last tab selected
     * @memberOf Screening/Widget
     */
    _deSelectPreviousAOIButton: function () {
      var selectedAOIButton;
      selectedAOIButton = query(".esriCTAOIButtonSelected", this.aoiButtonParentContainer);
      if (selectedAOIButton && selectedAOIButton[0]) {
        domClass.remove(selectedAOIButton[0],
          "esriCTAOIButtonSelected");
      }
    },

    /**
     * This function is to hide all widget containers
     * @memberOf Screening/Widget
     */
    _hideAllWidgetContainers: function () {
      var aoiWidgetsContainerArr, i;
      aoiWidgetsContainerArr = this.aoiWidgetParentContainer.children;
      for (i = 0; i < aoiWidgetsContainerArr.length; i++) {
        if (domClass.contains(aoiWidgetsContainerArr[i],
          "esriCTVisible")) {
          domClass.replace(aoiWidgetsContainerArr[i], "esriCTHidden",
            "esriCTVisible");
        }
      }
    },

    /**
     * This is callback function for report tab click event
     * @memberOf Screening/Widget
     */
    _onReportTabClick: function () {
      var aoiArea;
      //Deactivate draw and select tool on click of reports tab
      if (this._drawTool) {
        this._drawTool.deactivateTools();
      }
      //get geodesic Area of AOI geometry and display according to selected unit
      aoiArea = geometryUtils.getAreaOfGeometry(this._aoiGraphicsLayer.graphics[0].geometry);
      this._calculateStandardUnitAOIArea(aoiArea.acres);
      this._calculateMetricUnitAOIArea(aoiArea.squareKilometer);
      //Check if new report is generated and accordingly process report tab
      if (!this._isReportGenerated) {
        if (this._drawTool) {
          this._drawTool.clearAllSelections();
        }
        this._toggleReportTabButtons(false);
        this._initializeImpactSummaryReportWidget();
      }
      this._setMaxHeightOfImpactSummaryReportContainer();
    },

    /**
     * handle click event for download buttons
     * @memberOf Screening/Widget
     */
    _onDownloadClick: function (evt) {
      if (!domClass.contains(this.downloadReportBtn, "esriCTDownloadBtnDisabled")) {
        // Stop event from propagation
        evt.stopPropagation();
        evt.preventDefault();
        this._initDownloadWidget(evt);
      }
    },

    /**
     * This function is used to get index of array
     * @memberOf Screening/Widget
     */
    _getArrayIndex: function (arrayOfRows, arrayToBeSearched) {
      var i, j, current, matchedIndex = [];
      for (i = 0; i < arrayOfRows.length; ++i) {
        if (arrayToBeSearched.length === arrayOfRows[i].length) {
          current = arrayOfRows[i];
          j = 0;
          while (j < arrayToBeSearched.length && arrayToBeSearched[j] === current[j]) {
            ++j;
          }
          if (j === arrayToBeSearched.length) {
            matchedIndex.push(i);
          }
        }
      }
      return matchedIndex;
    },

    /**
     * This function is used to perform the aggregation of rows which contains same data
     * @memberOf Screening/Widget
     */
    getSum: function (arrayOfValues, arrayOfIndex) {
      var sum, filteredArr;
      //filter selected index
      if (arrayOfIndex && arrayOfIndex.length > 0) {
        filteredArr = array.filter(arrayOfValues, function (item, index) { // jshint unused: true
          return arrayOfIndex.indexOf(index) > -1;
        });
      } else {
        filteredArr = arrayOfValues;
      }
      //add values of filteredArr
      sum = filteredArr.reduce(function (prevValue, currentValue) {
        return prevValue + currentValue;
      }, 0);
      return conversionUtils.honourPopupRounding(2, sum);
    },

    /**
     * This function is used to get the column title
     * @memberOf Screening/Widget
     */
    _getAggregatedColTitle: function (geometryType) {
      var colTitle;
      switch (geometryType) {
        case "esriGeometryPoint":
          colTitle = this.nls.reportsTab.featureCountText;
          break;
        case "esriGeometryPolyline":
          if (domClass.contains(this.standardUnitAreaContainer, "esriCTHidden")) {
            colTitle = this.nls.reportsTab.featureLengthText +
              " (" + this.nls.units.kilometer.abbreviation + ")";
          } else {
            colTitle = this.nls.reportsTab.featureLengthText +
              " (" + this.nls.units.miles.abbreviation + ")";
          }
          break;
        case "esriGeometryPolygon":
          if (domClass.contains(this.standardUnitAreaContainer, "esriCTHidden")) {
            colTitle = this.nls.reportsTab.featureAreaText +
              " (" + this.nls.units.squareKilometer.abbreviation + ")";
          } else {
            colTitle = this.nls.reportsTab.featureAreaText +
              " (" + this.nls.units.acres.abbreviation + ")";
          }
          break;
      }
      return colTitle;
    },

    /**
     * This function is used to get the data needed for printing the report
     * @memberOf Screening/Widget
     */
    _getProcessedPrintData: function () {
      var dataForReport, areaOfInterestText, areaOfInterestValue, aoiTextTemplate,
        aoiText, printMap, id, isMetricUnitSelected, unableToAnalyzeText, showUnableToAnalyzeText;
      dataForReport = [];
      areaOfInterestText = this.nls.reportsTab.aoiInformationTitle;
      if (domClass.contains(this.standardUnitAreaContainer, "esriCTHidden")) {
        areaOfInterestValue = this.metricUnitAreaContainer.innerHTML;
        isMetricUnitSelected = true;
      } else {
        areaOfInterestValue = this.standardUnitAreaContainer.innerHTML;
        isMetricUnitSelected = false;
      }
      // Add AOI text on top of the report
      aoiTextTemplate =
        "<div class='esrCTAOIInfoDiv'>" +
        "<div class='esriAOITitle'>" + areaOfInterestText + "</div>" +
        "<div class='esriCTAOIArea'>" + areaOfInterestValue + "</div></div>";
      aoiText = {
        title: "",
        type: "html",
        data: aoiTextTemplate
      };
      dataForReport.push(aoiText);

      //add Map at the top in the report
      printMap = {
        addPageBreak: true,
        type: "map",
        map: this.map
      };
      dataForReport.push(printMap);
      //Impact summary table
      var impactSummaryTable = {
        title: this.nls.reportsTab.summaryReportTitle,
        addPageBreak: false,
        type: "table",
        data: {
          "showRowIndex": false,
          "tableCols": 5,
          "rows": [],
          "cols": [this.nls.reportsTab.summaryReportLayerNameColTitle,
          this.nls.reportsTab.summaryReportImpactColTitle,
          this._getAggregatedColTitle("esriGeometryPoint"),
          this._getAggregatedColTitle("esriGeometryPolygon"),
          this._getAggregatedColTitle("esriGeometryPolyline")]
        }
      };

      for (id in this._printData) {
        var data, reportTable, matchedIndex, temp, aggregatedObj, aggregatedId, impactArray,
          impactMsg, impactSummaryAggregatedValue;
        data = this._printData[id].info;
        impactArray = [data.title];
        if (data.rows && data.rows.length > 0) {
          matchedIndex = [];
          aggregatedObj = {};
          for (var i = 0; i < data.rows.length; i++) {
            //if current index is not found in matched index then search array of that index
            if (matchedIndex.indexOf(i) < 0) {
              temp = this._getArrayIndex(data.rows, data.rows[i]);
              aggregatedObj[i] = temp;
              matchedIndex = matchedIndex.concat(temp);
            }
            //if all index are matched break loop
            if (matchedIndex.length === data.rows.length) {
              break;
            }
          }
          var aggregatedData = {
            "showRowIndex": true,
            "rows": [],
            "cols": lang.clone(data.cols)
          };
          //based on selected unit add col
          aggregatedData.cols.push(this._getAggregatedColTitle(this._printData[id].geometryType));

          for (aggregatedId in aggregatedObj) {
            var newRowInaggregatedData = lang.clone(data.rows[parseInt(aggregatedId, 10)]);
            if (isMetricUnitSelected) {
              newRowInaggregatedData.push(
                this.getSum(this._printData[id].metricUnitInfo,
                  aggregatedObj[parseInt(aggregatedId, 10)]));
            } else {
              newRowInaggregatedData.push(
                this.getSum(this._printData[id].standardUnitInfo,
                  aggregatedObj[parseInt(aggregatedId, 10)]));
            }
            aggregatedData.rows.push(newRowInaggregatedData);
          }

          if (aggregatedData.rows && aggregatedData.rows.length > 0) {
            reportTable = {
              title: data.title,
              addPageBreak: false,
              type: "table",
              data: aggregatedData
            };
            dataForReport.push(reportTable);
            impactSummaryAggregatedValue = this.getSum(isMetricUnitSelected ?
              this._printData[id].metricUnitInfo : this._printData[id].standardUnitInfo);
            switch (this._printData[id].geometryType) {
              case "esriGeometryPoint":
                impactArray = impactArray.concat(this.nls.reportsTab.potentialImpactText,
                  impactSummaryAggregatedValue, this.nls.reportsTab.notApplicableText,
                  this.nls.reportsTab.notApplicableText);
                break;
              case "esriGeometryPolygon":
                impactArray = impactArray.concat(this.nls.reportsTab.potentialImpactText,
                  this._printData[id].featureCount, impactSummaryAggregatedValue,
                  this.nls.reportsTab.notApplicableText);
                break;
              case "esriGeometryPolyline":
                impactArray = impactArray.concat(this.nls.reportsTab.potentialImpactText,
                  this._printData[id].featureCount, this.nls.reportsTab.notApplicableText,
                  impactSummaryAggregatedValue);
                break;
            }

          }
        } else {
          //check if layer is not analyzed
          if (this._printData[id].isExceedingMaxRecordCount) {
            showUnableToAnalyzeText = true;
            //show * in impact col along with potentialImpactText
            impactMsg = this.nls.reportsTab.potentialImpactText + " *";
            //in case of unable to analyze show blank in area/length col
            impactSummaryAggregatedValue = "";
          } else {
            impactMsg = this.nls.reportsTab.noKnownImpactText;
            impactSummaryAggregatedValue = 0;
          }
          switch (this._printData[id].geometryType) {
            case "esriGeometryPoint":
              impactArray = impactArray.concat(impactMsg, this._printData[id].featureCount,
                this.nls.reportsTab.notApplicableText, this.nls.reportsTab.notApplicableText);
              break;
            case "esriGeometryPolygon":
              impactArray = impactArray.concat(impactMsg, this._printData[id].featureCount,
                impactSummaryAggregatedValue, this.nls.reportsTab.notApplicableText);
              break;
            case "esriGeometryPolyline":
              impactArray = impactArray.concat(impactMsg, this._printData[id].featureCount,
                this.nls.reportsTab.notApplicableText, impactSummaryAggregatedValue);
              break;
          }
        }
        impactSummaryTable.data.rows.push(impactArray);
      }
      //add impact summary table after map in report
      if (showUnableToAnalyzeText) {
        // Add unable to analyze text in report only if layer(s) not analyzed
        unableToAnalyzeText = {
          title: "",
          type: "html",
          data: "<div class='esriCTUnableToAnalyzeText'> * " +
          this.nls.reportsTab.unableToAnalyzeText + "</div>"
        };
        dataForReport.splice(2, 0, impactSummaryTable, unableToAnalyzeText);
      } else {
        dataForReport.splice(2, 0, impactSummaryTable);
      }
      return dataForReport;
    },

    /**
     * This function is used to open the print dialog box on click of print button
     * @memberOf Screening/Widget
     */
    _onPrintClick: function () {
      var data;
      if (!domClass.contains(this.printButton, "esriCTPrintBtnDisabled")) {
        if (this.reportDijit) {
          //Set map extent to AOI graphics layer
          this._setExtentToGraphicsLayer(this._aoiGraphicsLayer);
          data = this._getProcessedPrintData();
          this.reportDijit.print(this.nls.reportsTab.defaultReportTitle, data);
        } else {
          this._showMessage(this.nls.reportsTab.errorInPrintingReport);
        }
      }
    },

    /**
     * This function is used to initialize the report dijit
     * @memberOf Screening/Widget
     */
    _initReportDijit: function () {
      var logo, baseURL, reportStylesheet;
      if (this.config.reportSettings && this.config.reportSettings.printTaskURL) {
        if (this.config.reportSettings.logo) {
          if (this.config.reportSettings.logo.indexOf("${appPath}") > -1) {
            baseURL = location.href.slice(0, location.href.lastIndexOf('/'));
            logo = string.substitute(this.config.reportSettings.logo, {
              appPath: baseURL
            });
          } else {
            logo = this.config.reportSettings.logo;
          }
        }
        //set override style for report dijit
        reportStylesheet = this.folderUrl + "/css/reportDijitOverrides.css";
        //Create reportDijit
        this.reportDijit = new reportDijit({
          alignNumbersToRight: false,
          reportLogo: logo,
          appConfig: this.appConfig,
          footNotes: this.config.reportSettings.footnote,
          printTaskUrl: this.config.reportSettings.printTaskURL,
          reportLayout: {
            "pageSize": pageUtils.PageSizes.Letter,
            "orientation": pageUtils.Orientation.Portrait
          },
          styleSheets: [reportStylesheet],
          "tableCols": 4
        });
        this.own(on(this.reportDijit, "reportError", lang.hitch(this, function () {
          this._showMessage(this.nls.reportsTab.errorInPrintingReport);
        })));
      }
    },

    /**
     * This function is used to add graphics layer on map in which only AOI will be added
     * @memberOf Screening/Widget
     */
    _createAndAddGraphicsLayer: function () {
      this._aoiGraphicsLayer = new GraphicsLayer({
        id: "aoiGraphicsLayer"
      });
      this.map.addLayer(this._aoiGraphicsLayer);
      this._drawnOrSelectedGraphicsLayer = new GraphicsLayer({
        id: "drawnOrSelectedGraphicsLayer"
      });
      this.map.addLayer(this._drawnOrSelectedGraphicsLayer);
      this._uploadedShapefileGraphicsLayer = new GraphicsLayer({
        id: "uploadedShapefileGraphicsLayer"
      });
      this.map.addLayer(this._uploadedShapefileGraphicsLayer);
    },

    /**
     * This function is to display configured AOI tool tab
     * @memberOf Screening/Widget
     */
    _displayConfiguredWidgetAOIButton: function () {
      var showPanel, aoiButtonCount;
      aoiButtonCount = 0;
      if (this.config.showPlacenameWidget) {
        domClass.replace(this.placenameButton, "esriCTDisplayTableCell", "esriCTHidden");
        showPanel = "placename";
        aoiButtonCount++;
        this._initializePlacenameWidget();
      }
      if (this.config.showDrawToolsWidget) {
        domClass.replace(this.drawToolsButton, "esriCTDisplayTableCell", "esriCTHidden");
        if (!showPanel) {
          showPanel = "drawTool";
        }
        aoiButtonCount++;
        this._initializeDrawToolsWidget();
      }
      if (this.config.showShapefileWidget) {
        domClass.replace(this.shapefileButton, "esriCTDisplayTableCell", "esriCTHidden");
        if (!showPanel) {
          showPanel = "shapefile";
        }
        aoiButtonCount++;
        this._initializeShapefileWidget();
      }
      if (this.config.showCoordinatesWidget) {
        domClass.replace(this.coordinatesButton, "esriCTDisplayTableCell", "esriCTHidden");
        if (!showPanel) {
          showPanel = "coordinates";
        }
        aoiButtonCount++;
        this._initializeCoordinatesWidget();
      }
      //if only one aoi tool is available then don't show the tool buttons
      if (aoiButtonCount === 1) {
        domClass.add(this.aoiButtonParentContainer, "esriCTHidden");
      }
      //show selected tool and its panel
      this._showActiveToolPanel(showPanel);
    },

    /**
     * This function will initialize placename custom widget
     * @memberOf Screening/Widget
     */
    _initializePlacenameWidget: function () {
      // Initializing 'placename' AOI tool widget
      this._placenameTool = new Placename({
        nls: this.nls,
        config: this.config,
        map: this.map,
        appConfig: this.appConfig,
        widgetMainContainer: this.widgetMainContainer
      }, domConstruct.create("div", {}, this.placenameWidgetContainer));
      this.own(on(this._placenameTool, "onSearchComplete",
        lang.hitch(this, this.onReceiveSearchData)));
      this._placenameTool.onWindowResize();
    },

    /**
     * This function will initialize draw tool custom widget
     * @memberOf Screening/Widget
     */
    _initializeDrawToolsWidget: function () {
      // Initializing 'shapefile' AOI tool widget
      this._drawTool = new DrawTool({
        nls: this.nls,
        config: this.config,
        map: this.map,
        loadingIndicator: this._loadingIndicator,
        pointSymbol: jsonUtils.fromJson(this.config.drawToolSymbology.point),
        polylineSymbol: jsonUtils.fromJson(this.config.drawToolSymbology.polyline),
        polygonSymbol: jsonUtils.fromJson(this.config.drawToolSymbology.polygon),
        _drawnOrSelectedGraphicsLayer: this._drawnOrSelectedGraphicsLayer,
        filteredLayerObj: this._filteredLayerObj
      }, domConstruct.create("div", {}, this.drawToolWidgetContainer));
      this.own(on(this._drawTool, "onDrawComplete", lang.hitch(this, function (graphics) {
        this._initToCreateAOIBuffer(graphics);
      })));
      this.own(on(this._drawTool, "onSelectionComplete", lang.hitch(this, function (graphics) {
        this._initToCreateAOIBuffer(graphics);
      })));
    },

    /**
     * This function will initialize shapefile custom widget
     * @memberOf Screening/Widget
     */
    _initializeShapefileWidget: function () {
      // Initializing 'shapefile' AOI tool widget
      var shapefile = new Shapefile({
        nls: this.nls,
        config: this.config,
        map: this.map,
        label: this.nls.shapefileWidget.shapefileLabel,
        loadingIndicator: this._loadingIndicator
      }, domConstruct.create("div", {}, this.shapefileWidgetContainer));
      this.own(on(shapefile, "onShapefileUpload", lang.hitch(this,
        function (layer) {
          if (layer.graphics && layer.graphics.length > 0) {
            this._initToCreateAOIBuffer(layer.graphics);
          } else {
            this._showMessage(this.nls.noGraphicsShapefile);
          }
        })));
    },

    /**
     * This function is used to get the formatted field obj
     * @memberOf Screening/Widget
     */
    _getFormattedFieldObj: function (fieldsArr) {
      var formattedFieldObj;
      formattedFieldObj = {};
      array.forEach(fieldsArr, lang.hitch(this, function (field) {
        formattedFieldObj[field.name] = field;
      }));
      return formattedFieldObj;
    },

    /**
     * This function is used to initialize the shapefile widget needed for
     * on-the-fly shapefile analysis
     * @memberOf Screening/Widget
     */
    _initShapeFileForAnalysis: function () {
      //first show the container
      domClass.remove(this.uploadShapefileAnalysisTableContainer, "esriCTHidden");
      var shapefile = new Shapefile({
        nls: this.nls,
        config: this.config,
        map: this.map,
        label: this.nls.reportsTab.uploadShapefileForAnalysisText,
        loadingIndicator: this._loadingIndicator
      }, domConstruct.create("div", {}, this.uploadShapefileAnalysisTableContainer));
      this.own(on(shapefile, "onShapefileUpload",
        lang.hitch(this, function (layer) {
          var completeAOIGeometry;
          if (layer.graphics && layer.graphics.length > 0) {
            this._addUploadedShapefileGraphicsOnMap(layer.graphics);
            this.map.setExtent(layer.fullExtent);
            completeAOIGeometry = this._getCompleteAOIGeometry();
            //set id to the layer as it will be required to access print obj
            layer.id = "ShapeFile_" + Date.now();
            var impactSummaryReportObj = new ImpactSummaryReport({
              id:  layer.id,
              nls: this.nls,
              isFeatureCollectionLayer: true,
              config: this.config,
              appConfig: this.appConfig,
              map: this.map,
              featureLayer: layer,
              aoiGraphicsLayer: this._aoiGraphicsLayer,
              configuredField: this._getFormattedFieldObj(layer.fields),
              configuredLayerLabel: layer.name,
              maxFeaturesForAnalysis: this.config.maxFeaturesForAnalysis
            });
            //place uploaded shapeFile layer at top in the list
            domConstruct.place(impactSummaryReportObj.domNode,
              this.impactSummaryReportContainer, 0);
            this.own(on(impactSummaryReportObj, "printDataUpdated",
              lang.hitch(this, function (details) {
                this._printData[details.id].info = details.printData;
              })));
            impactSummaryReportObj.generateReport(completeAOIGeometry).then(lang.hitch(this,
              function (layerDetails) {
                var newPrintDataObject = {};
                //to add newly added shapeFile layer at top mixin and reassign in the _printData
                newPrintDataObject[layerDetails.id] = lang.hitch(layerDetails.printInfo);
                this._printData = lang.mixin(newPrintDataObject, this._printData);
                //if print icon is disabled enable if features are intersecting in uploaded shapefile
                if (domClass.contains(this.printButton, "esriCTPrintBtnDisabled") &&
                  layerDetails.features.length > 0) {
                  domClass.remove(this.printButton, "esriCTPrintBtnDisabled");
                }
              }));
          } else {
            this._showMessage(this.nls.noGraphicsShapefile);
          }
        })));
    },

    /**
     * This function will initialize coordinate custom widget
     * @memberOf Screening/Widget
     */
    _initializeCoordinatesWidget: function () {
      // Initializing 'coordinates' AOI tool widget
      this._coordinatesTool = new Coordinates({
        nls: this.nls,
        config: this.config,
        map: this.map,
        appConfig: this.appConfig,
        loadingIndicator: this._loadingIndicator,
        widgetMainContainer: this.widgetMainContainer,
        isSearchWidgetConfigured: this._isSearchWidgetConfigured,
        drawnOrSelectedGraphicsLayer: this._drawnOrSelectedGraphicsLayer,
        geometryService: this._geometryService,
        aoiGraphicsLayer: this._aoiGraphicsLayer,
        uploadedShapefileGraphicsLayer: this._uploadedShapefileGraphicsLayer
      }, domConstruct.create("div", {}, this.coordinateWidgetContainer));
      this.own(on(this._coordinatesTool, "onSearchComplete",
        lang.hitch(this, this.onReceiveSearchData)));
      this.own(on(this._coordinatesTool, "redrawAOI", lang.hitch(this, this._validateAndAddAOI)));
    },

    /**
     * This function will initiate the process to create AOI buffer
     * param{object} contains keys as listed below,,
     * 1. 'drawnOrSelectedGraphics an array of AOI features
     * @memberOf Screening/Widget
     */
    _initToCreateAOIBuffer: function (graphics) {
      // Clear previously drawn graphics from the graphics layers
      // Clear AOI graphics
      this._aoiGraphicsLayer.clear();
      this._drawnOrSelectedGraphicsLayer.clear();
      this._uploadedShapefileGraphicsLayer.clear();
      // Clear layer selections
      if (this._drawTool && !(this._drawTool.selectTool.isActive())) {
        this._drawTool.clearAllSelections();
      }
      // Reset start point
      if (this._coordinatesTool && this._currentActiveTool !== "coordinates") {
        this._coordinatesTool.resetCoordinatesWidgetValue();
      }
      // Function to add reference geometry graphics for AOI
      this._addDrawnOrSelectedGraphicsOnMap(graphics);
      if (!this._validateAndAddAOI()) {
        //as AOI is invalid we will not have AOI/Buffer geometry, we will only have drawn/selected
        //graphics so set the extent to drawn or selected graphics layer
        this._setExtentToGraphicsLayer(this._drawnOrSelectedGraphicsLayer);
      }
    },

    /**
     * This function will add and highlight drawn or selected graphics on map
     * param{object} contains keys as listed below,
     * 1. 'symbology' for the selected tab
     * @memberOf Screening/Widget
     */
    _addDrawnOrSelectedGraphicsOnMap: function (graphics) {
      // Loop through each graphic
      arrayUtils.forEach(graphics, lang.hitch(this, function (graphic) {
        var newGraphic, symbol;
        // Get symbol for current geometry type
        symbol = this._getSymbol(graphic.geometry.type);
        newGraphic = new Graphic(graphic.geometry, symbol);
        // Add graphic to which buffer will be drawn
        if (newGraphic && symbol) {
          this._drawnOrSelectedGraphicsLayer.add(newGraphic);
        }
      }));
    },

    /**
     * This function is used to add the uploaded shapefile graphics on map
     * @memberOf Screening/Widget
     */
    _addUploadedShapefileGraphicsOnMap: function (graphics) {
      arrayUtils.forEach(graphics, lang.hitch(this, function (graphic) {
        var newGraphic, symbol;
        symbol = this._getSymbol(graphic.geometry.type);
        newGraphic = new Graphic(graphic.geometry, symbol);
        if (newGraphic && symbol) {
          this._uploadedShapefileGraphicsLayer.add(newGraphic);
        }
      }));
    },

    /**
     * This function will return symbol according to the geometry type
     * 1. 'geometryType' geometry type of the graphic
     * @memberOf Screening/Widget
     */
    _getSymbol: function (geometryType) {
      var symbol, symbology;
      // Fetch symbology for the selected tab
      // Symbology, either for placename OR draw tools OR shapefile OR coordinates
      symbology = this.config[this._currentActiveTool + "Symbology"];
      //in case of extents show polygon symbol and in case of multipoint show points
      if (geometryType === 'extent') {
        geometryType = "polygon";
      } else if (geometryType === 'multipoint') {
        geometryType = "point";
      }
      symbol = jsonUtils.fromJson(symbology[geometryType]);
      // Return symbol
      return symbol;
    },

    /**
     * This function will return buffered polygon geometry on the basis of map's spatial Reference
     * param{object} contains keys as listed below,
     * 1. 'bufferParameters' set of required parameters to get buffer geometry
     * @memberOf Screening/Widget
     */
    _doBufferGeometry: function (bufferParameters) {
      var bufferGeometry, deferred;
      deferred = new Deferred();
      if (this.map.spatialReference.isWebMercator() || this.map.spatialReference
        .wkid === 4326) {
        // If spatial reference is web mercator, do GEODESIC BUFFER
        bufferGeometry = GeometryEngine.geodesicBuffer(bufferParameters
          .geometries, bufferParameters.distances,
          bufferParameters.unit, true);
        deferred.resolve(bufferGeometry);
      } else {
        // If spatial reference is NON web mercator, do BUFFER
        this._geometryService.buffer(bufferParameters,
          // Callback for geodesic buffer
          lang.hitch(this, function (bufferGeometry) {
            deferred.resolve(bufferGeometry);
          }),
          // Error while buffer
          lang.hitch(this, function () {
            deferred.resolve(null);
          }));
      }
      // Return resolved deferred
      return deferred.promise;
    },

    /**
     * This function will set the default values for buffer inputs and handle the events
     * @memberOf Screening/Widget
     */
    _setBufferInputs: function () {
      this.bufferDistanceTextBox.set("trim", true);
      //Set default value of the buffer distance
      this.bufferDistanceTextBox.set("value", this.config.defaultBufferDistance);
      this._bufferValue = this.bufferDistanceTextBox.value;
      //Set the default configured buffer unit
      this.bufferDistanceUnit.set("value", this.config.defaultBufferUnit);
      //Set max value for the default unit
      this._setMinAndMaxBufferDistance();
      //Attach key press event and focus out on enter press
      this._attachBufferDistanceTextboxKeypressEvent();
      //Attach buffer distance/unit change event and update buffers
      this.own(on(this.bufferDistanceTextBox, "blur", lang.hitch(this, this._validateAndAddAOI)));
      this.own(on(this.bufferDistanceUnit, "change", lang.hitch(this, this._validateAndAddAOI)));
    },

    /**
     * This function initialize the download widget and creates tooltip
     * @memberOf Screening/Widget
     */
    _initDownloadWidget: function (evt) {
      if (!this.downloadWidgetInstance) {
        this.downloadWidgetInstance = new DownloadReport({
          config: this.config, position: evt,
          nls: this.nls,
          map: this.map,
          aoi: this._aoiGraphicsLayer.graphics[0],
          loadingIndicator: this._loadingIndicator,
          downloadFeatureDetailsObj: this._downloadFeatureDetailsObj,
          filterLayerObj: this._filteredLayerObj,
          iframeNode: this.iframeContainer,
          isAndroidDevice: this.isAndroid()
        });

        this.own(on(this.downloadWidgetInstance, "showMessage",
          lang.hitch(this, function (msg) {
            this._showMessage(msg);
          })));

        this.own(on(this.downloadWidgetInstance, "toggleReportTabButtons",
          lang.hitch(this, function (msg) {
            this._showMessage(msg);
          })));
        this.downloadWidgetInstance.startup();
      } else {
        //Just pass the updated evt coordinates
        this.downloadWidgetInstance.position = evt;
        this.downloadWidgetInstance.downloadFeatureDetailsObj =
          this._downloadFeatureDetailsObj;
        this.downloadWidgetInstance.checkFileForDownload();
        this.downloadWidgetInstance.aoi = this._aoiGraphicsLayer.graphics[0];
        if (this.downloadWidgetInstance.isTooltipDialogOpened) {
          this.downloadWidgetInstance.closePopup();
        } else {
          this.downloadWidgetInstance.openPopup();
        }
      }
    },

    /**
     * This function will attach buffer distance textbox keypress event
     * @memberOf Screening/Widget
     */
    _attachBufferDistanceTextboxKeypressEvent: function () {
      var charOrCode;
      this.own(on(this.bufferDistanceTextBox, "keypress", lang.hitch(this,
        function (event) {
          charOrCode = event.charCode || event.keyCode;
          // Check for ENTER key
          if (charOrCode === keys.ENTER) {
            focusUtil.curNode.blur();
          }
        })));
    },

    /**
     * This function is to process adding valid AOI on map
     * param{object} contains keys as listed below,,
     * 1. 'drawnOrSelectedGraphics' array of reference graphics for creating AOI
     * @memberOf Screening/Widget
     */
    _validateAndAddAOI: function () {
      var i, graphics, isAOIValid, bufferedGeometryArray;
      isAOIValid = true;
      bufferedGeometryArray = [];
      // Clear layer selections
      if (this._drawTool && !(this._drawTool.selectTool.isActive())) {
        this._drawTool.clearAllSelections();
      }
      //if has valid drawn or selected graphics and valid buffer value
      if (this._drawnOrSelectedGraphicsLayer &&
        this._drawnOrSelectedGraphicsLayer.graphics &&
        this._drawnOrSelectedGraphicsLayer.graphics.length > 0) {
        graphics = this._drawnOrSelectedGraphicsLayer.graphics;
        // Show loading indicator
        this._loadingIndicator.show();
        // Loop through each feature
        for (i = 0; i < graphics.length; i++) {
          // Buffer distance should not be 0 for geometry types 'point' or 'polyline'
          if ((!this.bufferDistanceTextBox.isValid() ||
            Number(this.bufferDistanceTextBox.value) === 0 ||
            isNaN(this.bufferDistanceTextBox.value)) &&
            (graphics[i].geometry.type === "point" || graphics[i].geometry.type === "polyline")) {
            // Clear AOI graphics
            this._aoiGraphicsLayer.clear();
            // If buffer distance is 0 then clear AOI graphics and disable reports tab
            this._disableClearAOIButton();
            this._disableShowReportsButton();
            isAOIValid = false;
            break;
          }
          // Simplify geometry if it is of type polygon
          if (graphics[i].geometry.type === "polygon") {
            graphics[i].geometry = GeometryEngine.simplify(
              graphics[i].geometry);
          }
          if (this._currentActiveTool === "coordinates") {
            if (graphics[i].geometry.type === "polyline") {
              bufferedGeometryArray.push(graphics[i].geometry);
            }
          } else {
            bufferedGeometryArray.push(graphics[i].geometry);
          }
        }
        // If valid then draw the aoi/buffer based on buffer value not equal to 0
        if (isAOIValid) {
          if (!this.bufferDistanceTextBox.isValid() ||
            Number(this.bufferDistanceTextBox.value) === 0) {
            //As selected graphic is valid aoi(polygon) but the buffer value is zero,
            //add the graphics on aoi layer but don't set the AOI buffer symbology to it.
            this._drawAOIOnMap(bufferedGeometryArray, false);
          } else {
            this._drawAOIBuffer(bufferedGeometryArray);
          }
        } else {
          // Hide loading indicator
          this._loadingIndicator.hide();
        }
        return isAOIValid;
      } else {
        // Clear AOI graphics
        this._aoiGraphicsLayer.clear();
        // If buffer distance is 0 then clear AOI graphics and disable reports tab
        this._disableClearAOIButton();
        this._disableShowReportsButton();
      }
      return false;
    },

    /**
     * This function will draw AOI on map
     * 1. 'aoiGeometries' array of geometries to be buffered
     * @memberOf Screening/Widget
     */
    _drawAOIBuffer: function (aoiGeometries) {
      var bufferParameters;
      // Initialize buffer parameter
      bufferParameters = new BufferParameters();
      bufferParameters.distances = [this.bufferDistanceTextBox.value];
      bufferParameters.outSpatialReference = this.map.spatialReference;
      bufferParameters.unit = GeometryService[this.bufferDistanceUnit.value];
      bufferParameters.geometries = aoiGeometries;
      // Show loading indicator
      this._loadingIndicator.show();
      // added timeout to show the loading indicator as on
      // buffering dense geometries UIThread was not getting updated
      setTimeout(lang.hitch(this, function () {
        // Get buffer geometry as per map's spatial reference
        this._doBufferGeometry(bufferParameters).then(lang.hitch(this,
          function (bufferGeometry) {
            if (bufferGeometry) {
              // Function to draw AOI
              this._drawAOIOnMap(bufferGeometry, true);
            } else {
              // If unable to draw buffer
              this._showMessage(this.nls.unableToDrawBuffer);
            }
            // Hide loading indicator
            this._loadingIndicator.hide();
          }));
      }), 50);
    },

    /**
     * This function will clear AOI graphics from map
     * @memberOf Screening/Widget
     */
    _clearAOI: function () {
      if (!domClass.contains(this.clearAOIButton, "jimu-state-disabled")) {
        this._aoiGraphicsLayer.clear();
        this._drawnOrSelectedGraphicsLayer.clear();
        this._uploadedShapefileGraphicsLayer.clear();
        this._disableClearAOIButton();
        this._disableShowReportsButton();
        // Clear layer selections
        if (this._drawTool) {
          this._drawTool.clearAllSelections();
        }
        if (this._coordinatesTool) {
          this._coordinatesTool.resetCoordinatesWidgetValue();
        }
      }
    },

    /**
     * This function will draw AOI on Map
     * 1. 'aoiGeometry' contains polygon geometry to draw AOI
     * 2. 'addAOISymbology' Boolean indicates if to add symbology to graphics while adding on map
     * @memberOf Screening/Widget
     */
    _drawAOIOnMap: function (aoiGeometries, addAOISymbology) {
      // Show loading indicator
      this._loadingIndicator.show();
      this._aoiGraphicsLayer.clear();
      arrayUtils.forEach(aoiGeometries, lang.hitch(this, function (geometry) {
        var newGraphic;
        newGraphic = new Graphic(geometry);
        if (addAOISymbology) {
          newGraphic.setSymbol(jsonUtils.fromJson(this.config.aoiSymbol));
        }
        // Add aoi graphic on map
        this._aoiGraphicsLayer.add(newGraphic);
      }));
      this._isReportGenerated = false;
      if (this._aoiGraphicsLayer.graphics.length > 0) {
        this._setExtentToGraphicsLayer(this._aoiGraphicsLayer);
        // Enable reports tab
        // Now reports tab is available to generate reports
        this._enableClearAOIButton();
        this._enableShowReportsButton();
      } else {
        this._disableClearAOIButton();
        this._disableShowReportsButton();
      }
      // Hide loading indicator
      this._loadingIndicator.hide();
    },

    /**
     * This function will resize content of the widget
     * @memberOf Screening/Widget
     */
    resize: function () {
      this._setMaxHeightOfImpactSummaryReportContainer();
      //resize search boxes in placename & coordinateTools
      if (this._placenameTool) {
        this._placenameTool.onWindowResize();
      }
      if (this._coordinatesTool) {
        this._coordinatesTool.onWindowResize();
      }
    },

    /**
     * Create and show alert message.
     * @param {string} contains message
     * @memberOf Screening/Widget
     **/
    _showMessage: function (msg) {
      var alertMessage = new Message({
        message: msg
      });
      alertMessage.message = msg;
    },

    /**
     * This function will set min and max of buffer distance textbox according to selected unit
     * @param {string} contains unit string
     * @memberOf Screening/Widget
     **/
    _setMinAndMaxBufferDistance: function () {
      var maxValueInRange;
      // Set constraint as min and max for buffer distance as per unit
      this.bufferDistanceTextBox.set("constraints", {
        "min": 0,
        "max": this.config.maxBufferDistance
      });
      maxValueInRange = Math.floor(this.config.maxBufferDistance * 1000) / 1000;
      // Set its range error message as per unit value
      this.bufferDistanceTextBox.rangeMessage = string.substitute(this.nls.rangeErrorMessage, {
        "maxValue": maxValueInRange
      });
    },

    /**
     * This function will set the map's extent to the graphics of the selected graphics layer
     * @param {Object} GraphicsLayer object
     * @memberOf Screening/Widget
     **/
    _setExtentToGraphicsLayer: function (graphicsLayer) {
      if (graphicsLayer.graphics.length > 0 && graphicsLayer.graphics[0].geometry) {
        this.map.setExtent(
          graphicsUtils.graphicsExtent(graphicsLayer.graphics).expand(1.5));
      }
    },

    /**
     * This function is used to disable clear button
     * @memberOf Screening/Widget
     */
    _disableClearAOIButton: function () {
      domClass.add(this.clearAOIButton, "jimu-state-disabled");
    },

    /**
     * This function is used to enable clear button
     * @memberOf Screening/Widget
     */
    _enableClearAOIButton: function () {
      domClass.remove(this.clearAOIButton, "jimu-state-disabled");
    },

    /**
     * This function is used to disable show reports button
     * @memberOf Screening/Widget
     */
    _disableShowReportsButton: function () {
      domClass.add(this.showReportsButton, "jimu-state-disabled");
    },

    /**
     * This function is used to enable show reports button
     * @memberOf Screening/Widget
     */
    _enableShowReportsButton: function () {
      domClass.remove(this.showReportsButton, "jimu-state-disabled");
    },

    /**
     * This function is used to display the area of AOI in standard unit
     * @memberOf Screening/Widget
     */
    _calculateStandardUnitAOIArea: function (aoiArea) {
      var aoiAreaText;
      aoiArea = conversionUtils.honourPopupRounding(2, aoiArea);
      aoiArea = dojoNumber.format(aoiArea);
      aoiAreaText = this.nls.reportsTab.aoiAreaText + " : " +
        aoiArea + " " + this.nls.units.acres.abbreviation;
      domAttr.set(this.standardUnitAreaContainer, "innerHTML", aoiAreaText);
    },

    /**
     * This function is used to display the area of metric unit
     * @memberOf Screening/Widget
     */
    _calculateMetricUnitAOIArea: function (aoiArea) {
      var aoiAreaText;
      aoiArea = conversionUtils.honourPopupRounding(2, aoiArea);
      //apply locale formating
      aoiArea = dojoNumber.format(aoiArea);
      aoiAreaText = this.nls.reportsTab.aoiAreaText + " : " +
        aoiArea + " " + this.nls.units.squareKilometer.abbreviation;
      domAttr.set(this.metricUnitAreaContainer, "innerHTML", aoiAreaText);
    },

    /**
     * This function is used to display configured area units in reports tab
     * @memberOf Screening/Widget
     */
    _displayConfiguredAOIArea: function () {
      if (this.config.areaUnits === "Standard") {
        this._displayStandardUnitsArea();
      } else {
        this._displayMetricUnitsArea();
      }
    },

    /**
     * This function is used to display metric units area
     * @memberOf Screening/Widget
     */
    _displayMetricUnitsArea: function () {
      domClass.remove(this.metricUnitAreaContainer, "esriCTHidden");
      domClass.add(this.standardUnitAreaContainer, "esriCTHidden");
    },

    /**
     * This function is used to display standard units area
     * @memberOf Screening/Widget
     */
    _displayStandardUnitsArea: function () {
      domClass.remove(this.standardUnitAreaContainer, "esriCTHidden");
      domClass.add(this.metricUnitAreaContainer, "esriCTHidden");
    },

    /**
     * This function is used to enable/disable the download & print button
     * @memberOf Screening/Widget
     */
    _toggleReportTabButtons: function (isEnable) {
      if (isEnable) {
        domClass.remove(this.downloadReportBtn, "esriCTDownloadBtnDisabled");
        domClass.remove(this.printButton, "esriCTPrintBtnDisabled");
      } else {
        domClass.add(this.downloadReportBtn, "esriCTDownloadBtnDisabled");
        domClass.add(this.printButton, "esriCTPrintBtnDisabled");
      }
    },

    /**
     * This function is used to get the union of aoi/buffer geometries
     * @memberOf Screening/Widget
     */
    _getCompleteAOIGeometry: function () {
      var graphics, geometryArray = [];
      graphics = this._aoiGraphicsLayer.graphics;
      array.forEach(graphics, lang.hitch(this, function (graphic) {
        geometryArray.push(graphic.geometry);
      }));
      return GeometryEngine.union(geometryArray);
    },

    /**
     * This function is used to initialize ImpactSummaryReport widget
     * for each layer and add in the list
     * @memberOf Screening/Widget
     */
    _initializeImpactSummaryReportWidget: function () {
      var i, impactSummaryReportObj, featureLayerObj, promiseList, completeAOIGeometry;
      promiseList = [];
      this._isExceedingMaxRecordCount = false;
      domConstruct.empty(this.impactSummaryReportContainer);
      this._downloadFeatureDetailsObj = {};
      this._printData = {};
      completeAOIGeometry = this._getCompleteAOIGeometry();
      for (i = 0; i < this.config.layers.length; i++) {
        featureLayerObj = this._filteredLayerObj[this.config.layers[i].id];
        if (featureLayerObj) {
          impactSummaryReportObj = new ImpactSummaryReport({
            id: featureLayerObj.id + "_" + i + Date.now(),
            nls: this.nls,
            config: this.config,
            appConfig: this.appConfig,
            map: this.map,
            featureLayer: featureLayerObj,
            aoiGraphicsLayer: this._aoiGraphicsLayer,
            configuredField: this.config.layers[i].selectedFields,
            configuredLayerLabel: this.config.layers[i].label,
            maxFeaturesForAnalysis: this.config.maxFeaturesForAnalysis
          }, domConstruct.create("div", {}, this.impactSummaryReportContainer));
          this.own(on(impactSummaryReportObj, "printDataUpdated",
            lang.hitch(this, function (details) {
              this._printData[details.id].info = details.printData;
            })));
          this.own(on(impactSummaryReportObj, "showMessage", lang.hitch(this, function (msg) {
            this._showMessage(msg);
          })));
          this.own(on(impactSummaryReportObj, "exceedingMaxRecordCount",
            lang.hitch(this, this._displayExceedingFeatureCountError)));
          promiseList.push(impactSummaryReportObj.generateReport(completeAOIGeometry));
        }
      }
      //on report generation complete for all the layers
      all(promiseList).then(lang.hitch(this, function (reportLayerDetails) {
        var isIntersectingFeature = false;
        array.forEach(reportLayerDetails, lang.hitch(this, function (layerDetails) {
          //set download features details
          this._downloadFeatureDetailsObj[layerDetails.featureLayerId] = layerDetails.features;
          //set print info
          this._printData[layerDetails.id] = lang.hitch(layerDetails.printInfo);
          //if any of the layers count is greater than 0 enable download & print buttons
          if (layerDetails.features.length > 0 && !isIntersectingFeature) {
            isIntersectingFeature = true;
          }
          //After successful execution, change report generated flags value to true
          this._isReportGenerated = true;
        }));
        //Enable/disable download & print buttons
        this._toggleReportTabButtons(isIntersectingFeature);
      }));
    },

    /**
     * This function to display error message if feature count is more than max record count
     * @memberOf Screening/Widget
     */
    _displayExceedingFeatureCountError: function () {
      //if any of the layers count is exceeding Max record count show error on completion
      if (!this._isExceedingMaxRecordCount) {
        this._isExceedingMaxRecordCount = true;
        this._showMessage(this.nls.reportsTab.intersectingFeatureExceedsMsgOnCompletion);
      }
    },

    /**
     * This function detects if app is running in android
     * @memberOf Screening/Widget
     */
    isAndroid: function () {
      var ua = navigator.userAgent.toLowerCase();
      return ua.indexOf("android") > -1;
    },

    /**
     * This function detects if app is running in iOS
     * @memberOf Screening/Widget
     */
    isIOS: function () {
      return !!navigator.platform.match(/iPhone|iPod|iPad/);
    },

    /* Section to filter layers from the map */

    /**
     * This function to set feature layers for select tool
     * @memberOf Screening/Widget
     */
    _filterLayersFromMap: function () {
      this._filteredLayerObj = {};
      // Start showing loading indicator
      this._loadingIndicator.show();
      //get the instance of layer infos
      LayerInfos.getInstance(this.map, this.map.itemInfo)
        .then(lang.hitch(this, function (layerInfosObj) {
          this.layerInfosObj = layerInfosObj;
          // Get layers with information
          layerUtil.getLayerInfoArray(layerInfosObj).then(lang.hitch(this,
            function (layerInfoArray) {
              this._getLayerObjects(layerInfoArray).then(lang.hitch(this, function (layerObjects) {
                var defList = [];
                arrayUtils.forEach(layerObjects, function (layerObject) {
                  defList.push(this._filterLayer(layerObject));
                }, this);
                all(defList).then(lang.hitch(this, function () {
                  //load the widget
                  this._initWidgetComponents();
                }));
              }));
            }));
          //handle for filter changed event so that we can update the filters on search layers
          this.own(this.layerInfosObj.on('layerInfosFilterChanged',
            lang.hitch(this, this.onLayerInfosFilterChanged)));
        }));
    },

    /**
     * This function to get layer object from web map
     * @param{array} contains layers and its information
     * @memberOf Screening/Widget
     */
    _getLayerObjects: function (layerInfoArray) {
      var retDef = new Deferred();
      var defs = arrayUtils.map(layerInfoArray, function (layerInfo) {
        return layerInfo.getLayerObject();
      });
      all(defs).then(function (layerObjects) {
        retDef.resolve(layerObjects);
      });
      return retDef;
    },

    /**
     * This function to filter visible layers of the map
     * @param{object} contains information of the layer
     * @memberOf Screening/Widget
     */
    _filterLayer: function (layerObject) {
      var pattern, result, mapServerURL, i, mapServerLayerID, j, operationalLayers, visibleLayers,
        layerDef, isLayerAvailable;
      layerDef = new Deferred();
      pattern = /(^.*?MapServer)/gi;
      result = pattern.exec(layerObject.url);
      isLayerAvailable = false;
      // If it is a map server url
      if (result) {
        mapServerURL = result[1];
      }
      operationalLayers = this.map.webMapResponse.itemInfo.itemData.operationalLayers;
      mapServerLayerID = layerObject.layerId;
      // Check for map server or feature server layers
      for (i = 0; i < operationalLayers.length; i++) {
        if ((operationalLayers[i].layerType === "ArcGISMapServiceLayer") &&
          (mapServerURL === operationalLayers[i].url) && (result)) {
          visibleLayers = operationalLayers[i].layerObject.layerInfos;
          for (j = 0; j < visibleLayers.length; j++) {
            if (mapServerLayerID === visibleLayers[j].id) {
              this._filteredLayerObj[layerObject.id] = layerObject;
              isLayerAvailable = true;
              layerDef.resolve();
              break;
            }
          }
        } else if (operationalLayers[i].layerType === "ArcGISFeatureLayer") {
          this._filteredLayerObj[layerObject.id] = layerObject;
          isLayerAvailable = true;
          layerDef.resolve();
          break;
        }
      }
      if (!isLayerAvailable) {
        layerDef.resolve();
      }
      return layerDef.promise;
    },

    /**
     * This function will be triggered on filterChange
     * and updates the definition expression in the search layers
     * @memberOf Screening/Widget
     */
    onLayerInfosFilterChanged: function (changedLayerInfos) {
      array.some(changedLayerInfos, lang.hitch(this, function (info) {
        if (this._filteredLayerObj[info.id]) {
          this._filteredLayerObj[info.id].setDefinitionExpression(info.getFilter());
        }
      }));
    },

    /* End of filter layer section */

    /**
    * Show selected panel
    * @param{string} name
    * @param{boolean} isLeft
    * @memberOf Screening/Widget
    **/
    _showPanel: function (name, isLeft) {
      domStyle.set(this._panels[name], {
        display: 'block',
        left: '-100%'
      });
      if (isLeft) {
        this._slide(this._panels[name], -100, 0);
        this._slide(this._currentPanel, 0, 100);
      } else {
        this._slide(this._currentPanel, 0, -100);
        this._slide(this._panels[name], 100, 0);
      }
      this._currentPanelName = name;
      this._currentPanel = this._panels[name];
    },

    /**
    * animate panels
    * @param{object} dom
    * @param{int} startLeft
    * @param{int} endLeft
    * @memberOf Screening/Widget
    **/
    _slide: function (dom, startLeft, endLeft) {
      domStyle.set(dom, 'left', endLeft);
      if (endLeft === 0) {
        domStyle.set(dom, 'display', 'block');
      } else {
        domStyle.set(dom, 'display', 'none');
      }
      domStyle.set(dom, 'left', startLeft + "%");
      fx.animateProperty({
        node: dom,
        properties: {
          left: {
            start: startLeft,
            end: endLeft,
            units: '%'
          }
        },
        duration: 300
      }).play();
    }
  });
});