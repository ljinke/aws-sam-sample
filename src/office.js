const {
  convertTo,
  canBeConvertedToPDF
} = require("@shelf/aws-lambda-libreoffice");

exports.handler = async () => {
  console.log("Office converter.");
  // assuming there is a document.docx file inside /tmp dir
  // original file will be deleted afterwards

  if (!canBeConvertedToPDF("document.docx")) {
    return false;
  }

  return convertTo("document.docx", "pdf"); // returns /tmp/document.pdf
};
