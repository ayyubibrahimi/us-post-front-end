import Papa from 'papaparse';

// Helper function to generate a slug from an agency name
const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, '-'); // Convert agency name to slug
};

export async function fetchUniqueAgencies(state: string = 'Georgia') {
  const response = await fetch('/ga_fl.csv');
  const csvData = await response.text();
  const parsedData = Papa.parse(csvData, { header: true });

  const agencies = parsedData.data
    .filter(row => typeof row.agcy_name === 'string' && row.agcy_name.trim()) // Ensure agcy_name is a non-empty string
    .filter(row => row.state === state) // Filter agencies by state
    .map(row => ({
      name: row.agcy_name,
      state: row.state,
      slug: generateSlug(row.agcy_name),
    }));

  // Deduplicate based on slug
  const uniqueAgencies = Array.from(new Set(agencies.map(a => a.slug)))
    .map(slug => {
      return agencies.find(a => a.slug === slug);
    });

  return uniqueAgencies;
}

export async function fetchAgencyDetails(agencySlug: string) {
  // This function remains unchanged
  const response = await fetch('/ga_fl.csv');
  const csvData = await response.text();
  const parsedData = Papa.parse(csvData, { header: true });
  const agencyDetails = parsedData.data.find(row => generateSlug(row.agcy_name) === agencySlug);

  return agencyDetails || null; // Return null if no matching agency is found
}
