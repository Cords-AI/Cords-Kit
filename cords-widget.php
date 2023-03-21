<?php

/**
 * Plugin Name: CORDS Widget
 * Description: Adds a widget to help users find similar resources
 * Version: 0.1
 * Author: Billy
 * Author URI: billyhawkes.com
 */

class CORDSWidgetPlugin
{
	function __construct()
	{
		// Settings Page
		add_action("admin_menu", array($this, "settingsPage"));
		// Settings Setup
		add_action("admin_init", array($this, "settings"));

		// Add Widget
		add_action("wp_body_open", array($this, "widget"));
	}


	// Settings page setup 
	function settings()
	{
		add_settings_section("cp_first_section", null, null, "cords-settings");

		// Keywords setting
		add_settings_field("cp_keywords", "Site Keywords", array($this, 'keywordsHTML'), "cords-settings", "cp_first_section");
		register_setting("cordsplugin", "cp_keywords", array("sanitize_callback" => "sanitize_text_field", "default" => ""));

		// Toggle Widget
		add_settings_field("cp_show_widget", "Show Widget", array($this, 'showWidgetHTML'), "cords-settings", "cp_first_section");
		register_setting("cordsplugin", "cp_show_widget", array("sanitize_callback" => "sanitize_text_field", "default" => "true"));
	}
	function settingsPage()
	{
		add_options_page("CORDS", "CORDS Widget Settings", "manage_options", "cords-settings", array($this, 'settingsHTML'));
	}
	// Input HTML
	function keywordsHTML()
	{ ?>
		<input name="cp_keywords" type="text" value="<?php echo esc_attr(get_option("cp_keywords")) ?>" />
	<?php }
	function showWidgetHTML()
	{ ?>
		<input name="cp_show_widget" type="checkbox" value="true" <?php checked(get_option("cp_show_widget"), "true") ?> />
	<?php }

	// Settings page html form
	function settingsHTML()
	{ ?>
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
<?php }

	// Adds widget html 
	function widget()
	{
		if (get_option("cp_show_widget") == "true") {
			return '<div id="widget" data-keywords="' . get_option("cp_keywords") . '" data-description="' . get_option("blogdescription") . '"></div><script src="https://billyhawkes.github.io/widget/dist/widget.js"></script>';
		}
	}
}

$CORDSWidgetPlugin = new CORDSWidgetPlugin();
