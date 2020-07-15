'use strict';
angular.module('MapService',[]);
angular.module('MapService')
	.service('MapService', function($http) {
	var self = this;
	self.availableMaps = undefined;
	self.mapData       = undefined;
	//
	// Generic Functions
	//
	self.initMapData = function(){
		self.mapData = {
			memoryAddress:{
				tile     :{start:undefined,end:undefined},
				character:{start:undefined,end:undefined},
			},
			tile:{
				original:undefined,
				current :undefined
			},
			character:{
				original:undefined,
				current :undefined
			},
			spawn:{
				kickle:{row:-1,col:-1},
				bag   :[
					{row:-1,col:-1},
					{row:-1,col:-1},
					{row:-1,col:-1}
				],
				enemy:[]
			},
			sprite:{
				tile     :[],
				character:[]
			}
		};
		$http.get('json/meta_info.json').then(function(data) {
			//console.log(data);
			self.availableMaps = data.data.levels;			
			self.mapData.sprite.tile      = data.data.sprites.tile;
			self.mapData.sprite.character = data.data.sprites.character;
		});
	};
	self.getMapData = function(mapData){
		$http.get('json/maps/'+mapData+'.json').then(function(data) {
			//console.log(data);
			self.initTileData(data.data.rawHexData.tile);
			self.initCharacterData(data.data.rawHexData.character);
			self.mapData.memoryAddress.tile      = data.data.hexAddresses.tile;
			self.mapData.memoryAddress.character = data.data.hexAddresses.character;
		});
	};
	self.getEnemyData = function(){
		return self.mapData.sprite.character.slice(2);
	};
	//
	// Tile Data
	//
	self.tileData = function() {
		return self.mapData.tile.current;
	};
	self.initTileData = function(hexData) {
		self.mapData.tile.original = hexData;
		self.resetTileData();
	};
	self.setTileData = function(hexData) {
		self.mapData.tile.current = hexData;
	};
	self.resetTileData = function(hexData) {
		self.mapData.tile.current = self.mapData.tile.original;
	};
	self.getTileDataOriginalSize = function(){
		return countHexes(self.mapData.tile.original);
	};
	self.getTileDataCurrentSize = function(){
		return countHexes(self.mapData.tile.current);
	};
	//
	// Character Data
	//
	self.characterData = function() {
		return self.mapData.character.current;
	};
	self.initCharacterData = function(hexData) {
		self.mapData.character.original = hexData;
		self.resetCharacterData();
	};
	self.setCharacterData = function(hexData) {
		self.mapData.character.current = hexData;
		self.setKickleSpawn();
		self.setBagSpawns();
		self.setEnemySpawns();
	};	
	self.resetCharacterData = function(hexData) {
		self.mapData.character.current = self.mapData.character.original;
		self.setKickleSpawn();
		self.setBagSpawns();
		self.setEnemySpawns();
	};
	self.getCharacterDataOriginalSize = function(){
		return countHexes(self.mapData.character.original);
	};
	self.getCharacterDataCurrentSize = function(){
		return countHexes(self.mapData.character.current);
	};
	//
	// Kickle Functions
	//
	self.getKickleSpawn = function(){
		return self.mapData.spawn.kickle;
	};
	self.setKickleSpawn = function(){
		self.mapData.spawn.kickle = {row:-1,col:-1};
		if(self.mapData.character.current != ""){
			let hexValues   = self.mapData.character.current.match(/[\s\S]{1,2}/g);
			let atKickle    = false;
			//hexValues.lastIndexOf('FF')
			for(let i=findEnemyDataSplitter(hexValues);i<hexValues.length;i++){
				atKickle = hexValues[i-1] === '01'
				if(atKickle && self.mapData.spawn.kickle.row == -1){ 
					self.mapData.spawn.kickle = {row:parseInt(hexValues[i].charAt(0),16),col:parseInt(hexValues[i].charAt(1),16)};
				}
			}
		}
	};
	self.isKickleSpawn = function(row,col){
		return self.mapData.spawn.kickle.row == row && self.mapData.spawn.kickle.col == col;
	};
	//
	// Dream Bag Functions
	//
	self.getBagSpawns = function(){
		return self.mapData.spawn.bag;
	};
	self.setBagSpawns = function(){
		for(var i=0;i<self.mapData.spawn.bag.length;i++){
			self.mapData.spawn.bag[i] = {row:-1,col:-1};
		}
		if(self.mapData.character.current != ""){
			let hexValues      = self.mapData.character.current.match(/[\s\S]{1,2}/g);
			let lastEnemyIndex = findEnemyDataSplitter(hexValues);//hexValues.lastIndexOf('FF');
			for(var j=0;j<3;j++){
				self.mapData.spawn.bag[j] = {
					row:parseInt(hexValues[lastEnemyIndex+j+1].charAt(0),16),
					col:parseInt(hexValues[lastEnemyIndex+j+1].charAt(1),16)
				};
			}
		}
	};
	self.isBagSpawn = function(row,col){
		let isSpawn = false
		for(var i=0;i<self.mapData.spawn.bag.length;i++){
			let bag = self.mapData.spawn.bag[i];
			isSpawn = bag.row == row && bag.col == col || isSpawn;
		}
		return isSpawn;
	};
	//
	// Enemy Functions
	//
	self.getEnemySpawns = function(){
		return self.mapData.spawn.enemy;
	};
	self.setEnemySpawns = function(){
		self.mapData.spawn.enemy = [];
		if(self.mapData.character.current != ""){
			let hexValues = self.mapData.character.current.match(/[\s\S]{1,2}/g);
			let enemyIdx  = findEnemyDataSplitter(hexValues)-1;//hexValues.lastIndexOf('EF');
			for(let i=0;i<enemyIdx;i=i){
				let identifier = hexValues.slice(i,i+5).toString().replace(/,/g, '');
				let idxMoved   = 1;
				let enemyName  = getEnemyGroup(identifier);
				if(enemyName){
					idxMoved = populateSpawnEntry(hexValues,i,enemyIdx,enemyName);
				}
				i+=idxMoved;
			}
			//For some odd reason, some levels have extra enemy spawn data here baserock data here.
			let kickleData = hexValues.slice(findEnemyDataSplitter(hexValues));//hexValues.slice(hexValues.lastIndexOf('FF'));
			for(let i=kickleData.indexOf('01')+2;i<kickleData.length;i+=2){
				if(kickleData[i]){
					self.mapData.spawn.enemy.push({
						row       : parseInt(kickleData[i].charAt(0),16),
						col       : parseInt(kickleData[i].charAt(1),16),
						direction : '',
						name      : 'baserock_'+getEnemyGroup(hexValues.slice(0,5).toString().replace(/,/g, ''))
					});
				}
			}
			
		}
	};
	self.isEnemySpawn = function(row,col){
		let retEnemy = undefined;
		for(var i=0;i<self.mapData.spawn.enemy.length;i++){
			let enemy = self.mapData.spawn.enemy[i];
			if(enemy.row == row && enemy.col == col){
				retEnemy = enemy;
			}
		}
		return retEnemy;
	};
	//
	// Private
	//
	function findEnemyDataSplitter(hexArray){
		for(let i=1;i<hexArray.length;i++){
			if(hexArray[i-1] == 'EF' && hexArray[i] == 'FF' && hexArray[i+4] == '01'){
				return i;
			}
		}
		return -1;
	}
	function countHexes(hexString){
		if(hexString === undefined){
			return -1
		}else{
			return hexString != "" ? hexString.match(/[\s\S]{1,2}/g).length : 0;
		}
	};
	function getEnemyGroup(identifier){

		if(identifier === '0BC00A0500'){
			return 'noggle';
		}else{
			let nonNoggleEnemies = [
				{'name':'hoople'     ,'regex':/(0D)([0-9A-Fa-f]{2})(0E)(0D)(0(2|3))/g},
				{'name':'sparky'     ,'regex':/(1E)([0-9A-Fa-f]{2})(0D)(11)(0(2|3))/g},
				{'name':'max'        ,'regex':/(20)([0-9A-Fa-f]{2})(0B)(03)(0(2|3))/g},
				{'name':'rocky'      ,'regex':/(18)([0-9A-Fa-f]{2})(0C)(0B)(0(2|3))/g},
				{'name':'myrtle'     ,'regex':/(2D)([0-9A-Fa-f]{2})(13)(09)(0(2|3))/g},
				{'name':'rooker'     ,'regex':/(1A)([0-9A-Fa-f]{2})(0F)(03)(0(2|3))/g},
				{'name':'bonkers'    ,'regex':/(25)([0-9A-Fa-f]{2})(09)(07)(0(2|3))/g},
				{'name':'shades'     ,'regex':/(27)([0-9A-Fa-f]{2})(10)(01)(0(2|3))/g},
				{'name':'equalizer'  ,'regex':/(2B)([0-9A-Fa-f]{2})(12)(11)(0(2|3))/g},
				{'name':'spiny_right','regex':/(23)(4[0-9A-Fa-f]{1})(0A)(11)(0(2|3))/g},
				{'name':'spiny_left' ,'regex':/(23)([^4]{1}[0-9A-Fa-f]{1})(0A)(11)(0(2|3))/g},
				{'name':'gale'       ,'regex':/(46)([0-9A-Fa-f]{2})(4F)(0A)(0(2|3))/g}
			];
			for(let i=0;i<nonNoggleEnemies.length;i++){
				if(identifier.match(nonNoggleEnemies[i].regex)){
					return nonNoggleEnemies[i].name;
				}
			}
		}
		return	undefined;	
	};
	function populateSpawnEntry(hexValues,currHexIdx,enemyIdx,enemyName){
		let groupSlice = hexValues.slice(currHexIdx+5,enemyIdx);
		    groupSlice = groupSlice.slice(0,groupSlice.indexOf('EF'));
		for(var j=0;j<groupSlice.length;j+=4){
		self.mapData.spawn.enemy.push({
			row       : parseInt(groupSlice[j].charAt(0),16),
			col       : parseInt(groupSlice[j].charAt(1),16),
			direction : parseInt(groupSlice[j+3]        ,16) || 2,
			name      : enemyName});
		self.mapData.spawn.enemy.push({
			row       : parseInt(groupSlice[j+1].charAt(0),16),
			col       : parseInt(groupSlice[j+1].charAt(1),16),
			direction : '',
			name      : 'baserock_'+enemyName});
		}
		return groupSlice.length+6;
	};
	//
	// Constructor
	//
	self.initMapData();
});