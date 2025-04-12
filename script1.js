document.addEventListener("DOMContentLoaded", function () {
    const uploadArea = document.querySelector(".upload-area");
    const preview = document.querySelector(".preview");
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpeg, image/png, video/mp4";
    fileInput.style.display = "none";
  
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
  
    function handleFiles(files) {
      if (files.length > 0) {
        const file = files[0];
        const fileType = file.type;
    
        if (!fileType.match("image/jpeg|image/png|video/mp4")) {
          alert("Invalid file format. Only JPG, PNG, and MP4 are supported.");
          return;
        }
    
        if (file.size > 50 * 1024 * 1024) {
          alert("File size exceeds 50MB limit.");
          return;
        }
    
        // Preview
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
    
        // Upload to backend using FormData
        const formData = new FormData();
        formData.append("file", file);
    
        fetch("upload.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.text())
          .then((data) => {
            console.log("Upload response:", data);
            // Optional: Show message
            const msg = document.createElement("div");
            msg.innerText = data;
            msg.style.marginTop = "10px";
            msg.style.color = "green";
            preview.appendChild(msg);
          })
          .catch((error) => {
            console.error("Upload failed:", error);
            alert("File upload failed.");
          });
      }
    }
  
    document.querySelector(".btn").addEventListener("click", () => fileInput.click());
  });
  

// script1.js
// document.addEventListener('DOMContentLoaded', () => {
//   const uploadArea = document.querySelector('.upload-area');
//   const uploadButton = document.querySelector('.btn');
//   const preview = document.querySelector('.preview');
//   const analysisDetails = document.querySelector('.analysis-details');

//   // Handle drag and drop
//   uploadArea.addEventListener('dragover', (e) => {
//       e.preventDefault();
//       uploadArea.style.borderColor = '#3b82f6';
//   });

//   uploadArea.addEventListener('dragleave', () => {
//       uploadArea.style.borderColor = '#e2e8f0';
//   });

//   uploadArea.addEventListener('drop', (e) => {
//       e.preventDefault();
//       uploadArea.style.borderColor = '#e2e8f0';
//       handleFiles(e.dataTransfer.files);
//   });

//   // Handle click to upload
//   uploadArea.addEventListener('click', () => {
//       const input = document.createElement('input');
//       input.type = 'file';
//       input.accept = 'image/*';
//       input.onchange = (e) => handleFiles(e.target.files);
//       input.click();
//   });

//   uploadButton.addEventListener('click', () => {
//       const input = document.createElement('input');
//       input.type = 'file';
//       input.accept = 'image/*';
//       input.onchange = (e) => handleFiles(e.target.files);
//       input.click();
//   });

//   function handleFiles(files) {
//       if (files.length > 0) {
//           const file = files[0];
//           const formData = new FormData();
//           formData.append('file', file);

//           // Show preview
//           const reader = new FileReader();
//           reader.onload = (e) => {
//               preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 300px;">`;
//           };
//           reader.readAsDataURL(file);

//           // Update status
//           updateAnalysisStatus('Processing');

//           // Send to backend
//           fetch('http://localhost:5000/upload', {
//               method: 'POST',
//               body: formData
//           })
//           .then(response => response.json())
//           .then(data => {
//               if (data.success) {
//                   displayResults(data.analysis);
//                   updateAnalysisStatus('Completed');
//               } else {
//                   throw new Error(data.error);
//               }
//           })
//           .catch(error => {
//               console.error('Error:', error);
//               updateAnalysisStatus('Error');
//               preview.innerHTML = 'Error processing image';
//           });
//       }
//   }

//   function displayResults(analysis) {
//       analysisDetails.innerHTML = `
//           <h3 class="section-title">
//               <span>📋</span>
//               Analysis Results
//           </h3>
//           <div class="detail-group">
//               <div class="detail-label">Dimensions</div>
//               <div class="detail-value">${analysis.dimensions.width}x${analysis.dimensions.height}px</div>
//           </div>
//           <div class="detail-group">
//               <div class="detail-label">Edge Detection</div>
//               <div class="detail-value">${analysis.edge_percentage}% edge pixels</div>
//           </div>
//       `;
//   }

//   function updateAnalysisStatus(status) {
//       const statusElement = analysisDetails.querySelector('.status-pill') || 
//           document.createElement('span');
//       statusElement.className = 'status-pill';
//       statusElement.textContent = status;
      
//       const statusGroup = analysisDetails.querySelector('.detail-group:last-child') || 
//           document.createElement('div');
//       statusGroup.className = 'detail-group';
//       statusGroup.innerHTML = `
//           <div class="detail-label">Analysis Status</div>
//           <div class="detail-value"></div>
//       `;
//       statusGroup.querySelector('.detail-value').appendChild(statusElement);
      
//       if (!analysisDetails.contains(statusGroup)) {
//           analysisDetails.appendChild(statusGroup);
//       }
//   }
// });