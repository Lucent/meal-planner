<?
$food_file = "foods.tsv";

$foods = [];
$fp = fopen($food_file, "r");
$line = fgets($fp); // Burn first line
while (($line = fgetcsv($fp, 0, "\t")) !== FALSE) {
	list($food_name, $calories, $person) = $line;
	$foods[] = [
		"Name" => $food_name,
		"Cal" => (int) $calories,
		"Person" => $person
	];
}
?>
<!DOCTYPE html>
<html>
<head>
 <title>Food Picker</title>
 <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
 <style>
.Over		{ text-decoration: line-through; }
td			{ color: black; }
table		{ font-size: large; margin-top: 5em; }
div			{ position: fixed; top: 1ex; right: 1ex; margin-left: 1ex; padding: 0.5ex; font-size: x-large; background-color: white; border: thin solid #CCC; }
input[type=text]	{ width: 5ex; font-size: inherit; text-align: right; }
 </style>
 <script src="js/interactivity.js" defer></script>
 <script>
var foods = <?= json_encode($foods) ?>;
 </script>
</head>
<body>
<div><input type="text" id="RunningTotal" value="0"> kcal of <input type="text" id="GoalCals" value="1300"> daily goal and <input type="text" id="MaxCals" value="1490"> hard limit</div>
<table id="FoodChoices">
 <thead>
  <th></th>
  <th>kcal</th>
  <th>Food</th>
 </thead>
 <tbody>
<?
foreach ($foods as $key=>$food) {
	echo "  <tr>\n";
	echo "   <td><input type='checkbox' id='$key'></td>\n";
	echo "   <td align='right'>", $food["Cal"], "</td>\n";
	echo "   <td><label for='$key'>", $food["Name"], "</label></td>\n";
	echo "  </tr>\n";
}
?>
 </tbody>
</table>
</body>
</html>
