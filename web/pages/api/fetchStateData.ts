import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../utils/firebaseConfig';
import { collection, query, where, orderBy, limit, startAfter, getDocs, Query, DocumentData, getCountFromServer } from 'firebase/firestore';

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
      filterValue = uid;
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

    // Get total count
    const countSnapshot = await getCountFromServer(firestoreQuery);
    const totalItems = countSnapshot.data().count;
    const totalPages = Math.ceil(totalItems / size);

    // Adjust currentPage if it exceeds totalPages
    const adjustedCurrentPage = Math.min(currentPage, totalPages);

    // Calculate the number of items to skip
    const itemsToSkip = (adjustedCurrentPage - 1) * size;

    // Calculate the number of items to fetch
    const itemsToFetch = Math.min(size, totalItems - itemsToSkip);

    // Check if we're trying to fetch more items than available
    if (itemsToSkip >= totalItems) {
      return res.status(200).json({
        data: [],
        currentPage: adjustedCurrentPage,
        pageSize: itemsToFetch,
        totalItems: totalItems,
        totalPages: totalPages,
        isLastPage: true
      });
    }

    // Apply pagination
    if (adjustedCurrentPage > 1) {
      const batchSize = 1000; // Firestore limit
      const batches = Math.floor(itemsToSkip / batchSize);
      let lastVisible = null;

      for (let i = 0; i < batches; i++) {
        const batchQuery = query(firestoreQuery, limit(batchSize));
        const batchSnapshot = await getDocs(batchQuery);
        lastVisible = batchSnapshot.docs[batchSnapshot.docs.length - 1];
        firestoreQuery = query(firestoreQuery, startAfter(lastVisible));
      }

      const remainingToSkip = itemsToSkip % batchSize;
      if (remainingToSkip > 0) {
        const finalSkipQuery = query(firestoreQuery, limit(remainingToSkip));
        const finalSkipSnapshot = await getDocs(finalSkipQuery);
        lastVisible = finalSkipSnapshot.docs[finalSkipSnapshot.docs.length - 1];
        firestoreQuery = query(firestoreQuery, startAfter(lastVisible));
      }
    }

    firestoreQuery = query(firestoreQuery, limit(itemsToFetch));

    const dataSnapshot = await getDocs(firestoreQuery);

    // Perform client-side filtering for additional fields
    let filteredData = dataSnapshot.docs.map(doc => {
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

    res.status(200).json({
      data: filteredData,
      currentPage: adjustedCurrentPage,
      pageSize: itemsToFetch,
      totalItems: totalItems,
      totalPages: totalPages,
      isLastPage: adjustedCurrentPage === totalPages
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch state data' });
  }
}