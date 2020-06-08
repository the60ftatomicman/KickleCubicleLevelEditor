'use strict';
angular.module('hexEditor', ['MapService']);
angular.
  module('hexEditor').
  component('hexEditor', {
    templateUrl: 'hex-editor/hex-editor.template.html',
    controller : function HexEditorController(MapService) {
		var self                   = this;
		self.memoryString          = undefined;
		self.formattedMemoryString = '';
		self.memoryLocation        = {start:undefined,end:undefined};
		self.enemyString           = undefined;
		self.formattedEnemyString  = '';
		self.enemyLocation         = {start:undefined,end:undefined};
		//
		//
		//
		self.$onInit = function () {
			self.formatMapData_Editor();
			self.formatEnemyData_Editor();
		}
		//
		//
		//
		self.formatMapData_Editor = function(newData){
			if(!!newData){
                MapService.setTileData(self.formatData_Service(newData));
			}else{
				let serviceData = MapService.tileData();
				if(serviceData != undefined && self.memoryString != serviceData){
					self.memoryString          = serviceData;
					self.formattedMemoryString = '';
					self.memoryLocation        = MapService.mapData.memoryAddress.tile;
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
			}
			return self.formattedMemoryString;
		}
		//
		self.formatData_Service = function(editorData){
			return editorData.replace(/ /g, '').replace(/,/g, '');
		}
		//
		self.formatEnemyData_Editor = function(newData){
			if(!!newData){
                MapService.setCharacterData(self.formatData_Service(newData));
			}else{
				let serviceData = MapService.characterData();
				if(serviceData != undefined && self.enemyString != serviceData){
					self.enemyString          = serviceData;
					self.formattedEnemyString = '';
					self.enemyLocation        = MapService.mapData.memoryAddress.character;
					let hexValues             = self.enemyString.match(/[\s\S]{1,2}/g);
					for(let i=0;i<hexValues.length;i=i){
						//for now, just Space
						self.formattedEnemyString += hexValues[i];
						i+=1;
						self.formattedEnemyString += ' ';
					}
				}
			}
			return self.formattedEnemyString;	
		}
		//
		self.getOriginalCount = function(type){
			if(type == 'Character'){
				return MapService.getCharacterDataOriginalSize();
			}else{
				return MapService.getTileDataOriginalSize();
			}
		}
		//
		self.getCurrentCount = function(type){
			if(type == 'Character'){
				return MapService.getCharacterDataCurrentSize();
			}else{
				return MapService.getTileDataCurrentSize();
			}
		}
		self.resetText = function(type){
			if(type == 'Character'){
				return MapService.resetCharacterData();
			}else{
				return MapService.resetTileData();
			}
		}
		
		//
		self.hasEnoughHexDataDefined = function(type){
			return self.getOriginalCount(type) != self.getCurrentCount(type);
		}
		//
		self.tilesDefined = function(){
					let hexValues     = self.memoryString.match(/[\s\S]{1,2}/g);
			let tileCount     = 0;
			for(let i=0;i<hexValues.length;i=i){
				let isGroup = parseInt(hexValues[i].charAt(0),16) > 7;
				let nextHex = hexValues[i+1];
				if(isGroup && nextHex){ 
					tileCount+=parseInt(nextHex,16)+1;
					i+=2;
				}else{
					tileCount++;
					i+=1;
				}
			}
			return tileCount;	
		}
	}
  });
