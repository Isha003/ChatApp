var express    = require('express'),
    Bourne     = require('bourne'),
    bodyParser = require('body-parser'),
    crypto     = require('crypto'),
    db         = new Bourne('user.json'),
    jsonwebtoken = require('jsonwebtoken'),
    router     = express.Router();

var secretKey ='abc123';
// function to hash a password
 function hash (password) { 
    return crypto.createHash('sha256').update(password).digest('hex');
}
// function for creating token
function createToken(user){

	var token = jsonwebtoken.sign ({
		username:user.username,
		password:user.password
	   },secretKey,
	   { expirtesInMinute:1440 }

	);
       return token;
} 

router
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true
      }))

    
    .post('/signup',function(req,res){
    	//var user = req.body;
    	var user ={
    		username:req.body.username,
    		password:hash(req.body.password),
            dob:req.body.dob,
            email:req.body.email
            
    	}

    	var token =  createToken(user);
    	
	       db.find(user,function(err,data){
	       	if(err){
	       		res.json({failure:"server is down"});
	       	} 
	       	
	       	if(data.length > 0){
	       		res.json({ status: false, failure: "user already exists"});
	       	} else {

	            db.insert(user,function(err,data){
                    console.log(data);
                    var username = data.username;
                    var email = data.email;
                    var dob=data.dob;

	            res.json({
                    status: true,
	            	success: "Successfully registered",
	            	token: token,
                    username:username,
                    
	            });
	            
	            })
	        }
	      
	        })
   })
   
   
     .post('/login',function(req,res){
     	var user = {
            username:req.body.username,
            password:hash(req.body.password)
        }
     	
     	var token =  createToken(user);

     	// db find
     	db.find(user, function(err,data){
     		if(data.length > 0 ){
                 var username = data[0].username;
     			  res.json({
                    status: true,
     				success:'You are a valid user',
     				token:token,
                    username:username
     			});
     		}
            else{
                console.log('error');
               res.json({ status: false, failure:'Invalid user'});
            }
     	})
     })
     .use(function(req,res,next) {
        var token = req.body.token || req.query.token;
        
        jsonwebtoken.verify(token,secretKey,function(err,data) {

            if(data) {
                next();
            } else {

                res.status(200).send({status:false, failure: 'User Not Authorized'});
            }

        })
       
     })
     .post('/verifyToken',function(req,res){

        res.json({status: true, success: "You have a valid Token."})
     })
     // fetching user data on edit
     .get('/profile',function(req,res){
        
     
        var user = {
            username:req.query.username
        }
       
        db.find(user,function(err,data){
            // fetching into variables
            var username = data[0].username;
            var email = data[0].email;
            var dob = data[0].dob;
            console.log(dob);

            if(data.length > 0){

                res.json({
                    status:true,
                    success:'You can edit your profile',
                    username:username,
                    dob:dob,
                    email:email
                })
            }
        })
     })
     .post('/profile',function(req,res){
       
        var Username = {
            username:req.body.username
        }
        
        db.find(Username ,function(err,data){
            if(data.length > 0 ){
        
                var updatedPassword=data[0].password;
                if(req.body.password)  {
                    updatedPassword=hash(req.body.password);
                }     
                var user = {
            username:req.body.username,
            password:updatedPassword,
            dob:req.body.dob,
            email:req.body.email
        }
           db.update( Username, user, function(err,data){

            res.json({
                status:true,
                success:'update'
            });
             console.log(data);

        })
       }
        })
     });

module.exports = router;

