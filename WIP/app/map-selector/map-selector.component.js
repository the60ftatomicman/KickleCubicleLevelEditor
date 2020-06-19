'use strict';
angular.module('mapSelector', ['MapService']);
angular.
  module('mapSelector').
  component('mapSelector', {
    templateUrl: 'map-selector/map-selector.template.html',
    controller : function TileEditorController(MapService) {
		//
		//
		//
		var self            = this;
		self.currentMap     = undefined;
		self.currentIndex   = 0;
		self.selectableMaps = [];
		//
		//
		//
		self.$onInit = function () {};
		//
		//
		//
		self.updateMapSelection = function(){
			console.log(self.currentMap.file);
			MapService.getMapData(self.currentMap.file);
			self.currentIndex = parseInt(self.currentMap.file.replace("level_",""))-1;
		};
		self.gotoNext = function(){
			self.currentIndex += self.currentIndex < MapService.availableMaps.length ? 1 : 0;
			console.log(self.currentIndex);
			self.currentMap = MapService.availableMaps[self.currentIndex];
			self.updateMapSelection();
		};
		self.gotoPrev = function(){
			self.currentIndex -= self.currentIndex > 0 ? 1 : 0;
			console.log(self.currentIndex);
			self.currentMap = MapService.availableMaps[self.currentIndex];
			self.updateMapSelection();
		};
		self.getMapSelection = function(){
			var selectedData = MapService.availableMaps;
			if(self.selectableMaps != MapService.availableMaps){
				self.selectableMaps = MapService.availableMaps;
				self.currentMap     = MapService.availableMaps[0];
				MapService.getMapData( MapService.availableMaps[0].file);
			}
			return self.selectableMaps;
		};
	}
  });
