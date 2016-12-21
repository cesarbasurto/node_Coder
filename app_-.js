var ConfigModule = require('./Config.js');
var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var Converter = require("csvtojson").Converter;
var moment = require('moment');
var CryptoJS = require("crypto-js");
var pg = require('pg');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var cxPG=ConfigModule.GetPG();
var cxPort=ConfigModule.GetPort();

http.listen(cxPort, function() {
    console.log('Server listening on port '+cxPort);
});

var Config={
	cxPG :cxPG,
	claveAES:'1erf2a5f1e87g1'	
};


var Func={
	Decrypted:function (message) {
		var decrypted =JSON.parse(CryptoJS.AES.decrypt(message,Config.claveAES).toString(CryptoJS.enc.Utf8));
		return decrypted; 
	},
	Ecrypted:function (json){
		var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(json), Config.claveAES);
		return ciphertext.toString();
	}
};


var pool = new pg.Pool(Config.cxPG);

var dataReadCVS = {
	tituloID: function(fila) {
        var tx = undefined;
        var titulos = Object.keys(fila);
        for (var i = 0; i < titulos.length; i++) { console.log(titulos[i]);
            var t = titulos[i].toString().toUpperCase().trim();
            if (t == "IDENTIFICADOR") {
                tx = titulos[i];
                break;
            }
            if (t == "IDENT") {
                tx = titulos[i];
                break;
            }
            if (t == "ID") {
                tx = titulos[i];
                break;
            }
        }
        if (tx == undefined) { //console.log("Revisa valores");
            for (var i = 0; i < titulos.length; i++) {
                var t = fila[titulos[i]].toString().toUpperCase().trim();
               	if (t == "IDENTIFICADOR") {
	                tx = titulos[i];
	                break;
	            }
	            if (t == "IDENT") {
	                tx = titulos[i];
	                break;
	            }
	            if (t == "ID") {
	                tx = titulos[i];
	                break;
	            }
            }
        }
        return tx;
     },
	tituloDIR: function(fila) {
        var tx = undefined;
        var titulos = Object.keys(fila);
        for (var i = 0; i < titulos.length; i++) { //console.log(titulos[i]);
            var t = titulos[i].toString().toUpperCase().trim();
            if (t == "DIRECCION") {
                tx = titulos[i];
                break;
            }
            if (t == "DIRECC") {
                tx = titulos[i];
                break;
            }
            if (t == "DIREC") {
                tx = titulos[i];
                break;
            }
            if (t == "DRCN") {
                tx = titulos[i];
                break;
            }
            if (t == "DIR") {
                tx = titulos[i];
                break;
            }
        }
        if (tx == undefined) { //console.log("Revisa valores");
            for (var i = 0; i < titulos.length; i++) {
                var t = fila[titulos[i]].toString().toUpperCase().trim();
               	if (t == "DIRECCION") {
	                tx = titulos[i];
	                break;
	            }
	            if (t == "DIRECC") {
	                tx = titulos[i];
	                break;
	            }
	            if (t == "DIREC") {
	                tx = titulos[i];
	                break;
	            }
	            if (t == "DRCN") {
	                tx = titulos[i];
	                break;
	            }
	            if (t == "DIR") {
	                tx = titulos[i];
	                break;
	            }
            }
        }
        return tx;
    },
    tituloX: function(fila) {
        var tx = undefined;
        var titulos = Object.keys(fila);
        for (var i = 0; i < titulos.length; i++) { //console.log(titulos[i]);
            var t = titulos[i].toString().toUpperCase().trim();
            if (t == "X") {
                tx = titulos[i];
                break;
            }
            if (t == "CX") {
                tx = titulos[i];
                break;
            }
            if (t == "LON") {
                tx = titulos[i];
                break;
            }
            if (t == "LONG") {
                tx = titulos[i];
                break;
            }
            if (t == "LONGITUD") {
                tx = titulos[i];
                break;
            }
        }
        if (tx == undefined) { //console.log("Revisa valores");
            for (var i = 0; i < titulos.length; i++) {
                var t = fila[titulos[i]].toString().toUpperCase().trim();
                if (t == "X") {
                    tx = titulos[i];
                    break;
                }
                if (t == "CX") {
                    tx = titulos[i];
                    break;
                }
                if (t == "LON") {
                    tx = titulos[i];
                    break;
                }
                if (t == "LONG") {
                    tx = titulos[i];
                    break;
                }
                if (t == "LONGITUD") {
                    tx = titulos[i];
                    break;
                }
            }
        }
        return tx;
    },
    tituloY: function(fila) {
        var ty = undefined;
        var titulos = Object.keys(fila);
        for (var i = 0; i < titulos.length; i++) {
            var v = titulos[i].toString().toUpperCase().trim();
            if (v == "Y") {
                ty = titulos[i];
                break;
            }
            if (v == "CY") {
                ty = titulos[i];
                break;
            }
            if (v == "LAT") {
                ty = titulos[i];
                break;
            }
            if (v == "LATITUD") {
                ty = titulos[i];
                break;
            }
        }
        if (ty == undefined) {
            for (var i = 0; i < titulos.length; i++) {
                var v = fila[titulos[i]].toString().toUpperCase().trim();
                if (v == "Y") {
                    ty = titulos[i];
                    break;
                }
                if (v == "CY") {
                    ty = titulos[i];
                    break;
                }
                if (v == "LAT") {
                    ty = titulos[i];
                    break;
                }
                if (v == "LATITUD") {
                    ty = titulos[i];
                    break;
                }
            }
        }
        return ty;
    },
    leerArchivo: function(rutaArchivo, id_usr, srid,idSkt) {
        console.log(rutaArchivo);
        var converter = new Converter({
            constructResult: true,
            delimiter: ';',
            ignoreEmpty: true,
            checkColumn: true,
            noheader: false
        });
        converter.fromFile(rutaArchivo, function(err, jsonArray) {
            var contador = 0,contadorCol = 0; //console.log(jsonArray);
            if (jsonArray != undefined) {
                if (jsonArray.length > 0) {
                    var BreakException = {};
                    var headerX, headerY,headerID;
                    //ELIMINA GeoCode ANTERIOR DEL USUARIO
                    pool.query("DELETE FROM  t_geocode_tmp_inv WHERE id_usr = $1;", [id_usr],
                        function(err, result) {
                         if (err) return console.error('Error Eliminando datos cordenada', err);
						   	try {
						   		jsonArray.forEach(function(fila) {
		                            if (contadorCol == 0) { //console.log(fila);
		                                headerX = dataReadCVS.tituloX(fila); console.log("ColumnaX: "+headerX);
		                                headerY = dataReadCVS.tituloY(fila); console.log("ColumnaY: "+headerY);
		                                headerID = dataReadCVS.tituloID(fila); console.log("ColumnaY: "+headerID);
		                            } 
									if (headerX == undefined || headerY == undefined|| headerID == undefined){
										 io.to(idSkt).emit('erroresCarga', 'columnXY');
										 throw BreakException;		
										 									
									}else{
										contadorCol++;
			                            if (fila[headerX] != null && fila[headerY] != null) { //console.log("inserta");
			                                pool.query("INSERT INTO t_geocode_tmp_inv(id_usr, x, y,srid,id) VALUES ($1, $2, $3, $4, $5);", [id_usr, fila[headerX].toString().replace(",", "."), fila[headerY].toString().replace(",", "."), srid, fila[headerID]],
			                                    function(err, result) {
			                                        if (err) return console.error('Error insertando cordenada', err);
			                                        contador++;
			                                           
			                                        if(contador==jsonArray.length){
			                                        	var sql='INSERT INTO public.t_geocode_auditoria( tipo, fecha,id_usuario)'+
												   		"VALUES ('Inverso',now(), '"+id_usr+"')";
												   		pool.query(sql,function(err, resultInsert) {});
						                        		
			                                        	io.to(idSkt).emit('terminaCarga', 'Inverso');
			                                        }                                    
			                                    }); //console.log(fila);
			                            }		
									}

		                            		                        });
		                    } catch (e) {
		                        console.log(e);
		                        console.log("Archivo No Valido");
		                        if (e !== BreakException) throw e;
		                    }                        
                        
                        }
                    );

                    console.log("Json Archivo: " + moment().format('h:mm:s:SSSS'));
                    console.log("------------------------------------------------");
                }
            } else {
                console.log("No se pudo leer el archivo");
            }
        });
    },
    leerArchivoDirecto: function(rutaArchivo, id_usr, idSkt) {
        console.log(rutaArchivo);
        var converter = new Converter({
            constructResult: true,
            delimiter: ';',
            ignoreEmpty: true,
            checkColumn: true,
            noheader: false
        });
        converter.fromFile(rutaArchivo, function(err, jsonArray) {
            var contador = 0,contadorCol = 0; //console.log(jsonArray);
            if (jsonArray != undefined) {
                if (jsonArray.length > 0) {
                    var BreakException = {};
                    var headerDIR,headerID;
                    //ELIMINA GeoCode ANTERIOR DEL USUARIO
                    pool.query("DELETE FROM  t_geocode_tmp_dir WHERE id_usr = $1;", [id_usr],
                        function(err, result) {
                        if (err) return console.error('Error Eliminando datos cordenada', err);
                      	try {
                      		
	                        jsonArray.forEach(function(fila) {
	                            if (contadorCol == 0) { //console.log(fila);
	                                headerDIR = dataReadCVS.tituloDIR(fila); 
	                                headerID = dataReadCVS.tituloID(fila); 
	                            } 
		                        contadorCol++;
								if (headerDIR == undefined||headerID == undefined ){
									 io.to(idSkt).emit('erroresCarga', 'columnDir');
									 throw BreakException;		
								}else{
		                            if (fila[headerDIR] != null ) { //console.log("inserta");
		                                pool.query("INSERT INTO t_geocode_tmp_dir(id_usr, dir,id) VALUES ($1, $2, $3);", [id_usr, fila[headerDIR].toString(), fila[headerID]],
		                                    function(err, result) {
		                                        if (err) return console.error('Error insertando cordenada', err);
		                                        contador++;   
		                                        if(contador==jsonArray.length){
		                                        	var sql='INSERT INTO public.t_geocode_auditoria( tipo, fecha,id_usuario)'+
												   		"VALUES ('Directo',now(), '"+id_usr+"');";
												   		pool.query(sql,function(err, resultInsert) {});
							                    		
		                                        	io.to(idSkt).emit('terminaCarga', 'Directo');
		                                        }                                    
		                                    }); //console.log(fila);
		                            }
		                         }	
	                        });
	                    } catch (e) {
	                        console.log(e);
	                        console.log("Archivo No Valido");
	                        if (e !== BreakException) throw e;
	                    }
                      }
                    );
                    console.log("Json Archivo: " + moment().format('h:mm:s:SSSS'));
                    console.log("------------------------------------------------");
                }
            } else {
                console.log("No se pudo leer el archivo");
            }
        });
    }
    
};
var acceso={
	login:function(data){
		var dt=Func.Decrypted(data.aes);
		console.log(dt);
		var sql=' select id,nombre,perfil from public.t_usuario '+
			" where upper(usuario)=upper('"+dt.usr+"') and clave='"+dt.pas+"' and activo=1;";
		console.log(sql);	
		pool.query(sql,
            function(err, result) {
                if (err) {
                    return console.error('error running query', err);
                }               
                console.log(result.rows[0]);
                if(result.rows[0]){
		            var json=Func.Ecrypted(result.rows[0]);
		            
		            io.to(data.idSkt).emit('SetLoginUsuario', json);
                }else{
                	io.to(data.idSkt).emit('SetLoginUsuario', '');
                }
        });
	},
	CambioClave:function(data){
		var dt=Func.Decrypted(data.aes);
		console.log(dt);
		var sql='select id '+
		'from public.t_usuario '+
		"where id="+dt.id+" and clave='"+dt.pass+"' and activo=1 ";
		pool.query(sql,function(err, result) {
                if (err) {
                    return console.error('error running query', err);
                }               
                if(result.rows[0]){
                	var sql='update public.t_usuario '+
					" set clave='"+dt.pasnew+"' "+
					' where  id='+dt.id;
					console.log(sql);
					pool.query(sql,function(err, result) {
				    		var json=Func.Ecrypted({cambio:'ok'});    
		            		io.to(data.idSkt).emit('SetCambioUsuario', json);    	
				     });				    
                }else{
                	var json=Func.Ecrypted({cambio:'0'});
                	io.to(data.idSkt).emit('SetCambioUsuario', json);
                }
       });
	},
	getUsuarios:function(data){		//var dt=Func.Decrypted(data.aes);console.log(dt);
		var sql= "SELECT array_to_json(array_agg(d)) as datos FROM ( "+ 
					"SELECT COALESCE(row_to_json(t), '[]') as datos FROM "+
					"( " +
						"select u.id,u.nombre,usuario,u.clave,p.perfil,u.perfil id_perfil,activo id_activo,CASE WHEN (activo = 1) THEN 'Si' ELSE 'No' END AS activo "+
						"from t_usuario u inner join p_perfil p on u.perfil = p.id where u.perfil<>3 order by usuario"+
					")t"+
				")d";	//console.log(sql);
		pool.query(sql,
         function(err, res) {
                if (err) {
                    return console.error('error running query', err);
                }               
                io.to(data.idSkt).emit('Usrs', res.rows[0].datos);
        });
	},
	addUsuario:function(data){
		var dt=Func.Decrypted(data.aes);
		console.log(dt);
		var sql="INSERT INTO public.t_usuario (nombre,usuario,clave,activo,perfil) VALUES ('"+
		dt.nombre+"','"+dt.usuario+"','"+dt.clave+"','1','"+dt.perfil+"')";
		console.log(sql);	
		pool.query(sql,
         function(err, result) {
                if (err) {
					var json=Func.Ecrypted({resp:err});    
					io.to(data.idSkt).emit('setUsuarioResp', json);
                    return console.error('error running query', err);
                }               
				var json=Func.Ecrypted({resp:'ok'});    
				io.to(data.idSkt).emit('setUsuarioResp', json);
        });
	},
	updUsuario:function(data){
		var dt=Func.Decrypted(data.aes);
		console.log(dt);
		var sql="UPDATE public.t_usuario SET nombre='"+dt.nombre+"',usuario='"+dt.usuario+"',clave='"+dt.clave+"',activo='"+dt.activo+"',perfil='"+dt.perfil+"' WHERE id ='"+dt.id+"'";
		console.log(sql);	
		pool.query(sql,
         function(err, result) {
                if (err) {
					var json=Func.Ecrypted({resp:err});    
					io.to(data.idSkt).emit('updUsuarioResp', json);
                    return console.error('error running query', err);
                }               
				var json=Func.Ecrypted({resp:'ok'});    
				io.to(data.idSkt).emit('updUsuarioResp', json);
        });
	},
	delUsuario:function(data){
		var dt=Func.Decrypted(data.aes);
		console.log(dt);
		var sql="select activo from public.t_usuario WHERE id ='"+dt.id+"'";
		console.log(sql);	
		pool.query(sql,
        function(err, result) {
                if (err) {
					var json=Func.Ecrypted({resp:err});    
					io.to(data.idSkt).emit('delUsuarioResp', json);
                    return console.error('error running query', err);
                }          
                var sql='';     
                if(result.rows[0].activo=='1'){
                	sql="UPDATE public.t_usuario SET activo=0 WHERE id ='"+dt.id+"'";
                }else{
                	sql="UPDATE public.t_usuario SET activo=1 WHERE id ='"+dt.id+"'";
                }
				pool.query(sql,function(err, result) {
		                if (err) {
							var json=Func.Ecrypted({resp:err});    
							io.to(data.idSkt).emit('delUsuarioResp', json);
		                    return console.error('error running query', err);
		                }               
						var json=Func.Ecrypted({resp:'ok'});    
						io.to(data.idSkt).emit('delUsuarioResp', json);
		        });
				var json=Func.Ecrypted({resp:'ok'});    
				io.to(data.idSkt).emit('delUsuarioResp', json);
        });
		
 	}
};
var GeoCode={
	GetJson:function(data){
		_this=this;
		var dt=Func.Decrypted(data.aes);
		var sql="select tipo "+
		" from public.t_geocode_auditoria "+
		" where fecha=(select max(fecha) from public.t_geocode_auditoria where  id_usuario="+dt.id+");";
		console.log(sql);
		pool.query(sql,function(err, result) {
                if (err) {
                    return console.error('error running query', err);
                }
                
             if(result.rows[0]){
             	if(result.rows[0].tipo=="Inverso"){
             		_this.GetJsonInverso(data);
             	}else if(result.rows[0].tipo=="Directo"){
             		_this.GetJsonDirecto(data);
             	}             		
             }else{
             	io.to(data.idSkt).emit('SetSinDatos', 'no data');
             }
               
      });
	},
	GetJsonDirecto:function(data){
		var dt=Func.Decrypted(data.aes);
		var sql="select func.get_geo_directa('"+dt.id+"');";
		console.log(sql);
		pool.query(sql,function(err, result) {
                if (err) {
                    return console.error('error running query', err);
                } 
        		   console.log("devuelve datos");                 
                if(result.rows[0]){
                	var json=Func.Ecrypted(result.rows[0]);
                	console.log("devuelve datos Directo");
                	io.to(data.idSkt).emit('SetJsonDirecto', json);
                }else{
                	var json=Func.Ecrypted({cambio:'0'});
                	io.to(data.idSkt).emit('SetJsonDirecto', json);
                }
        });
	},
	GetJsonInverso:function(data){
		var dt=Func.Decrypted(data.aes);
		var sql="select func.get_geo_inversa('"+dt.id+"');";
		console.log(sql);
		pool.query(sql,function(err, result) {
                if (err) {
                    return console.error('error running query', err);
                } 
        		   console.log("devuelve datos");                 
                if(result.rows[0]){
                	var json=Func.Ecrypted(result.rows[0]);
                	console.log("devuelve datos Inveso");
                	io.to(data.idSkt).emit('SetJsonInverso', json);
                }else{
                	var json=Func.Ecrypted({cambio:'0'});
                	io.to(data.idSkt).emit('SetJsonInverso', json);
                }
        });
	},
	InitData:function(){
		app.use(express.static(path.join(__dirname, 'public')));

		app.get('/', function(req, res) {
		    res.sendFile(path.join(__dirname, 'views/index.html'));
		});
		app.get('/geo', function(req, res) {
		    res.sendFile(path.join(__dirname, 'views/geo.html'));
		});
		app.post('/uploadInverso/:id_usr/:srid/:idSkt', function(req, res) {
				var id_usr = req.params.id_usr;
			    console.log("Usuario: " + id_usr);
			    var srid = req.params.srid;
			    console.log("SRID: " + srid);
			    var idSkt = req.params.idSkt;
			    console.log("SRID: " + idSkt);
			
			    // create an incoming form object 
			    var form = new formidable.IncomingForm();
			    var rutaArchivo, nombreArchivo;
			
			    // specify that we want to allow the user to upload multiple files in a single request
			    form.multiples = true;
			
			    // store all uploads in the /uploads directory
			    form.uploadDir = path.join(__dirname, '/uploads');
			
			    // every time a file has been uploaded successfully,
			    // rename it to it's orignal name
			    form.on('file', function(field, file) {
			        fs.rename(file.path, path.join(form.uploadDir, file.name));
			        nombreArchivo = file.name;
			        rutaArchivo = path.join(form.uploadDir, nombreArchivo);
			    });
			
			    // log any errors that occur
			    form.on('error', function(err) {
			        console.log('An error has occured: \n' + err);
			    });
			
			    // once all the files have been uploaded, send a response to the client
			    form.on('end', function() {
			        res.end(nombreArchivo);
			        console.log(moment().format('h:mm:s:SSSS'));
			        setTimeout(function() {
			            dataReadCVS.leerArchivo(rutaArchivo, id_usr, srid,idSkt);
			        }, 100);
			    });
			
			    // parse the incoming request containing the form dataReadCVS
			    form.parse(req); //console.log(form.parse(req));
			
		});
		app.post('/uploadDirecto/:id_usr/:idSkt', function(req, res) {
				var id_usr = req.params.id_usr;
			    console.log("Usuario: " + id_usr);
			    var idSkt = req.params.idSkt;
			    console.log("idSkt: " + idSkt);
			
			    // create an incoming form object 
			    var form = new formidable.IncomingForm();
			    var rutaArchivo, nombreArchivo;
			
			    // specify that we want to allow the user to upload multiple files in a single request
			    form.multiples = true;
			
			    // store all uploads in the /uploads directory
			    form.uploadDir = path.join(__dirname, '/uploads');
			
			    // every time a file has been uploaded successfully,
			    // rename it to it's orignal name
			    form.on('file', function(field, file) {
			        fs.rename(file.path, path.join(form.uploadDir, file.name));
			        nombreArchivo = file.name;
			        rutaArchivo = path.join(form.uploadDir, nombreArchivo);
			    });
			
			    // log any errors that occur
			    form.on('error', function(err) {
			        console.log('An error has occured: \n' + err);
			    });
			
			    // once all the files have been uploaded, send a response to the client
			    form.on('end', function() {
			        res.end(nombreArchivo);
			        console.log(moment().format('h:mm:s:SSSS'));
			        setTimeout(function() {
			            dataReadCVS.leerArchivoDirecto(rutaArchivo, id_usr, idSkt);
			        }, 100);
			    });
			
			    // parse the incoming request containing the form dataReadCVS
			    form.parse(req); //console.log(form.parse(req));
			
		});

	},
	socket:[],
	InitSocket:function (){
		var _this=this;
		io.on('connection', function (sckt) {
		  console.log('conecta id');
		  console.log(sckt.id);
		  sckt.on('usuario', function (usr, fn) {
		    console.log(sckt.id);
		    fn(sckt.id);
		  });
		  sckt.on('LoginUsuario', function (data) {
		  	 console.log('LoginUsuario');
		     acceso.login(data);
		   });
		   
		   sckt.on('CambioPass', function (data) {
		  	 console.log('CambioPass');
		  	 console.log(data);
		     acceso.CambioClave(data);
		   });
		   sckt.on('GetJson', function (data) {
		   	 console.log("Ingresa a GetJson");
		  	 _this.GetJson(data);
		   });
		     sckt.on('listaUsuario', function (data) {
		  	 console.log('listaUsuario');	//console.log(data);
		     acceso.getUsuarios(data);
		   });
		   
		   sckt.on('setUsuario', function (data) {
		  	 console.log('setUsuario');	console.log(data);
		     acceso.addUsuario(data);
		   });
		   
		   sckt.on('updUsuario', function (data) {
		  	 console.log('updUsuario');	console.log(data);
		     acceso.updUsuario(data);
		   });
		   
		   sckt.on('delUsuario', function (data) {
		  	 console.log('delUsuario');	console.log(data);
		     acceso.delUsuario(data);
		   });
		   sckt.on('IndividualInv', function (data) {
		  	 _this.setIndInv(data);
		   });
		   sckt.on('IndividualDir', function (data) {
		  	 _this.setIndDir(data);
		   });
	});
	},
	setIndInv:function(data){
		_this=this;
		
		var dt=Func.Decrypted(data.aes);
		console.log(dt);
	    pool.query("DELETE FROM  t_geocode_tmp_inv WHERE id_usr = $1;", [dt.id],
	      function(err, result) {
        	if (err) return console.error('Error Eliminando datos cordenada', err);
	      		var sql='INSERT INTO public.t_geocode_auditoria( tipo, fecha,id_usuario)'+
		   		"VALUES ('Inverso',now(), '"+dt.id+"');";
		   		pool.query(sql,function(err, resultInsert) {});
	    		pool.query("INSERT INTO t_geocode_tmp_inv(id_usr, x, y,srid,id) VALUES ($1, $2, $3, $4, $5);", 
	    		[dt.id, dt.x, dt.y, dt.srid,'1'],
	            function(err, result) {
	                if (err) return console.error('Error insertando cordenada', err);
	                	io.to(data.idSkt).emit('terminaCarga', 'Inverso');
	            });
         });    
	},
	setIndDir:function(data){
		_this=this;
		var dt=Func.Decrypted(data.aes);
		console.log(dt);
	    pool.query("DELETE FROM  t_geocode_tmp_dir WHERE id_usr = $1;", [dt.id],
	      function(err, result) {
        	if (err) return console.error('Error Eliminando datos cordenada', err);
	      		var sql='INSERT INTO public.t_geocode_auditoria( tipo, fecha,id_usuario)'+
		   		"VALUES ('Directo',now(), '"+dt.id+"');";
		   		pool.query(sql,function(err, resultInsert) {});
		   		pool.query("INSERT INTO t_geocode_tmp_dir(id_usr, dir,id) VALUES ($1, $2, $3);"
		   		, [dt.id, dt.dir,'1'],	                                
	            function(err, result) {
	                if (err) return console.error('Error insertando cordenada', err);
	                	io.to(data.idSkt).emit('terminaCarga', 'Directo');
	            });
         });    
	},
	Init:function(){
		this.InitData();
		this.InitSocket();	
	}	
};

GeoCode.Init();

