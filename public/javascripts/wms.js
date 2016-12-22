var basemapIDESC =L.tileLayer.wms("http://idesc.cali.gov.co:8081/geoserver/wms", {
    layers: 'Mapa base',
    format: 'image/png',
    transparent: true,
    attribution: "IDESC",
    srs:'EPSG:4326'
});

var wmsMDE =L.tileLayer.wms("http://idesc.cali.gov.co:8081/geoserver/wms", {
    layers: 'raster:dem_modelo_elevacion_digital',
    format: 'image/png',
    transparent: true,
    attribution: "IDESC",
    srs:'EPSG:4326'
});

var wmsMicroZonSismica=L.tileLayer.wms("http://idesc.cali.gov.co:8081/geoserver/wms", {
    layers: 'idesc:mc_microzonificacion_sismica',
    format: 'image/png',
    transparent: true,
    attribution: "IDESC",
    srs:'EPSG:4326'
});


var wmsPerimetro =L.tileLayer.wms("http://idesc.cali.gov.co:8081/geoserver/wms", {
    layers: 'idesc:mc_perimetro_urbano_anno_2000',
    format: 'image/png',
    transparent: true,
    attribution: "IDESC",
    srs:'EPSG:4326'
});


var wmsLayers = {
	"Modelo Idgital de elevacion": wmsMDE,
	"Microzonificacion sismica": wmsMicroZonSismica,
	"Perimetro Urbano": wmsPerimetro
			
};