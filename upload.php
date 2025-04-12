<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = "uploads/";
    $fileName = basename($_FILES["file"]["name"]);
    $uploadFile = $uploadDir . $fileName;

    // Log info
    file_put_contents("log.txt", "Trying to upload: $fileName\n", FILE_APPEND);

    // Check MIME type
    $allowed = ['image/jpeg', 'image/png', 'video/mp4'];
    if (!in_array($_FILES["file"]["type"], $allowed)) {
        echo "Invalid file type: " . $_FILES["file"]["type"];
        exit;
    }

    // Check if uploads/ is writable
    if (!is_writable($uploadDir)) {
        echo "Uploads folder is not writable.";
        exit;
    }

    if (move_uploaded_file($_FILES["file"]["tmp_name"], $uploadFile)) {
        echo "File successfully uploaded to $uploadFile";
    } else {
        echo "Upload failed.";
    }
} else {
    echo "No file uploaded or upload error: " . $_FILES['file']['error'];
}
