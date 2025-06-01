# JSON to CSV Converter

A simple Node.js utility to convert JSON files to CSV format.

## Installation

### Using npx (Recommended)

No installation required! Use directly with npx:

```bash
npx @ceyhuncicek/jsontocsv <input-json-file> <output-csv-file>
```

### Local Installation

```bash
npm install
```

## Usage

### Using npx (No Installation Required)

```bash
npx @ceyhuncicek/jsontocsv data.json output.csv
```

This will automatically download and run the latest version without requiring local installation.

### Command Line (Local Installation)

```bash
node jsonToCsv.js <input-json-file> <output-csv-file>
```

Example:

```bash
node jsonToCsv.js data.json output.csv
```

### Programmatic Usage

```javascript
const convertJsonToCsv = require("./jsonToCsv");

const jsonData = [
  { name: "John", age: 30 },
  { name: "Jane", age: 25 },
];

convertJsonToCsv(jsonData, "output.csv")
  .then(() => console.log("Conversion complete"))
  .catch((error) => console.error("Error:", error));
```

## Input Format

The input JSON should be either:

- An array of objects
- A single object

Each object should have consistent keys that will be used as CSV headers.

## Error Handling

The converter includes error handling for:

- Invalid JSON input
- Empty data
- File system errors
- Invalid arguments
