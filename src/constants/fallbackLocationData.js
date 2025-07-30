// Fallback data for development when API is not available
export const FALLBACK_LOCATION_DATA = {
  provinces: [
    { id: 1, name: "प्रदेश नं. १", name_en: "Province No. 1" },
    { id: 2, name: "मधेश प्रदेश", name_en: "Madhesh Province" },
    { id: 3, name: "बागमती प्रदेश", name_en: "Bagmati Province" },
    { id: 4, name: "गण्डकी प्रदेश", name_en: "Gandaki Province" },
    { id: 5, name: "लुम्बिनी प्रदेश", name_en: "Lumbini Province" },
    { id: 6, name: "कर्णाली प्रदेश", name_en: "Karnali Province" },
    { id: 7, name: "सुदूरपश्चिम प्रदेश", name_en: "Sudurpashchim Province" }
  ],
  
  districts: {
    3: [ // Bagmati Province districts
      { id: 1, name: "काठमाडौं", name_en: "Kathmandu" },
      { id: 2, name: "ललितपुर", name_en: "Lalitpur" },
      { id: 3, name: "भक्तपुर", name_en: "Bhaktapur" },
      { id: 4, name: "सिन्धुली", name_en: "Sindhuli" },
      { id: 5, name: "रामेछाप", name_en: "Ramechhap" },
      { id: 6, name: "दोलखा", name_en: "Dolakha" },
      { id: 7, name: "चितवन", name_en: "Chitwan" },
      { id: 8, name: "मकवानपुर", name_en: "Makwanpur" },
      { id: 9, name: "नुवाकोट", name_en: "Nuwakot" },
      { id: 10, name: "धादिङ", name_en: "Dhading" },
      { id: 11, name: "काभ्रेपलाञ्चोक", name_en: "Kavrepalanchok" },
      { id: 12, name: "सिन्धुपाल्चोक", name_en: "Sindhupalchok" },
      { id: 13, name: "रसुवा", name_en: "Rasuwa" }
    ]
  },
  
  municipalities: {
    1: [ // Kathmandu municipalities
      { id: 1, name: "काठमाडौं महानगरपालिका", name_en: "Kathmandu Metropolitan City" },
      { id: 2, name: "कागेश्वरी मनोहरा नगरपालिका", name_en: "Kageshwori Manohara Municipality" },
      { id: 3, name: "कीर्तिपुर नगरपालिका", name_en: "Kirtipur Municipality" },
      { id: 4, name: "गोकर्णेश्वर नगरपालिका", name_en: "Gokarneshwor Municipality" },
      { id: 5, name: "चन्द्रागिरि नगरपालिका", name_en: "Chandragiri Municipality" },
      { id: 6, name: "तारकेश्वर नगरपालिका", name_en: "Tarakeshwor Municipality" },
      { id: 7, name: "दक्षिणकाली नगरपालिका", name_en: "Dakshinkali Municipality" },
      { id: 8, name: "नागार्जुन नगरपालिका", name_en: "Nagarjun Municipality" },
      { id: 9, name: "बुढानीलकण्ठ नगरपालिका", name_en: "Budhanilkantha Municipality" },
      { id: 10, name: "शङ्खरापुर नगरपालिका", name_en: "Shankharapur Municipality" },
      { id: 11, name: "टोखा नगरपालिका", name_en: "Tokha Municipality" }
    ]
  }
};
