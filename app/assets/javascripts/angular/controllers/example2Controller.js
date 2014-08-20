angular.module("XMPPLearnings").controller("example2Controller", function($scope, $timeout, $prettyXML, $textToXML) {
  $scope.connection = null;
  $scope.consoleEntries = [];

  function logToConsole(html, type) {
    $scope.consoleEntries.push({html: html, type: type});
  }

  function showTraffic(body, type) {
    if (body.childNodes.length > 0 ) {
      angular.forEach(body.childNodes, function(node) {
        var html = $prettyXML(node);
        logToConsole(html, type);
      });
    }
  }

  this.connect = function(jid, password) {
    $scope.connection = new Strophe.Connection("http://192.168.123.45:5280/http-bind");

    $scope.connection.xmlInput = function(body) {
      $timeout(function() { showTraffic(body, 'incoming') });
    };

    $scope.connection.xmlOutput = function(body) {
      $timeout(function() { showTraffic(body, 'outgoing') });
    };

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

  this.sendData = function(input) {
    var error = false;
    if (input.length > 0) {
      if (input[0] === '<') {
        var xml = $textToXML(input);
        if (xml) {
          $scope.connection.send(xml);
        } else {
          error = true;
        }
      } else if (input[0] === '$') {
        try {
          var builder = eval(input);
          $scope.connection.send(builder);
        } catch (e) {
          console.log(e);
          error = true;
        }
      } else {
        error = true;
      }
    }

    if (error) {
      $scope.inputInvalid = true;
    } else {
      $scope.input = "";
    }
  };
});
