const AWS = require("aws-sdk");
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");
const { Storage } = require("@google-cloud/storage");
const fetch = require("node-fetch");
const mailgun = require("mailgun-js");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const dotenv = require("dotenv");
dotenv.config();
const DOMAIN = process.env.MAILGUN_DOMAIN;
let mg;

const secretName = "mailgun_api_key";

const client = new SecretsManagerClient({
  region: process.env.REGION,
});

async function getSecret() {
  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: "AWSCURRENT",
      })
    );

    return response.SecretString;
  } catch (error) {
    throw error;
  }
}

console.log("-------------Key Check----------------");
console.log("GCP_SERVICE_ACCOUNT_KEY", process.env.GCP_PRIVATE_KEY);
console.log("GCS_BUCKET_NAME", process.env.GCS_BUCKET_NAME);
console.log("DYNAMODB_TABLE_NAME", process.env.DYNAMODB_TABLE_NAME);

exports.handler = async function handler(event) {
  try {
    const s = await getSecret();
    const secretValue = await JSON.parse(s);
    console.log("Mailgun API KEY:", secretValue.mailgun_api_key);

    mg = mailgun({
      apiKey: secretValue.mailgun_api_key,
      domain: DOMAIN,
    });

    const decodedPrivateKey = Buffer.from(
      process.env.GCP_PRIVATE_KEY,
      "base64"
    ).toString("utf-8");
    const keyFileJson = JSON.parse(decodedPrivateKey);
    const storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      credentials: keyFileJson,
    });

    console.log("EVENT SNS", event.Records[0].Sns);
    console.log("EVENT", event);
    const eventData = JSON.parse(event.Records[0].Sns.Message);
    const releaseUrl = eventData.submission_url;
    const receiversEmail = eventData.user_email;
    const assignmentId = eventData.assignment_id;
    const userId = eventData.user_id;
    console.log("URL:", releaseUrl);
    console.log("EMAIL:", receiversEmail);
    console.log("ASSIGNMENT_ID:", assignmentId);
    console.log("USER_ID:", userId);

    const response = await fetch(releaseUrl);
    if (!response.ok)
      throw new Error(`Failed to download Submission : ${response.statusText}`);

    const releaseData = await response.buffer();
    const bucketName = process.env.GCS_BUCKET_NAME;
    const fileName = `${userId}/${assignmentId}/file${Date.now().toString()}.zip`;
    const filepath = `${bucketName}/${fileName}`;
    await storage.bucket(bucketName).file(fileName).save(releaseData);

    const options = {
      version: "v4",
      action: "read",
      expires: Date.now() + 30 * 60 * 1000,
    };

    const bucketURL = await generateBucket(fileName, options, storage);
    console.log("BUCKET URL", bucketURL);

    await sendEmail(
      receiversEmail,
      "Download successful",
      `The release was successfully downloaded and uploaded to ${bucketName} \n File Path on Google Cloud: ${filepath}`
    );

    await recordEmailEvent(`Download was successful: Email sent to ${receiversEmail}`);
  } catch (error) {
    console.error("Error:", error);
    const eventData = JSON.parse(event.Records[0].Sns.Message);
    const receiversEmail = eventData.user_email;
    await sendEmail(
      receiversEmail,
      "Download failed",
      `Error occurred: ${error.message}`
    );

    await recordEmailEvent(`Download was failed: Email sent to ${receiversEmail}`);
  }
};

async function sendEmail(to, subject, message) {
  const data = {
    from: "noreply@demo.sparshramchandani.me",
    to: to,
    subject: subject,
    text: message,
  };
  await mg.messages().send(data);
}

async function recordEmailEvent(status) {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: {
      id: Date.now().toString(),
      status: status,
      timestamp: new Date().toISOString(),
    },
  };

  try {
    await dynamoDB.put(params).promise();
  } catch (error) {
    console.error("Error recording email event:", error);
    // Handle the error accordingly
  }
}

async function generateBucket(filename, options, storage) {
  return new Promise((resolve, reject) => {
    storage
      .bucket(process.env.GCS_BUCKET_NAME)
      .file(filename)
      .getSignedUrl(options, (err, url) => {
        if (err) {
          console.error("Error generating signed URL:", err);
          reject(err);
        } else {
          console.log("Signed URL:", url);
          resolve(url);
        }
      });
  });
}