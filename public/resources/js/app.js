
 var config = {
  //geojson: "http://localhost/geoCODE/data/data.geojson",
  geojson: "",
  title: "GeoCODE",
  layerName: "Puntos Georreferenciados",
  hoverProperty: "via_principal",
  sortProperty: "",
  sortOrder: "desc"
};	

$(function() {
	  $(".title").html(config.title);
	  $("#layer-name").html(config.layerName);
	});
	
// Basemap Layers

var basemapOSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

var mapESRISat =  L.tileLayer(
            'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; <a href="http://www.esri.com/">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 17,
            });

var mapESRIStreet =  L.tileLayer(
            'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; <a href="http://www.esri.com/">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 19,
            });			



	$("#loading-mask").hide();
	 switchView("map");
	var map = L.map('map', {
		center: [3.4319329, -76.5113047],
		layers: [basemapOSM],
		zoom: 12
	});
	// Larger screens get expanded layer control
	// Larger screens get expanded layer control
	if (document.body.clientWidth <= 767) {
		isCollapsed = true;
	} else {
		isCollapsed = false;
	}
	var baseLayers = {
		"Open Street Map": basemapOSM,
		"ESRI Street Map": mapESRIStreet,
		"ESRI Imagery": mapESRISat
	};
	
	var layerControl = L.control.layers(baseLayers).addTo(map);

	
function buildGEO(){
	$("#loading-mask").show();
	console.log("hay geojson");
	
	var highlightLayer = L.geoJson(null, {
	pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, {
		  radius: 5,
		  color: "#FFF",
		  weight: 2,
		  opacity: 1,
		  fillColor: "#00FFFF",
		  fillOpacity: 1,
		  clickable: false
		});
	},
	style: function (feature) {
	return {
		  color: "#00FFFF",
		  weight: 2,
		  opacity: 1,
		  fillColor: "#00FFFF",
		  fillOpacity: 0.5,
		  clickable: false
		};
	}
	});			
			
			
	var featureLayer = L.geoJson(null, {
		filter: function(feature, layer) {
			return feature.geometry.coordinates[0] !== 0 && feature.geometry.coordinates[1] !== 0;
		},
		style: function (feature) {
			return {
			  color: feature.properties.color
			};
		},
		pointToLayer: function (feature, latlng) {
			if (feature.properties && feature.properties["marker-color"]) {
			  markerColor = feature.properties["marker-color"];
			} else {
			  markerColor = "#F75000";
			}
			return L.circleMarker(latlng, {
			  radius: 4,
			  weight: 2,
			  fillColor: markerColor,
			  color: markerColor,
			  opacity: 1,
			  fillOpacity: 1
			});
		},
		onEachFeature: function (feature, layer) {
			if (feature.properties) {
			  layer.on({
				click: function (e) {
				  identifyFeature(L.stamp(layer));
				  highlightLayer.clearLayers();
				  highlightLayer.addData(featureLayer.getLayer(L.stamp(layer)).toGeoJSON());
				},
				mouseover: function (e) {
				  if (config.hoverProperty) {
					$(".info-control").html(feature.properties[config.hoverProperty]);
					$(".info-control").show();
				  }
				},
				mouseout: function (e) {
				  $(".info-control").hide();
				}
			  });
			}
		}
	});
	var loadGeojson=function (data) {
	 ///console.log(data);
	  geojson = data;
	  features = $.map(geojson.features, function(feature) {
	    return feature.properties;
	  });
	  featureLayer.clearLayers(); 
	  featureLayer.addData(data);
	  buildConfig();
	  $("#loading-mask").hide();
	};
	// Fetch the GeoJSON file
	
	featureLayer.addTo(map);
/*
	var map = L.map("map", {
		layers: [basemapOSM, featureLayer, highlightLayer]
	}).fitWorld();

	
		// Info control
	var info = L.control({
		position: "bottomleft"
	});

	// Custom info hover control
	info.onAdd = function (map) {
		this._div = L.DomUtil.create("div", "info-control");
		this.update();
		return this._div;
	};
	info.update = function (props) {
		this._div.innerHTML = "";
	};
	info.addTo(map);
	$(".info-control").hide();
*/


	 
	/*
	var overlayLayers = {
		"<span id='layer-name'>Puntos GeoCODE</span>": featureLayer
	};
	
	var layerControl = L.control.layers(baseLayers, overlayLayers, {
		collapsed: isCollapsed
	}).addTo(map);
	*/
	// Filter table to only show features in current map bounds
	map.on("moveend", function (e) {
		syncTable();
	});

	map.on("click", function(e) {
		highlightLayer.clearLayers();
	});		
	
	var properties = [{
	  value: "via_principal",
	  label: "Vía Principal",
	  table: {
		visible: true,
		sortable: true
	  },
	  filter: {
		type: "string"
	  },
	  info: true
	},
	{
	  value: "via_generadora",
	  label: "Vía Generadora",
	  table: {
		visible: true,
		sortable: true
	  },
	  filter: {
		type: "string"
	  }
	},
	{
	  value: "placa",
	  label: "Placa",
	  table: {
		visible: true,
		sortable: true
	  },
	  filter: {
		type: "string",
		operators: ["in", "not_in", "equal", "not_equal"]
	  }
	},
	{
	  value: "barrio",
	  label: "Barrio",
	  table: {
		visible: true,
		sortable: true
	  },
	  filter: {
		type: "string",
		input: "checkbox",
		vertical: true,
		multiple: true,
		operators: ["in", "not_in", "equal", "not_equal"],
		values: []
	  }
	},
	{
	  value: "comuna",
	  label: "Comuna",
	  table: {
		visible: false,
		sortable: true
	  },
	  filter: {
		type: "string",
		input: "checkbox",
		vertical: true,
		multiple: true,
		operators: ["in", "not_in", "equal", "not_equal"],
		values: []
	  }
	},
	{
	  value: "longitud",
	  label: "Longitud",
	  table: {
		visible: true,
		sortable: true
	  },
	  filter: {
		type: "double"
	  }
	},
	{
	  value: "latitud",
	  label: "Latitud",
	  table: {
		visible: true,
		sortable: true
	  },
	  filter: {
		type: "double"
	  }
	},
	{
	  value: "x_magna",
	  label: "Coord x (Magna)",
	  table: {
		visible: false,
		sortable: true
	  },
	  filter: {
		type: "double"
	  }
	},
	{
	  value: "y_magna",
	  label: "Coord y (Magna)",
	  table: {
		visible: false,
		sortable: true
	  },
	  filter: {
		type: "double"
	  }
	}];

/*Charts
	function drawCharts() {
	  // Barrios
	  $(function() {
		var result = alasql("SELECT barrio AS label, COUNT(*) AS total FROM ? GROUP BY barrio", [features]);
		var columns = $.map(result, function(barrio) {
		  return [[barrio.label, barrio.total]];
		});
		var chart = c3.generate({
			bindto: "#barrio-chart",
			data: {
			  type: "pie",
			  columns: columns
			}
		});
	  });


  // Comunas
  $(function() {
    var result = alasql("SELECT comuna AS label, COUNT(*) AS total FROM ? GROUP BY comuna ORDER BY label ASC", [features]);
    var chart = c3.generate({
        bindto: "#comuna-chart",
        size: {
          height: 2000
        },
        data: {
          json: result,
          keys: {
            x: "label",
            value: ["total"]
          },
          type: "bar"
        },
        axis: {
          rotated: true,
          x: {
            type: "category"
          }
        },
        legend: {
          show: false
        }
    });
  });
}
*/


	function buildConfig() {
	  filters = [];
	  table = [{
		field: "action",
		title: "<i class='fa fa-gear'></i>&nbsp;Action",
		align: "center",
		valign: "middle",
		width: "75px",
		cardVisible: false,
		switchable: false,
		formatter: function(value, row, index) {
		  return [
			'<a class="zoom" href="javascript:void(0)" title="Acercar" style="margin-right: 10px;">',
			  '<i class="fa fa-search-plus"></i>',
			'</a>',
			'<a class="identify" href="javascript:void(0)" title="Identificar">',
			  '<i class="fa fa-info-circle"></i>',
			'</a>'
		  ].join("");
		},
		events: {
		  "click .zoom": function (e, value, row, index) {
			map.fitBounds(featureLayer.getLayer(row.leaflet_stamp).getBounds());
			highlightLayer.clearLayers();
			highlightLayer.addData(featureLayer.getLayer(row.leaflet_stamp).toGeoJSON());
		  },
		  "click .identify": function (e, value, row, index) {
			identifyFeature(row.leaflet_stamp);
			highlightLayer.clearLayers();
			highlightLayer.addData(featureLayer.getLayer(row.leaflet_stamp).toGeoJSON());
		  }
		}
	  }];



	  $.each(properties, function(index, value) {
		// Filter config
		if (value.filter) {
		  var id;
		  if (value.filter.type == "integer") {
			id = "cast(properties->"+ value.value +" as int)";
		  }
		  else if (value.filter.type == "double") {
			id = "cast(properties->"+ value.value +" as double)";
		  }
		  else {
			id = "properties->" + value.value;
		  }
		  filters.push({
			id: id,
			label: value.label
		  });
		  $.each(value.filter, function(key, val) {
			if (filters[index]) {
			  // If values array is empty, fetch all distinct values
			  if (key == "values" && val.length === 0) {
				alasql("SELECT DISTINCT(properties->"+value.value+") AS field FROM ? ORDER BY field ASC", [geojson.features], function(results){
				  distinctValues = [];
				  $.each(results, function(index, value) {
					distinctValues.push(value.field);
				  });
				});
				filters[index].values = distinctValues;
			  } else {
				filters[index][key] = val;
			  }
			}
		  });
		}
		// Table config
		if (value.table) {
		  table.push({
			field: value.value,
			title: value.label
		  });
		  $.each(value.table, function(key, val) {
			if (table[index+1]) {
			  table[index+1][key] = val;
			}
		  });
		}
	  });

	  buildFilters();
	  buildTable();
	}
	
	
	// Table formatter to make links clickable
	function urlFormatter (value, row, index) {
	  if (typeof value == "string" && (value.indexOf("http") === 0 || value.indexOf("https") === 0)) {
		return "<a href='"+value+"' target='_blank'>"+value+"</a>";
	  }
	}

	function buildFilters() {
	  $("#query-builder").queryBuilder({
		allow_empty: true,
		filters: filters
	  });
	}

	function applyFilter() {
	  var query = "SELECT * FROM ?";
	  var sql = $("#query-builder").queryBuilder("getSQL", false, false).sql;
	  if (sql.length > 0) {
		query += " WHERE " + sql;
	  }
	  alasql(query, [geojson.features], function(features){
			featureLayer.clearLayers();
			featureLayer.addData(features);
			syncTable();
		});
	}

	function buildTable() {
	  $("#table").bootstrapTable({
		cache: false,
		height: $("#table-container").height(),
		undefinedText: "",
		striped: false,
		pagination: false,
		minimumCountColumns: 1,
		sortName: config.sortProperty,
		sortOrder: config.sortOrder,
		toolbar: "#toolbar",
		search: true,
		trimOnSearch: false,
		showColumns: true,
		showToggle: true,
		columns: table,
		onClickRow: function (row) {
		  // do something!
		},
		onDblClickRow: function (row) {
		  // do something!
		}
	  });

	  map.fitBounds(featureLayer.getBounds());

	  $(window).resize(function () {
		$("#table").bootstrapTable("resetView", {
		  height: $("#table-container").height()
		});
	  });
	}

	function syncTable() {
	  tableFeatures = [];
	  featureLayer.eachLayer(function (layer) {
		layer.feature.properties.leaflet_stamp = L.stamp(layer);
		if (map.hasLayer(featureLayer)) {
		 // if (map.getBounds().contains(layer.getBounds())) {
			tableFeatures.push(layer.feature.properties);
		 // }
		}
	  });
	  $("#table").bootstrapTable("load", JSON.parse(JSON.stringify(tableFeatures)));
	  var featureCount = $("#table").bootstrapTable("getData").length;
	  if (featureCount == 1) {
		$("#feature-count").html($("#table").bootstrapTable("getData").length + " visible feature");
	  } else {
		$("#feature-count").html($("#table").bootstrapTable("getData").length + " visible features");
	  }
	}

	function identifyFeature(id) {
	  var featureProperties = featureLayer.getLayer(id).feature.properties;
	  var content = "<table class='table table-striped table-bordered table-condensed'>";
	  $.each(featureProperties, function(key, value) {
		if (!value) {
		  value = "";
		}
		if (typeof value == "string" && (value.indexOf("http") === 0 || value.indexOf("https") === 0)) {
		  value = "<a href='" + value + "' target='_blank'>" + value + "</a>";
		}
		$.each(properties, function(index, property) {
		  if (key == property.value) {
			if (property.info !== false) {
			  content += "<tr><th>" + property.label + "</th><td>" + value + "</td></tr>";
			}
		  }
		});
	  });
	  content += "<table>";
	  $("#feature-info").html(content);
	  $("#featureModal").modal("show");
	}

	
	$("#filter-btn").click(function() {
	  $("#filterModal").modal("show");
	  $(".navbar-collapse.in").collapse("hide");
	  return false;
	});


	$("#view-sql-btn").click(function() {
	  alert($("#query-builder").queryBuilder("getSQL", false, false).sql);
	});

	$("#apply-filter-btn").click(function() {
	  applyFilter();
	});

	$("#reset-filter-btn").click(function() {
	  $("#query-builder").queryBuilder("reset");
	  applyFilter();
	});
		
	$("#download-csv-btn").click(function() {
	  $("#table").tableExport({
		type: "csv",
		ignoreColumn: [0],
		fileName: "data"
	  });
	  $(".navbar-collapse.in").collapse("hide");
	  return false;
	});

	$("#download-excel-btn").click(function() {
	  $("#table").tableExport({
		type: "excel",
		ignoreColumn: [0],
		fileName: "data"
	  });
	  $(".navbar-collapse.in").collapse("hide");
	  return false;
	});

	$("#download-pdf-btn").click(function() {
	  $("#table").tableExport({
		type: "pdf",
		ignoreColumn: [0],
		fileName: "data",
		jspdf: {
		  format: "bestfit",
		  margins: {
			left: 20,
			right: 10,
			top: 20,
			bottom: 20
		  },
		  autotable: {
			extendWidth: false,
			overflow: "linebreak"
		  }
		}
	  });
	  $(".navbar-collapse.in").collapse("hide");
	  return false;
	});

	/*
	$("#chartModal").on("shown.bs.modal", function (e) {
	  drawCharts();
	});
	*/
	$("#extent-btn").click(function() {
	  map.fitBounds(featureLayer.getBounds());
	  $(".navbar-collapse.in").collapse("hide");
	  return false;
	});
	
}


function switchView(view) {
  if (view == "split") {
    $("#view").html("Vista Dividida");
    location.hash = "#split";
    $("#table-container").show();
    $("#table-container").css("height", "55%");
    $("#map-container").show();
    $("#map-container").css("height", "45%");
    $(window).resize();
    if (map) {
      map.invalidateSize();
    }
  } else if (view == "map") {
    $("#view").html("Vista de Mapa");
    location.hash = "#map";
    $("#map-container").show();
    $("#map-container").css("height", "100%");
    $("#table-container").hide();
    if (map) {
      map.invalidateSize();
    }
  } else if (view == "table") {
    $("#view").html("Vista de Tabla");
    location.hash = "#table";
    $("#table-container").show();
    $("#table-container").css("height", "100%");
    $("#map-container").hide();
    $(window).resize();
  }
}

$("[name='view']").click(function() {
  $(".in,.open").removeClass("in open");
  if (this.id === "map-graph") {
    switchView("split");
    return false;
  } else if (this.id === "map-only") {
    switchView("map");
    return false;
  } else if (this.id === "graph-only") {
    switchView("table");
    return false;
  }
});

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});






$("[name='geoCODE']").click(function() {
  $(".in,.open").removeClass("in open");
  if (this.id === "geo-dir") {
	switchView("split");
	config.geojson= "http://localhost/geoCODE/data/data.geojson";
	buildGEO();
    return false;
  } else if (this.id === "geo-inv") {
    switchView("split");
	config.geojson= "http://localhost/geoCODE/data/data.geojson";
	buildGEO();
    return false;
  } 
});




var tabsFn = (function() {
  
  function init() {
    setHeight();
  }
  
  function setHeight() {
    var $tabPane = $('.tab-pane'),
        tabsHeight = $('.nav-tabs').height();
    
    $tabPane.css({
      height: tabsHeight
    });
  }
    
  $(init);
})();
