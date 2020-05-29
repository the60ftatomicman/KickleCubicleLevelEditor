'use strict';
angular.module('MapService',[]);
angular.module('MapService')
	.service('MapService', function($http) {
	var self = this;
	self.mapData = {
		name:'',
		tile:{
			original:'',
			current :''
		},
		character:{
			original:'',
			current :''
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
		sprite:[
			'00','01','03','04','05','07',
			'20','25','2C',
			'30','31',
			'41','42','43','44','45','46',
			'80','81','83','84','85','87',
			'A0','A5','AC',
			'B0','B1',
			'C1','C2','C3','C4','C5','C6'
		]
	};
	//
	// Generic Functions
	//
	self.getMapData = function(mapData){
		return $http.get('json/maps/'+mapData+'.json').then(function(data) {
			let jsonMap = data.data;
			self.initTileData(data.data.rawHexData.tile);
			self.initCharacterData(data.data.rawHexData.character);
		});
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
		self.mapData.tile.current  = self.mapData.tile.original;
	};
	self.getTileDataOriginalSize = function(){
		return self.mapData.tile.original.match(/[\s\S]{1,2}/g).length
	};
	self.getTileDataCurrentSize = function(){
		return self.mapData.tile.current.match(/[\s\S]{1,2}/g).length
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
		self.mapData.character.current  = self.mapData.character.original;
		self.setKickleSpawn();
		self.setBagSpawns();
		self.setEnemySpawns();
	};
	self.getCharacterDataOriginalSize = function(){
		return self.mapData.character.original.match(/[\s\S]{1,2}/g).length
	};
	self.getCharacterDataCurrentSize = function(){
		return self.mapData.character.current.match(/[\s\S]{1,2}/g).length
	};
	//
	// Kickle Functions
	//
	self.getKickleSpawn = function(){
		return self.mapData.spawn.kickle;
	};
	self.setKickleSpawn = function(){
		self.mapData.spawn.kickle = {row:-1,col:-1};
		let hexValues   = self.mapData.character.current.match(/[\s\S]{1,2}/g);
		let atKickle    = false;
		for(let i=hexValues.lastIndexOf('FF');i<hexValues.length;i++){
			atKickle = hexValues[i-1] === '01'
			if(atKickle && self.mapData.spawn.kickle.row == -1){ 
				self.mapData.spawn.kickle = {row:parseInt(hexValues[i].charAt(0),16),col:parseInt(hexValues[i].charAt(1),16)};
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
		let hexValues      = self.mapData.character.current.match(/[\s\S]{1,2}/g);
		let lastEnemyIndex = hexValues.lastIndexOf('FF');
		for(var j=0;j<3;j++){
			self.mapData.spawn.bag[j] = {
				row:parseInt(hexValues[lastEnemyIndex+j+1].charAt(0),16),
				col:parseInt(hexValues[lastEnemyIndex+j+1].charAt(1),16)
			};
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
		let hexValues = self.mapData.character.current.match(/[\s\S]{1,2}/g);
		let enemyIdx  = hexValues.lastIndexOf('EF');
		for(let i=0;i<enemyIdx;i=i){
			let identifier = hexValues.slice(i,i+5).toString().replace(/,/g, '');
			let idxMoved   = 1;
			if(identifier === '0BC00A0500'){
				idxMoved = populateSpawnEntry(hexValues,i,enemyIdx,'noggle');
			}else if(identifier === '0D080E0D02' || identifier === '0D080E0D03' ){
				idxMoved = populateSpawnEntry(hexValues,i,enemyIdx,'hoople');
			}else if(identifier === '1E880D1102' || identifier === '1E880D1103' ){
				idxMoved = populateSpawnEntry(hexValues,i,enemyIdx,'sparky');
			}else if(identifier === '20080B0302' || identifier === '20080B0303' ){
				idxMoved = populateSpawnEntry(hexValues,i,enemyIdx,'max');
			}else if(identifier === '18080C0B02' || identifier === '18080C0B03' ){
				idxMoved = populateSpawnEntry(hexValues,i,enemyIdx,'rocky');
			}else if(identifier === '2D08130902' || identifier === '2D08130903' ){
				idxMoved = populateSpawnEntry(hexValues,i,enemyIdx,'myrtle');
			}else if(identifier === '1A080F0302' || identifier === '1A080F0303' ){
				idxMoved = populateSpawnEntry(hexValues,i,enemyIdx,'rooker');
			}else if(identifier === '2588090702' || identifier === '2588090703' ){
				idxMoved = populateSpawnEntry(hexValues,i,enemyIdx,'bonkers');
			}else if(identifier === '27C8100102' || identifier === '27C8100103' ){
				idxMoved = populateSpawnEntry(hexValues,i,enemyIdx,'shades');
			}else if(identifier === '2B08121102' || identifier === '2B08121103' ){
				idxMoved = populateSpawnEntry(hexValues,i,enemyIdx,'equalizer');
			}else if(identifier === '23700A1102' || identifier === '23700A1103' ){
				idxMoved = populateSpawnEntry(hexValues,i,enemyIdx,'spiny_right');
			}else if(identifier === '23400A1102' || identifier === '23400A1103' ){
				idxMoved = populateSpawnEntry(hexValues,i,enemyIdx,'spiny_left');
			}else if(identifier === '46884F0A02' || identifier === '46884F0A03' ){
				idxMoved = populateSpawnEntry(hexValues,i,enemyIdx,'gale');
			}
			i+=idxMoved;
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
	function populateSpawnEntry(hexValues,currHexIdx,enemyIdx,enemyName){
		let groupSlice = hexValues.slice(currHexIdx+5,enemyIdx);
		    groupSlice = groupSlice.slice(0,groupSlice.indexOf('EF'));
		for(var j=0;j<groupSlice.length;j+=4){
		self.mapData.spawn.enemy.push({
			row       : parseInt(groupSlice[j].charAt(0),16),
			col       : parseInt(groupSlice[j].charAt(1),16),
			direction : parseInt(groupSlice[j+3]        ,16),
			name      : enemyName});
		self.mapData.spawn.enemy.push({
			row       : parseInt(groupSlice[j+1].charAt(0),16),
			col       : parseInt(groupSlice[j+1].charAt(1),16),
			direction : '',
			name      : 'baserock_'+enemyName});
		}
		return groupSlice.length+5;
	};

	//
	// Constructor 
	//
	//self.setKickleSpawn();
	//self.setBagSpawns();
	//self.setEnemySpawns();
	self.getMapData('level_2');
});