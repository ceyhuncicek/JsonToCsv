const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function convertJsonToCsv(jsonData, outputPath) {
  let data;
  let headers;

  if (Array.isArray(jsonData)) {
    // Handle array of objects
    if (jsonData.length === 0) {
      throw new Error("No data to convert");
    }

    // Get all unique keys from all objects
    const allKeys = new Set();
    jsonData.forEach((obj) => {
      Object.keys(obj).forEach((key) => allKeys.add(key));
    });

    // Create headers from all keys
    headers = Array.from(allKeys).map((key) => ({
      id: key,
      title: key,
    }));

    data = jsonData;
  } else {
    // Handle key-value object
    data = Object.entries(jsonData).map(([key, value]) => ({
      key: key,
      value: value,
    }));

    if (data.length === 0) {
      throw new Error("No data to convert");
    }

    // Fixed headers for key-value format
    headers = [
      { id: "key", title: "key" },
      { id: "value", title: "value" },
    ];
  }

  // Create CSV writer
  const csvWriter = createCsvWriter({
    path: outputPath,
    header: headers,
  });

  // Write data to CSV
  return csvWriter.writeRecords(data);
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error(
      "Usage: node jsonToCsv.js <input-json-file> <output-csv-file>"
    );
    process.exit(1);
  }

  const [inputFile, outputFile] = args;

  try {
    // Read and parse JSON file
    const jsonData = JSON.parse(fs.readFileSync(inputFile, "utf8"));

    // Convert to CSV
    convertJsonToCsv(jsonData, outputFile)
      .then(() =>
        console.log(`Successfully converted ${inputFile} to ${outputFile}`)
      )
      .catch((error) => {
        console.error("Error converting to CSV:", error.message);
        process.exit(1);
      });
  } catch (error) {
    console.error("Error reading JSON file:", error.message);
    process.exit(1);
  }
}

module.exports = convertJsonToCsv;
