<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once '../config/Database.php';

$database = new Database();
$db = $database->getConnection();

$query = "SELECT id, name FROM tier_lists ORDER BY created_at DESC";
$stmt = $db->prepare($query);
$stmt->execute();
$tierlists = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($tierlists);
?>