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
		add_action("admin_menu", array($this, "addAdminPages"));
		// Settings Setup
		add_action("admin_init", array($this, "settings"));

		// Add Widget
		add_action("wp_footer", array($this, "widget"));
	}

	// Settings page setup 
	function settings()
	{
		add_settings_section("cp_first_section", null, null, "cords-settings");

		// Name EN
		add_settings_field("cp_name_en", "Name (English)", array($this, 'textInputHTML',), "cords-settings", "cp_first_section", array("name" => "cp_name_en", "type" => "text"));
		register_setting("cordsplugin", "cp_name_en", array("sanitize_callback" => "sanitize_text_field", "default" => ""));

		// Name FR
		add_settings_field("cp_name_fr", "Name (French)", array($this, 'textInputHTML',), "cords-settings", "cp_first_section", array("name" => "cp_name_fr", "type" => "text"));
		register_setting("cordsplugin", "cp_name_fr", array("sanitize_callback" => "sanitize_text_field", "default" => ""));

		// Description EN
		add_settings_field("cp_description_en", "Description (English)", array($this, 'textAreaHTML',), "cords-settings", "cp_first_section", array("name" => "cp_description_en"));
		register_setting("cordsplugin", "cp_description_en", array("sanitize_callback" => "sanitize_text_field", "default" => ""));

		// Description FR
		add_settings_field("cp_description_fr", "Description (French)", array($this, 'textAreaHTML',), "cords-settings", "cp_first_section", array("name" => "cp_description_fr"));
		register_setting("cordsplugin", "cp_description_fr", array("sanitize_callback" => "sanitize_text_field", "default" => ""));

		// Email
		add_settings_field("cp_email", "Email", array($this, 'textInputHTML',), "cords-settings", "cp_first_section", array("name" => "cp_email", "type" => "email"));
		register_setting("cordsplugin", "cp_email", array("sanitize_callback" => "sanitize_text_field", "default" => ""));

		// Website
		add_settings_field("cp_website", "Website", array($this, 'textInputHTML',), "cords-settings", "cp_first_section", array("name" => "cp_website", "type" => "text"));
		register_setting("cordsplugin", "cp_website", array("sanitize_callback" => "sanitize_text_field", "default" => ""));
	}

	function addAdminPages()
	{
		add_menu_page("CORDS Plugin", "CORDS", "manage_options", "cords-settings", array($this, 'settingsHTML'), plugin_dir_url(__FILE__) . 'icon.svg', 110);
	}

	// Input HTML
	function textInputHTML($args)
	{ ?>
		<input name="<?php echo $args["name"] ?>" type="<?php echo $args["type"] ?>" value="<?php echo esc_attr(get_option($args["name"])) ?>" />
	<?php }
	function textAreaHTML($args)
	{ ?>
		<textarea rows="10" name="<?php echo $args["name"] ?>"><?php echo esc_attr(get_option($args["name"])) ?></textarea>
<?php }

	// Settings page html form
	function settingsHTML()
	{
		require_once plugin_dir_path(__FILE__) . "page.php";
	}

	// Adds widget html 
	function widget()
	{
		echo '<cords-widget keywords="' . get_option("cp_name_en") . '"></cords-widget><script type="module" src="https://cords-widget.vercel.app/widget.js"></script>';
	}
}

$CORDSWidgetPlugin = new CORDSWidgetPlugin();
