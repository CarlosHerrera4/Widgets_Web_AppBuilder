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
  _widgetLabel: "@fr Screening", // Shown as label of widget
  geometryServicesNotFound: "@fr Geometry service not available.", // Shown as error message if geometry service is not found
  unableToDrawBuffer: "@fr Unable to draw buffer.", // Shown as alert message if unable to draw buffer
  invalidConfiguration: "@fr Invalid configuration.", // Shown as alert message if configuration settings failed on widget load
  rangeErrorMessage: "@fr The max buffer distance is ${maxValue}", // Shown as alert message if buffer value exceeds maximum value
  clearAOIButtonLabel: "@fr Start Over", // Shown as label for Clear AOI Button
  backButtonLabel: "@fr Back",// Shown to go to AOI Container
  noGraphicsShapefile: "@fr The uploaded shapefile contains no graphics.", // When no graphics is present in the layer
  placenameWidget: {
    placenameLabel: "@fr Define a starting point"
  }, // Shown as label to guide user to enter value in search box
  // Draw Tool widget
  drawToolWidget: {
    useDrawToolForAOILabel: "@fr Select draw mode"
  },
  // Shapefile widget
  shapefileWidget: {
    shapefileLabel: "@fr Upload a zipped shapefile", // Shown as label to guide user to upload a shapefile to define AOI
    uploadShapefileButtonText: "@fr Upload", // Shown as text for upload a shapefile Button
    unableToUploadShapefileMessage: "@fr Unable to upload Shapefile." // Shown as alert message if upload to shapefile fails
  },
  // Coordinates widget
  coordinatesWidget: {
    selectStartPointFromSearchText: "@fr Define a starting point", // Shown as label to guide user to define a start point by entering address in search box
    latitudeLabelText: "@fr Latitude", // Shown as label text latitude
    longitudeLabelText: "@fr Longitude", // Shown as label text Longitude
    addButtonTitle: "@fr Add", // Shown as title for add button
    deleteButtonTitle: "@fr Remove", // Shown as title for remove button
    mapTooltipForStartPoint: "@fr Click on map to define a start point", // Shown as label to guide user to click on map to select start point
    mapTooltipForUpdateStartPoint: "@fr Click on map to update the start point", // Shown as label to guide user to click on map to update start point
    locateText: "@fr Locate", // Shown as label text locate
    locateByMapClickText: "@fr Select initial coordinates", // Shown as label to select initial coordinates
    enterBearingAndDistanceLabel: "@fr Enter bearing and distance from start point", // Shown as label to guide user to enter bearing and distance from start point
    bearingTitle: "@fr Bearing", // Shown as label text Bearing
    distanceTitle: "@fr Distance", // Shown as label text Distance
    planSettingTooltip: "@fr Plan Settings", // Shown as label  text Plan Settings
    invalidLatLongMessage: "@fr Please enter valid values." // Displayed when locate is clicked & lat, long is invalid
  },
  // Buffer Distance and Unit
  bufferDistanceAndUnit: { // Shown as buffer units
    UNIT_STATUTE_MILE: "@fr Miles",
    UNIT_KILOMETER: "@fr Kilometers",
    UNIT_FOOT: "@fr Feet",
    UNIT_METER: "@fr Meters",
    bufferInputTitle: "@fr Buffer distance (required for points and lines)",
    bufferInputLabel: "@fr Show results within"
  },
  // Traverse grid
  traverseSettings: {
    bearingLabel: "@fr Bearing", // Shown as label for bearing column in traverse grid
    lengthLabel: "@fr Length", // Shown as label for length column in traverse grid
    addButtonTitle: "@fr Add", // Shown as title on add button
    deleteButtonTitle: "@fr Remove" // Shown as title on delete button
  },
  // Plan settings
  planSettings: {
    expandGridTooltipText: "@fr Expand grid", // Show on hover of the expand grid button
    collapseGridTooltipText: "@fr Collapse grid", // Show on hover of the collapse grid button
    zoomToLocationTooltipText: "@fr Zoom to location", // Show on hover of the zoomToLocation button
    uSSurveyFeet: { label: "@fr US Survey Feet", abbreviation: "@fr ftUS" }, // Shown as label for US Survey Feet in direction or angle unit dropdown
    meters: { label: "@fr Meters", abbreviation: "@fr m" }, // Shown as label for Meters in
    decimalDegree: { label: "@fr Decimal Degree", abbreviation: "@fr dd" }, // Shown as label for Decimal Degree in direction or angle unit dropdown
    degreeMinuteSeconds: { label: "@fr Degree Minute Seconds", abbreviation: "@fr d-m-s" }, // Shown as label for Degree Minute Seconds in direction or angle unit dropdown,
    applyBtnLabel: "@fr Apply",
    directionUnitLabelText: "@fr Directions Unit",
    distanceUnitLabelText: "@fr Distance and Length Units",
    planSettingsComingSoonText: "@fr Coming Soon" // Message displayed on click of plan settings icon
  },
  // New traverse lines
  newTraverse: {
    invalidBearingMessage: "@fr Invalid Bearing.", // Shown when invalid bearing is entered
    invalidLengthMessage: "@fr Invalid Length." // Shown when invalid length is entered
  },
  // Reports tab
  reportsTab: {
    aoiAreaText: "@fr AOI area", // Shown while displaying the aoi area
    showAreaInText: "@fr Show areas in", // Shown as a prefix text to toggle area
    metricUnitsText: "@fr Metric Units", // Shown as a text option to convert area to metric unit
    standardUnitsText: "@fr Standard Units", // Shown as a text option to convert area to standard unit
    downloadButtonTooltip: "@fr Download", // Shown as a tooltip for download button
    printButtonTooltip: "@fr Print", // Shown as a tooltip for print button
    uploadShapefileForAnalysisText: "@fr Upload Shapefile to include in analysis", // Shown as a message to upload shapefile to include in analysis
    uploadShapefileForButtonText: "@fr Browse", // Shown as a label on upload shapefile button
    downloadLabelText: "@fr Select Format :", // Shown as a helper text to select download format
    downloadBtnText: "@fr Download",
    noDetailsAvailableText: "@fr No results found", // Shown when no features are intersected in AOI
    featureCountText: "@fr Count", // Shown as a prefix text to display count
    featureAreaText: "@fr Area", // Shown as a prefix text to display area
    featureLengthText: "@fr Length", // Shown as a prefix text to display length
    attributeChooserTooltip: "@fr Choose attributes to display", // Shown as a tooltip on field chooser button
    csv: "@fr CSV", // Shown as a download option
    filegdb: "@fr File Geodatabase", // Shown as a download option
    shapefile: "@fr Shapefile", // Shown as a download option
    noFeaturesFound: "@fr No result found for selected file format",
    selectReportFieldTitle: "@fr Select fields", // Shown as a title on field chooser dialog box
    noFieldsSelected: "@fr No fields selected", // Shown when all the fields are de-selected
    intersectingFeatureExceedsMsgOnCompletion: "@fr Analysis results of some layers may be invalid due to large number of features within aoi. Please try again by drawing a smaller aoi.", // Shown when number of features that intersects aoi exceeds its max record count
    unableToAnalyzeText: "@fr Unable to analyze, maximum record count has been reached.", // Shown as a message on click of info button when number of features that intersects aoi exceeds its max record count
    errorInPrintingReport: "@fr Unable to print the report. Please check if report settings are valid.", // Shown when report settings are invalid for print
    defaultReportTitle: "@fr Screening Report", //Shown as title for report
    aoiInformationTitle: "@fr Area of Interest (AOI) Information", // Shown as a title for aoi on print preview page
    summaryReportTitle: "@fr Summary of Impact", // Shown as section title for summary report
    summaryReportLayerNameColTitle: "@fr Name", // Shown as col title for layer names in summary report
    summaryReportImpactColTitle: "@fr Impact", // Shown as col title for impact in summary report
    noKnownImpactText: "@fr No known impact", // Shown as text if layer has no impact in summary report
    potentialImpactText: "@fr Potential impact", // Shown as text if layer has potential impact in summary report
    notApplicableText: "@fr N/A", // Shown as text for not applicable
    downloadReportConfirmTitle: "@fr Confirm download", // Shown as download popup title
    downloadReportConfirmMessage: "@fr Are you sure you want to download ?", // Shown as download popup content
    noDataText: "@fr No Data" // Shown when field data is empty in reports tab
  },
  units: {
    miles: { label: "@fr Miles", abbreviation: "@fr mi" }, // Standard
    kilometer: { label: "@fr Kilometer", abbreviation: "@fr km" }, // Metric
    acres: { label: "@fr Acres", abbreviation: "@fr acres" }, // Standard
    squareKilometer: { label: "@fr Square kilometer", abbreviation: "@fr sq.km." }, // Metric
  }
});