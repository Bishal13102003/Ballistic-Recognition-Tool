<?php
$host = "localhost";
$username = "root";
$password = "";
$database = "ballistic_tool";

$conn = new mysqli($host, $username, $password, $database);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

if (isset($_POST['bullet_type']) && isset($_POST['caliber']) && isset($_POST['velocity'])) {
  $bullet_type = $_POST['bullet_type'];
  $caliber = $_POST['caliber'];
  $velocity = $_POST['velocity'];

  $stmt = $conn->prepare("INSERT INTO bullets (bullet_type, caliber, velocity) VALUES (?, ?, ?)");
  $stmt->bind_param("ssi", $bullet_type, $caliber, $velocity);

  if ($stmt->execute()) {
    echo "✅ Data saved successfully!";
  } else {
    echo "❌ Error saving data: " . $stmt->error;
  }

  $stmt->close();
} else {
  echo "⚠️ Missing input values.";
}

$conn->close();
?>