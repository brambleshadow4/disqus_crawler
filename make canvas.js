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