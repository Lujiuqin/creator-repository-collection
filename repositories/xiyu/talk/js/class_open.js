window.onload = function(){
	var online = document.getElementById("online");
	var offline = document.getElementById("offline");
	var open_online = document.getElementById("open_online");
	var open_offline = document.getElementById("open_offline");
	online.onclick = function(){
		open_online.style.display = "block";
		open_offline.style.display = "none";
		// online.style.backgroundColor = "#A2CFE7";
		// offline.style.backgroundColor = "#F8F8F8";
	}
	offline.onclick = function(){
		open_online.style.display = "none";
		open_offline.style.display = "block";
		// online.style.backgroundColor = "#F8F8F8";
		// offline.style.backgroundColor = "#A2CFE7";
	}
}
$(document).ready(function(){
		var online = $('#online');
		var offline = $('#offline');
		var class_way = $('#class_way');
		var IT = $('#It');
		var Edu = $('#Edu');
		var Manage = $('#Manage');
		var Habit = $('#Habit');
		var Skill = $('#Skill');
		var class_type = $('#class_type');

		online.click(function(){
			class_way.attr("value","线上");
			online.attr("class","click_line");
			offline.attr("class","line");
		});
		offline.click(function(){
			class_way.attr("value","线下");
			offline.attr("class","click_line");
			online.attr("class","line");
		});
		IT.click(function(){
			class_type.attr("value","IT学习");
			IT.attr("class","click_line");
			Edu.attr("class","line");
			Manage.attr("class","line");
			Habit.attr("class","line");
			Skill.attr("class","line");
		});
		Edu.click(function(){
			class_type.attr("value","基础教育");
			IT.attr("class","line");
			Edu.attr("class","click_line");
			Manage.attr("class","line");
			Habit.attr("class","line");
			Skill.attr("class","line");
		});
		Manage.click(function(){
			class_type.attr("value","自我管理");
			IT.attr("class","line");
			Edu.attr("class","line");
			Manage.attr("class","click_line");
			Habit.attr("class","line");
			Skill.attr("class","line");
		});
		Habit.click(function(){
			class_type.attr("value","生活兴趣");
			IT.attr("class","line");
			Edu.attr("class","line");
			Manage.attr("class","line");
			Habit.attr("class","click_line");
			Skill.attr("class","line");
		});
		Skill.click(function(){
			class_type.attr("value","生活技能");
			IT.attr("class","line");
			Edu.attr("class","line");
			Manage.attr("class","line");
			Habit.attr("class","line");
			Skill.attr("class","click_line");
		});
		$("#city").click(function(){
			$("#city").val();
		});
	});