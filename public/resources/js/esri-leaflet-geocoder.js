/*! esri-leaflet-geocoder - v1.0.2 - 2015-07-14
*   Copyright (c) 2015 Environmental Systems Research Institute, Inc.
*   Apache 2.0 License */

(function (factory) {
  // define an AMD module that relies on 'leaflet'
  if (typeof define === 'function' && define.amd) {
    define(['leaflet', 'esri-leaflet'], function (L, Esri) {
      return factory(L, Esri);
    });

  // define a common js module that relies on 'leaflet'
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('leaflet'), require('esri-leaflet'));
  }

  // define globals if we can find the proper place to attach them to.
  if(typeof window !== 'undefined' && window.L && window.L.esri) {
    factory(L, L.esri);
  }

}(function (L, Esri) {

var protocol="https:"===window.location.protocol?"https:":"http:",EsriLeafletGeocoding={WorldGeocodingService:protocol+"//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/",Tasks:{},Services:{},Controls:{}};if("undefined"!=typeof window&&window.L&&window.L.esri&&(window.L.esri.Geocoding=EsriLeafletGeocoding),!Esri)var Esri=window.L.esri;EsriLeafletGeocoding.Tasks.Geocode=Esri.Tasks.Task.extend({path:"find",params:{outSr:4326,forStorage:!1,outFields:"*",maxLocations:20},setters:{address:"address",neighborhood:"neighborhood",city:"city",subregion:"subregion",region:"region",postal:"postal",country:"country",text:"text",category:"category[]",token:"token",key:"magicKey",fields:"outFields[]",forStorage:"forStorage",maxLocations:"maxLocations"},initialize:function(a){a=a||{},a.url=a.url||EsriLeafletGeocoding.WorldGeocodingService,Esri.Tasks.Task.prototype.initialize.call(this,a)},within:function(a){return a=L.latLngBounds(a),this.params.bbox=Esri.Util.boundsToExtent(a),this},nearby:function(a,b){return a=L.latLng(a),this.params.location=a.lng+","+a.lat,this.params.distance=Math.min(Math.max(b,2e3),5e4),this},run:function(a,b){return this.path=this.params.text?"find":"findAddressCandidates","findAddressCandidates"===this.path&&this.params.bbox&&(this.params.searchExtent=this.params.bbox,delete this.params.bbox),this.request(function(c,d){var e="find"===this.path?this._processFindResponse:this._processFindAddressCandidatesResponse,f=c?void 0:e(d);a.call(b,c,{results:f},d)},this)},_processFindResponse:function(a){for(var b=[],c=0;c<a.locations.length;c++){var d,e=a.locations[c];e.extent&&(d=Esri.Util.extentToBounds(e.extent)),b.push({text:e.name,bounds:d,score:e.feature.attributes.Score,latlng:new L.LatLng(e.feature.geometry.y,e.feature.geometry.x),properties:e.feature.attributes})}return b},_processFindAddressCandidatesResponse:function(a){for(var b=[],c=0;c<a.candidates.length;c++){var d=a.candidates[c],e=Esri.Util.extentToBounds(d.extent);b.push({text:d.address,bounds:e,score:d.score,latlng:new L.LatLng(d.location.y,d.location.x),properties:d.attributes})}return b}}),EsriLeafletGeocoding.Tasks.geocode=function(a){return new EsriLeafletGeocoding.Tasks.Geocode(a)},EsriLeafletGeocoding.Tasks.ReverseGeocode=Esri.Tasks.Task.extend({path:"reverseGeocode",params:{outSR:4326},setters:{distance:"distance",language:"language"},initialize:function(a){a=a||{},a.url=a.url||EsriLeafletGeocoding.WorldGeocodingService,Esri.Tasks.Task.prototype.initialize.call(this,a)},latlng:function(a){return a=L.latLng(a),this.params.location=a.lng+","+a.lat,this},run:function(a,b){return this.request(function(c,d){var e;e=c?void 0:{latlng:new L.LatLng(d.location.y,d.location.x),address:d.address},a.call(b,c,e,d)},this)}}),EsriLeafletGeocoding.Tasks.reverseGeocode=function(a){return new EsriLeafletGeocoding.Tasks.ReverseGeocode(a)},EsriLeafletGeocoding.Tasks.Suggest=Esri.Tasks.Task.extend({path:"suggest",params:{},setters:{text:"text",category:"category"},initialize:function(a){a=a||{},a.url=a.url||EsriLeafletGeocoding.WorldGeocodingService,Esri.Tasks.Task.prototype.initialize.call(this,a)},within:function(a){a=L.latLngBounds(a),a=a.pad(.5);var b=a.getCenter(),c=a.getNorthWest();return this.params.location=b.lng+","+b.lat,this.params.distance=Math.min(Math.max(b.distanceTo(c),2e3),5e4),this.params.searchExtent=L.esri.Util.boundsToExtent(a),this},nearby:function(a,b){return a=L.latLng(a),this.params.location=a.lng+","+a.lat,this.params.distance=Math.min(Math.max(b,2e3),5e4),this},run:function(a,b){return this.request(function(c,d){a.call(b,c,d,d)},this)}}),EsriLeafletGeocoding.Tasks.suggest=function(a){return new EsriLeafletGeocoding.Tasks.Suggest(a)},EsriLeafletGeocoding.Services.Geocoding=Esri.Services.Service.extend({includes:L.Mixin.Events,initialize:function(a){a=a||{},a.url=a.url||EsriLeafletGeocoding.WorldGeocodingService,Esri.Services.Service.prototype.initialize.call(this,a),this._confirmSuggestSupport()},geocode:function(){return new EsriLeafletGeocoding.Tasks.Geocode(this)},reverse:function(){return new EsriLeafletGeocoding.Tasks.ReverseGeocode(this)},suggest:function(){return new EsriLeafletGeocoding.Tasks.Suggest(this)},_confirmSuggestSupport:function(){this.metadata(function(a,b){b.capabilities&&b.capabilities.includes("Suggest")?this.options.supportsSuggest=!0:this.options.supportsSuggest=!1},this)}}),EsriLeafletGeocoding.Services.geocoding=function(a){return new EsriLeafletGeocoding.Services.Geocoding(a)},EsriLeafletGeocoding.Controls.Geosearch=L.Control.extend({includes:L.Mixin.Events,options:{position:"topleft",zoomToResult:!0,useMapBounds:12,collapseAfterResult:!0,expanded:!1,forStorage:!1,allowMultipleResults:!0,useArcgisWorldGeocoder:!0,providers:[],placeholder:"Search for places or addresses",title:"Location Search",mapAttribution:"Geocoding by Esri"},initialize:function(a){if(L.Util.setOptions(this,a),this.options.useArcgisWorldGeocoder){var b=new EsriLeafletGeocoding.Controls.Geosearch.Providers.ArcGISOnline;this.options.providers.push(b)}if(this.options.maxResults)for(var c=0;c<this.options.providers.length;c++)this.options.providers[c].options.maxResults=this.options.maxResults;this._pendingSuggestions=[]},_geocode:function(a,b,c){var d,e=0,f=[],g=L.Util.bind(function(b,c){e--,c&&(f=f.concat(c)),0>=e&&(d=this._boundsFromResults(f),this.fire("results",{results:f,bounds:d,latlng:d?d.getCenter():void 0,text:a}),this.options.zoomToResult&&d&&this._map.fitBounds(d),L.DomUtil.removeClass(this._input,"geocoder-control-loading"),this.fire("load"),this.clear(),this._input.blur())},this);if(b)e++,c.results(a,b,this._searchBounds(),g);else for(var h=0;h<this.options.providers.length;h++)e++,this.options.providers[h].results(a,b,this._searchBounds(),g)},_suggest:function(a){L.DomUtil.addClass(this._input,"geocoder-control-loading");var b=this.options.providers.length,c=L.Util.bind(function(a,c){return L.Util.bind(function(d,e){var f;if(b-=1,this._input.value<2)return this._suggestions.innerHTML="",void(this._suggestions.style.display="none");if(e)for(f=0;f<e.length;f++)e[f].provider=c;if(c._lastRender!==a&&c.nodes){for(f=0;f<c.nodes.length;f++)c.nodes[f].parentElement&&this._suggestions.removeChild(c.nodes[f]);c.nodes=[]}if(e.length&&this._input.value===a){if(c.nodes)for(var g=0;g<c.nodes.length;g++)c.nodes[g].parentElement&&this._suggestions.removeChild(c.nodes[g]);c._lastRender=a,c.nodes=this._renderSuggestions(e)}0===b&&L.DomUtil.removeClass(this._input,"geocoder-control-loading")},this)},this);this._pendingSuggestions=[];for(var d=0;d<this.options.providers.length;d++){var e=this.options.providers[d],f=e.suggestions(a,this._searchBounds(),c(a,e));this._pendingSuggestions.push(f)}},_searchBounds:function(){return this.options.useMapBounds===!1?null:this.options.useMapBounds===!0?this._map.getBounds():this.options.useMapBounds<=this._map.getZoom()?this._map.getBounds():null},_renderSuggestions:function(a){var b;this._suggestions.style.display="block",this._suggestions.style.maxHeight=this._map.getSize().y-this._suggestions.offsetTop-this._wrapper.offsetTop-10+"px";for(var c,d,e=[],f=0;f<a.length;f++){var g=a[f];!d&&this.options.providers.length>1&&b!==g.provider.options.label&&(d=L.DomUtil.create("span","geocoder-control-header",this._suggestions),d.textContent=g.provider.options.label,d.innerText=g.provider.options.label,b=g.provider.options.label,e.push(d)),c||(c=L.DomUtil.create("ul","geocoder-control-list",this._suggestions));var h=L.DomUtil.create("li","geocoder-control-suggestion",c);h.innerHTML=g.text,h.provider=g.provider,h["data-magic-key"]=g.magicKey}return e.push(c),e},_boundsFromResults:function(a){if(a.length){for(var b=new L.LatLngBounds([0,0],[0,0]),c=new L.LatLngBounds,d=a.length-1;d>=0;d--){var e=a[d];e.bounds&&e.bounds.isValid()&&!e.bounds.equals(b)&&c.extend(e.bounds),c.extend(e.latlng)}return c}},clear:function(){this._suggestions.innerHTML="",this._suggestions.style.display="none",this._input.value="",this.options.collapseAfterResult&&(this._input.placeholder="",L.DomUtil.removeClass(this._wrapper,"geocoder-control-expanded")),!this._map.scrollWheelZoom.enabled()&&this._map.options.scrollWheelZoom&&this._map.scrollWheelZoom.enable()},onAdd:function(a){return this._map=a,a.attributionControl&&(this.options.useArcgisWorldGeocoder?a.attributionControl.addAttribution("Geocoding by Esri"):a.attributionControl.addAttribution(this.options.mapAttribution)),this._wrapper=L.DomUtil.create("div","geocoder-control "+(this.options.expanded?" geocoder-control-expanded":"")),this._input=L.DomUtil.create("input","geocoder-control-input leaflet-bar",this._wrapper),this._input.title=this.options.title,this._suggestions=L.DomUtil.create("div","geocoder-control-suggestions leaflet-bar",this._wrapper),L.DomEvent.addListener(this._input,"focus",function(a){this._input.placeholder=this.options.placeholder,L.DomUtil.addClass(this._wrapper,"geocoder-control-expanded")},this),L.DomEvent.addListener(this._wrapper,"click",function(a){L.DomUtil.addClass(this._wrapper,"geocoder-control-expanded"),this._input.focus()},this),L.DomEvent.addListener(this._suggestions,"mousedown",function(a){var b=a.target||a.srcElement;this._geocode(b.innerHTML,b["data-magic-key"],b.provider),this.clear()},this),L.DomEvent.addListener(this._input,"blur",function(a){this.clear()},this),L.DomEvent.addListener(this._input,"keydown",function(a){L.DomUtil.addClass(this._wrapper,"geocoder-control-expanded");for(var b,c=this._suggestions.querySelectorAll(".geocoder-control-suggestion"),d=this._suggestions.querySelectorAll(".geocoder-control-selected")[0],e=0;e<c.length;e++)if(c[e]===d){b=e;break}switch(a.keyCode){case 13:d?(this._geocode(d.innerHTML,d["data-magic-key"],d.provider),this.clear()):this.options.allowMultipleResults?(this._geocode(this._input.value,void 0),this.clear()):L.DomUtil.addClass(c[0],"geocoder-control-selected"),L.DomEvent.preventDefault(a);break;case 38:d&&L.DomUtil.removeClass(d,"geocoder-control-selected");var f=c[b-1];d&&f?L.DomUtil.addClass(f,"geocoder-control-selected"):L.DomUtil.addClass(c[c.length-1],"geocoder-control-selected"),L.DomEvent.preventDefault(a);break;case 40:d&&L.DomUtil.removeClass(d,"geocoder-control-selected");var g=c[b+1];d&&g?L.DomUtil.addClass(g,"geocoder-control-selected"):L.DomUtil.addClass(c[0],"geocoder-control-selected"),L.DomEvent.preventDefault(a);break;default:for(var h=0;h<this._pendingSuggestions.length;h++){var i=this._pendingSuggestions[h];i&&i.abort&&!i.id?i.abort():i.id&&window._EsriLeafletCallbacks[i.id].abort&&window._EsriLeafletCallbacks[i.id].abort()}}},this),L.DomEvent.addListener(this._input,"keyup",L.Util.limitExecByInterval(function(a){var b=a.which||a.keyCode,c=(a.target||a.srcElement).value;return c.length<2?(this._suggestions.innerHTML="",this._suggestions.style.display="none",void L.DomUtil.removeClass(this._input,"geocoder-control-loading")):27===b?(this._suggestions.innerHTML="",void(this._suggestions.style.display="none")):void(13!==b&&38!==b&&40!==b&&this._input.value!==this._lastValue&&(this._lastValue=this._input.value,this._suggest(c)))},50,this),this),L.DomEvent.disableClickPropagation(this._wrapper),L.DomEvent.addListener(this._suggestions,"mouseover",function(b){a.scrollWheelZoom.enabled()&&a.options.scrollWheelZoom&&a.scrollWheelZoom.disable()}),L.DomEvent.addListener(this._suggestions,"mouseout",function(b){!a.scrollWheelZoom.enabled()&&a.options.scrollWheelZoom&&a.scrollWheelZoom.enable()}),this._wrapper},onRemove:function(a){a.attributionControl.removeAttribution("Geocoding by Esri")}}),EsriLeafletGeocoding.Controls.geosearch=function(a){return new EsriLeafletGeocoding.Controls.Geosearch(a)},EsriLeafletGeocoding.Controls.Geosearch.Providers={},EsriLeafletGeocoding.Controls.Geosearch.Providers.ArcGISOnline=EsriLeafletGeocoding.Services.Geocoding.extend({options:{label:"Places and Addresses",maxResults:5},suggestions:function(a,b,c){var d=this.suggest().text(a);return b&&d.within(b),d.run(function(a,b,d){var e=[];if(!a)for(;d.suggestions.length&&e.length<=this.options.maxResults-1;){var f=d.suggestions.shift();f.isCollection||e.push({text:f.text,magicKey:f.magicKey})}c(a,e)},this)},results:function(a,b,c,d){var e=this.geocode().text(a);return b?e.key(b):e.maxLocations(this.options.maxResults),c&&e.within(c),this.options.forStorage&&e.forStorage(!0),e.run(function(a,b){d(a,b.results)},this)}}),EsriLeafletGeocoding.Controls.Geosearch.Providers.FeatureLayer=L.esri.Services.FeatureLayerService.extend({options:{label:"Feature Layer",maxResults:5,bufferRadius:1e3,formatSuggestion:function(a){return a.properties[this.options.searchFields[0]]}},initialize:function(a){a.url=L.esri.Util.cleanUrl(a.url),L.esri.Services.FeatureLayerService.prototype.initialize.call(this,a),L.Util.setOptions(this,a),"string"==typeof this.options.searchFields&&(this.options.searchFields=[this.options.searchFields])},suggestions:function(a,b,c){var d=this.query().where(this._buildQuery(a)).returnGeometry(!1);b&&d.intersects(b),this.options.idField&&d.fields([this.options.idField].concat(this.options.searchFields));var e=d.run(function(a,b,d){if(a)c(a,[]);else{this.options.idField=d.objectIdFieldName;for(var e=[],f=Math.min(b.features.length,this.options.maxResults),g=0;f>g;g++){var h=b.features[g];e.push({text:this.options.formatSuggestion.call(this,h),magicKey:h.id})}c(a,e.slice(0,this.options.maxResults).reverse())}},this);return e},results:function(a,b,c,d){var e=this.query();return b?e.featureIds([b]):e.where(this._buildQuery(a)),c&&e.within(c),e.run(L.Util.bind(function(a,b){for(var c=[],e=0;e<b.features.length;e++){var f=b.features[e];if(f){var g=this._featureBounds(f),h={latlng:g.getCenter(),bounds:g,text:this.options.formatSuggestion.call(this,f),properties:f.properties};c.push(h)}}d(a,c)},this))},_buildQuery:function(a){for(var b=[],c=this.options.searchFields.length-1;c>=0;c--){var d=this.options.searchFields[c];b.push(d+" LIKE '%"+a+"%'")}return b.join(" OR ")},_featureBounds:function(a){var b=L.geoJson(a);if("Point"===a.geometry.type){var c=b.getBounds().getCenter();return new L.Circle(c,this.options.bufferRadius).getBounds()}return b.getBounds()}}),EsriLeafletGeocoding.Controls.Geosearch.Providers.GeocodeService=EsriLeafletGeocoding.Services.Geocoding.extend({options:{label:"Geocode Server",maxResults:5},suggestions:function(a,b,c){if(this.options.supportsSuggest){var d=this.suggest().text(a);return b&&d.within(b),d.run(function(a,b,d){var e=[];if(!a)for(;d.suggestions.length&&e.length<=this.options.maxResults-1;){var f=d.suggestions.shift();f.isCollection||e.push({text:f.text,magicKey:f.magicKey})}c(a,e)},this)}return c(void 0,[]),!1},results:function(a,b,c,d){var e=this.geocode().text(a);return e.maxLocations(this.options.maxResults),c&&e.within(c),e.run(function(a,b){d(a,b.results)},this)}}),EsriLeafletGeocoding.Controls.Geosearch.Providers.MapService=L.esri.Services.MapService.extend({options:{layers:[0],label:"Map Service",bufferRadius:1e3,maxResults:5,formatSuggestion:function(a){return a.properties[a.displayFieldName]+" <small>"+a.layerName+"</small>"}},initialize:function(a){L.esri.Services.MapService.prototype.initialize.call(this,a),this._getIdFields()},suggestions:function(a,b,c){var d=this.find().text(a).fields(this.options.searchFields).returnGeometry(!1).layers(this.options.layers);return d.run(function(a,b,d){var e=[];if(!a){var f=Math.min(this.options.maxResults,b.features.length);d.results=d.results.reverse();for(var g=0;f>g;g++){var h=b.features[g],i=d.results[g],j=i.layerId,k=this._idFields[j];h.layerId=j,h.layerName=this._layerNames[j],h.displayFieldName=this._displayFields[j],k&&e.push({text:this.options.formatSuggestion.call(this,h),magicKey:i.attributes[k]+":"+j})}}c(a,e.reverse())},this)},results:function(a,b,c,d){var e,f=[];if(b){var g=b.split(":")[0],h=b.split(":")[1];e=this.query().layer(h).featureIds(g)}else e=this.find().text(a).fields(this.options.searchFields).contains(!1).layers(this.options.layers);return e.run(function(a,b,c){if(!a){c.results&&(c.results=c.results.reverse());for(var e=0;e<b.features.length;e++){var g=b.features[e];if(h=h?h:c.results[e].layerId,g&&void 0!==h){var i=this._featureBounds(g);this._idFields[h];g.layerId=h,g.layerName=this._layerNames[h],g.displayFieldName=this._displayFields[h];var j={latlng:i.getCenter(),bounds:i,text:this.options.formatSuggestion.call(this,g),properties:g.properties};f.push(j)}}}d(a,f.reverse())},this)},_featureBounds:function(a){var b=L.geoJson(a);if("Point"===a.geometry.type){var c=b.getBounds().getCenter();return new L.Circle(c,this.options.bufferRadius).getBounds()}return b.getBounds()},_layerMetadataCallback:function(a){return L.Util.bind(function(b,c){this._displayFields[a]=c.displayField,this._layerNames[a]=c.name;for(var d=0;d<c.fields.length;d++){var e=c.fields[d];if("esriFieldTypeOID"===e.type){this._idFields[a]=e.name;break}}},this)},_getIdFields:function(){this._idFields={},this._displayFields={},this._layerNames={};for(var a=0;a<this.options.layers.length;a++){var b=this.options.layers[a];this.get(b,{},this._layerMetadataCallback(b))}}});
//# sourceMappingURL=esri-leaflet-geocoder.js.map

  return EsriLeafletGeocoding;
}));
