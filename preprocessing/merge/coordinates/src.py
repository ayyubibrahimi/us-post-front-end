import pandas as pd

def map_coordinates_to_agency():
    # # Load the employment data
    employment_data = pd.read_csv("../data/input/employment_without_coords.csv")
    employment_data = employment_data.drop(columns=["latitude", "longitude"])



    # Load the agency coordinates data
    agency_coordinates = pd.read_csv("../../coordinates/data/output/georgia_with_address.csv")

    agency_coordinates.loc[:, "agcy_name"] = agency_coordinates.agcy_name.str.upper()
    
    # # Merge the employment data with the agency coordinates based on 'agcy_name'
    merged_data = pd.merge(employment_data, agency_coordinates, on='agcy_name')
    # print(merged_data.columns)
    # merged_data = merged_data.rename(columns={"agency_for_coordinates": "agcy_name", "OKEY": "uid", " START DATE": "employ_start_date", " END DATE ": "separation_date", " STATUS": "separation_code"})
    merged_data.to_csv("../data/output/employment_with_add_coord.csv", index=False)

    
    return 
if __name__ == "__main__":
    merged_data = map_coordinates_to_agency()
    # print("Merging completed. Data saved to 'employment_with_coordinates.csv'.")
