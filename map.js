var userData = JSON.parse(document.getElementById('userData').value);
var responseData = JSON.parse(document.getElementById('responseData').value);


var drawID = {};
var radius = userData.length*75/2/Math.PI;
for (var i = 0; i < userData.length; i++)
{
	drawID[userData[i].userName] = i;

	var avatarIMG = document.createElement('img');
	avatarIMG.src = userData[i].imgURL;
	avatarIMG.id = "a-"+i;

	avatarIMG.style.position = "absolute";

	avatarIMG.style.top = (50+radius+radius*Math.sin(2*Math.PI*i/userData.length))+ "px";
	avatarIMG.style.left = (50+radius*3/2+radius*3/2*Math.cos(2*Math.PI*i/userData.length)) + "px";
	avatarIMG.height = "50";
	avatarIMG.width = "50";

	avatarIMG.ondragstart = function(){return false;};

	avatarIMG.onmousedown = function(e)
	{
		var x = Number(this.style.left.substring(0,this.style.left.length-2));
		var y = Number(this.style.top.substring(0,this.style.top.length-2));
		var offsetX = x - e.pageX
		var offsetY = y - e.pageY;

		var myElement = this;

		this.moveToMouse = function(e){

			myElement.style.left = e.pageX + offsetX + "px";
			myElement.style.top = e.pageY + offsetY + "px";

			var id = myElement.id.substring(2);
			var lines = document.getElementsByClassName("h-"+id);
			for (var i = 0; i < lines.length; i++)
			{
				lines[i].setAttribute('x1',e.pageX + offsetX +25);
				lines[i].setAttribute('y1',e.pageY + offsetY +25);
			}
			lines = document.getElementsByClassName("t-"+id);
			for (var i = 0; i < lines.length; i++)
			{
				lines[i].setAttribute('x2',e.pageX + offsetX +25);
				lines[i].setAttribute('y2',e.pageY + offsetY +25);
			}
		};

		window.onmousemove = this.moveToMouse;
		//console.log(e);
	}
	avatarIMG.onmouseup = function()
	{
		//alert();
		window.onmousemove = function(){return false};
	}

	avatarIMG.drawArrows = function()
	{

	}


	document.body.appendChild(avatarIMG);
	userData[i]
}



//"http://www.w3.org/2000/svg"

var SVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
SVG.style = "position: absolute; top:0px; left:0px; z-index: -1;"
SVG.setAttribute('height', Math.floor(radius*2+200));
SVG.setAttribute('width', Math.floor(radius*3+200));
document.body.appendChild(SVG);


for (var i = 0; i < responseData.length; i++)
{
	var head = document.getElementById('a-'+drawID[responseData[i][0]]);
	var tail = document.getElementById('a-'+drawID[responseData[i][1]]);

	var sx = head.style.left;
	var sy = head.style.top;
	var ex = tail.style.left;
	var ey = tail.style.top;

	sx = Number(sx.substring(0,sx.length-2))+25;
	sy = Number(sy.substring(0,sy.length-2))+25;
	ex = Number(ex.substring(0,ex.length-2))+25;
	ey = Number(ey.substring(0,ey.length-2))+25;

	var line = document.createElementNS("http://www.w3.org/2000/svg",'line');
	line.style = "stroke:rgb(0,0,0);stroke-width:" + (Math.log2(responseData[i][2])+1);
	line.classList.add('h-'+drawID[responseData[i][0]]);
	line.classList.add('t-'+drawID[responseData[i][1]]);

	line.setAttribute('x1',sx);
	line.setAttribute('x2',ex);
	line.setAttribute('y1',sy);
	line.setAttribute('y2',ey);
	SVG.appendChild(line);
		
	//responseData[i]
}




function makeCanvas()
{
	var canvas = document.createElement('canvas');
	var SVG = document.getElementsByTagName('svg')[0]
	canvas.setAttribute('height',SVG.getAttribute('height'));
	canvas.setAttribute('width',SVG.getAttribute('width'));
	document.body.appendChild(canvas);

	var ctx = canvas.getContext('2d');

	var lines = document.getElementsByTagName('line');
	ctx.fillStyle = "#000000";

	while(lines.length>0)
	{
		ctx.beginPath();
		ctx.moveTo(lines[0].getAttribute('x1'),lines[0].getAttribute('y1'));
		ctx.lineTo(lines[0].getAttribute('x2'),lines[0].getAttribute('y2'));
		ctx.lineWidth = lines[0].style.strokeWidth;
		ctx.stroke();
		lines[0].parentNode.removeChild(lines[0]);
	}
	
	SVG.parentNode.removeChild(SVG);

	var IMGs = document.getElementsByTagName('img');
	while(IMGs.length>0)
	{
		var y = IMGs[0].style.top.substring(0,IMGs[0].style.top.length-2);
		var x = IMGs[0].style.left.substring(0,IMGs[0].style.left.length-2);
		IMGs[0].style.width = IMGs[0].width + "px";
		IMGs[0].style.height = IMGs[0].height + "px";

		ctx.drawImage(IMGs[0],x,y,IMGs[0].width,IMGs[0].height);
		IMGs[0].parentNode.removeChild(IMGs[0]);
	}
}

var text = document.createElement("p");
text.innerHTML = "Images are draggable, feel free to move them around.<br/>";
document.body.appendChild(text);

var button = document.createElement('button');
button.onclick = makeCanvas;
button.innerHTML = "Turn into canvas (image)";
text.appendChild(button);

