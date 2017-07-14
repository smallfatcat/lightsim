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