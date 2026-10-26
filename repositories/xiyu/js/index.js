// JavaScript Document
window.onload = function(){
var hot = document.getElementById("hot");
var time = document.getElementById("time");
var contant_hot = document.getElementById("contant_hot");
var contant_time = document.getElementById("contant_time");
hot.onclick = function(){
	
	contant_hot.style.display = "block";
	contant_time.style.display = "none";
	time.style.color="#000";
	hot.style.color="#06F"
	}
time.onclick = function(){
	    contant_hot.style.display = "none";
		contant_time.style.display = "block";
		
	hot.style.color="#000";
	time.style.color="#06F"
	}
}
