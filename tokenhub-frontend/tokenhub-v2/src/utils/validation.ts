import { toast } from 'sonner';

/**
 * Validates if a string is a valid Ethereum address
 * @param address - The address string to validate
 * @returns boolean - true if valid, false otherwise
 */
export const isValidEthereumAddress = (address: string): boolean => {
  // Check if address matches Ethereum address format (0x followed by 40 hex characters)
  const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethereumAddressRegex.test(address);
};

/**
 * Validates if a string is a valid email address
 * @param email - The email string to validate
 * @returns boolean - true if valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  // Standard email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates Ethereum address and shows toast error if invalid
 * @param address - The address to validate
 * @param fieldName - The name of the field for error message (e.g., "wallet address", "contract address")
 * @returns boolean - true if valid, false otherwise
 */
export const validateEthereumAddressWithToast = (address: string, fieldName: string = 'address'): boolean => {
  if (!address.trim()) {
    toast.error(`Please enter a ${fieldName}`);
    return false;
  }
  
  if (!isValidEthereumAddress(address)) {
    toast.error(`Invalid ${fieldName}. Please enter a valid Ethereum address (0x...)`);
    return false;
  }
  
  return true;
};

/**
 * Validates email and shows toast error if invalid
 * @param email - The email to validate
 * @returns boolean - true if valid, false otherwise
 */
export const validateEmailWithToast = (email: string): boolean => {
  if (!email.trim()) {
    toast.error('Please enter an email address');
    return false;
  }
  
  if (!isValidEmail(email)) {
    toast.error('Please enter a valid email address');
    return false;
  }
  
  return true;
};
