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
