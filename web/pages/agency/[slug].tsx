import { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import AgencyPage from '../../components/Pages/AgencyPage';

// Updated to fetch all agency details matching the slug
// Function to fetch all agency records and details for the first record
const fetchAgencyDetailsAndStats = (slug) => {
  const filePath = path.join(process.cwd(), 'public', 'employment_with_add_coord.csv');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const parsedData = Papa.parse(fileContents, { header: true, skipEmptyLines: true });

  const agencyRecords = parsedData.data.filter(row => {
    const agencySlug = row.agcy_name.replace(/\s+/g, '-').toLowerCase();
    return agencySlug === slug;
  });


  return {
    records: agencyRecords,
  };
};

const fetchUniqueAgencies = () => {
  const filePath = path.join(process.cwd(), 'public', 'employment_with_add_coord.csv');
  const csvData = fs.readFileSync(filePath, 'utf8');
  const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });
  const agencies = parsedData.data.map(row => ({
    name: row.agcy_name,
    slug: row.agcy_name.replace(/\s+/g, '-').toLowerCase(),
  }));
  return agencies;
};


export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug;
  const { records } = fetchAgencyDetailsAndStats(slug);

  if (!records || records.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      agencyRecords: records,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const agencies = fetchUniqueAgencies();
  const paths = agencies.map(({ slug }) => ({
    params: { slug },
  }));

  return { paths, fallback: 'blocking' };
};

const AgencyPageContainer = ({ agencyRecords }) => {
  if (!agencyRecords) {
    return <div>Agency not found.</div>;
  }

  return <AgencyPage agencyRecords={agencyRecords} />;
};

export default AgencyPageContainer;
