from flask import Flask, render_template, request, send_file
from pdf2docx import Converter
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the uploads directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/')
def index(): 
    return render_template('wordconv.html')

@app.route('/convert', methods=['POST'])
def convert():
    # Check if a file was uploaded
    if 'file' not in request.files:
        return "No file uploaded", 400

    file = request.files['file']
    if file.filename == '':
        return "No file selected", 400

    # Save the uploaded PDF file
    pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(pdf_path)

    # Convert PDF to Word
    word_filename = file.filename.replace('.pdf', '.docx')
    word_path = os.path.join(app.config['UPLOAD_FOLDER'], word_filename)
    
    try:
        cv = Converter(pdf_path)
        cv.convert(word_path, start=0, end=None)
        cv.close()
    except Exception as e:
        return f"Error converting PDF to Word: {e}", 500

    # Clean up the uploaded PDF file
    os.remove(pdf_path)

    # Send the converted Word file to the user
    return send_file(word_path, as_attachment=True, download_name=word_filename)

if __name__ == '__main__':
    app.run(debug=True)