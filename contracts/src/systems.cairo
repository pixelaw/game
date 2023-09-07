// Core
mod spawn_pixel;
mod has_write_access;
mod update_owner;
mod update_color;
mod update_text;
mod update_type;
mod process_queue;

use spawn_pixel::spawn_pixel_system;
use has_write_access::has_write_access_system;
use update_owner::update_owner_system;
use update_color::update_color_system;
use update_text::update_text_system;
use update_type::update_type_system;
use process_queue::process_queue_system;
