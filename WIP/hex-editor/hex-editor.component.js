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
			self.formatEnemyData_Editor();
		}
		//
		//
		//
		self.updateMapData = function(){
			MapService.setTileData(self.formatData_Service(self.formattedMemoryString));
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
		self.formatData_Service = function(editorData){
			return editorData.replace(/ /g, '').replace(/,/g, '');
		}
		//
		self.formatEnemyData_Editor = function(){
			let serviceData = MapService.characterData();
			if(self.enemyString != serviceData){
				self.enemyString          = serviceData;
				self.formattedEnemyString = '';
				let hexValues             = self.enemyString.match(/[\s\S]{1,2}/g);
				for(let i=0;i<hexValues.length;i=i){
					//for now, just Space
					self.formattedEnemyString += hexValues[i];
					i+=1;
					self.formattedEnemyString += ' ';
				}
			}
			return self.formattedEnemyString;
		}
		//
		self.updateEnemyData = function(){
			MapService.setCharacterData(self.formatData_Service(self.formattedEnemyString));
			self.formatEnemyData_Editor();
		}
		//
		self.getOriginalCount = function(type){
			if('Character'){
				return MapService.getCharacterDataOriginalSize();
			}else{
				return MapService.getTileDataOriginalSize();
			}
		}
		self.getCurrentCount = function(type){
			if('Character'){
				return MapService.getCharacterDataCurrentSize();
			}else{
				return MapService.getTileDataCurrentSize();
			}
		}
	}
  });
