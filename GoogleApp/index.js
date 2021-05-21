// Require express and body-parser
const { conversation } = require('@assistant/conversation');
const functions = require('firebase-functions');
const fetch = require('node-fetch');
const https = require('https');

const app = conversation({debug: true});
const URL = 'http://wms.beavdms.com:9000';

// GET Requests //
app.handle('getItem', async conv => {
  const response = await fetch(URL + '/Parts?name=' + conv.session.params.ItemToFind);
  const json = await response.json();
  if (response.length > 3){
      conv.add("The " + json[0].partName + " is in the " + json[0].containerName);
    }
  else{
      conv.add("The " + conv.session.params.ItemToFind + " doesn't seem to be in the database" + JSON.stringify(response));
    }
});

app.handle('getContainer', async conv => {
  const response = await fetch(URL + '/Containers?name=' + conv.session.params.ContainerToFind);
  const json = await response.json();
  conv.add("The " + json[0].name + " is in the " + json[0].location);
});

app.handle('getCategories', async conv => {
  const response = await fetch(URL + '/Categories');
  const json = await response.json();
  conv.add(json[0].name);
});

// ADD Requests //
app.handle('addPart', async conv => {
  const partName = conv.session.params.partName;
  const partQuantity = conv.session.params.partQuantity;
  const partLocation = conv.session.params.partLocation;
  
  // Add the part first
  const addPartData = {
    name: `${partName}`
  };
  
  const addPartResp = await fetch(URL + '/Parts', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(addPartData)
  });
  const addPartJson = await addPartResp.json();
  
	// Get container ID next
  const getContainerResp = await fetch(URL + '/Containers?name=' + `${partLocation}`);
  const getContainerJson = await getContainerResp.json();
  
  // Lastly add the Part to the container
  const addPartContainerData = {
    quantity: `${partQuantity}`,
    identifier: ""
  };
  
    const addPartContainerResp = await fetch(URL + '/Contains/Containers/' + getContainerJson[0].containerID + '/Parts/' + addPartJson.id, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(addPartContainerData)
  });
  
  conv.add("The " + partName + " was added.");
});

app.handle('addContainer', async conv => {
  const containerName = conv.session.params.containerName;
  const containerSize = conv.session.params.containerSize;
  const containerLocation = conv.session.params.containerLocation;
  
  const postData = {
    name: `${containerName}`,
    size: `${containerSize}`,
    location: `${containerLocation}`
  };
  
  const response = await fetch(URL + '/Containers', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
  });
  const json = await response.json();
  conv.add("The " + containerName + " was added.");
});

// REMOVE Requests //
//Remove Part
app.handle('removePart', async conv => {
  const partName = conv.session.params.partName;
  
  const getResponse = await fetch(URL + '/Parts?name=' + `${partName}`);
  const getPartsJson = await getResponse.json();
  
  const deleteResponse = await fetch(URL + '/Parts/' + getPartsJson[0].partID, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json, */*',
      'Content-Type': 'application/json'
    }
  });
  
  const deletePartJson = deleteResponse.json();
  conv.add("The " + partName + " was deleted.");
});

//Remove Container
app.handle('removeContainer', async conv => {
  const containerName = conv.session.params.containerName;
  
  const getResponse = await fetch(URL + '/Containers?name=' + `${containerName}`);
  const getContainersJson = await getResponse.json();
  
  const deleteResponse = await fetch(URL + '/Containers/' + getContainersJson[0].containerID, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json, */*',
      'Content-Type': 'application/json'
    }
  });
  
  const deleteContainerJson = deleteResponse.json();
  conv.add("The " + containerName + " was deleted.");
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
