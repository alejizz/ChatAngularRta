// This basic angular chat app is for a General Assembly
// course I am teaching.

var est = angular.module('chatapp', ['firebase'])
.controller('MainCtrl', MainCtrl)
.service('Auth', AuthService)
.service('Messages', MessagesService)
.directive('messageBox', MessageBoxDirective)
.constant('FirebaseRef', new Firebase('https://chatangular-14105.firebaseio.com/messages'));

function MainCtrl(Auth, Messages){
  var vm = this;
  vm.name = 'Chat App';

  vm.auth = Auth;
  vm.messages = Messages;

}

function AuthService($rootScope){

  var Auth = {
    name: '',
    loggedIn: false
  };

  Auth.logInUser = function(){
    this.loggedIn = true;
    $rootScope.$broadcast('loggedIn');
  };

  return Auth;
}

function MessagesService(Auth, $rootScope, $firebaseArray, FirebaseRef){
  var Messages = {
    data: $firebaseArray(FirebaseRef)
  };

  Messages.add = function(message, idPadre){
    Messages.data.$add({
      text: message,
      name: Auth.name,
      time: Date.now(),
      messageFrom: idPadre
    });



    delete Messages.newMessage;
    //delete Messages.newMessageResponse;
    $rootScope.$broadcast('newMessage');
  }
  return Messages;
}



function MessageBoxDirective($rootScope, $timeout){
  var MessageBox = {
    restrict: 'A',
    link: function(scope, el, attrs){

      function scrollToBottom(){
        $timeout(function(){
          el[0].scrollTop = 9999;
        }, 0);
      }

      $rootScope.$on('loggedIn', scrollToBottom);
      $rootScope.$on('newMessage', scrollToBottom);

    }
  }

  return MessageBox;
}
