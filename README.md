# Download & Notify: A Lambda Function for GitHub Releases

## Overview:

This Lambda function automates downloading GitHub releases, storing them in Google Cloud Storage, and notifying users via email. It triggers on an SNS notification and utilizes DynamoDB for tracking sent emails.

## Key Features:

- Automated download: Seamlessly retrieves releases from GitHub repositories.
- Cloud storage: Securely stores releases in a Google Cloud Storage Bucket.
- Email notification: Informs users about download status through customizable emails sent by Amazon SES.
- Tracking & monitoring: Keeps track of sent emails in a DynamoDB table and logs execution details in CloudWatch Logs.

## Prerequisites

- AWS Lambda: Function and SNS topic for triggering.
- GitHub Token: Read access to repository releases.
- Google Cloud Storage Bucket: Target storage location for downloaded releases.
- AWS DynamoDB Table: Tracks sent email information.
- Amazon SES: Configured for sending email notifications.

## Getting Started:

1. Clone: Download this repository to your local machine.
2. Navigate: Go to the Lambda function directory.
3. Install Dependencies: Use the provided method to install required libraries.
4. Configure: Edit the config.js file with your settings.
5. Deploy: Utilize your preferred method to deploy the function to AWS.

## Function Flow:
1. Triggered by SNS: The function kicks off on receiving an SNS notification.
2. Download Release: Utilizes the provided GitHub token to download the specified release.
3. Store in Cloud Storage: Saves the downloaded release securely in your configured Google Cloud Storage Bucket.
4. Email Notification: Sends a customizable email to the user informing them about the download status. (Ensure SES is configured!)
5. Track in DynamoDB: Logs the sent email details in the designated DynamoDB table for future reference.

## Monitoring & Feedback:
- CloudWatch Logs: Monitor function execution details and troubleshoot any issues.
- DynamoDB Table: Track email delivery status and identify any potential failures.
- Feedback: Feel free to raise issues or suggest improvements for further development.


