const express = require("express");
const router = express.Router(); 
const keys = require('../config/keys');
const facilities = require('../models/facilities');
const fetch = require('node-fetch');

router.post('/', (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;
  // intial vars
  console.log(sessionId, serviceCode, phoneNumber, text);
  let emergency;
  let response = "";
  console.log("Logic about to start");

  switch (text) {
    case "":
      console.log("first question");
      // user's first dial
      response = "CON Hello, whats your emergency \n";
      response += "1. Pregnancy \n";
      response += "2. Accident \n";
      response += "3. Bleeding \n";
      response += "4. Heart Attack \n";
      response += "5. Other";
      // send response back to user
      res.header({ "Content-Type": "text/plain" });
      res.end(response);
      break;
    case "1":
      console.log("Pregnancy emergency");
      // user respond with pregnacy emergency
      emergency = "Pregnancy";
      response = "CON whats your location?";
      // send response back to user
      res.header({ "Content-Type": "text/plain" });
      res.end(response);
      break;
    case "2":
      console.log("second if");
      // user respond with accident emergency
      emergency = "Accident";
      response = "CON whats your location?";
      // send response back to user
      res.header({ "Content-Type": "text/plain" });
      res.end(response);
      break;
    case "3":
      console.log("Bleeding");
      // user respond with bleeding emergency
      emergency = "Bleeding";
      response = "CON whats your location?";
      // send response back to user
      res.header({ "Content-Type": "text/plain" });
      res.end(response);
      break;
    case "4":
      console.log("Heart attack");
      // user respond with hearth attack emergency
      emergency = "Heart Attack";
      response = "CON whats your location?";
      // send response back to user
      res.header({ "Content-Type": "text/plain" });
      res.end(response);
      break;
    case "5":
      console.log("Other emergencies");
      // user respond with other health emergencies
      emergency = "Other";
      response = "CON whats your location?";
      // send response back to user
      res.header({ "Content-Type": "text/plain" });
      res.end(response);
      break;
    default:
      let term = text;
      if(term.includes('*')) {
        term = text.substring(2);
      }
      console.log("User's location and response");
      const searchTerm = term.charAt(0).toUpperCase() + term.slice(1);
      // user respond with his/her location
      console.log('search term', searchTerm);
      // search for the user's location using google's places api
      let locationUrl = `${searchTerm} Kaduna, Nigeria`;
      locationUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(locationUrl)}&inputtype=textquery&fields=formatted_address,geometry&key=${keys.placeApiKey}`;

      // get user's location
      fetch(locationUrl)
        .then(result => result.json())
        .then(data => {
          // get user's geo coordinates
          const coordinates = data.candidates[0].geometry.location;

          // find the nearest 3 health facilities
          facilities
            .find(
              {
                $or: [
                  { long: coordinates.lng },
                  { lat: coordinates.lat },
                  { ward_name: searchTerm },
                  { lga_name: searchTerm },
                  { facility: searchTerm }
                ]
              },
              (err, match) => {
                console.log(match);
                if (err) console.log(err); // handling errors

                if (match.length > 0) {
                  response = "END Here are the nearest hospitals \n";
                  response += `* ${match[0].facility} \n`;
                  response += `* ${match[1].facility} \n`;
                  response += `* ${match[2].facility} \n`;
                  // send response back to user
                  res.header({ "Content-Type": "text/plain" });
                  res.end(response);
                } else {
                  response = "END No match found \n";
                  // send response back to user
                  res.header({ "Content-Type": "text/plain" });
                  res.end(response);
                }
              }
            )
            .limit(3);
        })
        .catch(err => {
          console.log(err);

        }); // handling errors
      break;
  }
  
  
});

module.exports = router;