'use strict';
angular.module('hexEditor', ['MapService']);
angular.
  module('hexEditor').
  component('hexEditor', {
    templateUrl: 'hex-editor/hex-editor.template.html',
    controller : function HexEditorController(MapService) {
		var self                   = this;
		self.memoryString          = '';
		self.formattedMemoryString = '';
		self.enemyString           = '';
		self.formattedEnemyString  = '';
		//
		//
		//
		self.$onInit = function () {
			self.formatMapData_Editor();
		}
		//
		//
		//
		self.updateMapData = function(){
			MapService.setTileData(self.formatMapData_Service());
			self.formatMapData_Editor();
		}
		//
		self.formatMapData_Editor = function(){
			let serviceData = MapService.tileData();
			if(self.memoryString != serviceData){
				self.memoryString          = serviceData;
				self.formattedMemoryString = '';
				let hexValues              = self.memoryString.match(/[\s\S]{1,2}/g);
				for(let i=0;i<hexValues.length;i=i){
					let isGroup = parseInt(hexValues[i].charAt(0),16) > 7;
					let nextHex = hexValues[i+1];
					if(isGroup && nextHex){ 
						self.formattedMemoryString += hexValues[i]+','+nextHex	
						i+=2;
					}else{
						self.formattedMemoryString += hexValues[i];
						i+=1;
					}
					self.formattedMemoryString += ' ';
				}
			}
			return self.formattedMemoryString;
		}
		//
		self.formatMapData_Service = function(){
			console.log(self.formattedMemoryString.replace(/ /g, '').replace(/,/g, ''));
			return self.formattedMemoryString.replace(/ /g, '').replace(/,/g, '');
		}
		//
		self.getDesiredHexCount = function(){
			return self.memoryString.match(/[\s\S]{1,2}/g).length;
		}
		//
		self.getCurrentHexCount = function(){
			return self.memoryString.match(/[\s\S]{1,2}/g).length;
		}
	}
  });
