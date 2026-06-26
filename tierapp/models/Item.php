<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/Database.php';

class Item {
    private $conn;
    private $table_name = "items";

    public $id;
    public $title;
    public $image_path;
    public $ranking;
    public $item_type;
    public $tier_list_id;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read($item_type, $tier_list_id = null) {
        $query = "SELECT id, title, image_path, ranking, item_type, tier_list_id 
                 FROM " . $this->table_name . "
                 WHERE item_type = :item_type";
        
        if ($tier_list_id) {
            $query .= " AND tier_list_id = :tier_list_id";
        }

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":item_type", $item_type);
        
        if ($tier_list_id) {
            $stmt->bindParam(":tier_list_id", $tier_list_id);
        }

        $stmt->execute();
        return $stmt;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                (title, image_path, ranking, item_type, tier_list_id)
                VALUES
                (:title, :image_path, :ranking, :item_type, :tier_list_id)";

        $stmt = $this->conn->prepare($query);

        // Sanitize inputs
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->image_path = htmlspecialchars(strip_tags($this->image_path));

        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":image_path", $this->image_path);
        $stmt->bindParam(":ranking", $this->ranking);
        $stmt->bindParam(":item_type", $this->item_type);
        $stmt->bindParam(":tier_list_id", $this->tier_list_id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . "
                SET ranking = :ranking
                WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":ranking", $this->ranking);
        $stmt->bindParam(":id", $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>