'use strict';

/**
 * @ngdoc function
 * @name iicaFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the iicaFrontendApp
 */
angular.module('iica')
   .factory('AnnyangService', function($rootScope) {
	   var service = {};
       
       // COMMANDS
       service.commands = {};

       service.addCommand = function(phrase, callback) {
           var command = {};
           
           // Wrap annyang command in scope apply
           command[phrase] = function(args) {
               $rootScope.$apply(callback(args));
           };

           // Extend our commands list
           angular.extend(service.commands, command);
           
           // Add the commands to annyang
           annyang.addCommands(service.commands);
           //console.debug('added command "' + phrase + '"', service.commands);
       };

       service.start = function() {
           annyang.addCommands(service.commands);
           annyang.debug(false);
           annyang.start();
       };
       
       return service;
	})

  .directive('myEnter', function () {
            return function (scope, element, attrs) {
                element.bind("keydown keypress", function (event) {
                    if(event.which === 13) {
                        scope.$apply(function (){
                            scope.$eval(attrs.myEnter);
                        });

                        event.preventDefault();
                    }
                });
            };
        })
  .directive('boundModel', function() {
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ngModel) {
      scope.$watch(attrs.boundModel, function(newValue, oldValue) {
        if(newValue != oldValue) {
          ngModel.$setViewValue(newValue);
          ngModel.$render();
        }
      });
    }}})
    
    
  .controller('MainCtrl', function (AnnyangService, $scope, $http, $interval) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
    var vm = this;
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.voice = voices[2]; // Note: some voices don't support altering params
    msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1
    msg.rate = 1; // 0.1 to 10
    msg.pitch = 1; //0 to 2
    msg.lang = 'en-GB';
    
    vm.init = function() {
        vm.clearResults();

        AnnyangService.addCommand('*allSpeech', function(allSpeech) {
            vm.addResult(allSpeech);
        });
        
        AnnyangService.start();
    };
    
    vm.addResult = function(result) {
       $http({
           url: 'http://13.76.181.19:8080/api/message',
       	//url: 'http://localhost:8080/resource',
           method: "POST",
           data: result
       }).then(function(response) {
    	       window.speechSynthesis.cancel();
               $scope.greeting = response.data;
              
               msg.text = response.data.content;
              
               window.speechSynthesis.speak(msg);
           });
    };
    
    
  
      $http({
        url: 'http://13.76.181.19:8080/api/message',
    	//url: 'http://localhost:8080/resource',
        method: "POST",
        data: "Hello"
    }).then(function(response) {
            $scope.greeting = response.data;
            msg.text = response.data.content;
            window.speechSynthesis.speak(msg);
        });
    $scope.sendInput = function() {
        $http({
            method : 'POST',
            url : 'http://13.76.181.19:8080/api/message',
            //url: 'http://localhost:8080/resource',
            data : $scope.textModel
        }).then(function(response){
        	window.speechSynthesis.cancel();
        	$scope.greeting = response.data;
        	msg.text = response.data.content;
            window.speechSynthesis.speak(msg);
        	$scope.textModel = '';
        });
        }
    $scope.startButton = function(event) {
        console.log('button presed');
        var final_transcript = '';
        recognition.start();
     }
    
    vm.clearResults = function() {
        vm.results = [];
    };

    vm.init();
  });
