# JSON to CSV Converter - Web Interface

This is the web version of the JSON to CSV converter. It runs entirely in your browser - no server required!

## 🌐 Live Demo

Visit: [https://ceyhuncicek.github.io/JsonToCsv/web/](https://ceyhuncicek.github.io/JsonToCsv/web/)

## 🚀 Features

- **Two Input Methods**: Choose between file upload or paste JSON directly
- **Drag & Drop**: Simply drag your JSON file onto the upload area
- **File Browse**: Click to browse and select JSON files
- **Paste JSON**: Copy and paste JSON directly into the textarea
- **Auto-validation**: Real-time JSON validation as you type
- **Live Preview**: See your JSON data before conversion
- **Instant Conversion**: Convert to CSV with one click
- **Direct Download**: Download the resulting CSV file
- **Error Handling**: Clear error messages for invalid files/JSON
- **Responsive Design**: Works on desktop and mobile devices

## 📝 How to Use

### Method 1: Upload File

1. Click "📁 Upload File" tab
2. Drag and drop a JSON file or click "Browse Files"
3. Preview your JSON data
4. Click "Convert to CSV"
5. Download the result

### Method 2: Paste JSON

1. Click "📋 Paste JSON" tab
2. Paste your JSON data into the textarea
3. JSON is automatically validated as you type
4. Click "Process JSON" or wait for auto-processing
5. Click "Convert to CSV"
6. Download the result

## 📁 Supported JSON Formats

### Array of Objects

```json
[
  { "name": "John", "age": 30, "city": "New York" },
  { "name": "Jane", "age": 25, "city": "San Francisco" }
]
```

### Key-Value Object

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "city": "New York",
  "age": 30
}
```

## 🛠️ Local Development

To run locally:

1. Navigate to the web folder
2. Start a local server:
   ```bash
   python3 -m http.server 8080
   ```
   or
   ```bash
   npx serve .
   ```
3. Open http://localhost:8080 in your browser

## 📄 Files

- `index.html` - Main HTML structure
- `styles.css` - CSS styling and responsive design
- `script.js` - JavaScript functionality and conversion logic

## 🔧 Technology Stack

- **HTML5** - Structure and file handling APIs
- **CSS3** - Modern styling with flexbox and grid
- **Vanilla JavaScript** - No dependencies, pure browser APIs
- **FileReader API** - For reading uploaded files
- **Blob API** - For generating downloadable CSV files
