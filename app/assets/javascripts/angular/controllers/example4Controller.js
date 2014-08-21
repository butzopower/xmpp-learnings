angular.module("XMPPLearnings").controller("example4Controller", function($scope, $timeout, ngDialog) {
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
    console.log(presence);
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

  function rosterReceived(iq) {
    $timeout(function() {
      $scope.contacts = {};
      $(iq).find('item').each(function() {
        var jid = getBareJid($(this).attr('jid'));
        var name = $(this).attr('name') || jid;
        var contact = {name: name, jid: jid, status: 'offline'};

        $scope.contacts[jid] = contact;
      })
    });
  }

  function fetchRoster() {
    var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
    connection.sendIQ(iq, rosterReceived);
  }

  function addContact(contact) {
    var iq = $iq({type: "set"}).c("query", {xmlns: "jabber:iq:roster"})
      .c("item", contact);
    connection.sendIQ(iq);

    var subscribe = $pres({to: contact.jid, "type": "subscribe"});
    connection.send(subscribe);
  }

  function connected() {
    $scope.connected = true;

    fetchRoster();

    connection.addHandler(presenceUpdated, null, "presence");
    connection.send($pres());

    connection.addHandler(function() {
      fetchRoster(); return true;
    }, "jabber:iq:roster", "iq", "set");
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

  this.openAddContactDialog = function() {
    var dialog = ngDialog.open({
      template: 'addContactDialog.html'
    });

    dialog.closePromise.then(function(dialog) {
      var contact = dialog.value;
      $timeout(function() {
        addContact(contact);
      });
    });
  };
});
