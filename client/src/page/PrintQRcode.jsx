import React, { useState, useRef } from "react";
import {
  ArrowLeft,
  Printer,
  Download,
  QrCode,
  Package,
  Search,
  Filter,
  CheckCircle,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";

const PrintQRCodePage = () => {
  const navigate = useNavigate();
  const printRef = useRef();
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [printLayout, setPrintLayout] = useState("standard");
  const [includeDetails, setIncludeDetails] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  // Mock equipment data
  const equipment = [
    {
      good_id: "1",
      name: "Heavy Duty Drill Machine",
      qr_code: "DRL-001-2024",
      category_name: "Power Tools",
      quantity: 5,
      status: "available"
    },
    {
      good_id: "2",
      name: "Industrial Power Washer",
      qr_code: "PWR-002-2024",
      category_name: "Cleaning Equipment",
      quantity: 3,
      status: "available"
    },
    {
      good_id: "3",
      name: "Extension Ladder",
      qr_code: "LAD-003-2024",
      category_name: "Safety Equipment",
      quantity: 2,
      status: "out"
    },
    {
      good_id: "4",
      name: "Portable Generator",
      qr_code: "GEN-004-2024",
      category_name: "Power Equipment",
      quantity: 1,
      status: "maintenance"
    },
    {
      good_id: "5",
      name: "Tool Kit Set",
      qr_code: "TKL-005-2024",
      category_name: "Hand Tools",
      quantity: 8,
      status: "available"
    }
  ];

  const filteredEquipment = equipment.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.qr_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectEquipment = (equipmentId) => {
    setSelectedEquipment(prev =>
      prev.includes(equipmentId)
        ? prev.filter(id => id !== equipmentId)
        : [...prev, equipmentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEquipment.length === filteredEquipment.length) {
      setSelectedEquipment([]);
    } else {
      setSelectedEquipment(filteredEquipment.map(item => item.good_id));
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Equipment QR Codes",
    onAfterPrint: () => toast.success("QR codes printed successfully!"),
  });

  const selectedItems = equipment.filter(item => selectedEquipment.includes(item.good_id));

  // QR Code Generator Component
  const QRCodeDisplay = ({ qrCode, size = 120 }) => {
    return (
      <div
        className="bg-white border-2 border-gray-800 flex flex-col items-center justify-center p-2"
        style={{ width: size, height: size }}
      >
        <div className="text-center">
          <QrCode className="w-6 h-6 mx-auto mb-1 text-gray-700" />
          <div className="font-mono font-bold text-xs text-gray-900 break-all">
            {qrCode}
          </div>
          <div className="text-[10px] mt-1 text-gray-600">SCAN ME</div>
        </div>
      </div>
    );
  };

  // Printable Content Component
  const PrintableContent = React.forwardRef((props, ref) => (
    <div ref={ref} className="p-8 bg-white">
      <style>
        {`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print-page {
              page-break-after: always;
            }
            @page {
              margin: 0.5in;
            }
          }

          .qr-grid-standard {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1in;
          }

          .qr-grid-compact {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5in;
          }

          .qr-grid-labels {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 0.2in;
          }
        `}
      </style>

      {selectedItems.length === 0 ? (
        <div className="text-center py-8">
          <p>No equipment selected for printing</p>
        </div>
      ) : (
        <div className="space-y-8">
          {selectedItems.map((item, pageIndex) => (
            <div
              key={item.good_id}
              className={`print-page ${
                printLayout === 'standard' ? 'qr-grid-standard' :
                printLayout === 'compact' ? 'qr-grid-compact' :
                'qr-grid-labels'
              }`}
            >
              {Array.from({ length:
                printLayout === 'standard' ? 4 :
                printLayout === 'compact' ? 8 : 30
              }).map((_, copyIndex) => (
                <div
                  key={`${item.good_id}-${copyIndex}`}
                  className={`flex flex-col items-center justify-center p-4 border border-gray-300 ${
                    printLayout === 'labels' ? 'text-xs' : 'text-sm'
                  }`}
                >
                  <QRCodeDisplay
                    qrCode={item.qr_code}
                    size={printLayout === 'labels' ? 80 : 120}
                  />

                  {includeDetails && (
                    <div className="text-center mt-3">
                      <div className="font-semibold text-gray-900 break-words">
                        {item.name}
                      </div>
                      <div className="text-gray-600 mt-1">
                        {item.category_name}
                      </div>
                      <div className="text-gray-500 mt-1">
                        ID: {item.good_id.slice(0, 8)}
                      </div>
                      {printLayout !== 'labels' && (
                        <div className="text-gray-500 text-xs mt-1">
                          Quantity: {item.quantity}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  ));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/equipment")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Equipment</span>
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <QrCode className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Print QR Codes</h1>
                <p className="text-gray-600 mt-2">Generate and print QR codes for equipment</p>
              </div>
            </div>

            {selectedEquipment.length > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {selectedEquipment.length} items selected
                </span>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Eye className="w-5 h-5" />
                  <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Printer className="w-5 h-5" />
                  <span>Print Selected</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Equipment Selection */}
          <div className="lg:col-span-1 space-y-6">
            {/* Print Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Print Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Layout
                  </label>
                  <select
                    value={printLayout}
                    onChange={(e) => setPrintLayout(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="standard">Standard (4 per page)</option>
                    <option value="compact">Compact (8 per page)</option>
                    <option value="labels">Label Sheets (30 per page)</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeDetails"
                    checked={includeDetails}
                    onChange={(e) => setIncludeDetails(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="includeDetails" className="text-sm text-gray-700">
                    Include equipment details
                  </label>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handlePrint}
                    disabled={selectedEquipment.length === 0}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Printer className="w-5 h-5" />
                    <span>Print QR Codes</span>
                  </button>

                  <button
                    onClick={() => {
                      // For PDF export, you can use the same print function
                      handlePrint();
                    }}
                    className="w-full mt-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export as PDF</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Selection Summary */}
            {selectedEquipment.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">{selectedEquipment.length} items selected</span>
                </div>
                <button
                  onClick={() => setSelectedEquipment([])}
                  className="text-sm text-green-600 hover:text-green-800 mt-2"
                >
                  Clear selection
                </button>
              </div>
            )}
          </div>

          {/* Right Panel - Equipment List */}
          <div className="lg:col-span-3">
            {showPreview && selectedItems.length > 0 ? (
              // Preview Mode
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Print Preview</h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Close Preview
                  </button>
                </div>

                <div className="border-2 border-dashed border-gray-300 p-8 bg-white">
                  <PrintableContent ref={printRef} />
                </div>
              </div>
            ) : (
              // Equipment List Mode
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {/* Search and Filters */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search equipment..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Filter className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Equipment Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left">
                          <input
                            type="checkbox"
                            checked={selectedEquipment.length === filteredEquipment.length && filteredEquipment.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Equipment
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          QR Code
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEquipment.map((item) => (
                        <tr key={item.good_id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedEquipment.includes(item.good_id)}
                              onChange={() => handleSelectEquipment(item.good_id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Package className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                <div className="text-xs text-gray-500">ID: {item.good_id.slice(0, 8)}...</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <QrCode className="w-4 h-4 text-gray-400" />
                              <div className="text-sm font-mono text-gray-900">{item.qr_code}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{item.category_name}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900">{item.quantity}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.status === 'available' ? 'bg-green-100 text-green-800' :
                              item.status === 'out' ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredEquipment.length === 0 && (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No equipment found</p>
                      <p className="text-gray-400 mt-2">Try adjusting your search</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintQRCodePage;