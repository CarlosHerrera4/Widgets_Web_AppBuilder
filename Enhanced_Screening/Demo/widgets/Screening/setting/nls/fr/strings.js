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
    miles: "@fr Miles",
    kilometers: "@fr Kilometers",
    feet: "@fr Feet",
    meters: "@fr Meters",
    uSSurveyFeet: "@fr US Survey Feet",
    standardUnit: "@fr Standard Unit",
    metricUnit: "@fr Metric Unit",
    decimalDegree: "@fr Decimal Degree", // Shown as label for Decimal Degree in direction or angle unit dropdown
    degreeMinuteSeconds: "@fr Degree Minute Seconds" // Shown as label for Degree Minute Seconds in direction or angle unit dropdown,
  },
  analysisTab: {
    analysisTabLabel: "@fr Analysis", // shown as label in config UI for first tab.
    selectAnalysisLayerLabel: "@fr Select analysis layers", // shown as main label in config UI for Add Layer section.
    addLayerLabel: "@fr Add Layers", // shown as label in config UI for button add layer for Add Layer section.
    noValidLayersForAnalysis: "@fr No valid layers found in the selected webmap.", // shown as label in config UI if no valid layers found in the selected webmap.
    noValidFieldsForAnalysis: "@fr No valid fields found in the selected webmap. Please remove the selected layer.", // shown as label in config UI if no valid fields found in the selected webmap.
    addLayersHintText: "@fr Hint: Select layers and fields to analyze and display in report", // shown as hint text in config UI for Add layers section.
    addLayerNameTitle: "@fr Layer Name", // shown as title in config UI for add layer Name in Add Layer section.
    addLayerLabelTitle: "@fr Label", // shown as title in config UI for add layer label in Add Layer section.
    addLayerActionsTitle: "@fr Actions", // shown as title in config UI for add layer Actions in Add Layer section.
    addFieldsLabel: "@fr Add Field", // shown as label in config UI for button add field for Add Fields section.
    addFieldsPopupTitle: "@fr Select Fields", // shown as title in config UI for add Fields Popup title in Add Fields section.
    addFieldsLabelTitle: "@fr Label", // shown as title in config UI for add Fields Fields in Add Fields section.
    addFieldsNameTitle: "@fr Field Names", // shown as title in config UI for add Fields Name in Add Fields section.
    addFieldsActionsTitle: "@fr Actions", // shown as title in config UI for add Fields Actions in Add Fields section.
    aoiToolsLegendLabel: "@fr AOI Tools", // shown as legend for fieldset in config UI for AOI Tools.
    aoiToolsDescriptionLabel: "@fr Enable tools to create areas of interest and specify their labels", // shown as label in config UI for AOI tools description label in AOI Tools
    placenameLabel: "@fr Placename", // shown as label in config UI for placename in AOI Tools section
    drawToolsLabel: "@fr Draw Tools", // shown as label in config UI for drawTools in AOI Tools section
    uploadShapeFileLabel: "@fr Upload a Shapefile", // shown as label in config UI for uploadShapeFile in AOI Tools section
    coordinatesLabel: "@fr Co-ordinates", // shown as label in config UI for coordinates in AOI Tools section
    coordinatesDrpDwnHintText: "@fr Hint: Select unit to display entered traverses", // Shown as hint text in config UI for coordinates DropDown hint text.
    coordinatesBearingDrpDwnHintText: "@fr Hint: Select bearing to display entered traverses", // Shown as hint text in config UI for coordinates DropDown hint text.
    allowShapefilesUploadLabel: "@fr Allow uploading shapefiles to analysis", // shown as main label in config UI for allow uploading shapefiles section.
    areaUnitsLabel: "@fr Show areas/lengths in", // shown as main label in config UI for area units dropdown section.
    allowShapefilesUploadLabelHintText: "@fr Hint: Display 'Upload shapefile in Analysis' in Report Tab", // Shown as hint text in config UI for area units DropDown hint text.
    maxFeatureForAnalysisLabel: "@fr Max features for analysis", // Shown as the label for max features for analysis
    maxFeatureForAnalysisHintText: "@fr Hint: Set the maximum number of features for analysis" // Shown as the hint text for max features for analysis
  },
  downloadTab: {
    downloadLegend: "@fr Download Settings", // Shown as fieldset legend for download settings
    reportLegend: "@fr Report Settings", // Shown as fieldset legend for report settings
    downloadTabLabel: "@fr Download", // Shown as the label of the tab
    syncEnableOptionLabel: "@fr Feature Layers", // Shown as the label for sync enable download option
    syncEnableOptionHint: "@fr Hint: Used to download feature information for features intersecting the area of interest in the indicated formats.", // Shown as the hint text for sync enable download option
    syncEnableOptionNote: "@fr Note: Sync enabled feature services are required for File Geodatabase and Shapefile options. Shapefile format is only supported with ArcGIS Online hosted feature layers.", // Shown as the special note in the hint text for sync enable download option
    extractDataTaskOptionLabel: "@fr Extract Data Task geoprocessing service", // Shown as the label for extract data task download option
    extractDataTaskOptionHint: "@fr Hint: Use a published Extract Data Task geoprocessing service to download features that intersect the area of interest in File Geodatabase or Shapefile formats.", // Shown as the hint for extract data task download option
    cannotDownloadOptionLabel: "@fr Disable download", // Shown as the label for disabling download option in widget
    syncEnableTableHeaderTitle: {
      layerNameLabel: "@fr Layer name", // Shown as the table header for layer name
      csvFileFormatLabel: "@fr CSV", // Shown as the table header for CSV file format
      fileGDBFormatLabel: "@fr File Geodatabase", // Shown as the table header for File Geodatabase file format
      ShapefileFormatLabel: "@fr Shapefile", // Shown as the table header for Shapefile file format
      allowDownloadLabel: "@fr Allow Download" // Shown as the table header for allowing download option checkboxes for the respective layers
    },
    setButtonLabel: "@fr Set", // Shown as the Set button label for selecting gp service for both Extract data task and Print task service
    GPTaskLabel: "@fr Specify url to geoprocessing service", // Shown as the label for selecting print task gp service
    printGPServiceLabel: "@fr Print Service URL", // Shown as the label to specify print service url
    setGPTaskTitle: "@fr Specify required Geoprocessing Service URL", // Shown as the title of the popup for selecting geoprocessing url
    logoLabel: "@fr Logo", // Shown as the label for selecting logo
    logoChooserHint: "@fr Hint: Click on image icon to change the image", // Shown as the hint for logo chooser
    footnoteLabel: "@fr Footnote", // Shown as the label for footnote textarea
    errorMessages: {
      invalidGPTaskURL: "@fr Invalid geoprocessing service. Please select geoprocessing service containing Extract Data Task.", // Shown as the error message on selecting invalid geoprocessing service
      noExtractDataTaskURL: "@fr Please select any geoprocessing service containing Extract Data Task." // Shown as the error message when no geoprocessing service is selected on setting the configuration
    }
  },
  generalTab: {
    generalTabLabel: "@fr General", // shown as label in config UI for third tab
    tabLabelsLegend: "@fr Tab Labels", // shown as label in config UI for Tab Labels Fieldset legend
    tabLabelsHint: "@fr Hint: Specify Labels", // shown as hint in config UI for Tab Labels Fieldset
    AOITabLabel: "@fr Area of Interest Tab", // shown as label in config UI for Tab Labels Fieldset AOI Tab Option
    ReportTabLabel: "@fr Report Tab", // shown as label in config UI for Tab Labels Fieldset Report Tab Option
    bufferSettingsLegend: "@fr Buffer Settings", // shown as label in config UI for Buffer Settings Fieldset legend
    defaultBufferDistanceLabel: "@fr Default Buffer Distance", // shown as label in config UI for Buffer Settings Fieldset Default Buffer Distance Option
    defaultBufferUnitsLabel: "@fr Buffer Units", // shown as label in config UI for Buffer Settings Fieldset Default Buffer Units Option
    maxBufferDistanceLabel: "@fr Max Buffer Distance", // shown as label in config UI for Buffer Settings Fieldset Max Buffer Distance Option
    maxBufferUnitsLabel: "@fr Max Buffer Units", // shown as label in config UI for Buffer Settings Fieldset Max Buffer Units Option
    generalBufferSymbologyHint: "@fr Hint: Set symbology to be used for displaying buffers around defined areas of interest", // shown as hint in config UI for Buffer Settings Fieldset for Buffer Symbology Option
    aoiGraphicsSymbologyLegend: "@fr AOI Graphics Symbology", // shown as label in config UI for AOI Graphics Symbology Fieldset legend
    aoiGraphicsSymbologyHint: "@fr Hint: Set symbology to be used while defining point, line and polygon areas of interest", // shown as hint in config UI for AOI Graphics Symbology Fieldset
    pointSymbologyLabel: "@fr Point", // shown as label in config UI for AOI Graphics Symbology Fieldset point Symbology
    previewLabel: "@fr Preview", // shown as label in config UI for AOI Graphics Symbology Fieldset preview
    lineSymbologyLabel: "@fr Line", // shown as label in config UI for AOI Graphics Symbology Fieldset line Symbology
    polygonSymbologyLabel: "@fr Polygon", // shown as label in config UI for AOI Graphics Symbology Fieldset polygon Symbology
    aoiBufferSymbologyLabel: "@fr Buffer Symbology", // shown as label in config UI for AOI Graphics Symbology Fieldset AOI Symbology
    pointSymbolChooserPopupTitle: "@fr Address or location symbol", // shown as title in config UI for Symbol chooser popup for point symbology
    polygonSymbolChooserPopupTitle: "@fr Select symbol to highlight polygon", // shown as title in config UI for Symbol chooser popup for polygon symbology
    lineSymbolChooserPopupTitle: "@fr Select symbol to highlight line", // shown as title in config UI for Symbol chooser popup for line symbology
    aoiSymbolChooserPopupTitle: "@fr Set buffer symbol" // shown as title in config UI for Symbol chooser popup for aoi symbology
  },
  searchSourceSetting: {
    searchSourceSettingTabTitle: "@fr Search Source Settings", // shown as a label in config UI dialog box for search source setting
    searchSourceSettingTitle: "@fr Search Source Settings", // shown as a label in config UI dialog box for search source setting
    searchSourceSettingTitleHintText: "@fr Add and configure geocode services or feature layers as search sources. These specified sources determine what is searchable within the search box", // shown as a hint text in config UI dialog box for search source setting
    addSearchSourceLabel: "@fr Add Search Source", // Shown as a label in config UI for button
    featureLayerLabel: "@fr Feature Layer", // Shown as a label in config UI for dropDown menu
    geocoderLabel: "@fr Geocoder", // Shown as a label in config UI for dropDown menu
    nameTitle: "@fr Name", // Shown as a title in table
    generalSettingLabel: "@fr General Setting", // Shown as a label in config UI
    allPlaceholderLabel: "@fr Placeholder text for searching all:", // Shown as a label in config UI
    allPlaceholderHintText: "@fr Hint: Enter text to be shown as placeholder while searching all layers and geocoder", // shown as a hint text in config UI
    generalSettingCheckboxLabel: "@fr Show pop-up for the found feature or location", // Shown as a label of checkbox
    countryCode: "@fr Country or Region Code(s)", // Shown as a label in config UI
    countryCodeEg: "@fr e.g. ", // Shown as a placeholder in config UI
    countryCodeHint: "@fr Leaving this value blank will search all countries and regions", // Shown as a hint text in config UI for country code textbox
    questionMark: "@fr ؟", //Shown as a question mark in config UI for help
    searchInCurrentMapExtent: "@fr Only search in current map extent", // Shown as a label in config UI for checkbox
    zoomScale: "@fr Zoom Scale", // Shown as a label in config UI
    locatorUrl: "@fr Geocoder URL", // Shown as a label in config UI for layer chooser
    locatorName: "@fr Geocoder Name", // Shown as a label in config UI
    locatorExample: "@fr Example", // Shown as a label in config UI
    locatorWarning: "@fr This version of geocoding service is not supported. The widget supports geocoding service 10.0 and above.",
    locatorTips: "@fr Suggestions are not available because the geocoding service doesn't support suggest capability.",
    layerSource: "@fr Layer Source", // Shown as a label in config UI
    setLayerSource: "@fr Set Layer Source", // Shown as a popup title while selecting layers
    setGeocoderURL: "@fr Set Geocoder URL", // Shown as a popup title while selecting geocoder URL
    searchLayerTips: "@fr Suggestions are not available because the feature service doesn't support pagination capability.", // Show as msg if suggestions would not be available
    placeholder: "@fr Placeholder Text", // Shown as a placeholder in config UI
    searchFields: "@fr Search Fields", // Shown as a label in config UI
    displayField: "@fr Display Field", // Shown as a label in config UI
    exactMatch: "@fr Exact Match", // Shown as a label in config UI for checkbox
    maxSuggestions: "@fr Maximum Suggestions", // Shown as a label in config UI
    maxResults: "@fr Maximum Results", // Shown as a label in config UI
    enableLocalSearch: "@fr Enable local search", // Shown as a label in config UI for checkbox
    minScale: "@fr Min Scale", // Shown as a label in config UI
    minScaleHint: "@fr When the map scale is larger than this scale, local search will be applied",
    radius: "@fr Radius", // Shown as a label in config UI
    radiusHint: "@fr Specifies the radius of an area around current map center that is used to boost the rank of geocoding candidates so that candidates closest to the location are returned first", // Shown as a hint for radius
    meters: "@fr Meters", // Shown as a label in config UI for radius unit
    setSearchFields: "@fr Set Search Fields", // Shown as a title for selecting search fields
    set: "@fr Set", // Shown as a label in config UI for button
    fieldName: "@fr Name", // Shown as a label in config UI
    invalidUrlTip: "@fr The URL ${URL} is invalid or inaccessible.", // Shown as error message if URL is invalid
    invalidSearchSources: "@fr Invalid search source settings" // Show as error msg if search source settings are invalid
  },
  errorMsg: {
    textboxFieldsEmptyErrorMsg: "@fr Please fill the required fields", // Shown as error message if textbox fields are empty.
    bufferDistanceFieldsErrorMsg: "@fr Please enter valid values", // Shown as error message if number textbox fields has invalid values.
    defaultLessThanMaxBufferDistanceFieldErrorMsg: "@fr Max buffer distance should not be 0 or less than default buffer distance", // Shown as error message if default buffer distance textbox field value less than max buffer distance textbox field.
    atLeastOneCheckboxCheckedErrorMsg: "@fr Invalid configuration", // Shown as error message if no checkbox field checked in AOI Tools section.
    noLayerAvailableErrorMsg: "@fr No layers available", // Shown as error message if no valid layer available.
    layerNotSupportedErrorMsg: "@fr Not Supported ", // Shown as error message if layer type is not supported.
    noFieldSelected: "@fr Please use the edit action to select a field", // Shown as error message if no field selected for add layers section
    duplicateFieldsLabels: "@fr Duplicate label '${labelText}' added for : '${itemNames}'", // Shown as error message if duplicate labels selected for layers/ fields in add layers section
    noLayerSelected: "@fr Please select at least one layer for analysis", // Shown as error message if no layer selected for add layers section
    errorInSelectingLayer: "@fr Unable to complete the operation of selecting layer. Please try again.", // Shown as error message when error in selecting layer in dropdown
    errorInMaxFeatureCount: "@fr Please enter valid max features count for analysis." // Shown as an error message if max count is less then 1 or invalid
  }
});
