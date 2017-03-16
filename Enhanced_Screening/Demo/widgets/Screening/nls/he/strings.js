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
  _widgetLabel: "@he Screening", // Shown as label of widget
  geometryServicesNotFound: "@he Geometry service not available.", // Shown as error message if geometry service is not found
  unableToDrawBuffer: "@he Unable to draw buffer.", // Shown as alert message if unable to draw buffer
  invalidConfiguration: "@he Invalid configuration.", // Shown as alert message if configuration settings failed on widget load
  rangeErrorMessage: "@he The max buffer distance is ${maxValue}", // Shown as alert message if buffer value exceeds maximum value
  clearAOIButtonLabel: "@he Start Over", // Shown as label for Clear AOI Button
  backButtonLabel: "@he Back",// Shown to go to AOI Container
  noGraphicsShapefile: "@he The uploaded shapefile contains no graphics.", // When no graphics is present in the layer
  placenameWidget: {
    placenameLabel: "@he Define a starting point"
  }, // Shown as label to guide user to enter value in search box
  // Draw Tool widget
  drawToolWidget: {
    useDrawToolForAOILabel: "@he Select draw mode"
  },
  // Shapefile widget
  shapefileWidget: {
    shapefileLabel: "@he Upload a zipped shapefile", // Shown as label to guide user to upload a shapefile to define AOI
    uploadShapefileButtonText: "@he Upload", // Shown as text for upload a shapefile Button
    unableToUploadShapefileMessage: "@he Unable to upload Shapefile." // Shown as alert message if upload to shapefile fails
  },
  // Coordinates widget
  coordinatesWidget: {
    selectStartPointFromSearchText: "@he Define a starting point", // Shown as label to guide user to define a start point by entering address in search box
    latitudeLabelText: "@he Latitude", // Shown as label text latitude
    longitudeLabelText: "@he Longitude", // Shown as label text Longitude
    addButtonTitle: "@he Add", // Shown as title for add button
    deleteButtonTitle: "@he Remove", // Shown as title for remove button
    mapTooltipForStartPoint: "@he Click on map to define a start point", // Shown as label to guide user to click on map to select start point
    mapTooltipForUpdateStartPoint: "@he Click on map to update the start point", // Shown as label to guide user to click on map to update start point
    locateText: "@he Locate", // Shown as label text locate
    locateByMapClickText: "@he Select initial coordinates", // Shown as label to select initial coordinates
    enterBearingAndDistanceLabel: "@he Enter bearing and distance from start point", // Shown as label to guide user to enter bearing and distance from start point
    bearingTitle: "@he Bearing", // Shown as label text Bearing
    distanceTitle: "@he Distance", // Shown as label text Distance
    planSettingTooltip: "@he Plan Settings", // Shown as label  text Plan Settings
    invalidLatLongMessage: "@he Please enter valid values." // Displayed when locate is clicked & lat, long is invalid
  },
  // Buffer Distance and Unit
  bufferDistanceAndUnit: { // Shown as buffer units
    UNIT_STATUTE_MILE: "@he Miles",
    UNIT_KILOMETER: "@he Kilometers",
    UNIT_FOOT: "@he Feet",
    UNIT_METER: "@he Meters",
    bufferInputTitle: "@he Buffer distance (required for points and lines)",
    bufferInputLabel: "@he Show results within"
  },
  // Traverse grid
  traverseSettings: {
    bearingLabel: "@he Bearing", // Shown as label for bearing column in traverse grid
    lengthLabel: "@he Length", // Shown as label for length column in traverse grid
    addButtonTitle: "@he Add", // Shown as title on add button
    deleteButtonTitle: "@he Remove" // Shown as title on delete button
  },
  // Plan settings
  planSettings: {
    expandGridTooltipText: "@he Expand grid", // Show on hover of the expand grid button
    collapseGridTooltipText: "@he Collapse grid", // Show on hover of the collapse grid button
    zoomToLocationTooltipText: "@he Zoom to location", // Show on hover of the zoomToLocation button
    uSSurveyFeet: { label: "@he US Survey Feet", abbreviation: "@he ftUS" }, // Shown as label for US Survey Feet in direction or angle unit dropdown
    meters: { label: "@he Meters", abbreviation: "@he m" }, // Shown as label for Meters in
    decimalDegree: { label: "@he Decimal Degree", abbreviation: "@he dd" }, // Shown as label for Decimal Degree in direction or angle unit dropdown
    degreeMinuteSeconds: { label: "@he Degree Minute Seconds", abbreviation: "@he d-m-s" }, // Shown as label for Degree Minute Seconds in direction or angle unit dropdown,
    applyBtnLabel: "@he Apply",
    directionUnitLabelText: "@he Directions Unit",
    distanceUnitLabelText: "@he Distance and Length Units",
    planSettingsComingSoonText: "@he Coming Soon" // Message displayed on click of plan settings icon
  },
  // New traverse lines
  newTraverse: {
    invalidBearingMessage: "@he Invalid Bearing.", // Shown when invalid bearing is entered
    invalidLengthMessage: "@he Invalid Length." // Shown when invalid length is entered
  },
  // Reports tab
  reportsTab: {
    aoiAreaText: "@he AOI area", // Shown while displaying the aoi area
    showAreaInText: "@he Show areas in", // Shown as a prefix text to toggle area
    metricUnitsText: "@he Metric Units", // Shown as a text option to convert area to metric unit
    standardUnitsText: "@he Standard Units", // Shown as a text option to convert area to standard unit
    downloadButtonTooltip: "@he Download", // Shown as a tooltip for download button
    printButtonTooltip: "@he Print", // Shown as a tooltip for print button
    uploadShapefileForAnalysisText: "@he Upload Shapefile to include in analysis", // Shown as a message to upload shapefile to include in analysis
    uploadShapefileForButtonText: "@he Browse", // Shown as a label on upload shapefile button
    downloadLabelText: "@he Select Format :", // Shown as a helper text to select download format
    downloadBtnText: "@he Download",
    noDetailsAvailableText: "@he No results found", // Shown when no features are intersected in AOI
    featureCountText: "@he Count", // Shown as a prefix text to display count
    featureAreaText: "@he Area", // Shown as a prefix text to display area
    featureLengthText: "@he Length", // Shown as a prefix text to display length
    attributeChooserTooltip: "@he Choose attributes to display", // Shown as a tooltip on field chooser button
    csv: "@he CSV", // Shown as a download option
    filegdb: "@he File Geodatabase", // Shown as a download option
    shapefile: "@he Shapefile", // Shown as a download option
    noFeaturesFound: "@he No result found for selected file format",
    selectReportFieldTitle: "@he Select fields", // Shown as a title on field chooser dialog box
    noFieldsSelected: "@he No fields selected", // Shown when all the fields are de-selected
    intersectingFeatureExceedsMsgOnCompletion: "@he Analysis results of some layers may be invalid due to large number of features within aoi. Please try again by drawing a smaller aoi.", // Shown when number of features that intersects aoi exceeds its max record count
    unableToAnalyzeText: "@he Unable to analyze, maximum record count has been reached.", // Shown as a message on click of info button when number of features that intersects aoi exceeds its max record count
    errorInPrintingReport: "@he Unable to print the report. Please check if report settings are valid.", // Shown when report settings are invalid for print
    defaultReportTitle: "@he Screening Report", //Shown as title for report
    aoiInformationTitle: "@he Area of Interest (AOI) Information", // Shown as a title for aoi on print preview page
    summaryReportTitle: "@he Summary of Impact", // Shown as section title for summary report
    summaryReportLayerNameColTitle: "@he Name", // Shown as col title for layer names in summary report
    summaryReportImpactColTitle: "@he Impact", // Shown as col title for impact in summary report
    noKnownImpactText: "@he No known impact", // Shown as text if layer has no impact in summary report
    potentialImpactText: "@he Potential impact", // Shown as text if layer has potential impact in summary report
    notApplicableText: "@he N/A", // Shown as text for not applicable
    downloadReportConfirmTitle: "@he Confirm download", // Shown as download popup title
    downloadReportConfirmMessage: "@he Are you sure you want to download ?", // Shown as download popup content
    noDataText: "@he No Data" // Shown when field data is empty in reports tab
  },
  units: {
    miles: { label: "@he Miles", abbreviation: "@he mi" }, // Standard
    kilometer: { label: "@he Kilometer", abbreviation: "@he km" }, // Metric
    acres: { label: "@he Acres", abbreviation: "@he acres" }, // Standard
    squareKilometer: { label: "@he Square kilometer", abbreviation: "@he sq.km." }, // Metric
  }
});