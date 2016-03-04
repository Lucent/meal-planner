"use strict";
var load_complete = function() {
	var checkboxes = document.getElementsByTagName("input");
	for (var x = 0; x < checkboxes.length; x++) {
		checkboxes[x].onchange = click_checkbox;
	}
	document.getElementById("GoalCals").onchange = update_available_foods;
	document.getElementById("MaxCals").onchange = update_available_foods;
};
var click_checkbox = function(e) {
	var total_holder = document.getElementById("RunningTotal");
	var current_total = parseInt(total_holder.innerHTML, 10);
	if (this.checked)
		total_holder.innerHTML = current_total + foods[this.id].Cal;
	else
		total_holder.innerHTML = current_total - foods[this.id].Cal;
	update_available_foods();
};
var update_available_foods = function() {
	var total_holder = document.getElementById("RunningTotal");
	var current_total = parseInt(total_holder.innerHTML, 10);
	var goal_calories = parseInt(document.getElementById("GoalCals").value, 10);
	var max_calories = parseInt(document.getElementById("MaxCals").value, 10);

	var checkboxes = document.querySelectorAll("input[type=checkbox]");
	for (var x = 0; x < checkboxes.length; x++) {
		if (checkboxes[x].checked)
			checkboxes[x].parentNode.parentNode.style.color = "";
		else if (current_total + foods[x].Cal > max_calories)
			checkboxes[x].parentNode.parentNode.style.color = "#DDDDDD";
		else if (current_total + foods[x].Cal > goal_calories)
			checkboxes[x].parentNode.parentNode.style.color = calc_color(current_total + foods[x].Cal, "000000", "DDDDDD", goal_calories, max_calories);
		else
			checkboxes[x].parentNode.parentNode.style.color = "";
	}
}
var calc_color = function(value, start, end, min, max) {
	var n = (value - min) / (max - min), result;
	end = parseInt(end, 16);
	start = parseInt(start, 16);

	result = start + ((( Math.round(((((end & 0xFF0000) >> 16) - ((start & 0xFF0000) >> 16)) * n))) << 16) + (( Math.round(((((end & 0x00FF00) >> 8) - ((start & 0x00FF00) >> 8)) * n))) << 8) + (( Math.round((((end & 0x0000FF) - (start & 0x0000FF)) * n)))));

	return "#" + ((result >= 0x100000) ? "" : (result >= 0x010000) ? "0" : (result >= 0x001000) ? "00" : (result >= 0x000100) ? "000" : (result >= 0x000010) ? "0000" : "00000") + result.toString(16);
}
load_complete();
