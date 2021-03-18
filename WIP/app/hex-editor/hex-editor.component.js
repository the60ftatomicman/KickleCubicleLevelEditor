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
		self.formattedMemoryArray  = [];
		self.simpleMemoryString    = [];
		self.memoryLocation        = {start:undefined,end:undefined};
		self.memoryNextState       = 'Raw';
		self.enemyString           = undefined;
		self.formattedEnemyString  = '';
		self.enemyLocation         = {start:undefined,end:undefined};
		self.enemyNextState        = 'Raw';
		self.characterSpawns       = undefined;
		self.enemySelection        = [
			'noggle'     ,
			'hoople'     ,  	
			'sparky'     ,   	
			'max'        ,    	
			'rocky'      ,    	
			'myrtle'     ,    	
			'rooker'     ,    	
			'bonkers'    ,    	
			'shades'     ,   	
			'equalizer'  ,  	
			'spiny_right',	
		    'spiny_left' ,
	        'gale'       
		];
		self.directions = [
			{label:'Down' ,val:'2'},
			{label:'Right',val:'1'},
			{label:'Up'   ,val:'0'},
			{label:'Left' ,val:'3'},
		];
		self.currentEnemySelection =  'noggle';
		self.hexValues     = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
		//
		//
		//
		self.$onInit = function () {
			self.formatMapData_Editor();
			self.formatEnemyData_Editor();
		};
		//
		self.showMapData_Count = function (h){
			return parseInt(h.category,16) > 7;
		};
		//
		self.showMapData_ChangeCategory = function (h){
			if (!self.showMapData_Count(h)){
				h.count = 1;
			}
			self.convertTileSimple_Formatted();
		};
		self.setTileHighlight = function(hex){
			//Makes performance LAAAAAAAG
			//MapService.setTileHighlights(hex.indexes);
		};
		//
		//
		//
		self.getMapData_Simple = function (){
			self.formattedMemoryArray = [];
			let formattedArray = self.formattedMemoryString.split(' ');
			let currentTileIndex=0;
			for (let h=0;h<formattedArray.length;h++){
				if(formattedArray[h].length > 0) {
					let count       = formattedArray[h].length < 3 ? 1 : parseInt(formattedArray[h].substr(3, 2),16);
					let category    = formattedArray[h][0];//self.hexCategories[0];
					let val         = formattedArray[h][1];
					self.formattedMemoryArray.push({
						category: category,
						val: val,
						count: count
						//indexes:{start:currentTileIndex,end:currentTileIndex+count-1}
					});
					currentTileIndex+=count;
				}
			}
		};
		//
		self.convertTileSimple_Formatted = function (){
			let tempFormattedString = '';
			for (let h=0;h<self.formattedMemoryArray.length;h++) {
				let bytes    = self.formattedMemoryArray[h];
				//(i+0x10000).toString(16).substr(-4).toUpperCase();
				let count    = self.showMapData_Count(bytes) ? ','+(bytes.count+0x100).toString(16).substr(-2).toUpperCase() : '';
				tempFormattedString += bytes.category+bytes.val+count+' ';
			}
			//self.formattedMemoryString = tempFormattedString;
			self.formatMapData_Editor(tempFormattedString);
		};
		//
		self.deleteTile = function(idx){
			self.formattedMemoryArray.splice(idx, 1)
			self.convertTileSimple_Formatted();
		}
		//
		self.addTile = function(idx){
			self.formattedMemoryArray.splice(idx+1,0,{
				category: "0",
				val: "0",
				count: 1
			});
			self.convertTileSimple_Formatted();
		}
		//
		self.incrementTileCount = function(delta,idx){
			let next = self.formattedMemoryArray[idx].count + delta;
			if (next > 0 && next < 16) {
				self.formattedMemoryArray[idx].count = next;
				/*
				let newIndex = self.formattedMemoryArray[idx].start;
				for (let i=idx;i<self.formattedMemoryArray.length;i++){
					self.formattedMemoryArray[i].indexes.start = newIndex;
					self.formattedMemoryArray[i].indexes.end   = newIndex+self.formattedMemoryArray[i].count;
					newIndex += self.formattedMemoryArray[i].count;
				}
				*/
				self.convertTileSimple_Formatted();
			}
		}
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
					self.getMapData_Simple();
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
			console.log(self.characterSpawns);
			return self.characterSpawns;	
		}
		//
		self.setSpawnData_Service = function(hex,idx){
			self.characterSpawns[idx] = hex;
			self.formatEnemyData_Editor(convertToEnemyDataString());
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
		//
		self.resetText = function(type){
			if(type == 'Character'){
				return MapService.resetCharacterData();
			}else{
				return MapService.resetTileData();
			}
		}
		//
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
			let tileCount     = 0;
			if(self.memoryString){
				let hexValues     = self.memoryString.match(/[\s\S]{1,2}/g);
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
		//
		self.addEnemy_Simple = function(){
			console.log(self.characterSpawns);
			self.characterSpawns.push({
				row: 0, col: 0, direction: 1, name: self.currentEnemySelection
			});
			self.characterSpawns.push({
				row: 0, col: 1, direction: "", name: "baserock_"+self.currentEnemySelection
			});
			self.formatEnemyData_Editor(convertToEnemyDataString());
		}
		//
		self.moveCharacter = function(dX,dY,idx){
			let newR = self.characterSpawns[idx].row + dX;
			let newC = self.characterSpawns[idx].col + dY;
			self.characterSpawns[idx].row = newR > -1 && newR < 14 ? newR : self.characterSpawns[idx].row;
			self.characterSpawns[idx].col = newC > -1 && newC < 16 ? newC : self.characterSpawns[idx].col;
			self.formatEnemyData_Editor(convertToEnemyDataString());
		}
		//
		self.deleteCharacter = function(idx){
			self.characterSpawns.splice(idx,2);
			self.formatEnemyData_Editor(convertToEnemyDataString());
		}
		//
		self.updateDirection = function(dir,idx){
			self.characterSpawns[idx].direction = dir; 
			self.formatEnemyData_Editor(convertToEnemyDataString());
		}
		//
		self.isDeletable = function(name){
			return name != 'Kickle' && name != 'Bag' && !name.match(/(baserock)/g)
		}
		//
		//
		//
		function convertToEnemyDataString(){
			var newEnemyData = '';
			//var enemyTemplate = '#$00!EF';
			var templateStrings = {
			'noggle'     :'~0BC00A0500',
			'hoople'     :'~0D080E0D02',  	
			'sparky'     :'~1E880D1102',    	
			'max'        :'~20080B0302',    	
			'rocky'      :'~18080C0b02',    	
			'myrtle'     :'~2D08130902',    	
			'rooker'     :'~1A080F0302',    	
			'bonkers'    :'~2508090702',    	
			'shades'     :'~27C8100102',   	
			'equalizer'  :'~2B08121102',  	
			'spiny_right':'~23400A1102',	
		    'spiny_left' :'~23700A1102',
	        'gale'       :'~46884F0A02',
			'Bag'        :'~FF',
			'Kickle'     :'~01'
			}
			for(let i=0;i<self.characterSpawns.length;i++){
				let name =  self.characterSpawns[i].name;
				let hex  = self.characterSpawns[i].row.toString(16)+self.characterSpawns[i].col.toString(16);
				let len  = self.characterSpawns.length;
				templateStrings[name]  = templateStrings[name][0] === '~' ? templateStrings[name].slice(1) : templateStrings[name];
				templateStrings[name] +=hex;
				if(name != 'Kickle' && name != 'Bag'){
					let brock  = self.characterSpawns[i+1].row.toString(16)+self.characterSpawns[i+1].col.toString(16);
					let dirHex = self.characterSpawns[i].direction ? self.characterSpawns[i].direction.toString(16) : "0";
					templateStrings[name]+=brock+"000"+dirHex;
					i++;
				}
			}
			for (var ts in templateStrings) {
				if(templateStrings[ts][0] != '~'){
					newEnemyData+=templateStrings[ts];
					if(ts != 'Kickle' && ts != 'Bag'){
						newEnemyData+='EF';
					}
				}
			}
			return newEnemyData;
		}
	}
  });
