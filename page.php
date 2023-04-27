<div>
	<h1>CORDS Widget Settings</h1>
	<form action="options.php" method="POST">
		<?php
		settings_fields("cordsplugin");
		do_settings_sections("cords-settings");
		submit_button();
		?>
	</form>
</div>