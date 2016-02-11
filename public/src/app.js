angular.module('chatApp',['ngRoute', 'ngResource', 'ngMessages'])
       .config(function ($routeProvider, $locationProvider) {
        $routeProvider
	       
            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'login.html'
            })
            .when('/signup', {
                controller: 'SignUpController',
                templateUrl: 'views/signup.html'
            })
            .when('/chat',{
                controller:'ChatController',
                templateUrl:'views/chat.html'
            })
            .when('/profile',{
                controller:'ProfileController',
                templateUrl:'views/profile.html'
            })
            .otherwise('/login');

                $locationProvider.html5Mode(true);
    });