# AWS Setup

## Pre-Production
### Validation
In development, we start the server using `npm run dev` and validate that the application works as expected.

For production, we can run the server locally:
```bash
npm ci
npm run build
npm run preview
```

This builds the application code into the `dist` directory and serves it on port 5173. The port is selected to avoid CORS issues as by default 4173 is used. The port was set in the `package.json` file under the `preview` script.

The application should be accessible at [localhost:5173](http://localhost:5173) and will be calling the API as specified in the `.env.production` file (rather than `.env.development`).

This version of the application is what we will deploy to AWS.
### AWS Setup
### AWS CLI Installation
1. Install the AWS CLI: [AWS CLI v2 download page](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
2. Validate the installation with `aws --version`.
3. Configure the AWS CLI with your credentials `aws configure`. It will prompt for:
   - AWS Access Key ID - this is your access key ID from AWS IAM (IAM > Users > MyUsername > Summary > Access key 1).
   - Secret Access Key - This was generated when I created the access key in AWS IAM and stored in local records.
   - region - I used `eu-west-2` (London) as it is the closest region to me, matching the backend.
   - output format - I used `json` as it is the default and works well with the CLI.
### S3 Bucket Creation
The S3 bucket is used to host the static files of the frontend application. The bucket name must be globally unique across all AWS accounts -- I selected `tas-frontend-dev` as my bucket name.
```bash
aws s3api create-bucket --bucket tas-frontend-dev --region eu-west-2 --create-bucket-configuration LocationConstraint=eu-west-2
```
Block all public access to the bucket to ensure security. This is important as we do not want anyone to be able to access the files in the bucket unless we explicitly allow it. CloudFront will be the only one allowed to read.
```bash
aws s3api put-public-access-block --bucket tas-frontend-dev --public-access-block-configuration 'BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true'
```
### Create CloudFront with Origin Access Control (OAC)
