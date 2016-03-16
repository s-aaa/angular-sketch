var sketch=angular.module('sketch',[]);
sketch.controller('sketchController', ['$scope', function($scope){
	$scope.canvasWH={width:600,height:600};
	$scope.csState={
		fillStyle:'#26c6da',
		strokeStyle:'#26c6da',
		lineWidth:1,
		style:'stroke'
	}
	$scope.setStyle=function(s){
		$scope.csState.style=s;
		console.log($scope.csState.style)
	}
	$scope.tool='rect';
	$scope.tools={
		'画线':'line',
		'画圆':'arc',
		'画矩形':'rect',
		'铅笔':'pen',
		'橡皮':'erase',
	}
	$scope.settool=function(tool){
		$scope.tool=tool;
	}
	$scope.newSketch=function(){
		if (current) {
			if (confirm('是否保存','')) {
				location.href=canvas.toDataURL();
			}
		}
		clearCanvas();
		current=null;
		
	}
	$scope.save=function(ev){
		if (current) {
			ev.srcElement.href=canvas.toDataURL();
			ev.srcElement.download='mypic.png';
		}else{
			alert('空画布')
		}
	}

	var canvas=document.querySelector('#canvas');
	var ctx=canvas.getContext('2d');
	var current;
	var clearCanvas=function(){
		ctx.clearRect(0,0,$scope.canvasWH.width,$scope.canvasWH.height)
	}

	var setmousemove={
		line:function(e){
			canvas.onmousemove=function(ev){
				ctx.clearRect(0,0,$scope.canvasWH.width,$scope.canvasWH.height)
				if (current) {
					ctx.putImageData(current,0,0)
				}
				ctx.beginPath();
				ctx.moveTo(e.offsetX,e.offsetY);
				ctx.lineTo(ev.offsetX,ev.offsetY);
				ctx.stroke();
			}
		},
		arc:function(e){
			canvas.onmousemove=function(ev){
				var r=Math.abs(ev.offsetX-e.offsetX);
				ctx.clearRect(0,0,$scope.canvasWH.width,$scope.canvasWH.height);
				if (current) {
					ctx.putImageData(current,0,0)
				}
				ctx.beginPath();
				ctx.moveTo(e.offsetX+r,e.offsetY)
				ctx.arc(e.offsetX,e.offsetY,r,0,Math.PI*2);
				if ($scope.csState.style=='stroke') {
					ctx.stroke();
				}else{
					ctx.fill();
				}
				
			}
		},
		rect:function(e){
			canvas.onmousemove=function(ev){
				ctx.clearRect(0,0,$scope.canvasWH.width,$scope.canvasWH.height);
				if (current) {
					ctx.putImageData(current,0,0)
				}
				ctx.beginPath();
				if ($scope.csState.style=='stroke') {

				ctx.strokeRect(e.offsetX,e.offsetY,ev.offsetX-e.offsetX,ev.offsetY-e.offsetY)
				}else{
					ctx.fillRect(e.offsetX,e.offsetY,ev.offsetX-e.offsetX,ev.offsetY-e.offsetY)
				}
			}
		},
		pen:function(e){
			ctx.clearRect(0,0,$scope.canvasWH.width,$scope.canvasWH.height)
			if (current) {
				ctx.putImageData(current,0,0)
			}
			ctx.beginPath();
			ctx.moveTo(e.offsetX,e.offsetY);
			canvas.onmousemove=function(ev){
				ctx.lineTo(ev.offsetX,ev.offsetY);
				ctx.stroke();
			}
		},
		erase:function(e){
			canvas.onmousemove=function(ev){
				ctx.clearRect(e.offsetX,e.offsetY,ev.offsetX-e.offsetX,ev.offsetY-e.offsetY)
			}
		}
	}
	
	canvas.onmousedown=function(e){
		ctx.fillStyle=$scope.csState.fillStyle;
		ctx.strokeStyle=$scope.csState.strokeStyle;
		ctx.lineWidth=$scope.csState.lineWidth;
		setmousemove[$scope.tool](e);
		document.onmouseup=function(){
			canvas.onmousemove=null;
			document.onmouseup=null;
			current=ctx.getImageData(0,0,$scope.canvasWH.width,$scope.canvasWH.height);
		}	
	}
}])