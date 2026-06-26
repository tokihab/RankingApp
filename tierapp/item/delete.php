<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once '../config/Database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));
if (!empty($data->id)) {
    // First, get the image path before deleting from database
    $selectQuery = "SELECT image_path FROM items WHERE id = :id";
    $selectStmt = $db->prepare($selectQuery);
    $selectStmt->bindParam(":id", $data->id);
    $selectStmt->execute();
    $result = $selectStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result && !empty($result['image_path'])) {
        $imagePath = __DIR__ . '/uploads/' . $result['image_path'];
        // Delete the physical file if it exists
        if (file_exists($imagePath)) {
            unlink($imagePath);
        }
    }
    
    // Now delete from database
    $query = "DELETE FROM items WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $data->id);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Item and image deleted successfully"]);
    } else {
        echo json_encode(["success" => false, "error" => "Failed to delete item from database."]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Item ID required."]);
}
?>