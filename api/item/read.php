<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once '../config/Database.php';
include_once '../models/Item.php';

$database = new Database();
$db = $database->getConnection();

$item = new Item($db);

$item_type = isset($_GET['item_type']) ? $_GET['item_type'] : null;
$tier_list_id = isset($_GET['tier_list_id']) ? $_GET['tier_list_id'] : null;

// If neither provided, return all items
$stmt = $item->read($item_type, $tier_list_id);
$num = $stmt->rowCount();

if($num > 0) {
    $items_arr = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $item_obj = array(
            "id" => (int)$id,
            "title" => $title,
            "image_path" => $image_path,
            "ranking" => (int)$ranking,
            "itemType" => (int)$item_type,
            "item_type" => (int)$item_type,
            "itemType" => (int)$item_type,
            "itemTypeRaw" => (int)$item_type,
            "itemTypeVal" => (int)$item_type,
            "itemTypeAlt" => (int)$item_type,
            "itemTypeFinal" => (int)$item_type,
            "itemTypeId" => (int)$item_type
        );

        // normalize keys expected by frontend
        $item_obj = array(
            "id" => (int)$id,
            "title" => $title,
            "image_path" => $image_path,
            "imageId" => is_numeric($image_path) ? (int)$image_path : null,
            "ranking" => (int)$ranking,
            "itemType" => (int)$item_type,
            "item_type" => (int)$item_type,
            "tierListId" => is_null($tier_list_id) ? null : (int)$tier_list_id
        );

        array_push($items_arr, $item_obj);
    }

    http_response_code(200);
    echo json_encode($items_arr);
} else {
    // return empty array instead of 404 for easier frontend handling
    http_response_code(200);
    echo json_encode(array());
}
?>