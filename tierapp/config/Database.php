<?php
class Database {
    private $host = "tokistiersql-tiersapp.i.aivencloud.com";
    private $port = "11606";
    private $db_name = "defaultdb";
    private $username = "avnadmin";
    private $password = getenv('AIVEN_DB_PASS');
    private $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            // Updated DSN to include the custom port
            $dsn = "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name;
            
            // Aiven requires SSL. This tells PDO to allow the encrypted connection.
            // Using 1014 directly bypasses the missing PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT constant
            $options = array(
                1014 => false
            );
            
            // Pass the options array into the PDO constructor
            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            echo "Connection Error: " . $e->getMessage();
        }

        return $this->conn;
    }
}
?>