import React from "react";
import Barcode from "react-barcode";
// import Qrcode from 'qrcode.react'
import QRCode from "react-qr-code";

const PrintQRCodeModal = ({ onClose, value }) => {
  const handlePrint = () => {
    // Get the barcode SVG element
    const barcodeSvg = document.querySelector(".barcode-container svg");

    if (barcodeSvg) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Barcode</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: white;
              }
              @media print {
                body { margin: 0; padding: 0; }
              }
            </style>
          </head>
          <body>
            ${barcodeSvg.outerHTML}
            <script>
              window.onload = function() {
                window.print();
                setTimeout(() => window.close(), 500);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-[900] bg-black/50 flex items-center justify-center">
      <div className="rounded-xl w-[95%] max-w-md bg-white p-6 flex flex-col gap-4 shadow-lg">
        <div className="flex flex-col items-center gap-4">
          {/* Barcode Container */}
          <div className="barcode-container bg-gray-50 p-4 rounded-lg">
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={value}
              viewBox={`0 0 256 256`}
            />
          </div>

          <p className="text-sm text-gray-600 text-center">
            Click "Print" to print only the barcode
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 cursor-pointer rounded-md bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-md bg-red-600 cursor-pointer text-white hover:bg-red-700"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintQRCodeModal;
