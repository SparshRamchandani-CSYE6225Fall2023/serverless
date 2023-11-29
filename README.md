# Lambda Function for GitHub Release Download and Email Notification

## Overview
This Lambda function is designed to be triggered by an SNS notification. Its main tasks include downloading a release from a GitHub repository, storing it in a Google Cloud Storage Bucket, sending an email to the user with the download status, and tracking sent emails in DynamoDB.

## Prerequisites
Ensure the following requirements are met before deploying the Lambda function:

AWS Lambda: Set up an AWS Lambda function and an SNS topic for triggering the Lambda function.

GitHub Token: Generate a GitHub token with read access to the repository releases.

Google Cloud Storage Bucket: Create a Google Cloud Storage Bucket to store downloaded releases.

AWS DynamoDB Table: Set up an AWS DynamoDB table to track sent emails.

Amazon SES: Configure Amazon Simple Email Service (SES) for sending emails.

## Deployment Steps
Clone this repository to your local machine.

Navigate to the Lambda function directory.

Install the required dependencies.

Edit the config.js file with your configuration settings.

Deploy the Lambda function to AWS using your preferred deployment method.

## Usage
Once deployed, the Lambda function is triggered by SNS notifications. It performs the following tasks:

Download GitHub Release: Uses the GitHub token to download the specified release and stores it in the configured Google Cloud Storage Bucket.

Email Notification: Sends an email to the user with the download status. Ensure SES is correctly configured for sending emails.

Tracking in DynamoDB: Records sent emails in the specified DynamoDB table for tracking purposes.

## Monitoring
Monitor the Lambda function's execution logs in AWS CloudWatch Logs. Additionally, check the DynamoDB table for tracking email status.
