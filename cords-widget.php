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

		// Post Meta Box
		add_action("add_meta_boxes", array($this, "add_post_meta_boxes"));
		/* Save post meta on the 'save_post' hook. */
		add_action('save_post', array($this, "cords_save_post_meta"), 10, 2);


		// Add Widget
		add_action("wp_footer", array($this, "widget"));
	}

	function cords_save_post_meta($post_id, $post)
	{
		/* Verify the nonce before proceeding. */
		if (!isset($_POST['cords_name_nonce']) || !wp_verify_nonce($_POST['cords_name_nonce'], basename(__FILE__))) {
			return $post_id;
		}

		/* Get the post type object. */
		$post_type = get_post_type_object($post->post_type);
		/* Check if the current user has permission to edit the post. */
		if (!current_user_can($post_type->cap->edit_post, $post_id)) {
			return $post_id;
		}

		/* Get the posted data and sanitize it for use as an HTML class. */
		$new_meta_value = (isset($_POST['cords_name']) ? sanitize_text_field($_POST['cords_name']) : '');

		/* Get the meta key. */
		$meta_key = 'cords_name';

		/* Get the meta value of the custom field key. */
		$meta_value = get_post_meta($post_id, $meta_key, true);

		$changed = true;
		/* If a new meta value was added and there was no previous value, add it. */
		if ($new_meta_value && '' == $meta_value) {
			add_post_meta($post_id, $meta_key, $new_meta_value, true);
		}
		/* If the new meta value does not match the old value, update it. */ elseif ($new_meta_value && $new_meta_value != $meta_value) {
			update_post_meta($post_id, $meta_key, $new_meta_value);
		}
		/* If there is no new meta value but an old value exists, delete it. */ elseif ('' == $new_meta_value && $meta_value) {
			delete_post_meta($post_id, $meta_key, $meta_value);
		} else {
			$changed = false;
		}
		if ($changed) {
			wp_remote_post(
				"http://localhost:3000/api/cords",
				array(
					'method' => 'POST',
					'body' => json_encode(array($meta_key => $new_meta_value)),
				)
			);
		}
	}

	function add_post_meta_boxes()
	{
		add_meta_box("cords_post_meta_data", "CORDS", array($this, "post_meta_box_html"), ["page", "post"], "normal", "high");
	}

	function post_meta_box_html($post)
	{ ?>
		<?php wp_nonce_field(basename(__FILE__), 'cords_name_nonce'); ?>
		<div>
			<label for="cords_name">
				Name
			</label>
			<input type="text" name="cords_name" value="<?php echo esc_attr(get_post_meta($post->ID, 'cords_name', true)) ?>">
		</div>
	<?php }


	// Settings page setup 
	function settings()
	{
		add_settings_section("cp_first_section", null, null, "cords-settings");

		// Keywords
		add_settings_field("cp_keywords", "Keywords", array($this, 'textInputHTML',), "cords-settings", "cp_first_section", array("name" => "cp_keywords", "type" => "text"));
		register_setting("cordsplugin", "cp_keywords", array("sanitize_callback" => "sanitize_text_field", "default" => ""));

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
		require_once plugin_dir_path(__FILE__) . "admin.php";
	}

	// Adds widget html 
	function widget()
	{
		echo '<cords-widget 
				keywords="' . get_option("cp_keywords") . '" 
				></cords-widget>
			<script type="module" src="https://cords-widget.vercel.app/widget.js"></script>';
	}
}

$CORDSWidgetPlugin = new CORDSWidgetPlugin();
