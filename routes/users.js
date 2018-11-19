var express = require('express');
var router = express.Router();
var fs = require('fs');
var User = require("../models/users");
var Device = require("../models/device");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jwt-simple");

/* Authenticate user */
var secret = fs.readFileSync(__dirname + '/../jwtkey').toString(); // FIXME!!!

router.post('/signin', function(req, res, next) {
	
   //res.status(201).json( { success: true, message: "In /users/signin router" } );
   
   
   var inFunc = false;
   User.findOne({email: req.body.email}, function(err, user) {
      inFunc = true;
      res.status(201).json( { success: true, message: "In /users/signin router User.findOne() function" } );
      /*
      if (err) {
         res.status(401).json({success : false, error : "Error communicating with database."});
      }
      else if(!user) {
         res.status(401).json({success : false, error : "The email or password provided was invalid."});         
      }
      else {
         bcrypt.compare(req.body.password, user.passwordHash, function(err, valid) {
            if (err) {
               res.status(401).json({success : false, error : "Error authenticating. Please contact support."});
            }
            else if(valid) {
               var token = jwt.encode({email: req.body.email}, secret);
               res.status(201).json({success : true, token : token});         
            }
            else {
               res.status(401).json({success : false, error : "The email or password provided was invalid."});         
            }
         });
      }
      */
   });
   if (!inFunc) {
      //res.status(201).json( { success: true, message: "AFTER /users/signin router User.findOne() function" } );
      res.status(201).json( { success: true, message: req.body.email } );
   }
   
});

/* Register a new user */
router.post('/register', function(req, res, next) {
	
    	
    //res.status(201).json( { success: true, message: "In /users/register router" } );

    
    // FIXME: Add input validation
    bcrypt.hash(req.body.password, null, null, function(err, hash) {
	//res.status(201).json( { success: true, message: "In bcrypt.hash" } );
	
        // Create an entry for the user
	try {
           var newUser = new User( {                //  Should we put a try-catch around this whole block???
              email: req.body.email,
              fullName: req.body.fullName,
              passwordHash: hash // hashed password
           }); 
	   //res.status(201).json( { success: true, message: "Created new instance of User model" } );
	}
	catch (err) {
	   res.status(400).json( { success: false, message: "Couldn't create new user" } );
	   return;
        }
	
	var insideSaveFunction = false;
	newUser.save( function(err, user) {
	   insideSaveFunction = true;
	   res.status(201).json( {success: true, message: "Inside newUser.save() function"});
	});
	if (insideSaveFunction == false) {
	    res.status(201).json( {success: true, message: "New user successfully saved"});
	}
        /*
        newUser.save( function(err, user) {
	   
           if (err) {
              // Error can occur if a duplicate email is sent
              //res.status(400).json( {success: false, message: err.errmsg});
	      res.status(400).json( {success: false, message: "Couldn't save new instance of User model"});
           }
           else {
               //res.status(201).json( {success: true, message: user.fullName + " has been created."});
	       res.status(201).json( {success: true, message: "New user successfully saved"});
           }
	   
	   res.status(201).json( {success: true, message: "New user possibly saved"});
        });
	*/
    });
    
});

router.get("/account" , function(req, res) {
   // Check for authentication token in x-auth header
   if (!req.headers["x-auth"]) {
      return res.status(401).json({success: false, message: "No authentication token"});
   }
   
   var authToken = req.headers["x-auth"];
   
   try {
      var decodedToken = jwt.decode(authToken, secret);
      var userStatus = {};
      
      User.findOne({email: decodedToken.email}, function(err, user) {
         if(err) {
            return res.status(200).json({success: false, message: "User does not exist."});
         }
         else {
            userStatus['success'] = true;
            userStatus['email'] = user.email;
            userStatus['fullName'] = user.fullName;
            userStatus['lastAccess'] = user.lastAccess;
            
            // Find devices based on decoded token
		      Device.find({ userEmail : decodedToken.email}, function(err, devices) {
			      if (!err) {
			         // Construct device list
			         var deviceList = []; 
			         for (device of devices) {
				         deviceList.push({ 
				               deviceId: device.deviceId,
				               apikey: device.apikey,
				         });
			         }
			         userStatus['devices'] = deviceList;
			      }
			      
               return res.status(200).json(userStatus);            
		      });
         }
      });
   }
   catch (ex) {
      return res.status(401).json({success: false, message: "Invalid authentication token."});
   }
   
});

module.exports = router;
