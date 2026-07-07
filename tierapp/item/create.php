<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . '/../config/Database.php';

$database = new Database();
$db = $database->getConnection();

// Check if this is a file upload
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    
    // 1. Cloudinary Credentials
    $cloud_name = "yx1q0hsv"; 
    $upload_preset = "tiersapp-bucket"; 
    
    $file_tmp_path = $_FILES['image']['tmp_name'];
    $file_type = $_FILES['image']['type'];
    $file_name = $_FILES['image']['name'];

    // 2. Prepare the file for Cloudinary
    $cfile = new CURLFile($file_tmp_path, $file_type, $file_name);
    
    $data = array(
        'file' => $cfile,
        'upload_preset' => $upload_preset
    );

    // 3. Send the image to your Cloudinary bucket
    $ch = curl_init("https://api.cloudinary.com/v1_1/$cloud_name/image/upload");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if ($err) {
        echo json_encode(["success" => false, "message" => "cURL Error: " . $err]);
        exit();
    }

    $cloudinary_result = json_decode($response, true);

    // 4. Extract the secure URL provided by Cloudinary
    if (isset($cloudinary_result['secure_url'])) {
        $image_path = $cloudinary_result['secure_url']; 
    } else {
        echo json_encode(["success" => false, "message" => "Cloudinary upload failed."]);
        exit();
    }
    
    // 5. Save everything to the Database
    $tier_list_id = isset($_POST['tier_list_id']) ? intval($_POST['tier_list_id']) : 0;
    $title = $_POST['title'] ?? '';
    $item_type = isset($_POST['item_type']) ? intval($_POST['item_type']) : 1;
    $ranking = isset($_POST['ranking']) ? intval($_POST['ranking']) : 0;
    
    $query = "INSERT INTO items (title, image_path, item_type, tier_list_id, ranking) 
              VALUES (:title, :image_path, :item_type, :tier_list_id, :ranking)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':image_path', $image_path); // Saving the Cloudinary URL here
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
        "message" => "No image file received"
    ]);
}
?>