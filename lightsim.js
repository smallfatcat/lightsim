$(document).ready( start );

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

var pixelsPerM = 250;
var wobbleY = 0;
var wobbleDirection = 'down';
var lightXMin = 125;
var lightXMax = 625;
var lightX = lightXMin;
var lightStaticX1 = 200;
var lightStaticX2 = 550;
var lightStaticX3 = 625;
var lightStaticY = 200;
var dynamicZ = 5;
var staticZ = 40;
var lightY = 200;
var direction = 'right';
var speedX = 2;
var speedY = 8;
var lightPower = 1000.0;
var lightPowerStatic = 600.0;
var frameCount = 0;
var delayTime = 5;
var delayCount = 0;
var delayTimeY = 5;
var delayCountY = 0;
var historyArray = [];
for (var i=0;i<75;i++){
	var historyArrayY = [];
	for(var j=0;j<75;j++){
		var historyArrayT = [];
		for(var k=0;k<1000;k++){
			historyArrayT.push(0);
		}
		historyArrayY.push(historyArrayT);
	}
	historyArray.push(historyArrayY);
}

function start() {
  //while(true){
  	//drawAll();
	//}
  //loopTimer = setInterval(drawAll, 10);
  
}

function drawAll()
{
	frameCount++;

	// Top Frame
	var canvas = document.getElementById("worldCanvas");
  var ctx = canvas.getContext("2d");
  for(var x = 0;x<750;x+=10){
		for(var y = 0;y<750;y+=10){
			var z = dynamicZ/pixelsPerM;
			var wperm1 = calcWattsPerM(x, y, z, lightX, lightY, lightPower);
			var wperm2 = calcWattsPerM(x, y, z, lightX, lightY + 250, lightPower);
			//var wperm3 = calcWattsPerM(x, y, z, lightX, lightY + 175, 50.0);

			var wperm = wperm1 + wperm2;// + wperm3;
			var historyTime = frameCount%1000;
			historyArray[x/10][y/10][historyTime] = wperm;
			
			ctx.fillStyle = getColorPower(wperm);
  		ctx.fillRect(x, y, 10, 10);
  	}
	}
	// Middle Frame
	var canvasHistory = document.getElementById("historyCanvas");
  var ctxHistory = canvasHistory.getContext("2d");
	for(var x = 0;x<750;x+=10){
		for(var y = 0;y<750;y+=10){
			var totalPowerHistory =0;
			for(var t = 0;t<1000;t++){
				totalPowerHistory += historyArray[x/10][y/10][t];
			}
			//ctxHistory.fillStyle = getColorPower(totalPowerHistory/(frameCount < 1000 ? frameCount : 1000));
			ctxHistory.fillStyle = getColorPower(totalPowerHistory/(1000));
  		ctxHistory.fillRect(x, y, 10, 10);
  	}
	}
	// Bottom Frame
	if(frameCount == 1){
		var canvasStatic = document.getElementById("staticCanvas");
	  var ctxStatic = canvasStatic.getContext("2d");
	  for(var x = 0;x<750;x+=10){
			for(var y = 0;y<750;y+=10){
				var z = staticZ/pixelsPerM;
				var wperm1 = calcWattsPerM(x, y, z, lightStaticX1, lightStaticY, lightPowerStatic);
				var wperm2 = calcWattsPerM(x, y, z, lightStaticX2, lightStaticY, lightPowerStatic);
				var wperm3 = calcWattsPerM(x, y, z, lightStaticX1, lightStaticY + 350, lightPowerStatic);
				var wperm4 = calcWattsPerM(x, y, z, lightStaticX2, lightStaticY + 350, lightPowerStatic);
				//var wperm5 = calcWattsPerM(x, y, z, lightStaticX3, lightStaticY, lightPowerStatic);
				//var wperm6 = calcWattsPerM(x, y, z, lightStaticX3, lightStaticY + 350, lightPowerStatic);

				var wperm = wperm1 + wperm2 + wperm3 + wperm4;// + wperm5 + wperm6;
				ctxStatic.fillStyle = getColorPower(wperm);
	  		ctxStatic.fillRect(x, y, 10, 10);
	  	}
		}
	}


	if(direction == 'left' && delayCount == 0 ){
		lightX -= speedX;
	}
	if(direction == 'right'&& delayCount == 0){
		lightX += speedX;
	}
	if(delayCount != 0){
		delayCount --;
	}
	if(lightX > lightXMax){
		direction = 'left';
		lightX = lightXMax;
		delayCount = delayTime;
	}
	if(lightX < lightXMin){
		direction = 'right';
		lightX = lightXMin;
		delayCount = delayTime;
	}

	if(delayCountY != 0){
		delayCountY --;
	}

	if(wobbleDirection == 'up' && delayCountY == 0){
		lightY -= speedY;
	}
	if(wobbleDirection == 'down' && delayCountY == 0){
		lightY += speedY;
	}
	if(lightY < 150){
		wobbleDirection = 'down';
		lightY = 150;
		delayCountY = delayTimeY;
	}
	if(lightY > 350){
		wobbleDirection = 'up';
		lightY = 350;
		delayCountY = delayTimeY;
	}
}
function calcWattsPerM(x, y, zpos, lightX, lightY, lightPower){
	var xpos = Math.abs(lightX -x)/pixelsPerM;
	var ypos = Math.abs(lightY -y)/pixelsPerM;
	var dist = Math.sqrt((xpos*xpos)+(ypos*ypos)+(zpos*zpos));
	var wperm = lightPower/(4 * Math.PI * dist * dist);
	return wperm;
}

function showInfo(event) {
    var cX = event.clientX;
    var cY = event.clientY;
    var coords1 = "client - X: " + cX + ", Y coords: " + cY;
    var xpos = Math.abs(lightX -cX)/500;
		var ypos = cY/500;
		var dist = Math.sqrt((xpos*xpos)+(ypos*ypos));
		var wperm = lightPower/(4 * Math.PI * dist * dist);
		var color = Math.round(wperm.map(0,20000,128,255));
		coords1 += ': ' + wperm + ': ' + color + ': ' + frameCount;
    $('#infoText').empty();
    $('#infoText').append(coords1);
}

function getColorPower(power){
	var greenLow = 100;
	var greenHigh = 400;
	var redLow = 3000;
	var cBlue = 0;
	var cRed = 0;
	var cGreen = 0;
	if(power < greenLow){
		cBlue = Math.round(power.map(0,greenLow,64,255));
		cBlue = 255 - cBlue;
		cGreen = 64;
	}
	if(power >= greenLow && power < greenHigh){
		cGreen = Math.round(power.map(greenLow,greenHigh,64,255));
		//cBlue = 255;
	}
	if(power >= greenHigh && power < redLow){
		cRed = Math.round(power.map(greenHigh,redLow,64,255));
		cGreen = 255;
	}
	if(power >= redLow){
		cGreen = Math.round(power.map(redLow,10000,64,255));
		cGreen = 255 - cGreen;
		cRed = 255;
	}
	var fillStyle = 'rgb('+ cRed +',' + cGreen +',' + cBlue + ')';

	return fillStyle;
}

var Light = function(x, y, z, power, dynamic, startX, startY, startZ, endX, endY, endZ, speed, delayX, delayY, delayZ)
{
  this.x       = x       || 1.0;
  this.y       = y       || 1.0;
  this.z       = z       || 0.5;
  this.power   = power   || 600;
  this.dynamic = dynamic || false;
  this.startX  = startX  || 0.0;
  this.startY  = startY  || 0.0;
  this.startZ  = startZ  || 0.0;
  this.endX    = endX    || 0.0;
  this.endY    = endY    || 0.0;
  this.endZ    = endZ    || 0.0;
  this.speed   = speed   || 0.0;
  this.delayX  = delayX  || 0.0;
  this.delayY  = delayY  || 0.0;
  this.delayZ  = delayZ  || 0.0;
}

var Sim = function(id, panelID){
	this.id = id || 0;
	this.room = new Room(3, 3, 2);
	this.room.lights.push(new Light(1.5, 1.5, 0.5, 600));
	this.panel = new Panel(panelID);
}

var View = function(w, h, viewType, visible, id, panelID, txt){
	this.width = w || 750;
	this.height = h || 750;
	this.viewType = viewType || 'live';
	this.visible = visible || true;
	this.txt = txt || '';
	this.id = id || 'none';
	this.panelID = panelID || 'panel1'
	this.init();
}

View.prototype = {
	draw: function(){
		if(this.viewType == 'live'){
			var canvas = document.getElementById(this.id);
  		var ctx = canvas.getContext("2d");
  		ctx.fillStyle = 'rgb(128,128,128)';
  		ctx.fillRect(100, 100, 10, 10);
		}
		if(this.viewType == 'history'){
			var canvas = document.getElementById(this.id);
  		var ctx = canvas.getContext("2d");
  		ctx.fillStyle = 'rgb(128,128,128)';
  		ctx.fillRect(100, 100, 10, 10);
		}
		if(this.viewType == 'info'){

		}
	},
	init: function(){
		if(this.viewType == 'live'){
			var canvasHtml = '<canvas id="'+this.id+'" width="750" height="750"></canvas>';
			$('#'+this.panelID).append(canvasHtml);
		}
		if(this.viewType == 'history'){
			var canvasHtml = '<canvas id="'+this.id+'" width="750" height="750"></canvas>';
			$('#'+this.panelID).append(canvasHtml);
		}
		if(this.viewType == 'info'){
			var infoHtml = '<div id="'+this.id+'">'+this.txt+'</div>';
			$('#'+this.panelID).append(infoHtml);
		}
	}
}

var Panel = function(panelID){
	this.panelID = panelID || 'panel1';
	this.init();
	this.views = [];
	var view = new View(750, 750, 'live', true, 'liveCanvas', this.panelID);
	this.views.push(view);
	view = new View(750, 750, 'history', true, 'historyCanvas', this.panelID);
	this.views.push(view);
	view = new View(750, 750, 'info', true, 'infoWindow', this.panelID, 'Info text');
	this.views.push(view);

}

Panel.prototype = {
	init: function(){
		var panelHtml = '<div id="'+this.panelID+'"></div>';
		$('#main').append(panelHtml);
	}
}

Light.prototype = {
  calcWperm: function(x,y,z){
    var vx = this.x - x;
    var vy = this.y - y;
    var vz = this.z - z;
    var distance = Math.sqrt((vx*vx)+(vy*vy)+(vz*vz));
    var area = 4 * Math.PI * distance * distance;
    var wperm = this.power / area;
    return wperm;
  }
}

var Room = function(maxX, maxY, maxZ)
{
  this.maxX = maxX || 3;
  this.maxY = maxY || 3;
  this.maxZ = maxZ || 2;
  this.powerGrid = new Grid(75, 75, 0.01, this.maxX);
  this.lights = [];
}

Room.prototype = {
	calcPowerGrid: function(){
		for(var x = 0; x < this.powerGrid.x; x++){
			for(var y = 0; y < this.powerGrid.y; y++){
				var roomX = x * this.powerGrid.gsize; 
				var roomY = y * this.powerGrid.gsize;
				var wperm = this.getWperm(roomX, roomY, this.powerGrid.z);
				this.powerGrid.gridHistory[this.powerGrid.historyIndex][x][y] = wperm;
			}
		}
		this.powerGrid.historyIndex++;
		if(this.powerGrid.historyIndex >= 1000){
			this.powerGrid.historyIndex = 0;
		}
	},
	getWperm: function(roomX, roomY, roomZ){
		var wperm = 0;
		for(var i = 0;i<this.lights.length;i++){
			wperm += this.lights[i].calcWperm(roomX, roomY, roomZ);
		}
		return wperm;
	}
}

var Grid = function(x, y, z, maxX)
{
  this.x = x || 75;
  this.y = y || 75;
  this.z = z || 0.01;
  this.gsize = maxX / this.x;
  this.historyIndex = 0;
  this.gridHistory = [];
  for(var h=0; h<1000; h++){
	  var cells = [];
	  for(var xi=0;xi < this.x; xi++){
	  	var yRow = [];
	  	for(var yi=0;yi < this.y; yi++){
	  		yRow.push(0);
	  	}
	  	cells.push(yRow);
	  }
	  this.gridHistory.push(cells);
	}
}

