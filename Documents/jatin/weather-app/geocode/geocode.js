const request = require('request');

var geocodeAddress = (address, callback) => {

  var encodedAddress = encodeURIComponent(address);

  ////console.log(encodedAddress); //for printing/testing the encoded address

  request({
    url: `https://maps.googleapis.com/maps/api/geocode/json?address= ${encodedAddress}`,
    json: true
  }, (error,response,body) =>
   {
     if(error)
     {
       callback('Unable to connect to google server');
     }
     else if(body.status === 'ZERO_RESULTS')
     {
        callback('Unable to find the address.');
     }
     else if(body.status === 'OK')
     {
       callback(undefined, {
         address: body.results[0].formatted_address,
         Longitude: body.results[0].geometry.location.lat,
         latitude: body.results[0].geometry.location.lng
       });
     }
  });
};

module.exports.geocodeAddress = geocodeAddress;
