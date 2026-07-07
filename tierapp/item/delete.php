<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once '../config/Database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));
if (!empty($data->id)) {
    
    // Simply delete the item from the database
    $query = "DELETE FROM items WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $data->id);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Item deleted successfully"]);
    } else {
        echo json_encode(["success" => false, "error" => "Failed to delete item from database."]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Item ID required."]);
}
?>