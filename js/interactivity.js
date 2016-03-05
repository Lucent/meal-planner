"use strict";

var load_complete = function() {
	var checkboxes = document.querySelectorAll("input[type=checkbox]");
	for (var x = 0; x < checkboxes.length; x++) {
		checkboxes[x].onchange = click_checkbox;
		checkboxes[x].parentNode.parentNode.onmouseenter = simulate_food_check;
		checkboxes[x].parentNode.parentNode.onmouseleave = simulate_food_uncheck;
	}
	document.getElementById("FoodChoices").onmouseleave = clear_strikethroughs;
	document.getElementById("RunningTotal").onchange = update_available_foods;
	document.getElementById("GoalCals").onchange = update_available_foods;
	document.getElementById("MaxCals").onchange = update_available_foods;
};

var simulate_food_check = function(e) {
	var checkbox = this.querySelector("input");
	checkbox.simulated = true;
	checkbox.onchange();
};
var simulate_food_uncheck = function(e) {
	var checkbox = this.querySelector("input");
	checkbox.simulated = false;
	checkbox.onchange();
};

var click_checkbox = function(e) {
	var total_holder = document.getElementById("RunningTotal");
	var current_total = parseInt(total_holder.value, 10);
	if (typeof e !== "undefined") {
		if (this.checked)
			total_holder.simulated = total_holder.value = current_total + foods[this.id].Cal;
		else
			total_holder.simulated = total_holder.value = current_total - foods[this.id].Cal;
	} else {
		if (this.simulated)
			total_holder.simulated = current_total + foods[this.id].Cal;
		else
			total_holder.simulated = current_total - foods[this.id].Cal;
	}
	update_available_foods(this);
};

var update_available_foods = function(current) {
	var total_holder = document.getElementById("RunningTotal");
	var current_total = parseInt(total_holder.value, 10);
	var future_total = parseInt(total_holder.simulated, 10);
	var goal_calories = parseInt(document.getElementById("GoalCals").value, 10);
	var max_calories = parseInt(document.getElementById("MaxCals").value, 10);

	var checkboxes = document.querySelectorAll("input[type=checkbox]");
	for (var x = 0; x < checkboxes.length; x++) {
		var food_label = checkboxes[x].parentNode.parentNode.querySelector("label");

		if (checkboxes[x].checked)
			food_label.style.color = "black";
		else if (current_total + foods[x].Cal > max_calories)
			food_label.style.color = "#DDDDDD";
		else if (current_total + foods[x].Cal > goal_calories)
			food_label.style.color = calc_color(current_total + foods[x].Cal, "000000", "DDDDDD", goal_calories, max_calories);
		else
			food_label.style.color = "black";

		if (checkboxes[x].id == current.id || checkboxes[x].checked) {
			food_label.parentNode.className = "";
			food_label.parentNode.style.color = "";
		} else if (future_total + foods[x].Cal > max_calories) {
			food_label.parentNode.className = "Over";
			food_label.parentNode.style.color = "#000000";
		} else if (future_total + foods[x].Cal > goal_calories) {
			food_label.parentNode.className = "Over";
			food_label.parentNode.style.color = calc_color(future_total + foods[x].Cal, "DDDDDD", "000000", goal_calories, max_calories);
		} else {
			food_label.parentNode.className = "";
			food_label.parentNode.style.color = "";
		}
	}
};

var clear_strikethroughs = function() {
	var checkboxes = document.querySelectorAll("input[type=checkbox]");
	for (var x = 0; x < checkboxes.length; x++) {
		var food_label = checkboxes[x].parentNode.parentNode.querySelector("label");
		food_label.className = "";
		food_label.parentNode.style.color = "";
	}
};

var calc_color = function(value, start, end, min, max) {
	var n = (value - min) / (max - min), result;
	end = parseInt(end, 16);
	start = parseInt(start, 16);

	result = start + ((( Math.round(((((end & 0xFF0000) >> 16) - ((start & 0xFF0000) >> 16)) * n))) << 16) + (( Math.round(((((end & 0x00FF00) >> 8) - ((start & 0x00FF00) >> 8)) * n))) << 8) + (( Math.round((((end & 0x0000FF) - (start & 0x0000FF)) * n)))));

	return "#" + ((result >= 0x100000) ? "" : (result >= 0x010000) ? "0" : (result >= 0x001000) ? "00" : (result >= 0x000100) ? "000" : (result >= 0x000010) ? "0000" : "00000") + result.toString(16);
}

load_complete();
