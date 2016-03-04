"use strict";
var load_complete = function() {
	var checkboxes = document.getElementsByTagName("input");
	for (var x = 0; x < checkboxes.length; x++) {
		checkboxes[x].onchange = click_checkbox;
	}
};
var click_checkbox = function(e) {
	var total_holder = document.getElementById("CalTotal");
	var current_total = parseInt(total_holder.innerHTML, 10);
	if (this.checked)
		total_holder.innerHTML = current_total + foods[this.id].Cal;
	else
		total_holder.innerHTML = current_total - foods[this.id].Cal;
};
load_complete();
