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
define({
  units: { // label shown in config UI dialog box(options for dropdown)
    miles: "@he Miles",
    kilometers: "@he Kilometers",
    feet: "@he Feet",
    meters: "@he Meters",
    uSSurveyFeet: "@he US Survey Feet",
    standardUnit: "@he Standard Unit",
    metricUnit: "@he Metric Unit",
    decimalDegree: "@he Decimal Degree", // Shown as label for Decimal Degree in direction or angle unit dropdown
    degreeMinuteSeconds: "@he Degree Minute Seconds" // Shown as label for Degree Minute Seconds in direction or angle unit dropdown,
  },
  analysisTab: {
    analysisTabLabel: "@he Analysis", // shown as label in config UI for first tab.
    selectAnalysisLayerLabel: "@he Select analysis layers", // shown as main label in config UI for Add Layer section.
    addLayerLabel: "@he Add Layers", // shown as label in config UI for button add layer for Add Layer section.
    noValidLayersForAnalysis: "@he No valid layers found in the selected webmap.", // shown as label in config UI if no valid layers found in the selected webmap.
    noValidFieldsForAnalysis: "@he No valid fields found in the selected webmap. Please remove the selected layer.", // shown as label in config UI if no valid fields found in the selected webmap.
    addLayersHintText: "@he Hint: Select layers and fields to analyze and display in report", // shown as hint text in config UI for Add layers section.
    addLayerNameTitle: "@he Layer Name", // shown as title in config UI for add layer Name in Add Layer section.
    addLayerLabelTitle: "@he Label", // shown as title in config UI for add layer label in Add Layer section.
    addLayerActionsTitle: "@he Actions", // shown as title in config UI for add layer Actions in Add Layer section.
    addFieldsLabel: "@he Add Field", // shown as label in config UI for button add field for Add Fields section.
    addFieldsPopupTitle: "@he Select Fields", // shown as title in config UI for add Fields Popup title in Add Fields section.
    addFieldsLabelTitle: "@he Label", // shown as title in config UI for add Fields Fields in Add Fields section.
    addFieldsNameTitle: "@he Field Names", // shown as title in config UI for add Fields Name in Add Fields section.
    addFieldsActionsTitle: "@he Actions", // shown as title in config UI for add Fields Actions in Add Fields section.
    aoiToolsLegendLabel: "@he AOI Tools", // shown as legend for fieldset in config UI for AOI Tools.
    aoiToolsDescriptionLabel: "@he Enable tools to create areas of interest and specify their labels", // shown as label in config UI for AOI tools description label in AOI Tools
    placenameLabel: "@he Placename", // shown as label in config UI for placename in AOI Tools section
    drawToolsLabel: "@he Draw Tools", // shown as label in config UI for drawTools in AOI Tools section
    uploadShapeFileLabel: "@he Upload a Shapefile", // shown as label in config UI for uploadShapeFile in AOI Tools section
    coordinatesLabel: "@he Co-ordinates", // shown as label in config UI for coordinates in AOI Tools section
    coordinatesDrpDwnHintText: "@he Hint: Select unit to display entered traverses", // Shown as hint text in config UI for coordinates DropDown hint text.
    coordinatesBearingDrpDwnHintText: "@he Hint: Select bearing to display entered traverses", // Shown as hint text in config UI for coordinates DropDown hint text.
    allowShapefilesUploadLabel: "@he Allow uploading shapefiles to analysis", // shown as main label in config UI for allow uploading shapefiles section.
    areaUnitsLabel: "@he Show areas/lengths in", // shown as main label in config UI for area units dropdown section.
    allowShapefilesUploadLabelHintText: "@he Hint: Display 'Upload shapefile in Analysis' in Report Tab", // Shown as hint text in config UI for area units DropDown hint text.
    maxFeatureForAnalysisLabel: "@he Max features for analysis", // Shown as the label for max features for analysis
    maxFeatureForAnalysisHintText: "@he Hint: Set the maximum number of features for analysis" // Shown as the hint text for max features for analysis
  },
  downloadTab: {
    downloadLegend: "@he Download Settings", // Shown as fieldset legend for download settings
    reportLegend: "@he Report Settings", // Shown as fieldset legend for report settings
    downloadTabLabel: "@he Download", // Shown as the label of the tab
    syncEnableOptionLabel: "@he Feature Layers", // Shown as the label for sync enable download option
    syncEnableOptionHint: "@he Hint: Used to download feature information for features intersecting the area of interest in the indicated formats.", // Shown as the hint text for sync enable download option
    syncEnableOptionNote: "@he Note: Sync enabled feature services are required for File Geodatabase and Shapefile options. Shapefile format is only supported with ArcGIS Online hosted feature layers.", // Shown as the special note in the hint text for sync enable download option
    extractDataTaskOptionLabel: "@he Extract Data Task geoprocessing service", // Shown as the label for extract data task download option
    extractDataTaskOptionHint: "@he Hint: Use a published Extract Data Task geoprocessing service to download features that intersect the area of interest in File Geodatabase or Shapefile formats.", // Shown as the hint for extract data task download option
    cannotDownloadOptionLabel: "@he Disable download", // Shown as the label for disabling download option in widget
    syncEnableTableHeaderTitle: {
      layerNameLabel: "@he Layer name", // Shown as the table header for layer name
      csvFileFormatLabel: "@he CSV", // Shown as the table header for CSV file format
      fileGDBFormatLabel: "@he File Geodatabase", // Shown as the table header for File Geodatabase file format
      ShapefileFormatLabel: "@he Shapefile", // Shown as the table header for Shapefile file format
      allowDownloadLabel: "@he Allow Download" // Shown as the table header for allowing download option checkboxes for the respective layers
    },
    setButtonLabel: "@he Set", // Shown as the Set button label for selecting gp service for both Extract data task and Print task service
    GPTaskLabel: "@he Specify url to geoprocessing service", // Shown as the label for selecting print task gp service
    printGPServiceLabel: "@he Print Service URL", // Shown as the label to specify print service url
    setGPTaskTitle: "@he Specify required Geoprocessing Service URL", // Shown as the title of the popup for selecting geoprocessing url
    logoLabel: "@he Logo", // Shown as the label for selecting logo
    logoChooserHint: "@he Hint: Click on image icon to change the image", // Shown as the hint for logo chooser
    footnoteLabel: "@he Footnote", // Shown as the label for footnote textarea
    errorMessages: {
      invalidGPTaskURL: "@he Invalid geoprocessing service. Please select geoprocessing service containing Extract Data Task.", // Shown as the error message on selecting invalid geoprocessing service
      noExtractDataTaskURL: "@he Please select any geoprocessing service containing Extract Data Task." // Shown as the error message when no geoprocessing service is selected on setting the configuration
    }
  },
  generalTab: {
    generalTabLabel: "@he General", // shown as label in config UI for third tab
    tabLabelsLegend: "@he Tab Labels", // shown as label in config UI for Tab Labels Fieldset legend
    tabLabelsHint: "@he Hint: Specify Labels", // shown as hint in config UI for Tab Labels Fieldset
    AOITabLabel: "@he Area of Interest Tab", // shown as label in config UI for Tab Labels Fieldset AOI Tab Option
    ReportTabLabel: "@he Report Tab", // shown as label in config UI for Tab Labels Fieldset Report Tab Option
    bufferSettingsLegend: "@he Buffer Settings", // shown as label in config UI for Buffer Settings Fieldset legend
    defaultBufferDistanceLabel: "@he Default Buffer Distance", // shown as label in config UI for Buffer Settings Fieldset Default Buffer Distance Option
    defaultBufferUnitsLabel: "@he Buffer Units", // shown as label in config UI for Buffer Settings Fieldset Default Buffer Units Option
    maxBufferDistanceLabel: "@he Max Buffer Distance", // shown as label in config UI for Buffer Settings Fieldset Max Buffer Distance Option
    maxBufferUnitsLabel: "@he Max Buffer Units", // shown as label in config UI for Buffer Settings Fieldset Max Buffer Units Option
    generalBufferSymbologyHint: "@he Hint: Set symbology to be used for displaying buffers around defined areas of interest", // shown as hint in config UI for Buffer Settings Fieldset for Buffer Symbology Option
    aoiGraphicsSymbologyLegend: "@he AOI Graphics Symbology", // shown as label in config UI for AOI Graphics Symbology Fieldset legend
    aoiGraphicsSymbologyHint: "@he Hint: Set symbology to be used while defining point, line and polygon areas of interest", // shown as hint in config UI for AOI Graphics Symbology Fieldset
    pointSymbologyLabel: "@he Point", // shown as label in config UI for AOI Graphics Symbology Fieldset point Symbology
    previewLabel: "@he Preview", // shown as label in config UI for AOI Graphics Symbology Fieldset preview
    lineSymbologyLabel: "@he Line", // shown as label in config UI for AOI Graphics Symbology Fieldset line Symbology
    polygonSymbologyLabel: "@he Polygon", // shown as label in config UI for AOI Graphics Symbology Fieldset polygon Symbology
    aoiBufferSymbologyLabel: "@he Buffer Symbology", // shown as label in config UI for AOI Graphics Symbology Fieldset AOI Symbology
    pointSymbolChooserPopupTitle: "@he Address or location symbol", // shown as title in config UI for Symbol chooser popup for point symbology
    polygonSymbolChooserPopupTitle: "@he Select symbol to highlight polygon", // shown as title in config UI for Symbol chooser popup for polygon symbology
    lineSymbolChooserPopupTitle: "@he Select symbol to highlight line", // shown as title in config UI for Symbol chooser popup for line symbology
    aoiSymbolChooserPopupTitle: "@he Set buffer symbol" // shown as title in config UI for Symbol chooser popup for aoi symbology
  },
  searchSourceSetting: {
    searchSourceSettingTabTitle: "@he Search Source Settings", // shown as a label in config UI dialog box for search source setting
    searchSourceSettingTitle: "@he Search Source Settings", // shown as a label in config UI dialog box for search source setting
    searchSourceSettingTitleHintText: "@he Add and configure geocode services or feature layers as search sources. These specified sources determine what is searchable within the search box", // shown as a hint text in config UI dialog box for search source setting
    addSearchSourceLabel: "@he Add Search Source", // Shown as a label in config UI for button
    featureLayerLabel: "@he Feature Layer", // Shown as a label in config UI for dropDown menu
    geocoderLabel: "@he Geocoder", // Shown as a label in config UI for dropDown menu
    nameTitle: "@he Name", // Shown as a title in table
    generalSettingLabel: "@he General Setting", // Shown as a label in config UI
    allPlaceholderLabel: "@he Placeholder text for searching all:", // Shown as a label in config UI
    allPlaceholderHintText: "@he Hint: Enter text to be shown as placeholder while searching all layers and geocoder", // shown as a hint text in config UI
    generalSettingCheckboxLabel: "@he Show pop-up for the found feature or location", // Shown as a label of checkbox
    countryCode: "@he Country or Region Code(s)", // Shown as a label in config UI
    countryCodeEg: "@he e.g. ", // Shown as a placeholder in config UI
    countryCodeHint: "@he Leaving this value blank will search all countries and regions", // Shown as a hint text in config UI for country code textbox
    questionMark: "@he ؟", //Shown as a question mark in config UI for help
    searchInCurrentMapExtent: "@he Only search in current map extent", // Shown as a label in config UI for checkbox
    zoomScale: "@he Zoom Scale", // Shown as a label in config UI
    locatorUrl: "@he Geocoder URL", // Shown as a label in config UI for layer chooser
    locatorName: "@he Geocoder Name", // Shown as a label in config UI
    locatorExample: "@he Example", // Shown as a label in config UI
    locatorWarning: "@he This version of geocoding service is not supported. The widget supports geocoding service 10.0 and above.",
    locatorTips: "@he Suggestions are not available because the geocoding service doesn't support suggest capability.",
    layerSource: "@he Layer Source", // Shown as a label in config UI
    setLayerSource: "@he Set Layer Source", // Shown as a popup title while selecting layers
    setGeocoderURL: "@he Set Geocoder URL", // Shown as a popup title while selecting geocoder URL
    searchLayerTips: "@he Suggestions are not available because the feature service doesn't support pagination capability.", // Show as msg if suggestions would not be available
    placeholder: "@he Placeholder Text", // Shown as a placeholder in config UI
    searchFields: "@he Search Fields", // Shown as a label in config UI
    displayField: "@he Display Field", // Shown as a label in config UI
    exactMatch: "@he Exact Match", // Shown as a label in config UI for checkbox
    maxSuggestions: "@he Maximum Suggestions", // Shown as a label in config UI
    maxResults: "@he Maximum Results", // Shown as a label in config UI
    enableLocalSearch: "@he Enable local search", // Shown as a label in config UI for checkbox
    minScale: "@he Min Scale", // Shown as a label in config UI
    minScaleHint: "@he When the map scale is larger than this scale, local search will be applied",
    radius: "@he Radius", // Shown as a label in config UI
    radiusHint: "@he Specifies the radius of an area around current map center that is used to boost the rank of geocoding candidates so that candidates closest to the location are returned first", // Shown as a hint for radius
    meters: "@he Meters", // Shown as a label in config UI for radius unit
    setSearchFields: "@he Set Search Fields", // Shown as a title for selecting search fields
    set: "@he Set", // Shown as a label in config UI for button
    fieldName: "@he Name", // Shown as a label in config UI
    invalidUrlTip: "@he The URL ${URL} is invalid or inaccessible.", // Shown as error message if URL is invalid
    invalidSearchSources: "@he Invalid search source settings" // Show as error msg if search source settings are invalid
  },
  errorMsg: {
    textboxFieldsEmptyErrorMsg: "@he Please fill the required fields", // Shown as error message if textbox fields are empty.
    bufferDistanceFieldsErrorMsg: "@he Please enter valid values", // Shown as error message if number textbox fields has invalid values.
    defaultLessThanMaxBufferDistanceFieldErrorMsg: "@he Max buffer distance should not be 0 or less than default buffer distance", // Shown as error message if default buffer distance textbox field value less than max buffer distance textbox field.
    atLeastOneCheckboxCheckedErrorMsg: "@he Invalid configuration", // Shown as error message if no checkbox field checked in AOI Tools section.
    noLayerAvailableErrorMsg: "@he No layers available", // Shown as error message if no valid layer available.
    layerNotSupportedErrorMsg: "@he Not Supported ", // Shown as error message if layer type is not supported.
    noFieldSelected: "@he Please use the edit action to select a field", // Shown as error message if no field selected for add layers section
    duplicateFieldsLabels: "@he Duplicate label '${labelText}' added for : '${itemNames}'", // Shown as error message if duplicate labels selected for layers/ fields in add layers section
    noLayerSelected: "@he Please select at least one layer for analysis", // Shown as error message if no layer selected for add layers section
    errorInSelectingLayer: "@he Unable to complete the operation of selecting layer. Please try again.", // Shown as error message when error in selecting layer in dropdown
    errorInMaxFeatureCount: "@he Please enter valid max features count for analysis." // Shown as an error message if max count is less then 1 or invalid
  }
});
