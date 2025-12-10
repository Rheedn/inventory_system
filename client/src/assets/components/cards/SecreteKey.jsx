import React, { useEffect, useRef, useState } from "react";
import {
  Key,
  Shield,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Copy,
  Loader,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
const SecreteKeyCard = ({ setSecretKey_valid }) => {
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [inputValues, setInputValues] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auto-focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index, value) => {
    // Only allow alphanumeric characters and limit to 3 characters per input
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 3);

    const newValues = [...inputValues];
    newValues[index] = sanitizedValue;
    setInputValues(newValues);
    setError("");

    // Auto-focus next input if current input is filled
    if (sanitizedValue.length === 3 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !inputValues[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/[^a-zA-Z0-9]/g, "");

    if (pasteData.length === 12) {
      const chunks = [
        pasteData.slice(0, 3),
        pasteData.slice(3, 6),
        pasteData.slice(6, 9),
        pasteData.slice(9, 12),
      ];
      setInputValues(chunks);
      inputRefs.current[3].focus();
    } else {
      setError("Pasted text must be exactly 12 characters");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredKey = inputValues.join("");
    if(enteredKey.trim() === ''){
      toast.error("Please fill in the secrete key");
      return
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_API_BASE_URL}/setup/verify-secrete-key`,
        { secret_key: enteredKey }
      );
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
     setSecretKey_valid(true)
    } catch (error) {
      console.log(error.message);
      toast.error(error?.response?.data.message);
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <div className="p-3 bg-blue-100 rounded-full">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Secret Key Verification
        </h1>
        <p className="text-gray-600 text-sm">
          Enter your 12-character secret key to continue
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Enter Secret Key
          </label>
          <div className="flex space-x-3 justify-center">
            {inputValues.map((value, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                maxLength={3}
                className={`
w-20 h-12 text-center font-mono text-lg font-bold
border-2 rounded-lg focus:outline-none outline-none focus:ring-2
transition-all duration-200
${
  error
    ? "border-red-300 focus:border-red-500 outline-none focus:ring-red-200"
    : isVerified
    ? "border-green-300 focus:border-green-500 focus:ring-green-200"
    : "border-gray-300 focus:border-blue-500 outline-none focus:ring-blue-200"
}
`}
                placeholder="XXX"
              />
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {isVerified && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-3 rounded-lg border border-green-200">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">
              Secret key verified successfully!
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            className="flex items-center justify-center space-x-2 flex-1 px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center items-center gap-2">
                <Loader className="animate-spin" />
                <span>Verifying </span>
              </div>
            ) : (
              <div className="flex justify-center items-center gap-2">
                <Key className="w-4 h-4" />
                <span>Verify Key</span>
              </div>
            )}
          </button>
        </div>
      </form>

      {/* Help Text */}
      <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
        <p>
          Each box should contain 3 characters. You can also paste the entire
          key.
        </p>
      </div>
    </div>
  );
};

export default SecreteKeyCard;
