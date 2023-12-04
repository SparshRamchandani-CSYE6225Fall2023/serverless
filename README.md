# AWS Lambda Function for File Download and Upload

This AWS Lambda function is designed to handle events triggered by AWS Simple Notification Service (SNS). It is responsible for downloading a file from a provided URL, uploading it to Google Cloud Storage (GCS), and sending a notification email via Mailgun. The function is written in Node.js and utilizes various AWS and third-party libraries.

## Prerequisites

Before deploying and running this Lambda function, ensure that you have the following set up:

- **AWS Secrets Manager**: A secret named "mailgun_api_key" containing the Mailgun API key.
- **Google Cloud Storage**: A GCS bucket for storing the downloaded file.
- **Mailgun Account**: An account to obtain the Mailgun API key and domain.

## Environment Variables

Make sure to set the following environment variables in your Lambda environment:

- `REGION`: AWS region for Secrets Manager.
- `MAILGUN_DOMAIN`: Mailgun domain for sending emails.
- `GCP_PROJECT_ID`: Google Cloud Project ID.
- `GCS_BUCKET_NAME`: GCS bucket name for file storage.
- `DYNAMODB_TABLE_NAME`: DynamoDB table name for recording email events.

## Dependencies

Ensure the necessary Node.js packages are installed. You can install them using:

```bash
npm install aws-sdk @aws-sdk/client-secrets-manager @google-cloud/storage node-fetch mailgun-js dotenv
```

## Lambda Execution

The Lambda function is triggered by an SNS event. When executed, it performs the following steps:

1. Retrieves the Mailgun API key from AWS Secrets Manager.
2. Parses the Google Cloud Storage private key and initializes the GCS client.
3. Processes the SNS event to extract relevant information (submission URL, user email, etc.).
4. Downloads the file from the submission URL using `node-fetch`.
5. Uploads the file to the specified GCS bucket.
6. Generates a signed URL for the uploaded file.
7. Sends a success email to the user using Mailgun.
8. Records the email event in DynamoDB.

If any step fails, the function catches errors, sends a failure email, and records the error in DynamoDB.

## Running Locally

To test the Lambda function locally, set the required environment variables and execute the function using an SNS event payload.

```bash
npm install -g aws-sdk @aws-sdk/client-secrets-manager @google-cloud/storage node-fetch mailgun-js dotenv
node your_lambda_function_file.js
```

Ensure that you provide a sample SNS event for testing.

## License

This Lambda function is licensed under the [MIT License](LICENSE). Feel free to modify and distribute it according to your needs.