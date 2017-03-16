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
  _widgetLabel: "@ar Screening", // Shown as label of widget
  geometryServicesNotFound: "@ar Geometry service not available.", // Shown as error message if geometry service is not found
  unableToDrawBuffer: "@ar Unable to draw buffer.", // Shown as alert message if unable to draw buffer
  invalidConfiguration: "@ar Invalid configuration.", // Shown as alert message if configuration settings failed on widget load
  rangeErrorMessage: "@ar The max buffer distance is ${maxValue}", // Shown as alert message if buffer value exceeds maximum value
  clearAOIButtonLabel: "@ar Start Over", // Shown as label for Clear AOI Button
  backButtonLabel: "@ar Back",// Shown to go to AOI Container
  noGraphicsShapefile: "@ar The uploaded shapefile contains no graphics.", // When no graphics is present in the layer
  placenameWidget: {
    placenameLabel: "@ar Define a starting point"
  }, // Shown as label to guide user to enter value in search box
  // Draw Tool widget
  drawToolWidget: {
    useDrawToolForAOILabel: "@ar Select draw mode" // Shown as label to guide user to use draw tools to define AOI
  },
  // Shapefile widget
  shapefileWidget: {
    shapefileLabel: "@ar Upload a zipped shapefile", // Shown as label to guide user to upload a shapefile to define AOI
    uploadShapefileButtonText: "@ar Upload", // Shown as text for upload a shapefile Button
    unableToUploadShapefileMessage: "@ar Unable to upload Shapefile." // Shown as alert message if upload to shapefile fails
  },
  // Coordinates widget
  coordinatesWidget: {
    selectStartPointFromSearchText: "@ar Define a starting point", // Shown as label to guide user to define a start point by entering address in search box
    latitudeLabelText: "@ar Latitude", // Shown as label text latitude
    longitudeLabelText: "@ar Longitude", // Shown as label text Longitude
    addButtonTitle: "@ar Add", // Shown as title for add button
    deleteButtonTitle: "@ar Remove", // Shown as title for remove button
    mapTooltipForStartPoint: "@ar Click on map to define a start point", // Shown as label to guide user to click on map to select start point
    mapTooltipForUpdateStartPoint: "@ar Click on map to update the start point", // Shown as label to guide user to click on map to update start point
    locateText: "@ar Locate", // Shown as label text locate
    locateByMapClickText: "@ar Select initial coordinates", // Shown as label to select initial coordinates
    enterBearingAndDistanceLabel: "@ar Enter bearing and distance from start point", // Shown as label to guide user to enter bearing and distance from start point
    bearingTitle: "@ar Bearing", // Shown as label text Bearing
    distanceTitle: "@ar Distance", // Shown as label text Distance
    planSettingTooltip: "@ar Plan Settings", // Shown as label  text Plan Settings
    invalidLatLongMessage: "@ar Please enter valid values." // Displayed when locate is clicked & lat, long is invalid
  },
  // Buffer Distance and Unit
  bufferDistanceAndUnit: { // Shown as buffer units
    UNIT_STATUTE_MILE: "@ar Miles",
    UNIT_KILOMETER: "@ar Kilometers",
    UNIT_FOOT: "@ar Feet",
    UNIT_METER: "@ar Meters",
    bufferInputTitle: "@ar Buffer distance (required for points and lines)",
    bufferInputLabel: "@ar Show results within"
  },
  // Traverse grid
  traverseSettings: {
    bearingLabel: "@ar Bearing", // Shown as label for bearing column in traverse grid
    lengthLabel: "@ar Length", // Shown as label for length column in traverse grid
    addButtonTitle: "@ar Add", // Shown as title on add button
    deleteButtonTitle: "@ar Remove" // Shown as title on delete button
  },
  // Plan settings
  planSettings: {
    expandGridTooltipText: "@ar Expand grid", // Show on hover of the expand grid button
    collapseGridTooltipText: "@ar Collapse grid", // Show on hover of the collapse grid button
    zoomToLocationTooltipText: "@ar Zoom to location", // Show on hover of the zoomToLocation button
    uSSurveyFeet: { label: "@ar US Survey Feet", abbreviation: "@ar ftUS" }, // Shown as label for US Survey Feet in direction or angle unit dropdown
    meters: { label: "@ar Meters", abbreviation: "@ar m" }, // Shown as label for Meters in
    decimalDegree: { label: "@ar Decimal Degree", abbreviation: "@ar dd" }, // Shown as label for Decimal Degree in direction or angle unit dropdown
    degreeMinuteSeconds: { label: "@ar Degree Minute Seconds", abbreviation: "@ar d-m-s" }, // Shown as label for Degree Minute Seconds in direction or angle unit dropdown,
    applyBtnLabel: "@ar Apply",
    directionUnitLabelText: "@ar Directions Unit",
    distanceUnitLabelText: "@ar Distance and Length Units",
    planSettingsComingSoonText: "@ar Coming Soon" // Message displayed on click of plan settings icon
  },
  // New traverse lines
  newTraverse: {
    invalidBearingMessage: "@ar Invalid Bearing.", // Shown when invalid bearing is entered
    invalidLengthMessage: "@ar Invalid Length." // Shown when invalid length is entered
  },
  // Reports tab
  reportsTab: {
    aoiAreaText: "@ar AOI area", // Shown while displaying the aoi area
    showAreaInText: "@ar Show areas in", // Shown as a prefix text to toggle area
    metricUnitsText: "@ar Metric Units", // Shown as a text option to convert area to metric unit
    standardUnitsText: "@ar Standard Units", // Shown as a text option to convert area to standard unit
    downloadButtonTooltip: "@ar Download", // Shown as a tooltip for download button
    printButtonTooltip: "@ar Print", // Shown as a tooltip for print button
    uploadShapefileForAnalysisText: "@ar Upload Shapefile to include in analysis", // Shown as a message to upload shapefile to include in analysis
    uploadShapefileForButtonText: "@ar Browse", // Shown as a label on upload shapefile button
    downloadLabelText: "@ar Select Format :", // Shown as a helper text to select download format
    downloadBtnText: "@ar Download",
    noDetailsAvailableText: "@ar No results found", // Shown when no features are intersected in AOI
    featureCountText: "@ar Count", // Shown as a prefix text to display count
    featureAreaText: "@ar Area", // Shown as a prefix text to display area
    featureLengthText: "@ar Length", // Shown as a prefix text to display length
    attributeChooserTooltip: "@ar Choose attributes to display", // Shown as a tooltip on field chooser button
    csv: "@ar CSV", // Shown as a download option
    filegdb: "@ar File Geodatabase", // Shown as a download option
    shapefile: "@ar Shapefile", // Shown as a download option
    noFeaturesFound: "@ar No result found for selected file format",
    selectReportFieldTitle: "@ar Select fields", // Shown as a title on field chooser dialog box
    noFieldsSelected: "@ar No fields selected", // Shown when all the fields are de-selected
    intersectingFeatureExceedsMsgOnCompletion: "@ar Analysis results of some layers may be invalid due to large number of features within aoi. Please try again by drawing a smaller aoi.", // Shown when number of features that intersects aoi exceeds its max record count
    unableToAnalyzeText: "@ar Unable to analyze, maximum record count has been reached.", // Shown as a message on click of info button when number of features that intersects aoi exceeds its max record count
    errorInPrintingReport: "@ar Unable to print the report. Please check if report settings are valid.", // Shown when report settings are invalid for print
    defaultReportTitle: "@ar Screening Report", //Shown as title for report
    aoiInformationTitle: "@ar Area of Interest (AOI) Information", // Shown as a title for aoi on print preview page
    summaryReportTitle: "@ar Summary of Impact", // Shown as section title for summary report
    summaryReportLayerNameColTitle: "@ar Name", // Shown as col title for layer names in summary report
    summaryReportImpactColTitle: "@ar Impact", // Shown as col title for impact in summary report
    noKnownImpactText: "@ar No known impact", // Shown as text if layer has no impact in summary report
    potentialImpactText: "@ar Potential impact", // Shown as text if layer has potential impact in summary report
    notApplicableText: "@ar N/A", // Shown as text for not applicable
    downloadReportConfirmTitle: "@ar Confirm download", // Shown as download popup title
    downloadReportConfirmMessage: "@ar Are you sure you want to download ?", // Shown as download popup content
    noDataText: "@ar No Data" // Shown when field data is empty in reports tab
  },
  units: {
    miles: { label: "@ar Miles", abbreviation: "@ar mi" }, // Standard
    kilometer: { label: "@ar Kilometer", abbreviation: "@ar km" }, // Metric
    acres: { label: "@ar Acres", abbreviation: "@ar acres" }, // Standard
    squareKilometer: { label: "@ar Square kilometer", abbreviation: "@ar sq.km." }, // Metric
  }
});