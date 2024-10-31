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
    startDate = '',
    endDate = '',
    agencyName = '',
    uid = ''
  } = req.query;
  
  if (!state || Array.isArray(state)) {
    return res.status(400).json({ error: 'State parameter is required and must be a string' });
  }

  function toTitleCase(str: string | string[]): string {
    if (Array.isArray(str)) {
      str = str[0]; // Take the first element if it's an array
    }
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
    let firestoreQuery: Query<DocumentData> = query(uploadsRef, 
      where('__name__', '>=', `${formattedState}-processed.csv_`), 
      where('__name__', '<', `${formattedState}-processed.csv_\uf8ff`)
    );

    // Define filters
    const filters = [
      { field: 'person_nbr', value: uid },
      { field: 'first_name', value: firstName },
      { field: 'last_name', value: lastName },
      { field: 'agency_name', value: agencyName },
      { field: 'start_date', value: startDate },
      { field: 'end_date', value: endDate }
    ].filter(f => f.value && typeof f.value === 'string');

    // Apply the first non-empty filter at Firestore level
    const primaryFilter = filters.find(f => f.value);
    if (primaryFilter) {
      const titleCaseValue = toTitleCase(primaryFilter.value);
      firestoreQuery = query(firestoreQuery, 
        where(primaryFilter.field, '>=', titleCaseValue),
        where(primaryFilter.field, '<=', titleCaseValue + '\uf8ff'),
        orderBy(primaryFilter.field)
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

    // Map the data
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

    // Apply remaining filters at application level
    filters.forEach(filter => {
      if (filter !== primaryFilter) {
        const value = filter.value as string;
        filteredData = filteredData.filter(d => 
          d[filter.field as keyof AgencyData]?.toString().toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    res.status(200).json({
      data: filteredData,
      currentPage: adjustedCurrentPage,
      pageSize: itemsToFetch,
      totalItems: totalItems,
      totalPages: totalPages,
      isLastPage: adjustedCurrentPage === totalPages
    });
  } catch (error) {
    console.error('Error in handler:', error);
    res.status(500).json({ error: 'Failed to fetch state data' });
  }
}