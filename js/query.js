var dataPoints = "";
function timlineQuery() {
	var pointQuery = "prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> "+
				"prefix gml: <http://www.opengis.net/gml/> "+
				"prefix geo2003: <http://www.w3.org/2003/01/geo/wgs84_pos#>"+
				"prefix geo-vis: <http://www.isi.edu/karma/visualization/> "+
				"prefix owl: <http://www.w3.org/2002/07/owl#> "+

				"SELECT DISTINCT ?lat ?long ?title ?startTime ?endTime ?color ?comment "+
				"WHERE {?point rdf:type gml:Point;"+
						"geo2003:lat ?lat;"+
						"geo2003:long ?long;"+
						"geo-vis:hasMarker ?marker."+
					"?marker geo-vis:title ?title;"+
						"geo-vis:start-time ?startTime;"+
						"geo-vis:end-time ?endTime."+
						"optional{?marker geo-vis:hasColor ?color}"+
					"optional{?marker geo-vis:hasPopup ?popup."+
						"?popup geo-vis:popup-comment ?comment.}}";

	var lineQuery = "prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> "+
				"prefix gml: <http://www.opengis.net/gml/> "+
				"prefix geo2003: <http://www.w3.org/2003/01/geo/wgs84_pos#>"+
				"prefix geo-vis: <http://www.isi.edu/karma/visualization/> "+
				"prefix owl: <http://www.w3.org/2002/07/owl#> "+

				"SELECT DISTINCT ?positions ?title ?startTime ?endTime ?weight ?color ?comment "+
				"WHERE {?line rdf:type gml:LineString;"+
						"gml:posList ?positions;"+
						"geo-vis:hasPlacemark ?placemark."+
					"?placemark geo-vis:title ?title;"+
						"geo-vis:start-time ?startTime;"+
						"geo-vis:end-time ?endTime."+
						"optional{?placemark geo-vis:lineWidth ?weight}"+
						"optional{?placemark geo-vis:hasColor ?color}"+
					"optional{?placemark geo-vis:hasPopup ?popup."+
						"?popup geo-vis:popup-comment ?comment.}}";

	var lineSeqQuery = "prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> "+
						"prefix gml: <http://www.opengis.net/gml/> "+
						"prefix geo2003: <http://www.w3.org/2003/01/geo/wgs84_pos#> "+
						"prefix geo-vis: <http://www.isi.edu/karma/visualization/> "+
						"prefix owl: <http://www.w3.org/2002/07/owl#> "+

						"SELECT DISTINCT ?LineTitle (concat(concat(?lat,\" \"),?long) AS ?positions) ?seq ?startTime ?endTime ?weight ?color ?comment "+
						"WHERE {?line rdf:type gml:LineString; "+
								"geo-vis:title ?LineTitle. "+
								"{ "+
									"SELECT ?lat ?long ?startTime ?endTime ?seq "+
									"WHERE{?line geo-vis:vertex ?vertex. "+
											"?vertex geo-vis:start-time ?startTime; "+
											"geo-vis:end-time ?endTime; "+
											"geo2003:lat ?lat; "+
											"geo2003:long ?long; "+
											"geo-vis:sequence ?seq. "+
									"}order by ?seq "+
								"} "+
								"optional{?line geo-vis:lineWidth ?weight} "+
								"optional{?line geo-vis:hasColor ?color} "+
								"optional{?line geo-vis:hasPopup ?popup. "+
								"?popup geo-vis:popup-comment ?comment.} "+
						"}";

	var polygonQuery = "prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> "+
				"prefix gml: <http://www.opengis.net/gml/> "+
				"prefix geo2003: <http://www.w3.org/2003/01/geo/wgs84_pos#>"+
				"prefix geo-vis: <http://www.isi.edu/karma/visualization/> "+
				"prefix owl: <http://www.w3.org/2002/07/owl#> "+

				"SELECT DISTINCT ?positions ?title ?startTime ?endTime ?weight ?color ?comment "+
				"WHERE {?polygon rdf:type gml:Polygon;"+
						"gml:posList ?positions;"+
						"geo-vis:title ?title;"+
						"geo-vis:start-time ?startTime;"+
						"geo-vis:end-time ?endTime."+
						"optional{?polygon geo-vis:lineWidth ?weight}"+
						"optional{?polygon geo-vis:hasColor ?color}"+
					"optional{?polygon geo-vis:hasPopup ?popup."+
						"?popup geo-vis:popup-comment ?comment.}}";

	var baseURL = "http://localhost:8080/openrdf-sesame/repositories/karma_data";

	sparqlQuery(lineSeqQuery, baseURL);
}
function display(binding) {
	var result = "[";
	for (var i = binding.length - 1; i >= 0; i--) {
		result = result + "{\"start\" : \"" + binding[i].startTime.value + "\",";
		result = result + "\"end\" : \"" + binding[i].endTime.value+"\",";
		result = result + "\"point\" : {\"lat\" : " + binding[i].lat.value + ", \"lon\" : " + binding[i].long.value + "},";
		result = result + "\"title\" : \"" + binding[i].title.value + "\",";
		result = result + "\"options\" : { ";
		if (binding[i].color) {
			result = result + "\"theme\" : \"" + binding[i].color.value + "\",";
		};
		if (binding[i].color) {
			result = result + "\"description\" : \"" + binding[i].comment.value;
		}
		result = result + "\"}";
		if (i>0) {
			result = result + "},";
		}else{
			result = result + "}";
		}
	}
	result = result + "]";
	return result;
}

function lineDisplay(binding) {
	
	var result = "[";
	for (var i = binding.length - 1; i >= 0; i--) {
		result = result + "{\"start\" : \"" + binding[i].startTime.value + "\",";
		result = result + "\"end\" : \"" + binding[i].endTime.value+"\",";
		result = result + "\"polyline\" : [";
		var coordinates = binding[i].positions.value;
		coordinates = $.trim(coordinates);
		coordinates = coordinates.substring(12,coordinates.length - 1);
		var markers = coordinates.split(",");
		for (var j = 0; j < markers.length - 1; j++) {
			var latlong = markers[j];
			latlong = latlong.split(" ");
			var lat = latlong[0];
			var lon = latlong[1];
			result = result + "{\"lat\" : " + lat + ", \"lon\" : " + lon + "},";
		};
		var latlong = markers[markers.length - 1];
		latlong = $.trim(latlong);
		latlong = latlong.split(" ");
		var lat = latlong[0];
		var lon = latlong[1];
		result = result + "{\"lat\" : " + lat + ", \"lon\" : " + lon + "}],";

		result = result + "\"title\" : \"" + binding[i].title.value + "\",";
		result = result + "\"options\" : { ";
		if (binding[i].color) {
			result = result + "\"theme\" : \"" + binding[i].color.value + "\",";
		};

		if (binding[i].comment) {
			result = result + "\"description\" : \"" + binding[i].comment.value + "\",";
		};

		if (binding[i].weight) {
			result = result + "\"lineWeight\" : \"" + binding[i].weight.value;
		};

		result = result + "\"}";
		if (i>0) {
			result = result + "},";
		}else{
			result = result + "}";
		}
	}
	result = result + "]";
	return result;
}

function polygonDisplay(binding) {
	
	var result = "[";
	for (var i = binding.length - 1; i >= 0; i--) {
		result = result + "{\"start\" : \"" + binding[i].startTime.value + "\",";
		result = result + "\"end\" : \"" + binding[i].endTime.value+"\",";
		result = result + "\"polygon\" : [";
		var coordinates = binding[i].positions.value;
		coordinates = $.trim(coordinates);
		coordinates = coordinates.substring(9,coordinates.length - 1);
		var markers = coordinates.split(",");
		for (var j = 0; j < markers.length - 1; j++) {
			var latlong = markers[j];
			latlong = $.trim(latlong);
			latlong = latlong.split(" ");
			var lat = latlong[0];
			var lon = latlong[1];
			result = result + "{\"lat\" : " + lat + ", \"lon\" : " + lon + "},";
		};
		var latlong = markers[markers.length - 1];
		latlong = $.trim(latlong);
		latlong = latlong.split(" ");
		var lat = latlong[0];
		var lon = latlong[1];
		result = result + "{\"lat\" : " + lat + ", \"lon\" : " + lon + "}],";

		result = result + "\"title\" : \"" + binding[i].title.value + "\",";
		result = result + "\"options\" : { ";
		if (binding[i].color) {
			result = result + "\"theme\" : \"" + binding[i].color.value + "\",";
		};

		if (binding[i].comment) {
			result = result + "\"description\" : \"" + binding[i].comment.value + "\",";
		};

		if (binding[i].weight) {
			result = result + "\"lineWeight\" : \"" + binding[i].weight.value;
		};

		result = result + "\"}";
		if (i>0) {
			result = result + "},";
		}else{
			result = result + "}";
		}
	}
	result = result + "]";
	return result;
}

function polyLineDisplay(binding) {
	
	var result = "[";
	for (var i = 1; i < binding.length; i++) {
		result = result + "{\"start\" : \"" + binding[i].startTime.value + "\",";
		result = result + "\"end\" : \"" + binding[i].endTime.value+"\",";
		result = result + "\"polyline\" : [";
		var latlong = binding[i-1].positions.value;
		latlong = latlong.split(" ");
		var lat = latlong[0];
		var lon = latlong[1];
		result = result + "{\"lat\" : " + lat + ", \"lon\" : " + lon + "},";
		
		latlong = binding[i].positions.value;
		latlong = latlong.split(" ");
		lat = latlong[0];
		lon = latlong[1];
		result = result + "{\"lat\" : " + lat + ", \"lon\" : " + lon + "}],";

		result = result + "\"title\" : \"" + binding[i].LineTitle.value + "\",";
		result = result + "\"options\" : { ";
		if (binding[i].color) {
			result = result + "\"theme\" : \"" + binding[i].color.value + "\",";
		};

		if (binding[i].comment) {
			result = result + "\"description\" : \"" + binding[i].comment.value + "\",";
		};

		if (binding[i].weight) {
			result = result + "\"lineWeight\" : \"" + binding[i].weight.value;
		};

		result = result + "\"}";
		if (i<binding.length-1) {
			result = result + "},";
		}else{
			result = result + "}";
		}
	}
	result = result + "]";
	console.log(result);
	return result;
}

function sparqlQuery(query, baseURL, format) {
	if (!format)
		format = "application/sparql-results+json";
	var params = {
		"default-graph" : "",
		"should-sponge" : "soft",
		"query" : query,
		"debug" : "on",
		"timeout" : "120",
		"format" : format,
		"save" : "display",
		"fname" : ""
	};

	var querypart = "";
	for ( var k in params) {
		querypart += k + "=" + encodeURIComponent(params[k]) + "&";
	}
	var queryURL = baseURL + '?' + querypart;

	console.log(queryURL);
	
	var xhr = createCORSRequest('GET', queryURL);
	if (!xhr) {
		alert('CORS not supported');
		return;
	}
	// Response handlers.
	xhr.onload = function() {
		if (xhr.responseText) {
			console.log(xhr.responseText);
			var results = JSON.parse(xhr.responseText);
			var binding = results.results.bindings;
			// dataPoints = display(binding);
			// dataPoints = lineDisplay(binding);
			// dataPoints = polygonDisplay(binding);
			dataPoints = polyLineDisplay(binding);
			initTimemap(dataPoints);
		}
	};

	xhr.onerror = function() {
		alert('Woops, there was an error making the request.');
	};
	xhr.setRequestHeader('Access-Control-Allow-Origin', 'http://localhost:8080/');
	xhr.setRequestHeader('Accept', 'application/sparql-results+json');
	xhr.send();
}

// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}


function initTimemap(dataPoints) {
	// alert(dataPoints);
	SimileAjax.History.enabled = false;
	var tm = TimeMap.init({
        mapId: "map",               // Id of map div element (required)
        timelineId: "timeline",     // Id of timeline div element (required)
        options: {
            eventIconPath: "../images/"
        },
        datasets: [
            {
                theme: "blue",
                // note that the lines below are now the preferred syntax
                type: "basic",
                options: {
                    items: JSON.parse(dataPoints)
                }
            }
        ]
    });
}