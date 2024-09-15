import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../utils/firebaseConfig';
import { collection, query, where, orderBy, limit, startAfter, getDocs, Query, DocumentData } from 'firebase/firestore';

type AgencyData = {
  case_id?: string;
  person_nbr: string;
  sanction?: string;
  sanction_date?: string;
  violation?: string;
  violation_date?: string;
  agency_name: string;
  employment_status?: string;
  employment_change?: string;
  start_date: string;
  end_date: string;
  last_name: string;
  first_name: string;
  middle_name?: string;
  suffix?: string;
  year_of_birth?: string;
  race?: string;
  sex?: string;
  separation_reason?: string;
  case_opened_date?: string;
  case_closed_date?: string;
  offense?: string;
  discipline_imposed?: string;
  discipline_comments?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { 
    state, 
    page = '1', 
    pageSize = '10',
    lastName = '',
    firstName = '',
    agencyName = '',
    uid = ''
  } = req.query;
  
  if (!state || Array.isArray(state)) {
    return res.status(400).json({ error: 'State parameter is required and must be a string' });
  }

  function toTitleCase(str: string) {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const currentPage = parseInt(Array.isArray(page) ? page[0] : page, 10);
  const size = parseInt(Array.isArray(pageSize) ? pageSize[0] : pageSize, 10);

  try {
    const formattedState = state.toLowerCase().replace(/\s+/g, '-');
    const uploadsRef = collection(db, 'uploads');
    let firestoreQuery: Query<DocumentData> = query(uploadsRef, where('__name__', '>=', `${formattedState}-processed.csv_`), where('__name__', '<', `${formattedState}-processed.csv_\uf8ff`));

    // Apply single field filter
    let filterField = '';
    let filterValue = '';
    
    if (uid && typeof uid === 'string') {
      filterField = 'person_nbr';
      filterValue = uid; // No need for title case on UID if it's a number
    } else if (firstName && typeof firstName === 'string') {
      filterField = 'first_name';
      filterValue = toTitleCase(firstName);
    } else if (lastName && typeof lastName === 'string') {
      filterField = 'last_name';
      filterValue = toTitleCase(lastName);
    } else if (agencyName && typeof agencyName === 'string') {
      filterField = 'agency_name';
      filterValue = toTitleCase(agencyName);
    }
    if (filterField && filterValue) {
      firestoreQuery = query(firestoreQuery, 
        where(filterField, '>=', filterValue), 
        where(filterField, '<=', filterValue + '\uf8ff'),
        orderBy(filterField)
      );
    } else {
      firestoreQuery = query(firestoreQuery, orderBy('__name__'));
    }

    // Apply pagination
    if (currentPage > 1) {
      const previousPageQuery = query(firestoreQuery, limit((currentPage - 1) * size));
      const previousPageSnapshot = await getDocs(previousPageQuery);
      const lastVisible = previousPageSnapshot.docs[previousPageSnapshot.docs.length - 1];
      firestoreQuery = query(firestoreQuery, startAfter(lastVisible));
    }

    firestoreQuery = query(firestoreQuery, limit(size));

    const snapshot = await getDocs(firestoreQuery);

    // Perform client-side filtering for additional fields
    let filteredData = snapshot.docs.map(doc => {
      const docData = doc.data();
      return {
        case_id: docData.case_id,
        person_nbr: docData.person_nbr,
        sanction: docData.sanction,
        sanction_date: docData.sanction_date,
        violation: docData.violation,
        violation_date: docData.violation_date,
        full_name: docData.full_name,
        agency_name: docData.agency_name,
        employment_status: docData.employment_status,
        employment_change: docData.employment_change,
        start_date: docData.start_date,
        end_date: docData.end_date,
        last_name: docData.last_name,
        first_name: docData.first_name,
        middle_name: docData.middle_name,
        suffix: docData.suffix,
        year_of_birth: docData.year_of_birth,
        race: docData.race,
        sex: docData.sex,
        separation_reason: docData.separation_reason,
        case_opened_date: docData.case_opened_date,
        case_closed_date: docData.case_closed_date,
        offense: docData.offense,
        discipline_imposed: docData.discipline_imposed,
        discipline_comments: docData.discipline_comments
      } as AgencyData;
    });

    const firstNameStr = typeof firstName === 'string' ? firstName : Array.isArray(firstName) ? firstName[0] : '';
    const lastNameStr = typeof lastName === 'string' ? lastName : Array.isArray(lastName) ? lastName[0] : '';
    const agencyNameStr = typeof agencyName === 'string' ? agencyName : Array.isArray(agencyName) ? agencyName[0] : '';

    if (firstNameStr && filterField !== 'first_name') {
      filteredData = filteredData.filter(d => d.first_name.toUpperCase().includes(firstNameStr.toUpperCase()));
    }
    if (lastNameStr && filterField !== 'last_name') {
      filteredData = filteredData.filter(d => d.last_name.toUpperCase().includes(lastNameStr.toUpperCase()));
    }
    if (agencyNameStr && filterField !== 'agency_name') {
      filteredData = filteredData.filter(d => d.agency_name.toUpperCase().includes(agencyNameStr.toUpperCase()));
    }

    const hasNextPage = filteredData.length === size;

    res.status(200).json({
      data: filteredData,
      currentPage: currentPage,
      pageSize: size,
      hasNextPage: hasNextPage
    });
  } catch (error) {
    console.error('Error fetching state data:', error);
    res.status(500).json({ error: 'Failed to fetch state data' });
  }
}