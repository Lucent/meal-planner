"use strict";

var last_checkbox;
var foods = [];

async function load_complete() {
	await fetch_foods("foods.tsv");
	var checkboxes = document.querySelectorAll("input[type=checkbox]");
	for (var x = 0; x < checkboxes.length; x++) {
		checkboxes[x].onchange = click_checkbox;
		checkboxes[x].parentNode.parentNode.onmouseenter = simulate_food_check;
		checkboxes[x].parentNode.parentNode.onmouseleave = simulate_food_uncheck;
	}
	document.getElementById("FoodChoices").onmouseleave = clear_outlines;
	document.getElementById("RunningTotal").onchange = update_available_foods;
	document.getElementById("GoalCals").onchange = update_available_foods;
	document.getElementById("MaxCals").onchange = update_available_foods;
};

async function fetch_foods(filename) {
	const response = await fetch(filename);
	const data = await response.text();
	const lines = data.split('\n').slice(1);
	for (const line of lines) {
		if (line.trim() === "") continue; // Ignore empty lines
		const [food_name, calories, person] = line.split('\t');
		foods.push({
			Name: food_name,
			Cal: parseInt(calories, 10),
			Person: person
		});
	}

	populate_table();
}

function populate_table() {
	const table = document.querySelector("#FoodChoices").tBodies[0];

	for (const [key, food] of foods.entries()) {
		// Create a new row and cells.
		const row = table.insertRow();

		// First cell with a checkbox.
		const cell1 = row.insertCell(0);
		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.id = key.toString();
		cell1.appendChild(checkbox);

		// Second cell with calories, aligned to the right.
		const cell2 = row.insertCell(1);
		cell2.setAttribute('align', 'right');
		cell2.textContent = food.Cal;

		// Third cell with food name.
		const cell3 = row.insertCell(2);
		const label = document.createElement('label');
		label.setAttribute('for', key.toString());
		label.textContent = food.Name;
		cell3.appendChild(label);
	}
}

var simulate_food_check = function(e) {
	var checkbox = this.querySelector("input");
	checkbox.simulated = true;
	checkbox.onchange();
};
var simulate_food_uncheck = function(e) {
	var checkbox = this.querySelector("input");
	checkbox.simulated = false;
	last_checkbox = checkbox;
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
			food_label.parentNode.style.borderColor = "";
		} else if (future_total + foods[x].Cal > max_calories) {
			food_label.parentNode.className = "Over";
			food_label.parentNode.style.borderColor = "";
		} else if (future_total + foods[x].Cal > goal_calories) {
			food_label.parentNode.className = "Over";
			food_label.parentNode.style.borderColor = calc_color(future_total + foods[x].Cal, "000000", "DDDDDD", goal_calories, max_calories);
		} else {
			food_label.parentNode.className = "";
			food_label.parentNode.style.borderColor = "black";
		}
	}
};

var clear_outlines = function() {
	last_checkbox.onchange();
	var checkboxes = document.querySelectorAll("input[type=checkbox]");
	for (var x = 0; x < checkboxes.length; x++) {
		var food_label = checkboxes[x].parentNode.parentNode.querySelector("label");
		food_label.parentNode.className = "";
		food_label.parentNode.style.borderColor = "";
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
