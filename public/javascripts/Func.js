var _0xe110=["","\x65\x6E\x63","\x63\x6C","\x64\x65\x63\x72\x79\x70\x74","\x41\x45\x53","\x70\x61\x72\x73\x65","\x73\x74\x72\x69\x6E\x67\x69\x66\x79","\x65\x6E\x63\x72\x79\x70\x74","\x64\x74","\x63\x6C\x65\x61\x72","\x2E\x2F","\x61\x73\x73\x69\x67\x6E","\x6C\x6F\x63\x61\x74\x69\x6F\x6E","\x70\x65\x72\x66\x69\x6C","\x67\x6C\x79\x70\x68\x69\x63\x6F\x6E\x20\x67\x6C\x79\x70\x68\x69\x63\x6F\x6E\x2D\x77\x61\x72\x6E\x69\x6E\x67\x2D\x73\x69\x67\x6E","\x20","\x64\x61\x6E\x67\x65\x72","\x61\x6E\x69\x6D\x61\x74\x65\x64\x20\x62\x6F\x75\x6E\x63\x65\x49\x6E","\x61\x6E\x69\x6D\x61\x74\x65\x64\x20\x62\x6F\x75\x6E\x63\x65\x4F\x75\x74","\x74\x6F\x70","\x63\x65\x6E\x74\x65\x72","\x6E\x6F\x74\x69\x66\x79","\x73\x75\x63\x63\x65\x73\x73","\x74\x6D\x70\x49\x64","\x74\x6D\x70\x4E\x6F\x6D","\x6E\x6F\x6D\x62\x72\x65","\x61\x70\x70\x65\x6E\x64","\x23\x6E\x6F\x6D\x62\x72\x65\x55\x73\x75\x61\x72\x69\x6F","\x41\x64\x6D\x69\x6E\x69\x73\x74\x72\x61\x64\x6F\x72","\x23\x70\x65\x72\x66\x69\x6C\x55\x73\x75\x61\x72\x69\x6F","\x55\x73\x75\x61\x72\x69\x6F"];var Func={Decrypted:function(_0x4930x2){if(_0x4930x3== _0xe110[0]){this.CerrarAPP();return false}else {var _0x4930x3=_0xe110[0];try{var _0x4930x3=JSON[_0xe110[5]](CryptoJS[_0xe110[4]][_0xe110[3]](_0x4930x2,Config[_0xe110[2]]).toString(CryptoJS[_0xe110[1]].Utf8))}catch(err){this.CerrarAPP();return false};return _0x4930x3}},Ecrypted:function(_0x4930x4){var _0x4930x5=CryptoJS[_0xe110[4]][_0xe110[7]](JSON[_0xe110[6]](_0x4930x4),Config[_0xe110[2]]);return _0x4930x5.toString()},DataLogin:function(){var _0x4930x6=this.Decrypted(sessionStorage[_0xe110[8]]);return _0x4930x6},CerrarAPP:function(){sessionStorage[_0xe110[9]]();window[_0xe110[12]][_0xe110[11]](_0xe110[10])},ValidaUsuario:function(){if(!sessionStorage[_0xe110[8]]){this.CerrarAPP()}else {var _0x4930x7=this.DataLogin();if(!_0x4930x7[_0xe110[13]]){this.CerrarAPP()}}},IntevaloLogin:function(){var _0x4930x8=this;_0x4930x8.ValidaUsuario();setInterval(function(){_0x4930x8.ValidaUsuario()},1000* 5)},msjAlerta:function(_0x4930x9){var _0x4930xa=$[_0xe110[21]]({icon:_0xe110[14],title:_0xe110[15],message:_0x4930x9},{type:_0xe110[16],timer:100,delay:3000,z_index:2061,animate:{enter:_0xe110[17],exit:_0xe110[18]},placement:{from:_0xe110[19],align:_0xe110[20]}})},msjExito:function(_0x4930x9){var _0x4930xa=$[_0xe110[21]]({icon:_0xe110[14],title:_0xe110[15],message:_0x4930x9},{type:_0xe110[22],timer:100,delay:3000,z_index:2061,animate:{enter:_0xe110[17],exit:_0xe110[18]},placement:{from:_0xe110[19],align:_0xe110[20]}})},setmpId:function(_0x4930xb){var _0x4930x6=this.Decrypted(sessionStorage[_0xe110[8]]);_0x4930x6[_0xe110[23]]= _0x4930xb;sessionStorage[_0xe110[8]]= Func.Ecrypted(_0x4930x6);return true},getmpId:function(){var _0x4930x6=this.Decrypted(sessionStorage[_0xe110[8]]);return _0x4930x6[_0xe110[23]]},setmpNom:function(_0x4930xc){var _0x4930x6=this.Decrypted(sessionStorage[_0xe110[8]]);_0x4930x6[_0xe110[24]]= _0x4930xc;sessionStorage[_0xe110[8]]= Func.Ecrypted(_0x4930x6);return true},getmpNom:function(){var _0x4930x6=this.Decrypted(sessionStorage[_0xe110[8]]);return _0x4930x6[_0xe110[24]]},setUsrMenu:function(){var _0x4930xd=this.DataLogin();$(_0xe110[27])[_0xe110[26]](_0x4930xd[_0xe110[25]]);if(_0x4930xd[_0xe110[13]]== 1){$(_0xe110[29])[_0xe110[26]](_0xe110[28])}else {$(_0xe110[29])[_0xe110[26]](_0xe110[30])}}}