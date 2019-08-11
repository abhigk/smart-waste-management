
const request = require('request');

var getWeather = (lat, long, callback) =>
{

request({
  url: `https://api.darksky.net/forecast/744b1c6d983b0972e7c4d7ea2a7c8fe9/${lat},${long}`,
  json: true
}, (error, response, body) =>
{
  if(error)
  {
    callback('Unable to connect to forecast.io server');
  }
  else if(response.statusCode === 400)
  {
    callback('Unable to fetch weather');
  }
  else if(response.statusCode === 200)
  {
    callback(undefined, {
      temperature: body.currently.temperature,
      apparentTemperature: body.currently.apparentTemperature
    });
  }
});
};
module.exports.getWeather = getWeather;
