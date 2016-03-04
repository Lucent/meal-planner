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
 <style>
table		{ font-size: large; }
.Over		{ color: #DDD; }
.Warning	{ color: #DD0; }
 </style>
 <script src="js/interactivity.js" defer></script>
 <script>
var foods = <?= json_encode($foods) ?>;
 </script>
</head>
<body>
<div style="position: fixed; top: 1ex; right: 1ex; font-size: x-large;"><span id="RunningTotal">0</span> kcal of <input type="text" id="MaxCals" value="1300" style="width: 5ex; font-size: inherit;"> selected</div>
<table>
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
	echo "   <td>", $food["Name"], "</td>\n";
	echo "  </tr>\n";
}
?>
 </tbody>
</table>
</body>
</html>
