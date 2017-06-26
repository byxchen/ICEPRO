var App = angular.module('ChatRoom',['ngResource','ngRoute','ngStorage','socket.io','ngFileUpload','Controllers','Services'])
.run(["$rootScope", function ($rootScope){
<<<<<<< HEAD
	$rootScope.baseUrl = 'http://142.1.88.147:8000'; //Application URL
}]);
App.config(function ($routeProvider, $socketProvider){
	$socketProvider.setConnectionUrl('http://142.1.88.147:8000'); // Socket URL
=======
	$rootScope.baseUrl = 'http://192.168.10.10:8000'; //Application URL
}]);
App.config(function ($routeProvider, $socketProvider){
	$socketProvider.setConnectionUrl('http://192.168.10.10:8000'); // Socket URL
>>>>>>> 68ac22c8d34c258bd77f93dcde63b1ae69976289

	$routeProvider	// AngularJS Routes
	.when('/v1/', {
		templateUrl: 'app/views/login.html',
		controller: 'loginCtrl'
	})
	.when('/v1/ChatRoom', {
		templateUrl: 'app/views/chatRoom.html',
		controller: 'chatRoomCtrl'
	})
	.otherwise({		
        redirectTo: '/v1/'	// Default Route
    });
});
