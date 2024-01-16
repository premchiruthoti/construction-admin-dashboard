-- CREATE DATABASE construction;

-- CREATE TABLE IF NOT EXISTS admin_users (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   user_name VARCHAR(200) NOT NULL,
--   password VARCHAR(255) NOT NULL,
--   name VARCHAR(200) NOT NULL,
--   event_slug VARCHAR(300) NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   UNIQUE KEY (user_name)
-- );

-- DROP TABLE events_images;

-- CREATE TABLE IF NOT EXISTS events (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   slug VARCHAR(250) UNIQUE NOT NULL,
--   event_name VARCHAR(300) UNIQUE NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE IF NOT EXISTS event_name (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   event_slug VARCHAR(300) NOT NULL,
--   name VARCHAR(300),
--   event_username VARCHAR(200) UNIQUE NOT NULL,
--   password VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE IF NOT EXISTS events_manage_editions (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   slug VARCHAR(250) NOT NULL,
--   year INT NOT NULL,
--   short_name VARCHAR(300) UNIQUE NOT NULL,
--   edition_title TEXT,
--   main_title TEXT NOT NULL,
--   start_date DATE NOT NULL,
--   end_date DATE NOT NULL,
--   city VARCHAR(300) NOT NULL,
--   country VARCHAR(200),
--   description TEXT,
--   meta_title TEXT,
--   meta_keywords TEXT,
--   meta_description TEXT,
--   is_featured BOOLEAN DEFAULT FALSE,
--   featured_in_past_event BOOLEAN DEFAULT FALSE,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE IF NOT EXISTS event_images (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   slug VARCHAR(250) NOT NULL,
--   edition_id VARCHAR(300) NOT NULL,
--   event_image_path TEXT,
--   event_image_alt_text VARCHAR(300),
--   is_featured BOOLEAN DEFAULT FALSE,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE IF NOT EXISTS event_logo (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   slug VARCHAR(250) UNIQUE NOT NULL,
--   event_logo_path TEXT,
--   event_logo_alt_text VARCHAR(300),
--   is_featured BOOLEAN DEFAULT FALSE,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE IF NOT EXISTS event_banners (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   slug VARCHAR(250) NOT NULL,
--   edition_id VARCHAR(300) NOT NULL,
--   main_title TEXT NOT NULL,
--   secondary_title TEXT NOT NULL,
--   city VARCHAR(300),
--   alt_title VARCHAR(200) NOT NULL,
--   event_banner_path TEXT,
--   event_banner_alt_text VARCHAR(300),
--   is_featured BOOLEAN DEFAULT FALSE,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE IF NOT EXISTS events_meta (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   slug VARCHAR(250) NOT NULL,
--   year INT NOT NULL,
--   meta_title TEXT,
--   meta_keywords TEXT,
--   meta_description TEXT,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

