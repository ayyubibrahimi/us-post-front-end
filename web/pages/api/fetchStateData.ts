import {
  type DocumentData,
  type Query,
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../utils/FirebaseConfig";

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

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

type Filter = {
  field: string;
  value: string | string[];
  isPrefix?: boolean;
};

function buildNameQuery(
  baseQuery: Query<DocumentData>,
  firstName: string | string[] | undefined,
  lastName: string | string[] | undefined,
  agencyName: string | string[] | undefined,
  person_nbr: string | string[] | undefined,
): Query<DocumentData> {
  // Convert potential array values to strings and clean
  const cleanFirstName = (
    Array.isArray(firstName) ? firstName[0] : firstName || ""
  ).trim();
  const cleanLastName = (
    Array.isArray(lastName) ? lastName[0] : lastName || ""
  ).trim();
  const cleanAgencyName = (
    Array.isArray(agencyName) ? agencyName[0] : agencyName || ""
  ).trim();

  const uid = (
    Array.isArray(person_nbr) ? person_nbr[0] : person_nbr || ""
  ).trim();

  let firestoreQuery = baseQuery;

  // Build query based on combinations of filters
  if (cleanFirstName && cleanLastName && cleanAgencyName) {
    // All three filters present
    const firstNameTitle = toTitleCase(cleanFirstName);
    const lastNameTitle = toTitleCase(cleanLastName);
    const agencyNameUpper = toTitleCase(cleanAgencyName);

    firestoreQuery = query(
      firestoreQuery,
      where("first_name", ">=", firstNameTitle),
      where("first_name", "<=", `${firstNameTitle}~`),
      where("last_name", ">=", lastNameTitle),
      where("last_name", "<=", `${lastNameTitle}~`),
      where("agency_name", ">=", agencyNameUpper),
      where("agency_name", "<=", `${agencyNameUpper}~`),
      orderBy("first_name"),
      orderBy("last_name"),
      orderBy("agency_name"),
    );
  } else if (cleanFirstName && cleanLastName) {
    // Only first and last name
    const firstNameTitle = toTitleCase(cleanFirstName);
    const lastNameTitle = toTitleCase(cleanLastName);

    firestoreQuery = query(
      firestoreQuery,
      where("first_name", ">=", firstNameTitle),
      where("first_name", "<=", `${firstNameTitle}~`),
      where("last_name", ">=", lastNameTitle),
      where("last_name", "<=", `${lastNameTitle}~`),
      orderBy("first_name"),
      orderBy("last_name"),
    );
  } else if (cleanFirstName && cleanAgencyName) {
    // First name and agency name
    const firstNameTitle = toTitleCase(cleanFirstName);
    const agencyNameUpper = toTitleCase(cleanAgencyName);

    firestoreQuery = query(
      firestoreQuery,
      where("first_name", ">=", firstNameTitle),
      where("first_name", "<=", `${firstNameTitle}~`),
      where("agency_name", ">=", agencyNameUpper),
      where("agency_name", "<=", `${agencyNameUpper}~`),
      orderBy("first_name"),
      orderBy("agency_name"),
    );
  } else if (cleanLastName && cleanAgencyName) {
    // Last name and agency name
    const lastNameTitle = toTitleCase(cleanLastName);
    const agencyNameUpper = toTitleCase(cleanAgencyName);

    firestoreQuery = query(
      firestoreQuery,
      where("last_name", ">=", lastNameTitle),
      where("last_name", "<=", `${lastNameTitle}~`),
      where("agency_name", ">=", agencyNameUpper),
      where("agency_name", "<=", `${agencyNameUpper}~`),
      orderBy("last_name"),
      orderBy("agency_name"),
    );
  } else if (cleanLastName) {
    // Only last name
    const lastNameTitle = toTitleCase(cleanLastName);
    firestoreQuery = query(
      firestoreQuery,
      where("last_name", ">=", lastNameTitle),
      where("last_name", "<=", `${lastNameTitle}~`),
      orderBy("last_name"),
    );
  } else if (cleanFirstName) {
    // Only first name
    const firstNameTitle = toTitleCase(cleanFirstName);
    firestoreQuery = query(
      firestoreQuery,
      where("first_name", ">=", firstNameTitle),
      where("first_name", "<=", `${firstNameTitle}~`),
      orderBy("first_name"),
    );
  } else if (cleanAgencyName) {
    // Only agency name
    const agencyNameUpper = toTitleCase(cleanAgencyName);
    firestoreQuery = query(
      firestoreQuery,
      where("agency_name", ">=", agencyNameUpper),
      where("agency_name", "<=", `${agencyNameUpper}~`),
      orderBy("agency_name"),
    );
  } else if (uid) {
    firestoreQuery = query(firestoreQuery, where("person_nbr", ">=", uid));
  } else {
    firestoreQuery = query(firestoreQuery, orderBy("person_nbr"));
  }

  return firestoreQuery;
}

// Update the handler function to use the new query builder
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    state,
    page = "1",
    pageSize = "10",
    lastName = "",
    middleName = "",
    firstName = "",
    startDate = "",
    endDate = "",
    agencyName = "",
    uid = "",
  } = req.query;

  if (!state || Array.isArray(state)) {
    return res
      .status(400)
      .json({ error: "State parameter is required and must be a string" });
  }

  const currentPage = Number.parseInt(Array.isArray(page) ? page[0] : page, 10);
  const size = Number.parseInt(
    Array.isArray(pageSize) ? pageSize[0] : pageSize,
    10,
  );
  const cleanFirstName = (
    Array.isArray(firstName) ? firstName[0] : firstName || ""
  ).trim();
  const cleanLastName = (
    Array.isArray(lastName) ? lastName[0] : lastName || ""
  ).trim();
  const cleanAgencyName = (
    Array.isArray(agencyName) ? agencyName[0] : agencyName || ""
  ).trim();

  try {
    const formattedState = state.toLowerCase().replace(/\s+/g, "-");
    if (formattedState === "minneapolis") {
      return res.status(200).json({
        data: [],
        currentPage: 1,
        pageSize: Number.parseInt(
          Array.isArray(pageSize) ? pageSize[0] : pageSize,
          10,
        ),
        totalItems: 0,
        totalPages: 0,
        isLastPage: true,
      });
    }
    const uploadsRef = collection(db, "db_launch");

    // Change the base query to use state field instead of document ID
    let firestoreQuery: Query<DocumentData> = query(
      uploadsRef,
      where("state", "==", formattedState),
    );

    firestoreQuery = buildNameQuery(
      firestoreQuery,
      firstName,
      lastName,
      agencyName,
      uid,
    );

    // Build remaining filters
    const filters: Filter[] = [];
    if (uid) filters.push({ field: "person_nbr", value: uid });
    if (middleName) filters.push({ field: "middle_name", value: middleName });
    // if (agencyName) filters.push({ field: 'agency_name', value: agencyName });
    if (startDate) filters.push({ field: "start_date", value: startDate });
    if (endDate) filters.push({ field: "end_date", value: endDate });

    // For name filters, return first batch immediately to avoid timeout
    if (cleanFirstName || cleanLastName || cleanAgencyName) {
      const batchSize = 500;

      // For first page, get first batch immediately
      if (currentPage === 1) {
        const snapshot = await getDocs(query(firestoreQuery, limit(batchSize)));

        if (snapshot.empty) {
          return res.status(200).json({
            data: [],
            currentPage: 1,
            pageSize: size,
            totalItems: 0,
            totalPages: 0,
            isLastPage: true,
          });
        }

        const batchData = snapshot.docs.map((doc) => {
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
            discipline_comments: docData.discipline_comments,
          } as AgencyData;
        });

        // Apply remaining filters
        let filteredData = batchData;
        for (const filter of filters) {
          const value = filter.value as string;
          filteredData = filteredData.filter((d) => {
            const fieldValue = d[filter.field as keyof AgencyData]?.toString();
            if (!fieldValue) return false;

            if (filter.isPrefix) {
              return fieldValue.toLowerCase().startsWith(value.toLowerCase());
            }
            return fieldValue.toLowerCase().includes(value.toLowerCase());
          });
        }

        // Sort the filtered data
        filteredData.sort((a, b) => {
          const firstNameA = a.first_name || "";
          const firstNameB = b.first_name || "";
          const lastNameA = a.last_name || "";
          const lastNameB = b.last_name || "";

          const lastNameCompare = lastNameA.localeCompare(lastNameB);
          if (lastNameCompare !== 0) return lastNameCompare;

          return firstNameA.localeCompare(firstNameB);
        });

        // Get rough estimate of total results for pagination
        const countSnapshot = await getCountFromServer(firestoreQuery);
        const estimatedTotal = countSnapshot.data().count;

        // Return first page immediately with estimated total
        const paginatedData = filteredData.slice(0, size);

        return res.status(200).json({
          data: paginatedData,
          currentPage: 1,
          pageSize: size,
          totalItems: Math.max(filteredData.length, estimatedTotal),
          totalPages: Math.ceil(
            Math.max(filteredData.length, estimatedTotal) / size,
          ),
          isLastPage: false, // Always false for first page to allow pagination
          isPartialResults: true, // Flag indicating there may be more results
        });
      }

      // For subsequent pages, fall back to full fetch
      let allData: AgencyData[] = [];
      let lastDoc = null;
      let hasMore = true;

      while (hasMore) {
        let batchQuery = firestoreQuery;
        if (lastDoc) {
          batchQuery = query(firestoreQuery, startAfter(lastDoc));
        }
        const snapshot = await getDocs(batchQuery);

        if (snapshot.empty) {
          hasMore = false;
          break;
        }

        const batchData = snapshot.docs.map((doc) => {
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
            discipline_comments: docData.discipline_comments,
          } as AgencyData;
        });

        allData = [...allData, ...batchData];
        lastDoc = snapshot.docs[snapshot.docs.length - 1];

        if (snapshot.docs.length < batchSize) {
          hasMore = false;
        }
      }

      // Apply remaining filters
      for (const filter of filters) {
        const value = filter.value as string;
        allData = allData.filter((d) => {
          const fieldValue = d[filter.field as keyof AgencyData]?.toString();
          if (!fieldValue) return false;

          if (filter.isPrefix) {
            return fieldValue.toLowerCase().startsWith(value.toLowerCase());
          }
          return fieldValue.toLowerCase().includes(value.toLowerCase());
        });
      }

      // Sort the filtered data
      allData.sort((a, b) => {
        const firstNameA = a.first_name || "";
        const firstNameB = b.first_name || "";
        const lastNameA = a.last_name || "";
        const lastNameB = b.last_name || "";

        const lastNameCompare = lastNameA.localeCompare(lastNameB);
        if (lastNameCompare !== 0) return lastNameCompare;

        return firstNameA.localeCompare(firstNameB);
      });

      // Calculate pagination after sorting
      const totalPages = Math.ceil(allData.length / size);
      const adjustedCurrentPage = Math.min(currentPage, totalPages);
      const startIndex = (adjustedCurrentPage - 1) * size;
      const endIndex = startIndex + size;
      const paginatedData = allData.slice(startIndex, endIndex);

      return res.status(200).json({
        data: paginatedData,
        currentPage: adjustedCurrentPage,
        pageSize: size,
        totalItems: allData.length,
        totalPages: totalPages,
        isLastPage: adjustedCurrentPage === totalPages,
      });
    }

    // For non-name queries, use standard pagination
    const countSnapshot = await getCountFromServer(firestoreQuery);
    const totalItems = countSnapshot.data().count;
    const totalPages = Math.ceil(totalItems / size);
    const adjustedCurrentPage = Math.min(currentPage, totalPages);
    const itemsToSkip = (adjustedCurrentPage - 1) * size;
    const itemsToFetch = Math.min(size, totalItems - itemsToSkip);

    if (itemsToSkip >= totalItems) {
      return res.status(200).json({
        data: [],
        currentPage: adjustedCurrentPage,
        pageSize: itemsToFetch,
        totalItems: totalItems,
        totalPages: totalPages,
        isLastPage: true,
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

    // Map and filter the current page data
    let filteredData = dataSnapshot.docs.map((doc) => {
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
        discipline_comments: docData.discipline_comments,
      } as AgencyData;
    });

    // Apply remaining filters
    for (const filter of filters) {
      const value = filter.value as string;
      filteredData = filteredData.filter((d) => {
        const fieldValue = d[filter.field as keyof AgencyData]?.toString();
        if (!fieldValue) return false;

        if (filter.isPrefix) {
          return fieldValue.toLowerCase().startsWith(value.toLowerCase());
        }
        return fieldValue.toLowerCase().includes(value.toLowerCase());
      });
    }

    return res.status(200).json({
      data: filteredData,
      currentPage: adjustedCurrentPage,
      pageSize: itemsToFetch,
      totalItems: totalItems,
      totalPages: totalPages,
      isLastPage: adjustedCurrentPage === totalPages,
    });
  } catch (error) {
    console.error("Error in handler:", error);
    res.status(500).json({ error: "Failed to fetch state data" });
  }
}
