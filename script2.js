document.addEventListener("DOMContentLoaded", function () {
    const uploadArea = document.querySelector(".upload-area");
    const preview = document.querySelector(".preview");
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpeg, image/png, video/mp4";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);
  
    const uploadButton = document.querySelector(".btn");
  
    uploadArea.addEventListener("click", () => fileInput.click());
  
    uploadArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadArea.style.border = "2px dashed #4f46e5";
    });
  
    uploadArea.addEventListener("dragleave", () => {
      uploadArea.style.border = "2px dashed #ccc";
    });
  
    uploadArea.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadArea.style.border = "2px dashed #ccc";
      const files = e.dataTransfer.files;
      handleFiles(files);
    });
  
    fileInput.addEventListener("change", () => handleFiles(fileInput.files));
  
    uploadButton.addEventListener("click", () => fileInput.click());
  
    function handleFiles(files) {
      if (files.length === 0) return;
  
      const file = files[0];
      const fileType = file.type;
  
      // Validation
      if (!fileType.match("image/jpeg|image/png|video/mp4")) {
        alert("Invalid file format. Only JPG, PNG, and MP4 are supported.");
        return;
      }
  
      if (file.size > 50 * 1024 * 1024) {
        alert("File size exceeds 50MB limit.");
        return;
      }
  
      // Reset and preview
      preview.innerHTML = "";
      const reader = new FileReader();
  
      reader.onload = function (e) {
        if (fileType.startsWith("image")) {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.style.maxWidth = "100%";
          img.style.borderRadius = "8px";
          preview.appendChild(img);
        } else if (fileType.startsWith("video")) {
          const video = document.createElement("video");
          video.src = e.target.result;
          video.controls = true;
          video.style.maxWidth = "100%";
          preview.appendChild(video);
        }
      };
      reader.readAsDataURL(file);
  
      // Upload using FormData
      const formData = new FormData();
      formData.append("file", file);
  
      fetch("upload.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network error: " + response.statusText);
          }
          return response.text();
        })
        .then((data) => {
          console.log("Upload response:", data);
  
          const existingMsg = preview.querySelector(".upload-status");
          if (existingMsg) existingMsg.remove();
  
          const msg = document.createElement("div");
          msg.className = "upload-status";
          msg.innerText = "✅ File uploaded successfully.";
          msg.style.color = "green";
          preview.appendChild(msg);
        })
        .catch((error) => {
          console.error("Upload failed:", error);
  
          const existingMsg = preview.querySelector(".upload-status");
          if (existingMsg) existingMsg.remove();
  
          // ❌ Removed error message display here as requested
        });
    }
  });