<?php

/**
 * Plugin Name: CORDS
 * Description: Plugin for implementing CORDS in your WordPress site. Includes indexing and widget support.
 * Version: 0.0.1
 * Author: Billy
 * Author URI: https://billyhawkes.com
 */

// REGISTER VALUES //
add_action('init', 'cords_register_values');
function cords_register_values()
{
	// Post meta
	register_meta('post', 'cords_enabled', array(
		'show_in_rest' => true,
		'type' => 'boolean',
		'default' => true,
		'single' => true,
		'auth_callback' => function () {
			return current_user_can('edit_posts');
		}
	));
	register_meta('post', 'cords_widget', array(
		'show_in_rest' => true,
		'type' => 'boolean',
		'default' => true,
		'single' => true,
		'auth_callback' => function () {
			return current_user_can('edit_posts');
		}
	));
	// Options
	add_option("cords_api_key", "");
}

// INDEXING //
add_action('template_redirect', 'cords_check_cookie_and_redirect');
function cords_check_cookie_and_redirect()
{
	// Check if the 'cords-id' query parameter is set
	if (isset($_GET['cordsId'])) {
		$cordsId = sanitize_text_field($_GET['cordsId']);

		// Set the 'cords-id' cookie for 30 days
		setcookie('cords-id', $cordsId, time() + (86400 * 30), "/", false, wp_get_environment_type() === "local" ? false : true, true);

		// Prepare the URL to redirect to (same URL but without the 'cordsId' query parameter)
		$redirect_url = remove_query_arg('cordsId');

		// Redirect to clear the 'cords-id' query parameter from the URL
		wp_redirect($redirect_url);
		exit();
	}
	if (!isset($_COOKIE['cords-id'])) {
		$origin = wp_get_environment_type() === "local" ? "http://localhost:3000" : "https://cords-prod.nuonn.com";
		$redirect_url = is_singular() ? get_permalink() : home_url();
		wp_redirect($origin . '/login?redirect=' . urlencode($redirect_url));
		exit();
	}
}

// ADMIN MENU //
add_action('admin_menu', 'cords_init_menu');
function cords_init_menu()
{
	add_menu_page('CORDS', 'CORDS', 'manage_options', 'cords', 'cords_admin_page', 'dashicons-admin-post', '2.1');
}
function cords_admin_page()
{
	echo '<div id="cords"></div>';
}
add_action('admin_enqueue_scripts', 'cords_admin_enqueue_scripts');
function cords_admin_enqueue_scripts($hook)
{
	if ($hook === 'toplevel_page_cords') {
		// Include the index.asset.php file
		$script_asset = require plugin_dir_path(__FILE__) . "build/index.asset.php";

		// Enqueue the script
		wp_enqueue_script(
			'cords-script',
			plugin_dir_url(__FILE__) . 'build/index.js',
			$script_asset['dependencies'],
			$script_asset['version'],
			true
		);
		wp_localize_script('cords-script', 'wpApiSettings', array(
			'root' => esc_url_raw(rest_url()),
			'nonce' => wp_create_nonce('wp_rest')
		));
	}
}

// WIDGET //
add_action('wp_footer', 'enqueue_cords_widget_script');
function enqueue_cords_widget_script()
{
	$post_id = get_the_ID();
	$show_widget = get_post_meta($post_id, 'cords_widget', true);

	if ($show_widget) {
		$api_key = get_option('cords_api_key');
		$origin = wp_get_environment_type() === "local" ? "http://localhost:3000" : "https://cords-prod.nuonn.com";
?>
		<script>
			function extractPageText(htmlContent) {
				// Create a new DOM element
				const parser = new DOMParser();
				const doc = parser.parseFromString(htmlContent, 'text/html');

				// Selectors for tags to remove
				const selectorsToRemove = ['nav', 'a', 'header', 'footer', "script", "form", "button", "a"];

				// Function to recursively remove elements matching any selector
				function removeElements(element) {
					Array.from(element.querySelectorAll('*')).forEach(child => {
						if (selectorsToRemove.some(selector => child.matches(selector))) {
							child.remove();
						} else {
							removeElements(child);
						}
					});
				}

				// Remove elements from the document
				removeElements(doc.body);

				// Extract and return the cleaned-up text content
				return doc.body.textContent || "";
			}

			// Resize widget to fit content
			window.addEventListener("message", function(event) {
				if (event.data.type !== "cords-resize") return;
				const widget = document.getElementById("cords-widget");
				widget.style.height = `${event.data.height}px`;
				widget.style.width = `${event.data.width}px`;
			});
			// Create widget
			document.addEventListener('DOMContentLoaded', function() {
				let iframe = document.createElement('iframe');
				const postContent = extractPageText(document.body.innerHTML);
				// Assuming $origin and $api_key are already defined in PHP and passed correctly into JavaScript
				iframe.src = '<?php echo $origin; ?>' + "?q=" + postContent + "&api_key=" + '<?php echo $api_key; ?>' + "&cordsId=" + '<?php echo $_COOKIE['cords-id']; ?>';
				iframe.style.cssText = 'pointer-events: all; background: none; border: 0px; float: none; position: absolute; inset: 0px; width: 100%; height: 100%; margin: 0px; padding: 0px; min-height: 0px; overscroll-behavior: contain';

				let widgetContainer = document.createElement('div');
				widgetContainer.id = 'cords-widget';
				widgetContainer.style.cssText = 'border: 0px; background-color: transparent; pointer-events: none; z-index: 2147483639; position: fixed; bottom: 0px; width: 60px; height: 60px; overflow: auto; opacity: 1; max-width: 100%; right: 0px; max-height: 100%; overscroll-behavior: contain';

				widgetContainer.appendChild(iframe);
				document.body.appendChild(widgetContainer);
			});
		</script>
<?php
	}
}

// REST API //
add_action('rest_api_init', 'rest_api_register_route');
function rest_api_register_route()
{
	register_rest_route('cords/v1', '/options', array(
		'methods' => 'GET',
		'callback' => 'get_options_route',
		'permission_callback' => 'permission_callback'
	));
	register_rest_route('cords/v1', '/options', array(
		'methods' => 'POST',
		'callback' => 'update_options_route',
		'permission_callback' => 'permission_callback'
	));
}
function permission_callback()
{
	return current_user_can('manage_options');
}

function get_options_route()
{
	$api_key = get_option('cords_api_key');
	return array(
		'api_key' => $api_key
	);
}

function update_options_route($request)
{
	$api_key = sanitize_text_field($request->get_param('api_key'));
	update_option('cords_api_key', $api_key);
	wp_cache_flush();
	return array(
		'api_key' => $api_key
	);
}
