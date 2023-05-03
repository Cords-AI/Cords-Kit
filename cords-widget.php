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
		if (!isset($_POST['cords_meta_nonce']) || !wp_verify_nonce($_POST['cords_meta_nonce'], basename(__FILE__))) {
			return $post_id;
		}

		/* Get the post type object. */
		$post_type = get_post_type_object($post->post_type);
		/* Check if the current user has permission to edit the post. */
		if (!current_user_can($post_type->cap->edit_post, $post_id)) {
			return $post_id;
		}

		$meta_keys = ["cords_name_en", "cords_description_en", "cords_name_fr", "cords_description_fr"];

		$content = apply_filters("the_content", $post->post_content);
		$meta_data = ["url" => get_permalink($post_id), "content" => $content, "id" => $post_id];
		$changed = false;

		foreach ($meta_keys as $meta_key) {
			/* Get the posted data and sanitize it. */
			$new_meta_value = (isset($_POST[$meta_key]) ? sanitize_text_field($_POST[$meta_key]) : '');

			/* Get the meta value of the custom field key. */
			$meta_value = get_post_meta($post_id, $meta_key, true);

			$meta_data[$meta_key] = $new_meta_value;

			/* If a new meta value was added and there was no previous value, add it. */
			if ($new_meta_value && '' == $meta_value) {
				add_post_meta($post_id, $meta_key, $new_meta_value, true);
				$changed = true;
			}
			/* If the new meta value does not match the old value, update it. */ elseif ($new_meta_value && $new_meta_value != $meta_value) {
				update_post_meta($post_id, $meta_key, $new_meta_value);
				$changed = true;
			}
			/* If there is no new meta value but an old value exists, delete it. */ elseif ('' == $new_meta_value && $meta_value) {
				delete_post_meta($post_id, $meta_key, $meta_value);
				$changed = true;
			}
		}
		if ($changed) {
			wp_remote_post(
				"http://localhost:3000/api/cords",
				array(
					'method' => 'POST',
					'body' => json_encode($meta_data),
				)
			);
		}
	}

	function add_post_meta_boxes()
	{
		add_meta_box("cords_post_meta_data", "CORDS", array($this, "post_meta_box_html"), ["page"], "normal", "high");
	}

	function post_meta_box_html($page)
	{ ?>
		<?php wp_nonce_field(basename(__FILE__), 'cords_meta_nonce'); ?>
		<style>
			#cords_meta_container {
				display: flex;
				flex-direction: column;
			}

			#cords_meta_container label {
				font-weight: bold;
				margin-bottom: 10px;
				display: flex;
				flex-direction: column;
			}

			#cords_meta_container input {
				font-weight: normal;
				margin-top: 5px;
			}

			#cords_meta_explanation {
				font-weight: bold;
				padding: 15px;
				margin-bottom: 10px;
				background-color: rgb(71 85 105);
				color: white;
				border-radius: 10px;
			}
		</style>
		<div id="cords_meta_container">
			<div id="cords_meta_explanation">
				Please enter this pages information to allow indexing.
			</div>
			<label>
				Name (English)
				<input type="text" name="cords_name_en" value="<?php echo esc_attr(get_post_meta($page->ID, 'cords_name_en', true)) ?>" />
			</label>
			<label>
				Description (English)
				<input type="text" name="cords_description_en" value="<?php echo esc_attr(get_post_meta($page->ID, 'cords_description_en', true)) ?>" />
			</label>
			<label>
				Name (French)
				<input type="text" name="cords_name_fr" value="<?php echo esc_attr(get_post_meta($page->ID, 'cords_name_fr', true)) ?>" />
			</label>
			<label>
				Description (French)
				<input type="text" name="cords_description_fr" value="<?php echo esc_attr(get_post_meta($page->ID, 'cords_description_fr', true)) ?>" />
			</label>
		</div>
	<?php
	}


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
