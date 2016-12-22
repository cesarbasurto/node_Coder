 var socket = io(); 
 
 var GeoCode={
 	idSkt:'',
 	InitSocket:function (){
 		_this=this;
		socket.on('connect', function () {
		  socket.emit('usuario',{id:'usuario'}, function (data) {
		     _this.idSkt=data;
			if(window.location.pathname!="/"){ 
		    	//console.log("Peticion Inicio Mapa");
		    	$("#loading-mask").show();
		    	var dt=Func.DataLogin();
		    	$("#download-shp-btn").attr("href", "../shp/"+dt.id+"shape.zip");
		     	_this.InitMapData(); 
		    }
		     //console.log(GeoCode.idSkt);
		   });
		   socket.on('terminaCarga', function (data) {
		   		//console.log(data);
		   		if(data=="Directo"||data=="Inverso"){
					_this.InitMapData();	
		   		}else{
		   			Func.msjAlerta("Coordenada no valida");
		   		}
		   });
		   socket.on('erroresCarga', function (data) {
		   		if(data=="columnXY"){
					$("#loading-mask").hide();	
					Func.msjAlerta("No existen las columnas X,Y o ID");	
		   		}else if(data=="columnDir"){
					$("#loading-mask").hide();	
					Func.msjAlerta("No existe la columna direccion o ID");
		   		}
		   });
		   socket.on('SetJsonInverso', function (data) {
		   	 var json=Func.Decrypted(data);
		   	 $("#MasivoInversoModal").modal("hide");
		  	 //console.log(json);
		  	 if(json.get_geo_inversa.features ==null){
		   	 	$("#loading-mask").hide();
		   	 }else{
		   	 	buildGEO(json.get_geo_inversa);
		   	 		if(json.get_geo_inversa.features.length==1){
			   			if(json.get_geo_inversa.features[0].properties.estado=="Fallo"){
			   				Func.msjAlerta("No se encontro direccion");	
			   			}	
			   		}
		   	 }
		   });
		   socket.on('SetJsonDirecto', function (data) {
		   	 
		   	 var json=Func.Decrypted(data);
		   	 //console.log(json);
		   	 $("#MasivoDirectoModal").modal("hide");
		   	 	if(json.get_geo_directa.features==null){
			   	 	$("#loading-mask").hide();	
			   	}else{
			   		buildGEO(json.get_geo_directa);	
			   		if(json.get_geo_directa.features.length==1){
			   			if(json.get_geo_directa.features[0].properties.estado=="Fallo"){
			   				Func.msjAlerta("No se encontro direccion");	
			   			}	
			   		}
			   	}		
		   	 		  	 
		   });
		   socket.on('SetSinDatos', function () {
		   	 	$("#loading-mask").hide();
		   });
		});	
	},
	InitMapData:function(){
		_this=this;
		//console.log("realiza peticion");
		var DataAES =Func.Ecrypted(Func.DataLogin());
		socket.emit('GetJson',{idSkt:_this.idSkt,aes:DataAES});	
	},
	Init:function(){
		this.InitSocket();
		if(window.location.pathname=="/"){
			//console.log("sessionStorage.dt");
			//console.log(sessionStorage.dt);
			if (sessionStorage.dt) {
				window.location.assign(Config.NextLogin);
			}else{
				acceso.Init();
			}		
		}
	}	 
 }; 
 GeoCode.Init();
