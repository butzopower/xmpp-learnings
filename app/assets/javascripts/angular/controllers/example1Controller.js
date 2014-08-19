angular.module("XMPPLearnings").controller("example1Controller", function($scope, $timeout) {
  function connected() {
    $scope.logEntries.push('Connection established.')
  }

  function disconnected() {
    $scope.logEntries.push('Connection terminated.')
  }

  $scope.logEntries = [];

  this.connect = function(jid, password) {
    $scope.logEntries.push('Starting to connect.')
    var connection = new Strophe.Connection("http://192.168.55.55:5280/http-bind");
    connection.connect(jid, password, function(status) {
      console.log(status);
      if (status === Strophe.Status.CONNECTED) {
        $timeout(connected);
      } else if (status === Strophe.Status.DISCONNECTED) {
        $timeout(disconnected);
      }
    });
  }
});
