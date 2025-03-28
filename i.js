// Wait until the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('image-input');
    const generatePdfButton = document.getElementById('generate-pdf');
    const imagePreview = document.getElementById('image-preview');

    // Function to display selected images
    imageInput.addEventListener('change', (e) => {
        const files = e.target.files;
        imagePreview.innerHTML = "";  // Clear the preview section before displaying new images

        // Loop through all selected files and create an image element for each
        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100%'; // Ensure the image fits the container
                img.style.maxHeight = '200px'; // Optional height limit for better display
                img.style.objectFit = 'contain'; // Maintain aspect ratio

                // Append each image to the preview container
                imagePreview.appendChild(img);
            };
            reader.readAsDataURL(file);  // Start reading the file
        });
    });

    // Function to generate PDF from selected images
    generatePdfButton.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;  // Ensure jsPDF is loaded correctly
        const pdf = new jsPDF();

        const files = imageInput.files;
        if (files.length === 0) {
            alert('Please select some images first!');
            return;
        }

        Array.from(files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgData = e.target.result;

                // If it's not the first image, add a new page
                if (index > 0) {
                    pdf.addPage();
                }

                // Add the image to the PDF (JPEG format, at position x=10, y=10)
                pdf.addImage(imgData, 'JPEG', 10, 10, 180, 160);

                // Save PDF after the last image is added
                if (index === files.length - 1) {
                    // Save the generated PDF
                    pdf.save('images.pdf');
                }
            };
            reader.onerror = () => {
                alert('Error reading the file!');
            };

            // Start reading the file
            reader.readAsDataURL(file);
        });
    });
});
