$(document).ready( start );

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}



var mainSim1 = 0;
var mainSim2 = 0;
var mainSim3 = 0;
var mainSim4 = 0;
var mainSim5 = 0;

var frames = 0;

function start() {
  //while(true){
  	//drawAll();
	//}
  //loopTimer = setInterval(drawAll, 10);

  
  mainSim1 = new Sim(0,'mainroom1');
  mainSim1.room.lights.push(new Light(0.75, 1.0, 0.1, 600, true, 0.75, 1.0, 0.1, 2.25, 1.0, 0.1, 0.004));
	mainSim1.room.lights.push(new Light(0.75, 2.0, 0.1, 600, true, 0.75, 2.0, 0.1, 2.25, 2.0, 0.1, 0.004));

	mainSim2 = new Sim(1,'mainroom2');
  mainSim2.room.lights.push(new Light(0.75, 1.0, 0.2, 600, true, 0.75, 1.0, 0.2, 2.25, 1.0, 0.2, 0.004));
	mainSim2.room.lights.push(new Light(0.75, 2.0, 0.2, 600, true, 0.75, 2.0, 0.2, 2.25, 2.0, 0.2, 0.004));

	mainSim3 = new Sim(2,'mainroom3');
  mainSim3.room.lights.push(new Light(0.75, 1.0, 0.3, 600, true, 0.75, 1.0, 0.3, 2.25, 1.0, 0.3, 0.004));
	mainSim3.room.lights.push(new Light(0.75, 2.0, 0.3, 600, true, 0.75, 2.0, 0.3, 2.25, 2.0, 0.3, 0.004));

	mainSim4 = new Sim(3,'mainroom4');
  mainSim4.room.lights.push(new Light(0.75, 1.0, 0.4, 600, true, 0.75, 1.0, 0.4, 2.25, 1.0, 0.4, 0.004));
	mainSim4.room.lights.push(new Light(0.75, 2.0, 0.4, 600, true, 0.75, 2.0, 0.4, 2.25, 2.0, 0.4, 0.004));

	mainSim5 = new Sim(4,'mainroom5');
  mainSim5.room.lights.push(new Light(0.75, 1.0, 0.5, 600, true, 0.75, 1.0, 0.5, 2.25, 1.0, 0.5, 0.004));
	mainSim5.room.lights.push(new Light(0.75, 2.0, 0.5, 600, true, 0.75, 2.0, 0.5, 2.25, 2.0, 0.5, 0.004));
  testTimer = setInterval(testDraw, 10);
  
}

function testDraw(){
	//console.log(frames);
	mainSim1.room.moveLights();
	mainSim1.room.calcPowerGrid();
	mainSim1.panel.views[0].draw(mainSim1.room.powerGrid.getLiveData(frames%1000));
	mainSim1.panel.views[1].draw(mainSim1.room.powerGrid.getHistoryData());
	mainSim1.panel.views[2].draw();

	mainSim2.room.moveLights();
	mainSim2.room.calcPowerGrid();
	mainSim2.panel.views[0].draw(mainSim2.room.powerGrid.getLiveData(frames%1000));
	mainSim2.panel.views[1].draw(mainSim2.room.powerGrid.getHistoryData());
	mainSim2.panel.views[2].draw();

	mainSim3.room.moveLights();
	mainSim3.room.calcPowerGrid();
	mainSim3.panel.views[0].draw(mainSim3.room.powerGrid.getLiveData(frames%1000));
	mainSim3.panel.views[1].draw(mainSim3.room.powerGrid.getHistoryData());
	mainSim3.panel.views[2].draw();

	mainSim4.room.moveLights();
	mainSim4.room.calcPowerGrid();
	mainSim4.panel.views[0].draw(mainSim4.room.powerGrid.getLiveData(frames%1000));
	mainSim4.panel.views[1].draw(mainSim4.room.powerGrid.getHistoryData());
	mainSim4.panel.views[2].draw();

	mainSim5.room.moveLights();
	mainSim5.room.calcPowerGrid();
	mainSim5.panel.views[0].draw(mainSim5.room.powerGrid.getLiveData(frames%1000));
	mainSim5.panel.views[1].draw(mainSim5.room.powerGrid.getHistoryData());
	mainSim5.panel.views[2].draw();

	frames++;
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
  this.directionX = 'right';
  this.directionY = 'right';
  this.directionZ = 'right';
  this.delayCountX = 0;
  this.delayCountY = 0;
  this.delayCountZ = 0;
  

}

var Sim = function(id, panelID){
	this.id = id || 0;
	this.room = new Room(3, 3, 2);
	//this.room.lights.push(new Light(0.75, 0.75, 0.1, 600, true, 0.75, 0.75, 0.1, 2.25, 0.75, 0.1, 0.01));
	//this.room.lights.push(new Light(2.25, 2.25, 0.1, 600, true, 2.25, 2.25, 0.1, 0.75, 2.25, 0.1, 0.01));
	//this.room.lights.push(new Light(1.75, 0.75, 0.1, 600, true, 1.75, 0.75, 0.1, 2.75, 0.75, 0.1, 0.01));
	//this.room.lights.push(new Light(1.75, 2.25, 0.1, 600, true, 1.75, 2.25, 0.1, 2.75, 2.25, 0.1, 0.01));
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
	draw: function(viewData){
		if(this.viewType == 'live'){
			var canvas = document.getElementById(this.id);
  		var ctx = canvas.getContext("2d");
  		for(var x = 0; x < 75; x++){
  			for(var y = 0; y < 75; y++){
  				ctx.fillStyle = getColorPower(viewData[x][y]);
  				ctx.fillRect(x*10, y*10, 10, 10);
  			}
  		}
		}
		if(this.viewType == 'history'){
			var canvas = document.getElementById(this.id);
  		var ctx = canvas.getContext("2d");
  		for(var x = 0; x < 75; x++){
  			for(var y = 0; y < 75; y++){
  				ctx.fillStyle = getColorPower(viewData[x][y]);
  				ctx.fillRect(x*10, y*10, 10, 10);
  			}
  		}
		}
		if(this.viewType == 'info'){
			$('#'+this.id).empty();
			$('#'+this.id).append(frames);
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
	var view = new View(750, 750, 'live', true, this.panelID+'liveCanvas', this.panelID);
	this.views.push(view);
	view = new View(750, 750, 'history', true, this.panelID+'historyCanvas', this.panelID);
	this.views.push(view);
	view = new View(750, 750, 'info', true, this.panelID+'infoWindow', this.panelID, 'Info text');
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
  this.powerGrid = new Grid(75, 75, 0.0, this.maxX);
  this.lights = [];
}

Room.prototype = {
	moveLights: function(){
		for(var i = 0; i < this.lights.length; i++){
			if(this.lights[i].dynamic){
				var sx = this.lights[i].startX;
				var sy = this.lights[i].startY;
				var ex = this.lights[i].endX;
				var ey = this.lights[i].endY;
				var speed = this.lights[i].speed;
				var direction = this.lights[i].directionX;
				var dirVectorX = ex - sx;
				var dirVectorY = ey - sy;
				var distance = Math.sqrt((dirVectorX*dirVectorX)+(dirVectorY*dirVectorY));
				var unitvectorX = dirVectorX / distance;
				var unitvectorY = dirVectorY / distance;
				if(direction == 'right'){
					this.lights[i].x += unitvectorX * speed;
					this.lights[i].y += unitvectorY * speed;
				}
				else{
					this.lights[i].x -= unitvectorX * speed;
					this.lights[i].y -= unitvectorY * speed;
				}
				if(this.lights[i].x < Math.min(sx,ex)){
					if(direction == 'right'){
						this.lights[i].directionX = 'left';
					}
					else{
						this.lights[i].directionX = 'right';
					}
					this.lights[i].x = Math.min(sx,ex);
					
				}
				else if(this.lights[i].y < Math.min(sy,ey) ){
					if(direction == 'right'){
						this.lights[i].directionX = 'left';
					}
					else{
						this.lights[i].directionX = 'right';
					}
					this.lights[i].y = Math.min(sy,ey);
				}
				else if(this.lights[i].x > Math.max(ex,sx)){
					if(direction == 'right'){
						this.lights[i].directionX = 'left';
					}
					else{
						this.lights[i].directionX = 'right';
					}
					this.lights[i].x = Math.max(ex,sx);
				}
				else if(this.lights[i].y > Math.max(ey,sy) ){
					if(direction == 'right'){
						this.lights[i].directionX = 'left';
					}
					else{
						this.lights[i].directionX = 'right';
					}
					this.lights[i].y = Math.max(ey,sy);
				}

			}
		}
	},
	calcPowerGrid: function(){
		for(var x = 0; x < this.powerGrid.x; x++){
			for(var y = 0; y < this.powerGrid.y; y++){
				var roomX = x * this.powerGrid.gsize; 
				var roomY = y * this.powerGrid.gsize;
				var wperm = this.getWperm(roomX, roomY, this.powerGrid.z);
				var old = this.powerGrid.gridHistory[this.powerGrid.historyIndex][x][y];
				var diff = (wperm - old) / this.powerGrid.gridHistory.length;
				this.powerGrid.averages[x][y] += diff;
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
		if(wperm <= 0 || wperm > 10000000000000){
			console.log(wperm);
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
	this.averages = [];
  for(var xi=0;xi < this.x; xi++){
  	var yRow = [];
  	for(var yi=0;yi < this.y; yi++){
  		yRow.push(0);
  	}
  	this.averages.push(yRow);
  }
}

Grid.prototype = {
	getLiveData: function(historyIndex){
		return this.gridHistory[historyIndex];
	},

	getHistoryData: function(historyIndex){
		/*
		var averageGrid = [];
		for(var x = 0; x < this.x; x++){
			var yRow = [];
			for(var y = 0; y < this.y; y++){
				var totalPower = 0;
				for(var h = 0; h < this.gridHistory.length; h++){
					totalPower += this.gridHistory[h][x][y];
				}
				yRow.push(totalPower/this.gridHistory.length);
			}
			averageGrid.push(yRow);
		}
		return averageGrid;
		*/
		return this.averages;
	}
}


