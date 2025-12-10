import crypto from "crypto";
export const generateQRcode = (options = {}) => {
  const { short = false, prefix = "EQP" } = options;
  // Generate a UUID (v4)
  const uuid = crypto.randomUUID();
  const uniquePart = short
    ? crypto.createHash("sha256").update(uuid).digest("hex").slice(0, 8)
    : uuid;

  return `${prefix}-${uniquePart}`;
};
