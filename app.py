from flask import Flask, render_template, request, send_file
import pikepdf
import io
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the uploads directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/protect', methods=['POST'])
def protect():
    print("Protect route called")  # Debug statement
    if 'file' not in request.files:
        print("No file uploaded")  # Debug statement
        return "No file uploaded", 400

    file = request.files['file']
    if file.filename == '':
        print("No file selected")  # Debug statement
        return "No file selected", 400

    password = request.form.get('password')
    if not password:
        print("No password provided")  # Debug statement
        return "No password provided", 400

    # Save the uploaded file temporarily
    input_pdf_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(input_pdf_path)
    print(f"File saved to {input_pdf_path}")  # Debug statement

    # Encrypt the PDF with AES-256
    try:
        with pikepdf.open(input_pdf_path) as pdf:
            encrypted_pdf = io.BytesIO()
            pdf.save(encrypted_pdf, encryption=pikepdf.Encryption(owner=password, user=password, aes=True))
            encrypted_pdf.seek(0)
            print("PDF encrypted successfully")  # Debug statement
    except Exception as e:
        print(f"Error encrypting PDF: {e}")  # Debug statement
        return f"Error encrypting PDF: {e}", 500

    # Clean up the temporary file
    os.remove(input_pdf_path)

    # Send the encrypted PDF to the user
    return send_file(encrypted_pdf, as_attachment=True, download_name='protected.pdf')

if __name__ == '__main__':
    app.run(debug=True)