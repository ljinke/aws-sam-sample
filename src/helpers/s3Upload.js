// You can either "yarn add aws-sdk" or "npm i aws-sdk"
const AWS = require('aws-sdk');
const path = require('path')

const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET } = process.env;

// Configure AWS to use promise
// AWS.config.setPromisesDependency(require('bluebird'));
// Configure AWS with your access and secret key.
AWS.config.update({ accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY, region: AWS_REGION });

// Create an s3 instance
const s3 = new AWS.S3();


const normalizeFileName = fileName => {
    const ext = path.extname(fileName);
    const baseName = path.basename(fileName, ext);

    return `${baseName}-${new Date().toISOString()}${ext}`
}

const uploadFile = async (filePath, key) => {
    const data = fs.createReadStream(filePath);
    const type = 'PDF'; // TODO: Guess the type from file extension.
    const objectKey = key || normalizeFileName(filePath)

        // With this setup, each time your user uploads an image, will be overwritten.
    // To prevent this, use a different Key each time.
    // This won't be needed if they're uploading their avatar, hence the filename, userAvatar.js.
    const params = {
        Bucket: S3_BUCKET,
        Key: objectKey, // type is not required
        Body: data,
        ACL: 'public-read',
        ContentEncoding: 'gzip', // required
        ContentType: `image/${type}` // required. Notice the back ticks
    }

    // The upload() is used instead of putObject() as we'd need the location url and assign that to our user profile/database
    // see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
    const { Location, Key } = await s3.upload(params).promise();
    // Save the Location (url) to your database and Key if needs be.
    // As good developers, we should return the url and let other function do the saving to database etc
    console.log(Location, Key);
}

const downloadFile = async (filePath, key) => {
    const params = {
        Bucket: S3_BUCKET,
        Key: key,
    }
    const targetStream = fs.createWritableStream(filePath);

    return s3.getObject(params).createReadStream().pipe(targetStream);
}

module.exports = { downloadFile, uploadFile };