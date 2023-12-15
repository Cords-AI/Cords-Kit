<?php

/**
 * Plugin Name: CORDS
 * Description: Plugin for implementing CORDS in your WordPress site. Includes indexing and widget support.
 * Version: 0.0.1
 * Author: Billy
 * Author URI: https://billyhawkes.com
 */


add_action('admin_menu', 'cords_init_menu');
function cords_init_menu()
{
	$my_page = add_menu_page('CORDS', 'CORDS', 'manage_options', 'cords', 'cords_admin_page', 'dashicons-admin-post', '2.1');
	add_action('load-' . $my_page, 'load_admin_js');
}
// This function is only called when our plugin's page loads!
function load_admin_js()
{
	// Unfortunately we can't just enqueue our scripts here - it's too early. So register against the proper action hook to do it
	add_action('admin_enqueue_scripts', 'cords_admin_enqueue_scripts');
}

function cords_admin_page()
{
	echo '<div id="cords"></div>';
}
function cords_admin_enqueue_scripts()
{
	wp_enqueue_style('cords-style', plugin_dir_url(__FILE__) . 'apps/wp-admin/dist/assets/index.css');
	wp_enqueue_script('cords-script', plugin_dir_url(__FILE__) . 'apps/wp-admin/dist/assets/index.js', array('wp-element'), '1.0.0', true);
	wp_localize_script('cords-script', 'wpApiSettings', array(
		'root' => esc_url_raw(rest_url()),
		'nonce' => wp_create_nonce('wp_rest')
	));
}

add_action('init', 'cords_register_meta');
function cords_register_meta()
{
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
}

add_action("wp_enqueue_scripts", "cords_enqueue_scripts");
function cords_enqueue_scripts()
{
	wp_enqueue_script("cords-widget-script", plugin_dir_url(__FILE__) . 'apps/wp-admin/resize-script.js');
}

add_action("wp_footer", "widget");
function widget()
{
	global $post;
	error_log('Post ID: ' . $post->ID);

	// Check if $post is available
	if (isset($post)) {
		$show_widget = get_post_meta($post->ID, 'cords_widget', true);
		$post_content = strip_tags(get_the_content());
		$encoded_post_content = urlencode($post_content);

		// Check if meta value exists and is not empty
		if (!empty($show_widget)) {
			echo '<div id="cords-widget" style="border: 0px; background-color: transparent; pointer-events: none; z-index: 2147483639; position: fixed; bottom: 0px; width: 60px; height: 60px; overflow: hidden; opacity: 1; max-width: 100%; right: 0px; max-height: 100%;"><iframe src="' . (wp_get_environment_type() === "local" ? "http://localhost:3000" : "https://cords-widget.vercel.app")  . '?q=' . $encoded_post_content . '" style="pointer-events: all; background: none; border: 0px; float: none; position: absolute; inset: 0px; width: 100%; height: 100%; margin: 0px; padding: 0px; min-height: 0px;" /></div>';
		}
	}
}
