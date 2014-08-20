function textToXML(text) {
  var doc = null;
  if (window['DOMParser']) {
    var parser = new DOMParser();
    doc = parser.parseFromString(text, 'text/xml');
  } else if (window['ActiveXObject']) {
    var doc = new ActiveXObject("MSXML2.DOMDocument");
    doc.async = false;
    doc.loadXML(text);
  } else {
    throw {
      type: 'PeekError',
      message: 'No DOMParser object found.'
    };
  }

  var elem = doc.documentElement;
  if (elem.getElementsByTagName('parsererror').length > 0) {
    return null;
  }
  return elem;
}

window.app.value('$textToXML', textToXML);
