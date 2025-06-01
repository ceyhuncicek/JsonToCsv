// Browser-compatible JSON to CSV converter
class JsonToCsvConverter {
  constructor() {
    this.jsonData = null;
    this.csvData = null;
    this.currentMode = "upload"; // 'upload' or 'paste'
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    const uploadArea = document.getElementById("uploadArea");
    const fileInput = document.getElementById("fileInput");
    const browseBtn = document.querySelector(".browse-btn");
    const convertBtn = document.getElementById("convertBtn");
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    // Toggle buttons
    const uploadToggle = document.getElementById("uploadToggle");
    const pasteToggle = document.getElementById("pasteToggle");
    const processJsonBtn = document.getElementById("processJsonBtn");
    const clearJsonBtn = document.getElementById("clearJsonBtn");
    const jsonInput = document.getElementById("jsonInput");

    // Ensure elements exist before adding listeners
    if (!uploadArea || !fileInput || !browseBtn) {
      console.error("Upload elements not found");
      return;
    }

    // File input events - only add if element exists
    if (uploadArea) {
      uploadArea.addEventListener("click", (e) => {
        // Only trigger if upload area is visible
        if (!uploadArea.classList.contains("hidden")) {
          fileInput.click();
        }
      });
    }

    if (browseBtn) {
      browseBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    if (fileInput) {
      fileInput.addEventListener("change", (e) => this.handleFileSelect(e));
    }

    // Drag and drop events - only add if element exists
    if (uploadArea) {
      uploadArea.addEventListener("dragover", (e) => this.handleDragOver(e));
      uploadArea.addEventListener("dragleave", (e) => this.handleDragLeave(e));
      uploadArea.addEventListener("drop", (e) => this.handleDrop(e));
    }

    // Toggle events
    if (uploadToggle) {
      uploadToggle.addEventListener("click", () => this.switchToUploadMode());
    }
    if (pasteToggle) {
      pasteToggle.addEventListener("click", () => this.switchToPasteMode());
    }

    // Paste area events
    if (processJsonBtn) {
      processJsonBtn.addEventListener("click", () =>
        this.processJsonFromTextarea()
      );
    }
    if (clearJsonBtn) {
      clearJsonBtn.addEventListener("click", () => this.clearJsonTextarea());
    }

    // Auto-process when user types in textarea (with debounce)
    if (jsonInput) {
      let debounceTimer;
      jsonInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          if (jsonInput.value.trim()) {
            this.processJsonFromTextarea(true); // silent mode
          }
        }, 1000);
      });
    }

    // Button events
    if (convertBtn) {
      convertBtn.addEventListener("click", () => this.convertToCSV());
    }
    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.clearAll());
    }
    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => this.downloadCSV());
    }
  }

  switchToUploadMode() {
    this.currentMode = "upload";
    document.getElementById("uploadToggle").classList.add("active");
    document.getElementById("pasteToggle").classList.remove("active");
    document.getElementById("uploadArea").classList.remove("hidden");
    document.getElementById("pasteArea").classList.remove("active");
    this.clearAll();
  }

  switchToPasteMode() {
    this.currentMode = "paste";
    document.getElementById("pasteToggle").classList.add("active");
    document.getElementById("uploadToggle").classList.remove("active");
    document.getElementById("uploadArea").classList.add("hidden");
    document.getElementById("pasteArea").classList.add("active");
    this.clearAll();
  }

  processJsonFromTextarea(silent = false) {
    const jsonInput = document.getElementById("jsonInput");
    const jsonText = jsonInput.value.trim();

    if (!jsonText) {
      if (!silent) {
        this.showError("Please paste some JSON data.");
      }
      return;
    }

    if (!silent) {
      this.showProcessing("Parsing JSON data...");
    }

    try {
      this.jsonData = JSON.parse(jsonText);
      this.showJsonPreview();
      this.clearError();

      if (!silent) {
        this.clearProcessing();
        this.showSuccess(
          `✅ JSON parsed successfully! ${this.getDataSummary()}`
        );

        // Scroll to preview section for better UX
        setTimeout(() => {
          document.getElementById("previewSection").scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    } catch (error) {
      if (!silent) {
        this.clearProcessing();
        this.showError("❌ Invalid JSON format. Please check your syntax.");
      }
    }
  }

  clearJsonTextarea() {
    document.getElementById("jsonInput").value = "";
    this.clearAll();
  }

  handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    const uploadArea = document.getElementById("uploadArea");
    // Only handle drag if upload area is visible
    if (uploadArea && !uploadArea.classList.contains("hidden")) {
      uploadArea.classList.add("dragover");
    }
  }

  handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    const uploadArea = document.getElementById("uploadArea");
    if (uploadArea) {
      uploadArea.classList.remove("dragover");
    }
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const uploadArea = document.getElementById("uploadArea");

    if (uploadArea) {
      uploadArea.classList.remove("dragover");
    }

    // Only process file if upload area is visible
    if (uploadArea && !uploadArea.classList.contains("hidden")) {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.processFile(files[0]);
      }
    }
  }

  handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
      this.processFile(files[0]);
    }
  }

  processFile(file) {
    if (!file.name.toLowerCase().endsWith(".json")) {
      this.showError("Please select a JSON file.");
      return;
    }

    // Show loading state
    this.showProcessing(`Processing ${file.name}...`);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        this.jsonData = JSON.parse(e.target.result);
        this.showJsonPreview();
        this.clearError();
        this.clearProcessing();

        // Show success feedback
        this.showSuccess(
          `✅ File "${file.name}" loaded successfully! ${this.getDataSummary()}`
        );

        // Scroll to preview section for better UX
        setTimeout(() => {
          document.getElementById("previewSection").scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } catch (error) {
        this.clearProcessing();
        this.showError(
          `❌ Invalid JSON in file "${file.name}". Please check your file format.`
        );
      }
    };

    reader.onerror = () => {
      this.clearProcessing();
      this.showError(`❌ Error reading file "${file.name}". Please try again.`);
    };

    reader.readAsText(file);
  }

  getDataSummary() {
    if (!this.jsonData) return "";

    if (Array.isArray(this.jsonData)) {
      const count = this.jsonData.length;
      const keys = count > 0 ? Object.keys(this.jsonData[0]).length : 0;
      return `Found ${count} record${
        count !== 1 ? "s" : ""
      } with ${keys} field${keys !== 1 ? "s" : ""}.`;
    } else {
      const keys = Object.keys(this.jsonData).length;
      return `Found object with ${keys} field${keys !== 1 ? "s" : ""}.`;
    }
  }

  showProcessing(message) {
    this.clearError();
    this.clearSuccess();

    const processingDiv = document.createElement("div");
    processingDiv.className = "processing";
    processingDiv.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div class="spinner"></div>
        <span>${message}</span>
      </div>
    `;

    const uploadSection = document.querySelector(".upload-section");
    uploadSection.appendChild(processingDiv);
  }

  clearProcessing() {
    const existingProcessing = document.querySelector(".processing");
    if (existingProcessing) {
      existingProcessing.remove();
    }
  }

  showJsonPreview() {
    const previewSection = document.getElementById("previewSection");
    const jsonPreview = document.getElementById("jsonPreview");

    jsonPreview.textContent = JSON.stringify(this.jsonData, null, 2);
    previewSection.style.display = "block";

    // Hide result section if visible
    document.getElementById("resultSection").style.display = "none";
  }

  convertToCSV() {
    if (!this.jsonData) {
      this.showError("No JSON data to convert.");
      return;
    }

    try {
      this.csvData = this.jsonToCsv(this.jsonData);
      this.showCsvResult();
      this.clearError();
    } catch (error) {
      this.showError("Error converting to CSV: " + error.message);
    }
  }

  jsonToCsv(jsonData) {
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
      headers = Array.from(allKeys);
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
      headers = ["key", "value"];
    }

    // Convert to CSV string
    let csvContent = headers.join(",") + "\n";

    data.forEach((row) => {
      const values = headers.map((header) => {
        let value = row[header] || "";

        // Handle values that contain commas, quotes, or newlines
        if (
          typeof value === "string" &&
          (value.includes(",") || value.includes('"') || value.includes("\n"))
        ) {
          value = '"' + value.replace(/"/g, '""') + '"';
        }

        return value;
      });
      csvContent += values.join(",") + "\n";
    });

    return csvContent;
  }

  showCsvResult() {
    const resultSection = document.getElementById("resultSection");
    const csvPreview = document.getElementById("csvPreview");

    csvPreview.textContent = this.csvData;
    resultSection.style.display = "block";
  }

  downloadCSV() {
    if (!this.csvData) {
      this.showError("No CSV data to download.");
      return;
    }

    const blob = new Blob([this.csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "converted_data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  clearAll() {
    this.jsonData = null;
    this.csvData = null;

    document.getElementById("previewSection").style.display = "none";
    document.getElementById("resultSection").style.display = "none";
    document.getElementById("fileInput").value = "";

    // Clear textarea if in paste mode
    if (this.currentMode === "paste") {
      document.getElementById("jsonInput").value = "";
    }

    this.clearError();
    this.clearSuccess();
    this.clearProcessing();
  }

  showError(message) {
    // Remove existing error if any
    this.clearError();
    this.clearSuccess();

    const errorDiv = document.createElement("div");
    errorDiv.className = "error";
    errorDiv.textContent = message;

    const uploadSection = document.querySelector(".upload-section");
    uploadSection.appendChild(errorDiv);
  }

  clearError() {
    const existingError = document.querySelector(".error");
    if (existingError) {
      existingError.remove();
    }
  }

  showSuccess(message) {
    // Remove existing success if any
    this.clearSuccess();

    const successDiv = document.createElement("div");
    successDiv.className = "success";
    successDiv.textContent = message;

    const uploadSection = document.querySelector(".upload-section");
    uploadSection.appendChild(successDiv);
  }

  clearSuccess() {
    const existingSuccess = document.querySelector(".success");
    if (existingSuccess) {
      existingSuccess.remove();
    }
  }
}

// Initialize the converter when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new JsonToCsvConverter();
});
