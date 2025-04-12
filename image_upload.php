<?php
header('Content-Type: application/json');

$localhost = "localhost";
$username = "root";
$password = "";
$database = "ballistic_tool";

$conn = new mysqli("$localhost", "$username", "$password", "$database");

if ($conn->connect_error) {
    die(json_encode([
        'success' => false,
        'message' => "Connection failed: " . $conn->connect_error
    ]));
}


$table_check = $conn->query("SHOW TABLES LIKE 'images'");
if ($table_check->num_rows == 0) {
    $create_table = "CREATE TABLE images (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        image_name VARCHAR(255) NOT NULL,
        image_data LONGBLOB NOT NULL,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    if (!$conn->query($create_table)) {
        die(json_encode([
            'success' => false,
            'message' => "Error creating table: " . $conn->error
        ]));
    }
}


if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $image = $_FILES['image'];
    
    
    $file_name = $image['name'];
    $file_tmp = $image['tmp_name'];
    $file_size = $image['size'];
    
    
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    
    
    $allowed = array('jpg', 'jpeg', 'png', 'gif');
    
    if (in_array($file_ext, $allowed)) {
        if ($file_size <= 2097152) { 
            
            $uploaded_image_data = file_get_contents($file_tmp);
            $uploaded_image_hash = md5($uploaded_image_data); 
            
            
            $sql = "SELECT image_name, image_data FROM images";
            $result = $conn->query($sql);
            
            $match_found = false;
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $stored_image_hash = md5($row['image_data']);
                    if ($uploaded_image_hash === $stored_image_hash) {
                        $match_found = true;
                        break;
                    }
                }
            }
            
            
            if ($match_found) {
                echo json_encode([
                    'success' => true,
                    'message' => "Successfully matched with an image in the database!"
                ]);
            } else {
                
                $sql = "INSERT INTO images (image_name, image_data) VALUES (?, ?)";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ss", $file_name, $uploaded_image_data);
                if ($stmt->execute()) {
                    echo json_encode([
                        'success' => true,
                        'message' => "No match found. Image has been uploaded to the database."
                    ]);
                } else {
                    echo json_encode([
                        'success' => false,
                        'message' => "No match found. Error uploading to database: " . $conn->error
                    ]);
                }
                $stmt->close();
            }
        } else {
            echo json_encode([
                'success' => false,
                'message' => "File size too large. Maximum 2MB"
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => "Invalid file type. Only JPG, JPEG, PNG, and GIF allowed"
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => "Error uploading file"
    ]);
}

$conn->close();


function mime_content_type_from_name($filename) {
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    switch ($ext) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        default:
            return 'application/octet-stream';
    }
}
?>