const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const {
  convertTo,
  canBeConvertedToPDF,
  getExecutablePath, defaultArgs
} = require("@shelf/aws-lambda-libreoffice");

const convert = async () => {
  execSync('mkdir -p /tmp');
  const dir = '/tmp';
  const file = `${__dirname}/pco.docx`;

  const loBinary = await getExecutablePath(); // /tmp/instdir/program/soffice

  console.log('exec path', loBinary)
  //execSync(`${loBinary} --convert-to pdf ${file} --outdir ${dir}`);

  //execSync(`ls -l ${dir} | grep pdf`, { stdio: 'inherit' })

  //execSync(`cat ${dir}/pco.pdf`, { stdio: 'inherit' })

  console.log("ENVS", { key: process.env.AWS_ACCESS_KEY_ID, secret: process.env.AWS_SECRET_ACCESS_KEY })

  return `${dir}/pco.pdf}`
}



exports.handler = async () => {
  console.log("Office converter.");
  // assuming there is a document.docx file inside /tmp dir
  // original file will be deleted afterwards

  if (!canBeConvertedToPDF("./pco.docx")) {
    console.log(false)
    return false;
  }

  console.log('Can convert to PDF')

  const result = await convert(); // returns /tmp/document.pdf

  return   {
    statusCode: 200,
    body: JSON.stringify({
      result: 'good',
      file: `${result}`
    })
  };
};
