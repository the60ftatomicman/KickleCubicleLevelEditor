'use strict';
angular.module('mapSelector', ['MapService']);
angular.
  module('mapSelector').
  filter('worldFilter', function() { 
		return function(map,world) { 
			if(world === '*' || map.name.indexOf(world) > -1){
				return map; 
			}
		}; 
	}).
    component('mapSelector', {
    templateUrl: 'map-selector/map-selector.template.html',
    controller : function TileEditorController(MapService) {
		//
		//
		//
		var self            = this;
		self.currentMap     = undefined;
		self.prevWorld      = undefined;
		self.currentWorld   = undefined;
		self.currentIndex   = 0;
		self.selectableMaps = [];
		self.selectableWorlds = [
			{label:'All'     ,filter:" "},
			{label:'Garden'  ,filter:"Garden"},
			{label:'Fruit'   ,filter:"Fruit"},
			{label:'Cake'    ,filter:"Cake"},
			{label:'Toy'     ,filter:"Toy"},
			{label:'Special' ,filter:"Special"}
		];
		//
		//
		//
		self.$onInit = function () {
			self.currentWorld = self.selectableWorlds[0];
		};
		//
		//
		//
		self.updateMapSelection = function(){
			console.log(self.currentMap.file);
			MapService.getMapData(self.currentMap.file);
			self.currentIndex = parseInt(self.currentMap.file.replace("level_",""))-1;
			setCurrent(self.currentIndex);
		};
		self.updateMapSelection = function(){
			console.log(self.currentMap.file);
			MapService.getMapData(self.currentMap.file);
			self.currentIndex = parseInt(self.currentMap.file.replace("level_",""))-1;
			setCurrent(self.currentIndex);
		};
		self.gotoNext = function(){
			self.currentIndex += self.currentIndex < MapService.availableMaps.length ? 1 : 0;
			console.log(self.currentIndex);
			setCurrent(self.currentIndex);
			self.updateMapSelection();
		};
		self.gotoPrev = function(){
			self.currentIndex -= self.currentIndex > 0 ? 1 : 0;
			console.log(self.currentIndex);
			setCurrent(self.currentIndex);
			self.updateMapSelection();
		};
		self.saveData = function(){
			MapService.saveData(self.currentMap.file);
		};
		self.getMapSelection = function(){
			var selectedData = MapService.availableMaps;
			if(selectedData && self.selectableMaps != MapService.availableMaps){
				self.selectableMaps = MapService.availableMaps;
				setCurrent(0);
				MapService.getMapData( MapService.availableMaps[0].file);
			}
			return self.selectableMaps;
		};
		self.getWorldSelection = function(){
			return self.selectableWorlds;
		};
		//
		//
		//
		//TODO: add pallete modifications here here!
		function setCurrent(idx){
			if(MapService.availableMaps){
			self.currentMap = MapService.availableMaps[idx];
			}
		}
	}
  });
