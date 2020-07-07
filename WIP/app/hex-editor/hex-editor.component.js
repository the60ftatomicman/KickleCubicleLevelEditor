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
		self.memoryNextState       = 'Simple';
		self.enemyString           = undefined;
		self.formattedEnemyString  = '';
		self.enemyLocation         = {start:undefined,end:undefined};
		self.enemyNextState        = 'Simple';
		self.characterSpawns       = undefined;
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
				self.formattedMemoryString = newData;
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
			return editorData.replace(/ /g, '').replace(/,/g, '').toUpperCase();
		}
		//
		self.formatEnemyData_Editor = function(newData){
			if(!!newData){
                MapService.setCharacterData(self.formatData_Service(newData));
				self.formattedEnemyString = newData;
			}else{
				let serviceData = MapService.characterData();
				if(serviceData != undefined && self.enemyString != serviceData){
					self.enemyString          = serviceData;
					self.formattedEnemyString = '';
					 self.characterSpawns     = undefined;
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
		self.getSpawnData_Editor = function(){
			let serviceData = MapService.characterData();
			if(serviceData != undefined && self.enemyString != serviceData || self.characterSpawns == undefined){
				self.characterSpawns = [];
				self.characterSpawns[0] = MapService.mapData.spawn.kickle;
				self.characterSpawns[0].name = 'Kickle';
				for(let i=0;i<MapService.mapData.spawn.bag.length;i++){
					self.characterSpawns[i+1] = MapService.mapData.spawn.bag[i];
					self.characterSpawns[i+1].name = 'Bag';
				}
				for(let i=0;i<MapService.mapData.spawn.enemy.length;i++){
					self.characterSpawns[i+4] = MapService.mapData.spawn.enemy[i];
				}	
			}
			return self.characterSpawns;	
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
		self.copyText = function(type){
			let tmp = document.createElement("textarea");
			if(type == 'Character'){
				tmp.value = MapService.characterData();
			}else{
				tmp.value = MapService.tileData();
			}
			tmp.style.height = "0";
			tmp.style.overflow = "hidden";
			tmp.style.position = "fixed";
			document.body.appendChild(tmp);
			tmp.focus();
			tmp.select();
			document.execCommand("copy");
			document.body.removeChild(tmp);
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
		//
		self.switchState = function(type){
			if(type == 'Character'){
				self.enemyNextState  = self.enemyNextState  === 'Simple' ? 'Raw' : 'Simple';
			}else{
				self.memoryNextState = self.memoryNextState === 'Simple' ? 'Raw' : 'Simple';
			}	
		}
	}
  });
