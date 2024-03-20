import pandas as pd
from geopy.geocoders import GoogleV3

def convert_address_to_coordinates():
    locations = pd.read_csv("../data/input/employment_with_address.csv")

    locations = locations.drop_duplicates(subset=["address"])
    
    gkey = "AIzaSyArsC8WGqTR5SAm4g1vCQyfg4XMre7kM64" 
    geolocator = GoogleV3(api_key=gkey)

    agency_names = []
    latitudes = []
    longitudes = []
    original_agency_names = []  # New list to store original agency names

    for index, row in locations.iterrows():  # Iterate over rows
        addy = row["address"]
        agcy_name = row["agcy_name"]  # Get the original agency name

        try:
            address = geolocator.geocode(addy)
            if address:
                lat, lon = address.latitude, address.longitude
            else:
                lat, lon = None, None
                print(f"Address not found for: {addy}")
        except Exception as e:
            print(f"Error geocoding {addy}: {e}")
            lat, lon = None, None

        agency_names.append(addy)
        latitudes.append(lat)
        longitudes.append(lon)
        original_agency_names.append(agcy_name)  # Append original agency name

    df = pd.DataFrame({
        'address': agency_names,  # Change addy to agency_names
        'latitude': latitudes,
        'longitude': longitudes,
        'agcy_name': original_agency_names  # Add original agency name column
    })
    
    df.to_csv("../data/output/georgia_with_address.csv", index=False)
    return df

if __name__ == "__main__":
    convert_address_to_coordinates()



# import pandas as pd
# from geopy.geocoders import GoogleV3

# def convert_address_to_coordinates():
#     locations = pd.read_csv("../data/input/georgia.csv")

#     locations = locations.drop_duplicates(subset=["agency_for_coordinates"])
    
#     gkey = "AIzaSyArsC8WGqTR5SAm4g1vCQyfg4XMre7kM64" 
#     geolocator = GoogleV3(api_key=gkey)

#     agency_names = []
#     latitudes = []
#     longitudes = []

#     for agency_name in locations["agency_for_coordinates"]:
#         try:
#             address = geolocator.geocode(agency_name)
#             if address:
#                 lat, lon = address.latitude, address.longitude
#             else:
#                 lat, lon = None, None
#                 print(f"Address not found for: {agency_name}")
#         except Exception as e:
#             print(f"Error geocoding {agency_name}: {e}")
#             lat, lon = None, None

#         agency_names.append(agency_name)
#         latitudes.append(lat)
#         longitudes.append(lon)

#     df = pd.DataFrame({
#         'agency_name': agency_names,
#         'latitude': latitudes,
#         'longitude': longitudes
#     })
    
#     df.to_csv("../data/output/georgia_coordinates.csv", index=False)
#     return df

# if __name__ == "__main__":
#     convert_address_to_coordinates()
