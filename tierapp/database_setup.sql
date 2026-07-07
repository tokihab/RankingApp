-- Database setup for Ranking App Tier Lists
-- Run this script in MySQL to create the tier_lists table

-- Create tier_lists table
CREATE TABLE IF NOT EXISTS tier_lists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create items table (for uploaded items in tier lists)
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tier_list_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    ranking INT NOT NULL DEFAULT 0,
    item_type INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tier_list_id) REFERENCES tier_lists(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create rankings table (to store saved tier rankings)
CREATE TABLE IF NOT EXISTS rankings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tier_list_id INT NOT NULL,
    item_id INT NOT NULL,
    tier_name VARCHAR(50) NOT NULL,
    position_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tier_list_id) REFERENCES tier_lists(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

