"use strict";
var load_complete = function() {
	var checkboxes = document.getElementsByTagName("input");
	for (var x = 0; x < checkboxes.length; x++) {
		checkboxes[x].onchange = click_checkbox;
	}
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
	var FUDGE = 190;
	var total_holder = document.getElementById("RunningTotal");
	var current_total = parseInt(total_holder.innerHTML, 10);
	var max_calories = parseInt(document.getElementById("MaxCals").value, 10);

	var checkboxes = document.querySelectorAll("input[type=checkbox]");
	for (var x = 0; x < checkboxes.length; x++) {
		if (checkboxes[x].checked)
			checkboxes[x].parentNode.parentNode.className = "";
		else if (current_total + foods[x].Cal > max_calories + FUDGE)
			checkboxes[x].parentNode.parentNode.className = "Over";
		else if (current_total + foods[x].Cal > max_calories)
			checkboxes[x].parentNode.parentNode.className = "Warning";
		else
			checkboxes[x].parentNode.parentNode.className = "";
	}
}
load_complete();
