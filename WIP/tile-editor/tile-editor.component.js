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
		self.memoryString = MapService.tileData();		
		self.tiles        = [[]];
		self.currentTile  = {};
		//
		//
		//
		self.$onInit = function () {
			let hexValues = self.memoryString.match(/[\s\S]{1,2}/g);
			let hexCount  = 0;
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
		self.getTiles = function(){
			console.log("getting tiles");
			return self.tiles;
		}
		self.setCurrentTile = function (i) {
			console.log(i);
		}
		function populateTiles(tile,cHex,index){
			//console.log('i:['+index+'] hexCount:['+cHex+'] val:['+tile+']');
			if(self.tiles[self.tiles.length-1].length >= 16){
				self.tiles.push([]);
			}
			self.tiles[self.tiles.length-1].push({
				hex   : cHex,
				row   : self.tiles.length-1,
				col   : self.tiles[self.tiles.length-1].length,
				val   : tile,
				sprite: getSpritePath(tile)
			});
		}
		function getSpritePath(hexValue){
			if(MapService.mapData.sprite.includes(hexValue)){
				return 'img/tiles/'+hexValue+'.png';
			}else{
				return false;
			}
		}
	}
  });
