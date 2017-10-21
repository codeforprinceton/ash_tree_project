var albumBucketName = 'ash-tree-photos';
var bucketRegion = 'us-east-1';
var IdentityPoolId = 'us-east-1:8b0020d0-7894-415d-b55b-bdf15f1f1b50';

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});

var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: albumBucketName}
});
