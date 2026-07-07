<?php
// Include your database configuration
require_once 'config/Database.php';

echo "Testing connection to Aiven MySQL database...\n";

$database = new Database();
$db = $database->getConnection();

if ($db) {
    echo "Success! The PHP PDO connection is working perfectly.\n";
    
    // Quick test query to show the tables
    try {
        $query = "SHOW TABLES";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        echo "\nTables found in database:\n";
        while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
            echo "- " . $row[0] . "\n";
        }
    } catch (PDOException $e) {
        echo "Query failed: " . $e->getMessage() . "\n";
    }
} else {
    echo "Connection failed. Check your credentials or network rules.\n";
}
?>