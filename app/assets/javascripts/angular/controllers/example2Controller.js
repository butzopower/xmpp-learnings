angular.module("XMPPLearnings").controller("example2Controller", function($scope, $timeout) {
  $scope.connection = null;
  $scope.consoleEntries = [];

  function logToConsole(html, type) {
    $scope.consoleEntries.push({html: html, type: type});
  }

  function xml2html (xmlString) {
    return xmlString.replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function showTraffic(body, type) {
    if (body.childNodes.length > 0 ) {
      angular.forEach(body.childNodes, function(node) {
        var xmlString = Strophe.serialize(node);
        var html = xml2html(xmlString);
        logToConsole(html, type);
      });
    }
  }

  this.connect = function(jid, password) {
    $scope.connection = new Strophe.Connection("http://192.168.123.45:5280/http-bind");

    $scope.connection.xmlInput = function(body) { $timeout(function() {showTraffic(body, 'incoming')});};
    $scope.connection.xmlOutput = function(body) { $timeout(function() {showTraffic(body, 'outgoing')});};

    $scope.connection.connect(jid, password, function(status) {
      if (status === Strophe.Status.CONNECTED) {
        $timeout(connected);
      } else if (status === Strophe.Status.DISCONNECTED) {
        $timeout(disconnected);
      }
    });
  };

  this.disconnect = function() {
    $scope.connection.disconnect();
    $scope.connection = null;
  };
});
