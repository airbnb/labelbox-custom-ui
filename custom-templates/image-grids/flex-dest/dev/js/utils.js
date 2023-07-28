export function get(url) {
  var Httpreq = new XMLHttpRequest();
  Httpreq.open('GET', url, false);
  Httpreq.send(null);
  return Httpreq.responseText;
}
