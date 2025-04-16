<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "signup";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"]; // The entered password

    // SQL query to find the user
    $sql = "SELECT * FROM users WHERE username = '$username' LIMIT 1";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        // Verify the password with the hashed password stored in the database
        if (password_verify($password, $user['password'])) {
            // Password is correct
            echo "<script>alert('Login successful!'); window.location.href = 'test.html';</script>";
        } else {
            // Incorrect password
            echo "<script>alert('Invalid username or password'); window.location.href = 'login_page.html';</script>";
        }
    } else {
        echo "<script>alert('Invalid username or password'); window.location.href = 'login_page.html';</script>";
    }
}

$conn->close();
?>
