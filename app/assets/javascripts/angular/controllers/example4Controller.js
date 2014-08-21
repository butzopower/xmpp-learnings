angular.module("XMPPLearnings").controller("example4Controller", function($scope, $timeout) {
  var connection = null;
  $scope.contacts = {};
  $scope.connected = false;

  // for testing
  $scope.jid = "foo@localhost";
  $scope.password = "bar";

  function getBareJid(jid) {
    return Strophe.getBareJidFromJid(jid);
  }

  function getStatusFromPresence(presence) {
    var presenceType = $(presence).attr('type');
    if (presenceType == 'unavailable') return 'offline';

    var show = $(presence).find('show').text();
    if (show === "" || show === "chat") return 'online';

    return 'away';
  }

  function presenceUpdated(presence) {
    $timeout(function() {
      var presenceType = $(presence).attr('type');
      var from = $(presence).attr('from');
      var jid = getBareJid(from);

      if (presenceType !== 'error') {
        var contact = $scope.contacts[jid];
        if (contact) {
          contact.status = getStatusFromPresence(presence);
        }
      }
    });

    return true;
  }

  function initialRosterReceived(iq) {
    $timeout(function() {
      $(iq).find('item').each(function() {
        var jid = getBareJid($(this).attr('jid'));
        var name = $(this).attr('name') || jid;
        var contact = {name: name, jid: jid, status: 'offline'};

        $scope.contacts[jid] = contact;
      })
    });

    connection.addHandler(presenceUpdated, null, "presence");
    connection.send($pres());
  }

  function connected() {
    $scope.connected = true;
    var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
    connection.sendIQ(iq, initialRosterReceived);
  }

  function disconnected() {
    connection = null;
    $scope.connected = false;
    $scope.contacts = {};
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
  };

  this.disconnect = function() {
    connection.disconnect();
  };
});
