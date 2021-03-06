/**
 * Helpers for various tasks
 * 
 */

//Dependencies
var cyrpto = require('crypto');
var config = require('./config');
var querystring = require('querystring');
var https = require('https');

//Container of all the helpers

var helpers = {}

// Create a SHA256 hash
helpers.hash = function(str){
    if(typeof(str) == 'string' && str.length > 0){
       var hash = cyrpto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
       return hash;
    }
    else{
        return false;
    }
}

//parse string and return as JSON Object
helpers.parseJsonToObject = function(str){
    try{
        var obj = JSON.parse(str);
        return obj;
    }
    catch(e){
        return {};
    };
}

//Create a string of Random Aphonumeric Charcterss, of a given length
helpers.createRandomString = function(strLength){
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if(strLength){
       // Define all the possible characters that could go into string
       var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

       //Start the final string
       var str = '';
       
       for(i = 1;i <= strLength;i++){
           //Get random charcters from possibleCharacters strin
           var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random()* possibleCharacters.length));
           //Append this chacter to the final string
           str+=randomCharacter;
       }
       
       //Return the final string
       return str;
    }
    else{
        return false;
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////                                         Send an SMS message via Twilio
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * 
 */
helpers.sendTwilioSms = (phone,msg,callback)=>{
    //Validate parameters
    phone = typeof(phone) == 'string' && phone.trim().length == 10? phone : false;
    msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
    if(phone && msg){
      //Configure the request payload to twilio
      var payload = {
          'From':config.twilio.fromPhone,
          'To': '+91'+phone,
          'Body': msg
      };

      //stringify the payload
      var stringPayload = JSON.stringify(payload);


      //configure the request details
      var requestDetails = {
          'method':'POST',
          'protocol': 'https:',
          'hostname': 'api.twilio.com',          
          'path' : '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
          'auth': config.twilio.accountSid+':'+config.twilio.authToken,
          'headers': {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': Buffer.byteLength(stringPayload)
           }
      };

    

      //Instantiate the request object
      var req = https.request(requestDetails,(res)=>{
          //Grab the status of the sent request
          var status = res.statusCode;
          //Callback successfully if the request went
          if(status == 200 || status == 201){
              callback(false);
          }
          else{
              callback('Status code returned was '+ status);
          }
      });

      //Bind to the error event so it dosen't get thrown
      req.on('error',(e)=>{
          callback(e);
      });

      //Add the payload
      req.write(stringPayload);

      //End the request
      req.end();

    }
    else{
        //callback(400,{'Error':"Missing Parameters or Invalid parameters"});
        callback('Missing Parameters or Invalid parameters');
    }

}


//Export the module
module.exports = helpers