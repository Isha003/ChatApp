angular.module('chatApp')
       .controller('LoginController',function($scope,$log,LogIn,AuthToken){
       	//$scope.greet ="Hi ";

       

       var onSuccess = function(data){
       	if(data.status == true){
       	$scope.msg = data.success;
              AuthToken.setToken(data.token);
              AuthToken.setName(data.username);
       }else{
       	$scope.msg = data.failure;
       }
      
       
       };

       var onError = function(reason){
    	console.log( 'Invalid user' );
       	
       };

       $scope.logIn = function(username,passwd){
       	
       	if( username != null && passwd != null ){
       		$log.info("searching for user in database is "+ username);
       		                                       // calling service LogIn to identify user in username 
       		LogIn.getResult(username,passwd).then(onSuccess,onError);
       	}

       };

       })
       .controller('SignUpController',function($scope,SignUp,$location){
       	

       	var onSuccess = function (data){
       		if(data.status == true){
       		$scope.msg = data.success;
            $location.url('/login');
       	} else{
       		$scope.msg = data.failure;
       	}
       	};

       	var onError = function (reason){
       		$scope.error = "invalid user";
       	};
       	$scope.register = function(username,passwd,confirmPasswd,dob,email) {

       		
       		if( username != null && passwd != null  && confirmPasswd != null   &&  passwd == confirmPasswd && dob != null && email != null){
            
            SignUp.getResult(username,passwd,dob,email).then(onSuccess,onError);
       	    }
       	    else{
       	    	$scope.error = 'Password doesn \'t match';
       	    	console.log($scope.error);
       	    }
       };

       })
       .controller('ChatController', function($scope,LoginVerification,AuthToken,$location,socketIo){
             
             onSuccess = function(data){
              console.log(data);

               if(data.status){
                     $scope.msg = data.success;

               }
               else{
                     $scope.msg = data.failure;
                     AuthToken.setToken();
                     $location.url('/login');
               }
             };
             onError = function(reason){
              $scope.error = ' Error';
             }
            var token =  AuthToken.getToken();
            var username = AuthToken.getName();

            console.log("token from verifyToken url is " + token);
            LoginVerification.verifyLogin(token).then(onSuccess,onError);

            $scope.LogOut = function(){

                AuthToken.setToken();
                $location.url('/login');
            }
            // to start a listener which will recieve showMsg
           
            $scope.send = function(text){
              if(text){

              // sending msg to server by calling event emit in factory
              socketIo.emit('chat',{'username': username, 'msg':text});  
              $scope.text='';
            }
            }
            $scope.messages = [];
            var displayMsg = function(name,text){
             
              $scope.messages.push({'name': name, 'msg':text});
            };
             socketIo.on( displayMsg);
           
            })
              // profile controller

      .controller('ProfileController',function($scope,Profile,$http,AuthToken,$location){
        
       var token =  AuthToken.getToken();
       var username = AuthToken.getName();


       var onSuccess = function(data){
          
        if(data.status == true){
          $scope.msg = data.success;
          $scope.username = data.username;
          $scope.email = data.email;
          $scope.dob = data.dob;
          $scope.password = "*******";



        }
       }
       var onError = function(reason){
              $scope.error = 'Profile Page is empty';
       }

       Profile.getUser(username,token).then(onSuccess,onError);
       $scope.edit = function(){
              $scope.editProfile = true;
              $scope.viewProfile = true;
       }
       // callbacks of update function
       onUpdateSuccess = function(data){
        console.log(data);
        if(data.status == true){
          console.log("update successfully");
          $location.url('/chat');

        }
       }
       onUpdateError = function(reason){
        console.log('some error occur in updating user profile ');
       }

       $scope.save = function(username,password,dob,email){

        if(password == '*******')
           {
            password = null;
           }
              $scope.editProfile = false;
              $scope.viewProfile = false;
           Profile.updateUser(username,password,dob,email,token).then(onUpdateSuccess,onUpdateError); 
       }

      });
       