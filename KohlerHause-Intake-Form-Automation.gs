function onOpen() {

  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu("Autofill Docs");
  menu.addItem("Create New Docs", 'createNewGoogleDocs');
  menu.addToUi();

  //sendAttatchment('10-NoCxCUwX1P6TtCDdjt2cv9Mez8C46XM6eg-Ngwt3M', 'TYLA JEFFS')

}

function createNewGoogleDocs() {
  //This value should be the id of your document template that we created in the last step
  const googleDocTemplate = DriveApp.getFileById('1XKinL4QjodCFZeiqE1SibJXRcO7WHoyjQSqRIMm2QFw');
  
  //This value should be the id of the folder where you want your completed documents stored
  const destinationFolder = DriveApp.getFolderById('1qmIMQM_eUSN_-LDYpeRrtjb9aKYlFOEL')
  //Here we store the sheet as a variable
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Form Responses 1')  
  //Now we get all of the values as a 2D array
  const rows = sheet.getDataRange().getValues();
  
  //Start processing each spreadsheet row
  rows.forEach(function(row, index){
    //Here we check if this row is the headers, if so we skip it
    if (index === 0) return;
    //Here we check if a document has already been generated by looking at 'Document Link', if so we skip it
    if (row[15]) return;
    //Using the row data in a template literal, we make a copy of our template document in our destinationFolder
    const copy = googleDocTemplate.makeCopy(`${row[1]} Client Intake Form` , destinationFolder)
    //Once we have the copy, we then open it using the DocumentApp
    const doc = DocumentApp.openById(copy.getId())
    //All of the content lives in the body, so we get that for editing
    const body = doc.getBody();
    //In this line we do some friendly date formatting, that may or may not work for you locale
    const friendlyDate = new Date(row[3]).toLocaleDateString();
    
    //In these lines, we replace our replacement tokens with values from our spreadsheet row
    body.replaceText('{{Request}}', index);
    body.replaceText('{{ClientName}}', row[1]);
    body.replaceText('{{Phone}}', row[2]);
    body.replaceText('{{Date}}', friendlyDate);
    body.replaceText('{{Address}}', row[4]);
    body.replaceText('{{Code}}', row[5]);
    body.replaceText('{{Email}}', row[6]);
    body.replaceText('{{Meeting}}', row[7]);
    body.replaceText('{{Location}}', row[8]);
    body.replaceText('{{ReferredBy}}', row[9]);
    body.replaceText('{{Timeline}}', row[10]);
    body.replaceText('{{HomeAge}}', row[11]);
    body.replaceText('{{Budget}}', row[12]);
    body.replaceText('{{Assist}}', row[13]);
    body.replaceText('{{Notes}}', row[14]);
    
    //We make our changes permanent by saving and closing the document
    doc.saveAndClose();
    //Store the url of our new document in a variable
    const url = doc.getUrl();
    //Write that value back to the 'Document Link' column in the spreadsheet. 
    sheet.getRange(index + 1, 16).setValue(url);

    //get the document id
    newDocId = doc.getId();
    //send the new attatchment
    sendAttatchment(newDocId, row[1]);
    
  })

  Logger.log("done");
  
}

//function to send the new document as a pdf attatchment in an email
function sendAttatchment(docId, clientName) {
  const recipient = 'cjeffs@kohlerhaus.net';
  const subject = 'New Client Intake Form: '+ clientName;
  const body = "Here is the client intake form for " + clientName + ".";
  const attachment = DriveApp.getFileById(docId);

  MailApp.sendEmail(recipient,subject,body, {
    attachments:[attachment]
  })
}
