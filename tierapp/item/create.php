<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . '/../config/Database.php';

$database = new Database();
$db = $database->getConnection();

// Check if this is a file upload
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $tier_list_id = isset($_POST['tier_list_id']) ? intval($_POST['tier_list_id']) : 0;
    
    // Create filename with tier_list_id prefix for uniqueness
    $fileName = $tier_list_id . '_' . uniqid() . '_' . basename($_FILES['image']['name']);
    $targetPath = $uploadDir . $fileName;
    
    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
        $title = $_POST['title'] ?? '';
        $item_type = isset($_POST['item_type']) ? intval($_POST['item_type']) : 1;
        $ranking = isset($_POST['ranking']) ? intval($_POST['ranking']) : 0;
        // Save the filename only, not the path
        $image_path = $fileName;
        
        $query = "INSERT INTO items (title, image_path, item_type, tier_list_id, ranking) 
                  VALUES (:title, :image_path, :item_type, :tier_list_id, :ranking)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':image_path', $image_path);
        $stmt->bindParam(':item_type', $item_type);
        $stmt->bindParam(':tier_list_id', $tier_list_id);
        $stmt->bindParam(':ranking', $ranking);
        
        if ($stmt->execute()) {
            $id = $db->lastInsertId();
            echo json_encode([
                "success" => true,
                "id" => (int)$id,
                "message" => "Item created successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to insert item into database"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Failed to upload image"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "No image file received"
    ]);
}
?>
