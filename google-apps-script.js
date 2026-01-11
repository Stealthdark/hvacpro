/**
 * Google Apps Script for HVACPro Lead Collection
 *
 * INSTRUCTIONS:
 * 1. Create a Google Sheet with these column headers in Row 1:
 *    A1: Timestamp
 *    B1: Full Name
 *    C1: Email
 *    D1: Contact Number
 *    E1: Product Interest
 *    F1: Has Address
 *    G1: Resident 2+ Years
 *    H1: Page URL
 *
 * 2. In your Google Sheet, go to Extensions → Apps Script
 * 3. Delete any existing code
 * 4. Copy and paste ALL the code below
 * 5. Click Save (💾)
 * 6. Click Deploy → New deployment
 * 7. Choose Web app
 * 8. Set "Execute as" to "Me"
 * 9. Set "Who has access" to "Anyone"
 * 10. Click Deploy and copy the URL
 * 11. Paste the URL in assets/js/script.js
 */

// Main function to handle POST requests from the website
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse the incoming JSON data
    var data = JSON.parse(e.postData.contents);

    // Append a new row with the form data
    sheet.appendRow([
      new Date(),                    // Timestamp
      data.fullName,                 // Full Name
      data.email,                    // Email Address
      data.contactNo,                // Contact Number
      data.productInterest,          // Product of Interest
      data.hasAddress,               // Has Physical Address (Yes/No)
      data.residentDuration,         // Resident for 2+ years (Yes/No)
      data.pageUrl                   // Page URL where form was submitted
    ]);

    // OPTIONAL: Send email notification
    // Uncomment the lines below and update YOUR_EMAIL@example.com
    /*
    MailApp.sendEmail({
      to: "YOUR_EMAIL@example.com",
      subject: "New HVACPro Lead: " + data.fullName,
      body: "You have received a new lead!\n\n" +
            "Full Name: " + data.fullName + "\n" +
            "Email: " + data.email + "\n" +
            "Phone: " + data.contactNo + "\n" +
            "Product Interest: " + data.productInterest + "\n" +
            "Has Physical Address: " + data.hasAddress + "\n" +
            "Resident 2+ Years: " + data.residentDuration + "\n" +
            "Submitted From: " + data.pageUrl + "\n" +
            "Time: " + new Date() + "\n\n" +
            "View all leads: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID"
    });
    */

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Lead data saved successfully',
      'timestamp': new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch(error) {
    // Return error response
    Logger.log('Error: ' + error.toString());

    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function - Run this to test if the script works
// Go to Run → Run function → doGet
function doGet() {
  return ContentService.createTextOutput('HVACPro Lead Collection Script is working! Deploy as Web App to use it.');
}

// OPTIONAL: Function to get all leads (for testing)
function getAllLeads() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  Logger.log(data);
  return data;
}

// OPTIONAL: Function to count total leads
function countLeads() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  Logger.log('Total leads: ' + (lastRow - 1)); // Subtract header row
  return lastRow - 1;
}

// OPTIONAL: Function to send daily summary email
// Set up a time-based trigger to run this daily
function sendDailySummary() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  var totalLeads = lastRow - 1;

  // Get today's leads
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var data = sheet.getRange(2, 1, lastRow - 1, 8).getValues();
  var todaysLeads = data.filter(function(row) {
    var rowDate = new Date(row[0]);
    rowDate.setHours(0, 0, 0, 0);
    return rowDate.getTime() === today.getTime();
  });

  // Send email
  MailApp.sendEmail({
    to: "YOUR_EMAIL@example.com",
    subject: "HVACPro Daily Lead Summary - " + Utilities.formatDate(today, Session.getScriptTimeZone(), "MMM dd, yyyy"),
    body: "Daily Summary\n\n" +
          "New leads today: " + todaysLeads.length + "\n" +
          "Total leads: " + totalLeads + "\n\n" +
          "View spreadsheet: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID"
  });
}

// OPTIONAL: Function to auto-format the spreadsheet
function formatSpreadsheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Format header row
  var headerRange = sheet.getRange(1, 1, 1, 8);
  headerRange.setBackground('#163f63');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');

  // Auto-resize columns
  sheet.autoResizeColumns(1, 8);

  // Freeze header row
  sheet.setFrozenRows(1);

  // Add alternating row colors
  var dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, 8);
  dataRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
}

/**
 * SETUP INSTRUCTIONS SUMMARY:
 *
 * 1. Create Google Sheet with headers
 * 2. Extensions → Apps Script
 * 3. Paste this code
 * 4. Save
 * 5. Deploy → New deployment → Web app
 * 6. Execute as: Me
 * 7. Access: Anyone
 * 8. Deploy
 * 9. Copy URL
 * 10. Paste in website's script.js file
 *
 * OPTIONAL ENHANCEMENTS:
 * - Uncomment email notification code and add your email
 * - Set up daily summary (uncomment and add trigger)
 * - Run formatSpreadsheet() to beautify your sheet
 *
 * TROUBLESHOOTING:
 * - If data not appearing: Check deployment settings
 * - If errors: Check Logger.log() output
 * - Test with doGet() function first
 */
