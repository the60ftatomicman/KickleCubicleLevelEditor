'use strict';
angular.module('tileEditor', ['MapService']);
angular.
  module('tileEditor').
  component('tileEditor', {
    templateUrl: 'tile-editor/tile-editor.template.html',
    controller : function TileEditorController(MapService) {
		//
		//
		//
		var self = this;
		self.memoryString = '';
		self.enemyString  = '';		
		self.tiles        = [[]];
		self.currentTile  = {};
		//
		//
		//
		self.$onInit = function () {}
		//
		//
		//
		self.getTiles = function(){
			let serviceMapData  = MapService.tileData();
			let serviceCharData = MapService.characterData();
			if(self.memoryString != serviceMapData || self.enemyString != serviceCharData){
				self.memoryString = serviceMapData;
				self.enemyString  = serviceCharData;
				self.tiles=[[]];
				let hexValues   = self.memoryString.match(/[\s\S]{1,2}/g);
				let hexCount    = 0;
				for(let i=0;i<hexValues.length;i=i){
					let isGroup = parseInt(hexValues[i].charAt(0),16) > 7;
					let nextHex = hexValues[i+1];
					if(isGroup && nextHex){ 
						for(let j=0;j<parseInt(nextHex,16)+1;j++){
							populateTiles(hexValues[i],hexCount,i);
						}
						i+=2;
					}else{
						populateTiles(hexValues[i],hexCount,i);
						i+=1;
					}
					
					hexCount++;
				}
			}
			return self.tiles;
		}
		self.setCurrentTile = function (i) {
			console.log(i);
		}
		function populateTiles(tile,cHex,index){
			if(self.tiles[self.tiles.length-1].length >= 16){
				self.tiles.push([]);
			}
			let r = self.tiles.length-1;
			let c = self.tiles[self.tiles.length-1].length;
			self.tiles[self.tiles.length-1].push({
				hex    : cHex,
				row    : r,
				col    : c,
				val    : tile,
				sprite : getSpritePath(tile),
				spawn  : getSpawnString(r,c)
			});
		}
		function getSpritePath(hexValue){
			if(MapService.mapData.sprite.includes(hexValue)){
				return 'img/tiles/'+hexValue+'.png';
			}else{
				return false;
			}
		}
		function getSpawnString(row,col){
			let kickleSpawn = getKickleSpawn();
			if(kickleSpawn.row == row && kickleSpawn.col == col){
				return 'kickle';
			}
			return '';
		}
		function getKickleSpawn(){
			let hexValues   = self.enemyString.match(/[\s\S]{1,2}/g);
			let pastEnemies = false;
			let atKickle    = false;
			let objSpawn    = {row:-1,col:-1};
			for(let i=0;i<hexValues.length;i++){
					pastEnemies = hexValues[i] === 'EF' || pastEnemies;
					atKickle    = pastEnemies && hexValues[i-1] === '01'
					if(atKickle && objSpawn.row == -1){ 
						objSpawn = {row:parseInt(hexValues[i].charAt(0),16),col:parseInt(hexValues[i].charAt(1),16)};
					}
			}
			return objSpawn;
		}
	}
  });
