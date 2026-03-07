// utils/geoUtils.ts
// Centralised geographic-area mapping shared across the Capital Manager UI.
// Mirrors the backend capital-manager/modules/utils/geoUtils.js logic.

const EUROPE = new Set([
  "AL","AD","AT","BE","BG","CH","CY","CZ","DE","DK","EE","ES","FI","FR",
  "GB","UK","UNITED KINGDOM","GR","HR","HU","IE","IS","IT","LI","LT","LU",
  "LV","MC","MT","NL","NO","PL","PT","RO","SE","SI","SK","SM","VA",
  "ANDORRA","AUSTRIA","BELGIUM","BULGARIA","SWITZERLAND","CYPRUS","CZECH REPUBLIC",
  "GERMANY","DENMARK","ESTONIA","SPAIN","FINLAND","FRANCE","GREECE","CROATIA",
  "HUNGARY","IRELAND","ICELAND","ITALY","LIECHTENSTEIN","LITHUANIA","LUXEMBOURG",
  "LATVIA","MONACO","MALTA","NETHERLANDS","NORWAY","POLAND","PORTUGAL","ROMANIA",
  "SWEDEN","SLOVENIA","SLOVAKIA","SAN MARINO","VATICAN",
]);

const ASIA = new Set([
  "AE","AF","AM","AZ","BD","BH","BN","BT","CN","GE","HK","ID","IN","IL",
  "IQ","IR","JO","JP","KG","KH","KP","KR","KW","KZ","LA","LB","LK","MM",
  "MN","MO","MV","MY","NP","OM","PH","PK","PS","QA","SA","SG","SY","TH",
  "TJ","TL","TM","TR","TW","UZ","VN","YE",
  "UAE","UNITED ARAB EMIRATES","AFGHANISTAN","ARMENIA","AZERBAIJAN","BANGLADESH",
  "BAHRAIN","BRUNEI","BHUTAN","CHINA","GEORGIA","HONG KONG","INDONESIA","INDIA",
  "ISRAEL","IRAQ","IRAN","JORDAN","JAPAN","KYRGYZSTAN","CAMBODIA","NORTH KOREA",
  "SOUTH KOREA","KUWAIT","KAZAKHSTAN","LAOS","LEBANON","SRI LANKA","MYANMAR",
  "MONGOLIA","MACAU","MALDIVES","MALAYSIA","NEPAL","OMAN","PHILIPPINES","PAKISTAN",
  "PALESTINE","QATAR","SAUDI ARABIA","SINGAPORE","SYRIA","THAILAND","TAJIKISTAN",
  "TIMOR-LESTE","TURKMENISTAN","TURKEY","TAIWAN","UZBEKISTAN","VIETNAM","YEMEN",
]);

const LATAM = new Set([
  "AR","BO","BR","BZ","CL","CO","CR","CU","DO","EC","SV","GF","GT","GY",
  "HN","JM","MX","NI","PA","PE","PR","PY","SR","UY","VE",
  "ARGENTINA","BOLIVIA","BRAZIL","BELIZE","CHILE","COLOMBIA","COSTA RICA","CUBA",
  "DOMINICAN REPUBLIC","ECUADOR","EL SALVADOR","FRENCH GUIANA","GUATEMALA","GUYANA",
  "HONDURAS","JAMAICA","MEXICO","NICARAGUA","PANAMA","PERU","PUERTO RICO",
  "PARAGUAY","SURINAME","URUGUAY","VENEZUELA",
]);

/**
 * Map a country name or ISO 3166-1 alpha-2 code to a geographic area label.
 * Returns "Europe", "Asia", "Latam", or "North America" (default).
 */
export function countryToArea(country: string): string {
  const norm = country.trim().toUpperCase();
  if (EUROPE.has(norm)) return "Europe";
  if (ASIA.has(norm))   return "Asia";
  if (LATAM.has(norm))  return "Latam";
  return "North America";
}
