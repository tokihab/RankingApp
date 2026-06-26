<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once '../config/Database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id) && isset($data->ranking)) {
    $query = "UPDATE items SET ranking = :ranking WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":ranking", $data->ranking);
    $stmt->bindParam(":id", $data->id);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Item ranking updated."]);
    } else {
        http_response_code(503);
        echo json_encode(["success" => false, "message" => "Unable to update item ranking."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Unable to update item ranking. Data is incomplete."]);
}
?>
