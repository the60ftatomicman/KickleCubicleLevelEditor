'use strict';
angular.module('hexEditor', ['MapService']);
angular.
  module('hexEditor').
  component('hexEditor', {
    templateUrl: 'hex-editor/hex-editor.template.html',
    controller : function HexEditorController(MapService) {
		var self          = this;
		self.memoryString = MapService.tileData();
		//
		//
		//
		self.$onInit = function () {}
		//
		//
		//
		self.updateMapData = function(){
			MapService.setTileData(self.memoryString);
		}
	}
  });
