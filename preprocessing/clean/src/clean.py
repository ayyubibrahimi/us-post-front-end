import pandas as pd
from geopy.distance import geodesic

# Define the geographic boundaries of Georgia (approximate)
GEORGIA_BOUNDARIES = [(34.982, -85.605), (34.988, -83.108), (30.356, -83.136), (30.708, -81.460), (31.53, -81.444), (33.015, -85.161)]

# Function to check if a point is within Georgia
def is_within_georgia(lat, lon):
    # Check if point is within the defined bounding box for simplicity
    min_lat = min(lat for lat, lon in GEORGIA_BOUNDARIES)
    max_lat = max(lat for lat, lon in GEORGIA_BOUNDARIES)
    min_lon = min(lon for lat, lon in GEORGIA_BOUNDARIES)
    max_lon = max(lon for lat, lon in GEORGIA_BOUNDARIES)
    return min_lat <= lat <= max_lat and min_lon <= lon <= max_lon

# Function to filter out rows with coordinates outside of Georgia
def filter_coordinates(df):
    # Group by uid
    grouped = df.groupby('uid')
    
    # Initialize lists to store valid and filtered out rows
    valid_rows = []
    filtered_out_rows = []
    
    # Iterate over groups
    for name, group in grouped:
        # Check if all rows in the group are within Georgia
        if all(group.apply(lambda row: is_within_georgia(row['latitude'], row['longitude']), axis=1)):
            valid_rows.append(group)  # Append valid rows to valid_rows list
        else:
            filtered_out_rows.append(group)  # Append filtered out rows to filtered_out_rows list
    
    # Concatenate the valid rows into a single DataFrame
    valid_df = pd.concat(valid_rows)
    
    # Concatenate the filtered out rows into a single DataFrame
    filtered_out_df = pd.concat(filtered_out_rows)
    
    return valid_df, filtered_out_df

def read_data():
    df = pd.read_csv("../data/input/employment_with_coordinates_georgia_test.csv")

    valid_df, filtered_out_df = filter_coordinates(df)
    print("Valid Rows:", valid_df.shape)
    print("Filtered Out Rows:", filtered_out_df.shape)

    # print(filtered_out_df.agcy_name.unique())

    # filtered_out_df.to_csv("../data/output/employment_with_filtered_out_agencies.csv", index=False)

    valid_df.loc[:, "agcy_name"] = valid_df.agcy_name.str.lower().str.replace(r"\s+", "-", regex=True)



    print(valid_df.agcy_name.unique())
    valid_df.to_csv("../data/output/employment_with_coordinates_georgia_test.csv", index=False)
    return valid_df, filtered_out_df

if __name__ == "__main__":
    read_data()