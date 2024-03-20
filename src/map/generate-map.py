import folium
import pandas as pd
from selenium import webdriver
import time
import os

df = pd.read_csv('../data/input/florida.csv')  

m = folium.Map(location=[df['latitude'].mean(), df['longitude'].mean()], zoom_start=6, tiles='CartoDB Positron')

for _, row in df.iterrows():
    folium.CircleMarker(location=[row['latitude'], row['longitude']],
                        radius=5, 
                        color='black',
                        fill=True,
                        fill_color='black').add_to(m)

m.save('data/map/florida_map.html')

chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument("--headless")  
chrome_options.add_argument("--disable-gpu")  
chrome_options.add_argument("--window-size=1920,1080") 
driver = webdriver.Chrome(options=chrome_options)

driver.get('file://' + os.path.realpath('florida_map.html'))

time.sleep(5)

driver.save_screenshot('../data/map/florida_map.png')

driver.quit()
