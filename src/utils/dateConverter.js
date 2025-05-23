/**
 * Convert English (Gregorian) date to Nepali (Bikram Sambat) date
 * This is a simplified implementation - for production, consider using a comprehensive library
 */

// Nepali months in Devanagari script
const nepaliMonths = [
  'बैशाख', 'जेठ', 'असार', 'श्रावण', 'भाद्र', 'आश्विन', 
  'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुण', 'चैत्र'
];

// Nepali digits in Devanagari script
const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

// Convert a number to Nepali digits string
export const toNepaliDigits = (number) => {
  if (number === undefined || number === null) return '';
  return number.toString().split('').map(digit => 
    isNaN(digit) ? digit : nepaliDigits[parseInt(digit)]
  ).join('');
};

// Simple offset-based conversion (approximate)
// For accurate conversion, a more sophisticated algorithm or library would be needed
export const convertToBS = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'मिति उपलब्ध छैन';
    
    // Add approximately 56 years, 8 months and 17 days for BS
    // This is a very simplified approach - real conversion is more complex
    const bsYear = date.getFullYear() + 56 + (date.getMonth() >= 4 ? 1 : 0);
    
    // Approximate month conversion (this is highly simplified)
    let bsMonth = (date.getMonth() + 8) % 12;
    if (bsMonth === 0) bsMonth = 12;
    
    // Date adjustments (simplified)
    let bsDate = date.getDate() + 15;
    
    // Basic adjustment for month ends (very approximate)
    if (bsDate > 30) {
      bsDate = bsDate - 30;
      bsMonth = bsMonth + 1;
      if (bsMonth > 12) {
        bsMonth = 1;
      }
    }
    
    return `${nepaliMonths[bsMonth-1]} ${toNepaliDigits(bsDate)}, ${toNepaliDigits(bsYear)}`;
  } catch (error) {
    console.error("Error converting date to BS:", error);
    return 'मिति उपलब्ध छैन';
  }
};

// Format date in Nepali style
export const formatNepaliDate = (dateString) => {
  if (!dateString) return 'मिति उपलब्ध छैन';
  
  try {
    return convertToBS(dateString);
  } catch (error) {
    console.error("Error formatting Nepali date:", error);
    return 'मिति उपलब्ध छैन';
  }
};
