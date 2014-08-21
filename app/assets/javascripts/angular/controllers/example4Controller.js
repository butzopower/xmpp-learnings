angular.module("XMPPLearnings").controller("example4Controller", function($scope, $timeout) {
  var connection = null;
  $scope.contacts = {};
  $scope.jid = "foo@localhost";
  $scope.password = "bar";

  function rosterReceived(iq) {
    $timeout(function() {
      $(iq).find('item').each(function() {
        var jid = $(this).attr('jid');
        var name = $(this).attr('name') || jid;
        var contact = {name: name, jid: jid};

        $scope.contacts[jid] = contact;
      })
    });
  }

  function connected() {
    var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
    connection.sendIQ(iq, rosterReceived);
  }

  function disconnected() {

  }

  this.connect = function(jid, password) {
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
