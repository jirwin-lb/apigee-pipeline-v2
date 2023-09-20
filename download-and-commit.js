const axios = require('axios');
const fs = require('fs');
const AdmZip = require('adm-zip');

const orgName = process.argv[2]; // Get the orgName from the command line arguments
const apiName = process.argv[3]; // Get the apiName from the command line arguments
const proxyRevision = process.argv[4]; // Get the PROXY_REVISION from the command line arguments
const username = process.argv[5]; // Get the APIGEE username from the command line arguments
const password = process.argv[6]; // Get the APIGEE password from the command line arguments

// Basic Authentication credentials
const credentials = Buffer.from(`${username}:${password}`).toString('base64');
const basicAuthHeader = `Basic ${credentials}`;

// APIGEE API endpoint
const apiUrl = `https://api.enterprise.apigee.com/v1/organizations/${orgName}/apis/${apiName}/revisions/${proxyRevision}`;

// Axios configuration with Basic Authentication
const axiosConfig = {
  headers: {
    Authorization: basicAuthHeader,
  },
  responseType: 'arraybuffer', // Ensure we get binary data
};

const downloadAndCommit = async () => {
  try {
    // Download the zip file
    const response = await axios.get(apiUrl, axiosConfig);

    // Write the zip file to disk
    fs.writeFileSync('api-revision.zip', response.data);

    // Unzip the file
    const zip = new AdmZip('api-revision.zip');
    zip.extractAllTo('api-revision', /*overwrite*/ true);

    console.log('API revision downloaded and extracted.');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

downloadAndCommit();
