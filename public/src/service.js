angular.module('chatApp')
      // login service
       .factory('LogIn',function($http){

       	var getResult = function(username,passwd){
       	var user = {
       		method:'POST',
       		url:'/api/login',
       		data: { username :username,
       		       password: passwd
       	           }
       	}	
       	 return      $http(user)
       	             .then(function(response){
        	             	
       	             	return response.data;

       	             });
       	             	
       };

       return{
       	   getResult:getResult

       };

	}) // signup Service
       .factory('SignUp',function($http){

       	var getResult = function(username,passwd,dob,email){
       	var user = {
       		method:'POST',
       		url:'/api/signup',
       		data:{ username:username,
       		       password:passwd,
                 email:email,
                 dob:dob
       		       }
        }
        return $http(user)
               .then(function(response){
               	return response.data;
               });
        };        
               return{
               	getResult:getResult
               };

       })
       // token service
       .factory('AuthToken',function($window,$location){

        var getToken = function(){
          return $window.localStorage['token'];

        }
        var setToken = function(token){
          if(token){
            $window.localStorage['token'] = token;
            $location.url('/chat');
          } else{
            $window.localStorage.removeItem('token');
            
            
          }

        }
        var getName = function(){
          return $window.localStorage['username'];
        }
        var setName = function(username){
          if(username){
            $window.localStorage['username'] = username;
            //$location.url('/chat');
          } else{
            $window.localStorage.removeItem('username');
            
            
          }

        }

        /*var removeToken = function(){
          return  $window.localStorage.remove('token');

        }*/
        return{
            
          getToken: getToken,
          setToken:setToken,
          getName:getName,
          setName:setName
        }
        

       })
       .factory('LoginVerification',function($http){

        var verifyLogin = function(token){
        var token = {
          method:'POST',
          url:'/api/verifyToken',
          data:{ token:token
                 }
        }
        return $http(token)
               .then(function(response){
                return response.data;
               });
        };        
               return{
                verifyLogin:verifyLogin
               };

       })
       .factory('socketIo',function($rootScope){
         var socket = io.connect();
           return{
            on:function(displayMsg){
              socket.on('chat',function(msg){
                console.log(msg);
                $rootScope.$apply(function(){
                  console.log(msg.username);
                  console.log(msg.msg);
                 displayMsg(msg.username,msg.msg);
                });
              });
            },
            // send msg to server 
            emit:function(chat,data){
              console.log('Testing ...');
              socket.emit(chat,data,function(){

                console.log('Test message sent.');
                var args = arguments;
                /*$rootScope.apply(function(){
                  if(callback){
                    callback.apply(socket,args);
                  }
                });*/
              });
            }
           };



       })
       .factory('Profile',function($http){
          var getUser = function(username,token){
         
            return $http.get('/api/profile?username='+username+'&token='+token)
                     .then(function(response){
                      return response.data;

                     });
          }
        var updateUser = function(username,password,dob,email,token){
          console.log("username is "+username);
            var user = {
              method:'POST',
              url:'/api/profile',
              data:{ username:username,
                  password:password,
                  dob:dob,
                  email:email,
                  token:token
                 
                 }
            }
        return $http(user)
          .then(function(response){

                return response.data;

               });
        };     

               return{
                           getUser:getUser,
                           updateUser:updateUser
               }

     });
  
       
       