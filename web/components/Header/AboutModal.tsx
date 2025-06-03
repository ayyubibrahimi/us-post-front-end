import type React from "react";
import styles from "./AboutModal.module.scss";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedState: string;
}

const linkStyle = {
  color: "blue",
  textDecoration: "underline",
};

const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  selectedState,
}) => {
  if (!isOpen) return null;

  const stateInfo: { [key: string]: React.ReactNode } = {
    Arizona: (
      <>
        <p>
          Data about law enforcement officers in Arizona were obtained under the
          Arizona Public Records Law from the{" "}
          <a
            href="https://post.az.gov/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Arizona Peace Officer Standards and Training Board
          </a>
          . The data released includes personnel and employment history for all
          officers certified by the POST, with data going back to the 1950s. The
          data were last updated in May 2023, and were processed by John Kelly
          of CBS News. Read more about the data processing{" "}
          <a
            href="https://github.com/ayyubibrahimi/us-post-data/blob/main/bln/AZ/README.md"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            here
          </a>
          .
        </p>
      </>
    ),
    California: (
      <>
        <p>
          Data about law enforcement officers in California were obtained under
          the California Public Records Act from the{" "}
          <a
            href="https://post.ca.gov/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            California Commission on Peace Officer Standards and Training
          </a>{" "}
          and the{" "}
          <a
            href="https://www.cdcr.ca.gov/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            California Department of Corrections and Rehabilitation
          </a>
          .
        </p>
        <p>
          The two databases come from separate data systems, and do not share a
          unique identifier. No matching has been done between the two. If an
          individual worked in both law enforcement and corrections, they would
          appear in this data twice. However, the fact of a name appearing in
          both datasets does not necessarily mean that it is the same person.
          POST and CDCR data were last updated in 2023, and obtained by{" "}
          <a
            href="https://bsky.app/profile/whosthatcop.bsky.social"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            @WhosThatCop
          </a>{" "}
          and the California Reporting Project respectively. Both datasets were
          processed by Tarak Shah of the Human Rights Data Analysis Group. Read
          more about the data processing{" "}
          <a
            href="https://github.com/ayyubibrahimi/us-post-data/blob/main/bln/CA/README.md"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            here
          </a>
          .
        </p>
        <p>
          Access to{" "}
          <a
            href="https://post.ca.gov/CPRA-Requests"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            California POST data
          </a>{" "}
          was established by the California Supreme Court in{" "}
          <a
            href="https://caselaw.findlaw.com/court/ca-supreme-court/1387579.html"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            <i>
              Commission on Peace Officer Standards and Training v. Superior
              Court of Sacramento County
            </i>
          </a>
          .
        </p>
      </>
    ),
    Florida: (
      <>
        <p>
          Data about law enforcement officers in Florida were obtained under the
          Florida Sunshine Law from the{" "}
          <a
            href="https://www.fdle.state.fl.us/CJSTC"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Florida Department of Law Enforcement
          </a>
          . The data released includes personnel information, certification
          information, employment history, complaints and disciplinary actions
          for all officers certified in the state, with data going back to the
          1940s. The data were last updated in April 2023, and were processed by
          John Kelly of CBS News. Read more about the data processing{" "}
          <a
            href="https://github.com/ayyubibrahimi/us-post-data/blob/main/bln/FL/README.md"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            here
          </a>
          .
        </p>
      </>
    ),
    "Florida Discipline": (
      <>
        <p>
          This table shows sustained allegations of misconduct by Florida law
          enforcement officers, as reported to the{" "}
          <a
            href="https://www.fdle.state.fl.us/CJSTC"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Florida Department of Law Enforcement
          </a>{" "}
          and released under the Florida Sunshine Law. Various forms of
          sustained investigations of misconduct are reported by local police
          departments to the Florida Department of Law Enforcement, as detailed
          on their{" "}
          <a
            href="https://www.fdle.state.fl.us/CJSTC/Professional-Compliance/PC-Initiation-of-Misconduct.aspx"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Professional Compliance page
          </a>
          .
        </p>

        <br />

        <p>
          Only some specific cases that were sustained, in which an officer was
          disciplined, or in which an officer was arrested are reported to FDLE
          and available in this data tool. It does not include any cases in
          which the local department did not discipline the officer. Information
          about penalties issued by FDLE can be found{" "}
          <a
            href="https://www.fdle.state.fl.us/CJSTC/Professional-Compliance/PC-Violations-and-Penalties.aspx"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            here
          </a>
          . The data were last updated in April 2023, and were processed by
          Ayyub Ibrahim of the Louisiana Law Enforcement Accountability
          Database.
        </p>
      </>
    ),
    Georgia: (
      <>
        <p>
          Data about law enforcement officers in Georgia were obtained under the
          Georgia Open Records Act from the{" "}
          <a
            href="https://gapost.org/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Georgia Peace Officer Standards & Training Council
          </a>
          . The dataset includes information on all certified peace and
          corrections officers, with work history data dating back to the early
          1990s. While there is some data from earlier years, it is of lower
          quality, covering less than five hundred officers. The data were last
          updated in May 2024 and were processed by Ayyub Ibrahim of the
          Louisiana Law Enforcement Accountability Database. Read more about the
          data processing{" "}
          <a
            href="https://github.com/ayyubibrahimi/us-post-data/blob/main/bln/GA/README.md"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            here
          </a>
          .
        </p>

        <br />

        <p>
          The data include police and correctional officers. They do not include
          information on federal law enforcement officers.
        </p>
      </>
    ),
    "Georgia Discipline": (
      <>
        <p>
          This table shows arrests and sustained allegations of misconduct by
          Georgia law enforcement officers, as reported to the{" "}
          <a
            href="https://gapost.org/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Georgia Peace Officer Standards & Training Council
          </a>{" "}
          and released under the Georgia Open Records Act. Various forms of
          sustained investigations of misconduct are reported by local police
          departments to the Georgia POST, as detailed in their{" "}
          <a
            href="https://gapost.org/wp-content/uploads/2023/06/Department464GEORGIAPEACEOFFICERSTANDARDSANDTRAININGCOUNCILRules.pdf#page=26"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            rules
          </a>
          .
        </p>

        <br />

        <p>
          Only some specific cases that were sustained, or in which an officer
          was disciplined, or in which an officer was arrested are reported to
          Georgia POST and available in this data tool. It does not include any
          cases in which the local department did not discipline the officer,
          unless the officer was also arrested. The data were last updated in
          April 2023, and were processed by Ayyub Ibrahim of the Louisiana Law
          Enforcement Accountability Database.
        </p>
      </>
    ),
    Illinois: (
      <>
        <p>
          Data about law enforcement in Illinois were obtained under the
          Illinois Freedom of Information Act from the{" "}
          <a
            href="https://www.ptb.illinois.gov/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Illinois Law Enforcement Training and Standards Board
          </a>
          . The data released includes personnel information, license and
          certification information, and employment history for all officers
          certified in the state, with data going back to the 1960s. The data
          were last updated in August 2024, and were processed by John Kelly of
          CBS News and Ayyub Ibrahim of the Louisiana Law Enforcement
          Accountability Database. Read more about the data processing{" "}
          <a
            href="https://github.com/ayyubibrahimi/us-post-data/blob/main/bln/IL/README.md"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            here
          </a>
          .
        </p>

        <br />

        <p>
          ILETSB also publishes a{" "}
          <a
            href="https://www.ptb.illinois.gov/resources/officer-lookup/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            public lookup tool for police employment history
          </a>
          . This tool requires knowledge of the officer in question&apos;s name.
          It is more current than our data, and can be used to ensure that
          information from our database is accurate.
        </p>
      </>
    ),
    Idaho: (
      <>
        <p>
          Data about law enforcement officers in Idaho were obtained under the
          Idaho Public Records Law from the{" "}
          <a
            href="https://post.idaho.gov/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Idaho Peace Officer Standards and Training
          </a>
          . The data released includes personnel and employment history for
          officers certified by the POST. The data were last updated in May
          2025, and were processed by Ayyub Ibrahim of the Berkeley Institute
          for Data Science. Read more about the data processing{" "}
          <a
            href="https://github.com/ayyubibrahimi/us-post-data/blob/main/preprocess/clean/ID/src/src.ipynb"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            here
          </a>
          .
        </p>
      </>
    ),
    Indiana: (
      <>
        <p>
          Data about law enforcement in Indiana were obtained under the Indiana
          Access to Public Records Act from the{" "}
          <a
            href="https://www.in.gov/ilea/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Indiana Law Enforcement Academy
          </a>
          . The data released includes personnel and employment history for all
          officers certified by the ILEA, with data going back to the 1970s. The
          data were last updated in August 2024 by Emily Hopkins of Mirror Indy,
          and were processed by Emily Hopkins of Mirror Indy and Tarak Shah of
          Human Rights Data Analysis Group. Read more about the data processing{" "}
          <a
            href="https://github.com/ayyubibrahimi/us-post-data/tree/main/preprocess/clean"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            here
          </a>
          .
        </p>

        <br />

        <p>
          The ILEA requires agencies to report when officers leave agencies, and
          that data includes whether officers resigned, retired, were terminated
          for misconduct, or any other type of separation. That data is
          reflected on the National Police Index in the &ldquo;employment
          status&rdquo; column. However, the ILEA cautions that the submission
          of that information by local agencies is not monitored.
          &ldquo;Discharged&rdquo; generally indicates that the officer was
          terminated or fired, but could have been used to simply denote that
          they were separated. Additional information should be sought from the
          local agency or ILEA about the circumstances of an officer&apos;s
          separation.
        </p>
      </>
    ),
    Kansas: (
      <>
        <p>
          Data about law enforcement in Kansas were obtained under the Kansas
          Open Records Act from the{" "}
          <a
            href="https://www.kscpost.gov/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Kansas Commission on Peace Officers&apos; Standards and Training
          </a>
          . The data released includes personnel and employment history for all
          officers certified by CPOST. The data were last updated in December
          2024, and were processed by Tarak Shah of Human Rights Data Analysis
          Group and Larry Barrett. Read more about the data processing{" "}
          <a
            href="https://github.com/ayyubibrahimi/us-post-data/tree/main/preprocess/clean"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            here
          </a>
          .
        </p>
      </>
    ),
    Kentucky: (
      <>
        <p>
          Data about law enforcement in Kentucky were obtained under the
          Kentucky Open Records Act from the{" "}
          <a
            href="https://klecs.ky.gov/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Kentucky Law Enforcement Council
          </a>
          . The data were last updated in October 2022.
        </p>
      </>
    ),
    Maryland: (
      <>
        <p>
          Data about law enforcement in Maryland were obtained under the
          Maryland Public Information Act from the{" "}
          <a
            href="https://www.dpscs.state.md.us/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Maryland Department of Public Safety and Correctional Services
          </a>
          . The data released includes personnel information and employment
          history for all officers certified in the state, with data going back
          to the 1960s. The data were last updated in August 2022, and were
          processed by John Kelly of CBS News. Read more about the data
          processing{" "}
          <a
            href="https://github.com/ayyubibrahimi/us-post-data/blob/main/bln/MD/README.md"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            here
          </a>
          .
        </p>
      </>
    ),
    "New Mexico": (
      <>
        <p>
          Data about law enforcement in New Mexico were obtained under the New
          Mexico Inspection of Public Records Act from the{" "}
          <a
            href="https://www.lea.nm.gov/law-enforcement-certification-board/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            New Mexico Law Enforcement Agency
          </a>{" "}
          . The data released includes personnel and employment history for all
          officers certified by NMLEA’s Law Enforcement Certification Board and
          its predecessor, with data going back to the 1960s. The data were last
          updated in June 2023. Read more about the data processing{" "}
          <a
            href="https://github.com/ayyubibrahimi/us-post-data/tree/main/preprocess/clean"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            here
          </a>
          .
        </p>
      </>
    ),
    "North Carolina": (
      <>
        <p>
          Data about law enforcement in North Carolina were obtained under the
          North Carolina Public Records Act from the{" "}
          <a
            href="https://ncdoj.gov/law-enforcement-training/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            North Carolina Department of Justice
          </a>
          . The data released includes personnel and employment history for all
          officers certified by NCDOJ’s Criminal Justice Education & Training
          Standards Commission and Sheriffs’ Education & Training Standards
          Commission, with data going back to the 1970s. The data were last
          updated in August 2023, and were processed by Ayyub Ibrahim of the
          Berkeley Institute for Data Science. Read more about the data
          processing{" "}
          <a
            href="https://github.com/ayyubibrahimi/us-post-data/tree/main/preprocess/clean"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            here
          </a>
          .
        </p>
      </>
    ),
    Ohio: (
      <>
        <p>
          Data about law enforcement in Ohio were obtained under the Ohio Public
          Records Act from the{" "}
          <a
            href="https://opota.ohioattorneygeneral.gov/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Ohio Peace Officer Training Commission
          </a>
          . The data released includes personnel and employment history for all
          officers certified in the state, with data going back to the 1950s.
          The data were last updated in November 2024, and were processed by
          John Kelly of CBS News. Read more about the data processing{" "}
          <a
            href="https://github.com/ayyubibrahimi/us-post-data/blob/main/bln/OH/README.md"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            here
          </a>
          .
        </p>

        <br />

        <p>
          OPOTA also publishes a{" "}
          <a
            href="https://opota.ohioattorneygeneral.gov/PublicRecords"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            public lookup tool for police employment history
          </a>
          . While it does not allow for filtering in the same way as our
          database, it is more current than our data, and can be used to ensure
          that information from our database is accurate.
        </p>
      </>
    ),
    Oregon: (
      <>
        <p>
          Data about law enforcement in Oregon were obtained under the Oregon
          Public Records Law from the{" "}
          <a
            href="https://www.oregon.gov/dpsst/cj/pages/default.aspx"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Oregon Department of Public Safety Standards and Training
          </a>
          . The data released includes certified police officers, corrections
          officers, and parole/probation officers with work history data going
          back into the 1970s. The data were last updated in September 2022, and
          were processed by Justin Mayo of Big Local News. Read more about the
          data processing{" "}
          <a
            href="https://github.com/ayyubibrahimi/us-post-data/blob/main/bln/OR/README.md"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            here
          </a>
          .
        </p>

        <br />

        <p>
          DPSST also publishes a{" "}
          <a
            href="https://www.bpl-orsnapshot.net/PublicInquiry_CJ/EmployeeSearch.aspx"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            public lookup tool for police employment history
          </a>
          . This tool requires knowledge of the officer in question&apos;s name.
          It is more current than our data, and can be used to ensure that
          information from our database is accurate.
        </p>
      </>
    ),
    "South Carolina": (
      <>
        <p>
          Data about law enforcement in South Carolina were obtained under the
          South Carolina Freedom of Information Act from the{" "}
          <a
            href="https://sccja.sc.gov/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            South Carolina Criminal Justice Academy
          </a>
          . The data released includes certified police officers, corrections
          officers, and parole/probation officers with work history data going
          back into the 1970s. The data were last updated in July 2023, and were
          processed by Justin Mayo of Big Local News. Read more about the data
          processing{" "}
          <a
            href="https://github.com/ayyubibrahimi/us-post-data/blob/main/bln/SC/README.md"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            here
          </a>
          .
        </p>
      </>
    ),
    Tennessee: (
      <>
        <p>
          Data about law enforcement in Tennessee were obtained under the
          Tennessee Public Records Act from the{" "}
          <a
            href="https://www.tn.gov/commerce/post.html"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Tennessee Peace Officer Standards & Training Commission
          </a>
          . The dataset includes information on all certified peace and
          corrections officers, with work history data dating back to the mid
          1980s. While there is some data from earlier years, it is of lower
          quality, covering less than five hundred officers. The data were
          originally obtained by Paige Pfleger of WPLN News in June 2023. The
          data were processed by Ayyub Ibrahim of the Louisiana Law Enforcement
          Accountability Database. Read more about the data processing{" "}
          <a
            href="https://github.com/ayyubibrahimi/us-post-data/blob/main/bln/TN/README.md"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            here
          </a>
          .
        </p>
      </>
    ),
    Texas: (
      <>
        <p>
          Data about law enforcement in Texas were obtained under the Texas
          Public Information Act from the{" "}
          <a
            href="https://www.tcole.texas.gov/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Texas Commission on Law Enforcement
          </a>
          . The data released includes certification information and employment
          history for all officers certified in the state, with data going back
          to the 1930s. The data were last updated in September 2023, and were
          processed by John Kelly of CBS News. Read more about the data
          processing{" "}
          <a
            href="https://github.com/ayyubibrahimi/us-post-data/tree/main/bln/TX"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            here
          </a>
          .
        </p>

        <br />

        <p>
          TCOLE also publishes a{" "}
          <a
            href="https://tcledds.tcole.texas.gov/IAM/Identity/Account/PublicLogin"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            lookup tool for police employment and other history
          </a>
          . It requires creating an account with the agency. It is more current
          than our data, and can be used to ensure that information from our
          database is accurate. Find more information about how to use it{" "}
          <a
            href="https://x.com/LuisSantosTX/status/1831420379770057147"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            here
          </a>
          . However, because TCOLE previously asserted exemptions over unique
          IDs, the unique officer IDs in the public lookup tool do not match the
          data previously released by TCOLE.
        </p>
      </>
    ),
    Utah: (
      <>
        <p>
          Data about law enforcement in Utah were obtained under the Utah
          Government Records Access and Management Act from{" "}
          <a
            href="https://post.utah.gov/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Utah Peace Officer Standards and Training
          </a>
          .
        </p>

        <br />

        <p>
          The data were obtained in July 2024 after a{" "}
          <a
            href="https://archives.utah.gov/transparency-services/state-records-committee/src-decisions/?decision=23-45"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            public records appeal
          </a>{" "}
          on behalf of the Utah Investigative Journalism Project by{" "}
          <a
            href="https://parrbrown.com/attorneys/david-c-reymann/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            David Reymann
          </a>{" "}
          of the Utah Freedom of Information Hotline of Parr Brown Gee &
          Loveless. You can read the relevant filings of the appeal{" "}
          <a
            href="https://www.documentcloud.org/documents/23855318-ut-state-records-committee-appeal"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            here
          </a>
          , and read about the fight to obtain the records{" "}
          <a
            href="https://www.utahinvestigative.org/new-data-tool-allows-journalists-and-the-public-to-track-wandering-cops-in-utah/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            here
          </a>
          .
        </p>

        <br />

        <p>
          Information about disciplinary actions taken by Utah POST is compiled
          by the{" "}
          <a
            href="https://www.ucji.org/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Utah Criminal Justice Institute
          </a>{" "}
          and is available in a{" "}
          <a
            href="https://public.tableau.com/app/profile/ucji/viz/UtahPOSTDiscipline2009-Present_16461679612650/UtahPOSTDiscipline2009-Present"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            lookup tool here
          </a>
          .
        </p>
      </>
    ),
    Vermont: (
      <>
        <p>
          Data about law enforcement in Vermont were obtained under the Vermont
          Public Records Law from the{" "}
          <a
            href="https://vcjc.vermont.gov/about-us"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Vermont Criminal Justice Council
          </a>
          . The data released includes certification information and employment
          history for all certified police officers, with work history data
          going back into the late 1970s. The data were last updated in October
          2022 and were processed by Justin Mayo of Big Local News. Read more
          about the data processing{" "}
          <a
            href="https://github.com/ayyubibrahimi/us-post-data/blob/main/bln/VT/README.md"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            here
          </a>
          .
        </p>
      </>
    ),
    Washington: (
      <>
        <p>
          Data about law enforcement in Washington were obtained under the
          Washington Public Records Act from the{" "}
          <a
            href="https://www.cjtc.wa.gov/certification/certification-information"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Washington Criminal Justice Training Commission
          </a>
          . The data released includes certification information and employment
          history for all certified police officers, with work history data
          going back into the late 1970s. The data were last updated in November
          2022 and were processed by Justin Mayo of Big Local News. Read more
          about the data processing{" "}
          <a
            href="https://github.com/ayyubibrahimi/us-post-data/blob/main/bln/WA/README.md"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            here
          </a>
          .
        </p>
      </>
    ),
    "West Virginia": (
      <>
        <p>
          Data about law enforcement in West Virginia were obtained under the
          West Virginia Freedom of Information Act from the{" "}
          <a
            href="https://das.wv.gov/JCS/law-enforcement/Pages/default.aspx"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            West Virginia Law Enforcement Professional Standards Program
          </a>
          . The data were last updated in November 2024 by Kyle Vass of
          Dragline/ACLU of West Virginia. Read more about the processing{" "}
          <a
            href="https://github.com/ayyubibrahimi/us-post-data/tree/main/preprocess/clean"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            here
          </a>
          .
        </p>
      </>
    ),
    Wyoming: (
      <>
        <p>
          Data about law enforcement in Wyoming were obtained under the Wyoming
          Public Records Act from the{" "}
          <a
            href="https://post.wyo.gov/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Wyoming Peace Officer Standards and Training Commission
          </a>
          . The data were originally obtained by WyoFile and Invisible
          Institute. The data were last updated in March 2023.
        </p>
      </>
    ),
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>
          About {selectedState} Peace Officer Employment History Database
        </h2>
        <div className={styles.modalText}>
          {stateInfo[selectedState] ||
            "Information about this state's peace officer employment history database is currently unavailable."}
        </div>
        <button type="button" className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AboutModal;
