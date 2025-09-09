// Simple test to check decimal formatting
const testDecimalFormatting = () => {
  const number = 1595.2451009600002;
  const decimals = 6;
  
  console.log("Original number:", number);
  console.log("Too many decimals:", number.toString());
  console.log("Fixed formatting:", number.toFixed(Math.min(decimals, 8)));
  
  const formatted = number.toFixed(Math.min(decimals, 8));
  console.log("Can parse?", !isNaN(parseFloat(formatted)));
};

console.log("Testing decimal formatting fix:");
testDecimalFormatting();
