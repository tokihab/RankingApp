<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . '/../config/Database.php';

$database = new Database();
$db = $database->getConnection();

$raw = file_get_contents('php://input');
$data = json_decode($raw);

if (!isset($data->name) || trim($data->name) === '') {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Tier list name is required."]);
    exit;
}

try {
    $query = "INSERT INTO tier_lists (name) VALUES (:name)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':name', $data->name);
    if ($stmt->execute()) {
        $id = $db->lastInsertId();
        http_response_code(200);
        echo json_encode(["success" => true, "id" => (int)$id]);
        exit;
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database insert failed."]);
        exit;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Exception: " . $e->getMessage()]);
    exit;
}