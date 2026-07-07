<?php
class Database {
    // 1. Hardcode your static Aiven strings
    private $host = "your-aiven-host.aivencloud.com";
    private $db_name = "defaultdb"; // (or whatever your db is named)
    private $username = "avnadmin";
    
    // 2. Declare password, but DO NOT assign getenv() here
    private $password; 
    
    public $conn;

    public function getConnection() {
        $this->conn = null;
        
        // 3. Assign the environment variable INSIDE the function
        $this->password = getenv("AIVEN_DB_PASS"); 

        try {
            // 4. Connect using $this->password
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?>