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
  _widgetLabel: "@it Screening", // Shown as label of widget
  geometryServicesNotFound: "@it Geometry service not available.", // Shown as error message if geometry service is not found
  unableToDrawBuffer: "@it Unable to draw buffer.", // Shown as alert message if unable to draw buffer
  invalidConfiguration: "@it Invalid configuration.", // Shown as alert message if configuration settings failed on widget load
  rangeErrorMessage: "@it The max buffer distance is ${maxValue}", // Shown as alert message if buffer value exceeds maximum value
  clearAOIButtonLabel: "@it Start Over", // Shown as label for Clear AOI Button
  backButtonLabel: "@it Back",// Shown to go to AOI Container
  noGraphicsShapefile: "@it The uploaded shapefile contains no graphics.", // When no graphics is present in the layer
  placenameWidget: {
    placenameLabel: "@it Define a starting point"
  }, // Shown as label to guide user to enter value in search box
  // Draw Tool widget
  drawToolWidget: {
    useDrawToolForAOILabel: "@it Select draw mode"
  },
  // Shapefile widget
  shapefileWidget: {
    shapefileLabel: "@it Upload a zipped shapefile", // Shown as label to guide user to upload a shapefile to define AOI
    uploadShapefileButtonText: "@it Upload", // Shown as text for upload a shapefile Button
    unableToUploadShapefileMessage: "@it Unable to upload Shapefile." // Shown as alert message if upload to shapefile fails
  },
  // Coordinates widget
  coordinatesWidget: {
    selectStartPointFromSearchText: "@it Define a starting point", // Shown as label to guide user to define a start point by entering address in search box
    latitudeLabelText: "@it Latitude", // Shown as label text latitude
    longitudeLabelText: "@it Longitude", // Shown as label text Longitude
    addButtonTitle: "@it Add", // Shown as title for add button
    deleteButtonTitle: "@it Remove", // Shown as title for remove button
    mapTooltipForStartPoint: "@it Click on map to define a start point", // Shown as label to guide user to click on map to select start point
    mapTooltipForUpdateStartPoint: "@it Click on map to update the start point", // Shown as label to guide user to click on map to update start point
    locateText: "@it Locate", // Shown as label text locate
    locateByMapClickText: "@it Select initial coordinates", // Shown as label to select initial coordinates
    enterBearingAndDistanceLabel: "@it Enter bearing and distance from start point", // Shown as label to guide user to enter bearing and distance from start point
    bearingTitle: "@it Bearing", // Shown as label text Bearing
    distanceTitle: "@it Distance", // Shown as label text Distance
    planSettingTooltip: "@it Plan Settings", // Shown as label  text Plan Settings
    invalidLatLongMessage: "@it Please enter valid values." // Displayed when locate is clicked & lat, long is invalid
  },
  // Buffer Distance and Unit
  bufferDistanceAndUnit: { // Shown as buffer units
    UNIT_STATUTE_MILE: "@it Miles",
    UNIT_KILOMETER: "@it Kilometers",
    UNIT_FOOT: "@it Feet",
    UNIT_METER: "@it Meters",
    bufferInputTitle: "@it Buffer distance (required for points and lines)",
    bufferInputLabel: "@it Show results within"
  },
  // Traverse grid
  traverseSettings: {
    bearingLabel: "@it Bearing", // Shown as label for bearing column in traverse grid
    lengthLabel: "@it Length", // Shown as label for length column in traverse grid
    addButtonTitle: "@it Add", // Shown as title on add button
    deleteButtonTitle: "@it Remove" // Shown as title on delete button
  },
  // Plan settings
  planSettings: {
    expandGridTooltipText: "@it Expand grid", // Show on hover of the expand grid button
    collapseGridTooltipText: "@it Collapse grid", // Show on hover of the collapse grid button
    zoomToLocationTooltipText: "@it Zoom to location", // Show on hover of the zoomToLocation button
    uSSurveyFeet: { label: "@it US Survey Feet", abbreviation: "@it ftUS" }, // Shown as label for US Survey Feet in direction or angle unit dropdown
    meters: { label: "@it Meters", abbreviation: "@it m" }, // Shown as label for Meters in
    decimalDegree: { label: "@it Decimal Degree", abbreviation: "@it dd" }, // Shown as label for Decimal Degree in direction or angle unit dropdown
    degreeMinuteSeconds: { label: "@it Degree Minute Seconds", abbreviation: "@it d-m-s" }, // Shown as label for Degree Minute Seconds in direction or angle unit dropdown,
    applyBtnLabel: "@it Apply",
    directionUnitLabelText: "@it Directions Unit",
    distanceUnitLabelText: "@it Distance and Length Units",
    planSettingsComingSoonText: "@it Coming Soon" // Message displayed on click of plan settings icon
  },
  // New traverse lines
  newTraverse: {
    invalidBearingMessage: "@it Invalid Bearing.", // Shown when invalid bearing is entered
    invalidLengthMessage: "@it Invalid Length." // Shown when invalid length is entered
  },
  // Reports tab
  reportsTab: {
    aoiAreaText: "@it AOI area", // Shown while displaying the aoi area
    showAreaInText: "@it Show areas in", // Shown as a prefix text to toggle area
    metricUnitsText: "@it Metric Units", // Shown as a text option to convert area to metric unit
    standardUnitsText: "@it Standard Units", // Shown as a text option to convert area to standard unit
    downloadButtonTooltip: "@it Download", // Shown as a tooltip for download button
    printButtonTooltip: "@it Print", // Shown as a tooltip for print button
    uploadShapefileForAnalysisText: "@it Upload Shapefile to include in analysis", // Shown as a message to upload shapefile to include in analysis
    uploadShapefileForButtonText: "@it Browse", // Shown as a label on upload shapefile button
    downloadLabelText: "@it Select Format :", // Shown as a helper text to select download format
    downloadBtnText: "@it Download",
    noDetailsAvailableText: "@it No results found", // Shown when no features are intersected in AOI
    featureCountText: "@it Count", // Shown as a prefix text to display count
    featureAreaText: "@it Area", // Shown as a prefix text to display area
    featureLengthText: "@it Length", // Shown as a prefix text to display length
    attributeChooserTooltip: "@it Choose attributes to display", // Shown as a tooltip on field chooser button
    csv: "@it CSV", // Shown as a download option
    filegdb: "@it File Geodatabase", // Shown as a download option
    shapefile: "@it Shapefile", // Shown as a download option
    noFeaturesFound: "@it No result found for selected file format",
    selectReportFieldTitle: "@it Select fields", // Shown as a title on field chooser dialog box
    noFieldsSelected: "@it No fields selected", // Shown when all the fields are de-selected
    intersectingFeatureExceedsMsgOnCompletion: "@it Analysis results of some layers may be invalid due to large number of features within aoi. Please try again by drawing a smaller aoi.", // Shown when number of features that intersects aoi exceeds its max record count
    unableToAnalyzeText: "@it Unable to analyze, maximum record count has been reached.", // Shown as a message on click of info button when number of features that intersects aoi exceeds its max record count
    errorInPrintingReport: "@it Unable to print the report. Please check if report settings are valid.", // Shown when report settings are invalid for print
    defaultReportTitle: "@it Screening Report", //Shown as title for report
    aoiInformationTitle: "@it Area of Interest (AOI) Information", // Shown as a title for aoi on print preview page
    summaryReportTitle: "@it Summary of Impact", // Shown as section title for summary report
    summaryReportLayerNameColTitle: "@it Name", // Shown as col title for layer names in summary report
    summaryReportImpactColTitle: "@it Impact", // Shown as col title for impact in summary report
    noKnownImpactText: "@it No known impact", // Shown as text if layer has no impact in summary report
    potentialImpactText: "@it Potential impact", // Shown as text if layer has potential impact in summary report
    notApplicableText: "@it N/A", // Shown as text for not applicable
    downloadReportConfirmTitle: "@it Confirm download", // Shown as download popup title
    downloadReportConfirmMessage: "@it Are you sure you want to download ?", // Shown as download popup content
    noDataText: "@it No Data" // Shown when field data is empty in reports tab
  },
  units: {
    miles: { label: "@it Miles", abbreviation: "@it mi" }, // Standard
    kilometer: { label: "@it Kilometer", abbreviation: "@it km" }, // Metric
    acres: { label: "@it Acres", abbreviation: "@it acres" }, // Standard
    squareKilometer: { label: "@it Square kilometer", abbreviation: "@it sq.km." }, // Metric
  }
});