angular.module("XMPPLearnings").controller("example1Controller", function($scope, $timeout) {
  var connection = null;

  function clearLogs() {
    $scope.logEntries = [];
  }

  function log(message) {
    $scope.logEntries.push(message);
  }

  function receivePing() {
    log('Received ping.');
    connection.disconnect();
    return false; // Strophe wants you to return false on callbacks that should only run once
  }

  function setupHandlers() {
    log('Setting up handlers.');
    connection.addHandler($timeout(receivePing), null, 'iq', null, 'ping1');
  }

  function sendPing() {
    log('Sending ping.');

    var domain = Strophe.getDomainFromJid(connection.jid);
    var ping = (
        new Strophe.Builder('iq', {to: domain, type: "get", id: "ping1"})
        ).c("ping", {xmlns: "urn:xmpp:ping"});

    connection.send(ping);
  }

  function connected() {
    log('Connection established.');
    setupHandlers();
    sendPing();
  }

  function disconnected() {
    log('Connection terminated.');
  }

  this.connect = function(jid, password) {
    clearLogs();
    log('Starting to connect.');
    connection = new Strophe.Connection("http://192.168.123.45:5280/http-bind");
    connection.connect(jid, password, function(status) {
      if (status === Strophe.Status.CONNECTED) {
        $timeout(connected);
      } else if (status === Strophe.Status.DISCONNECTED) {
        $timeout(disconnected);
      }
    });
  }
});
