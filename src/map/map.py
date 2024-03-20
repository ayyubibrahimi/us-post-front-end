import pandas as pd
from PIL import Image, ImageDraw, ImageEnhance
import os
from constants import FL_LOC_BOTTOM_RIGHT, FL_LOC_TOP_LEFT, MAP_LINE_COLOR, NODE_HIGHLIGHT_COLOR, HISTORICAL_LINE_COLOR


df = pd.read_csv(
    "../data/input/florida.csv", parse_dates=["employ_start_date", "separation_date"]
)

department_locations = (
    df.groupby("agcy_name")
    .agg({"latitude": "first", "longitude": "first"})
    .to_dict(orient="index")
)

department_movements = {name: 0 for name in department_locations}

def draw_line(draw, start_pos, end_pos, color, width=10):
    draw.line((start_pos, end_pos), fill=color, width=width)

def plot_data_points(draw, department_locations, base_map_width, base_map_height):
    for department, location in department_locations.items():
        position = lat_lon_to_pixels(
            location['latitude'],
            location['longitude'],
            base_map_width,
            base_map_height
        )
        draw_enhance_node(draw, position, 1, NODE_HIGHLIGHT_COLOR)

def lat_lon_to_pixels(lat, lon, width, height):
    delta_x = FL_LOC_BOTTOM_RIGHT[0] - FL_LOC_TOP_LEFT[0]
    delta_y = FL_LOC_TOP_LEFT[1] - FL_LOC_BOTTOM_RIGHT[1]
    x_pix = (lon - FL_LOC_TOP_LEFT[0]) * width / delta_x
    y_pix = (FL_LOC_TOP_LEFT[1] - lat) * height / delta_y
    return int(x_pix), int(y_pix)


def draw_enhance_node(draw, position, intensity, color):
    radius = 5 + intensity * 2
    draw.ellipse(
        [
            (position[0] - radius, position[1] - radius),
            (position[0] + radius, position[1] + radius),
        ],
        fill=color,
        outline=color,
    )


sorted_movements = df.sort_values("employ_start_date")

frame_file_paths = []

base_map_path = "data/map.png"
base_map = Image.open(base_map_path).convert("RGBA")
draw = ImageDraw.Draw(base_map)

plot_data_points(draw, department_locations, base_map.width, base_map.height)

base_map_with_points_path = "../data/base_map_with_points.png"
base_map.save(base_map_with_points_path)


person_last_department = {}
historical_lines = []

# Loop through each movement, sorted by date
for i, row in sorted_movements.iterrows():
    # Load the updated base map with points for each frame
    frame_map = Image.open(base_map_with_points_path).convert("RGBA")
    draw = ImageDraw.Draw(frame_map)

    # Redraw historical lines in light blue before drawing the new movement
    for line in historical_lines:
        draw_line(draw, line['start'], line['end'], HISTORICAL_LINE_COLOR, line['width'])

    person_id = row["person_nbr"]
    current_department = row["agcy_name"]
    start_date = row["employ_start_date"]
    end_date = row["separation_date"]

    if person_id in person_last_department and end_date:
        previous_department = person_last_department[person_id]["department"]
        previous_department_location = department_locations[previous_department]
        current_department_location = department_locations[current_department]

        start_pos = lat_lon_to_pixels(
            previous_department_location["latitude"],
            previous_department_location["longitude"],
            frame_map.width,
            frame_map.height,
        )
        end_pos = lat_lon_to_pixels(
            current_department_location["latitude"],
            current_department_location["longitude"],
            frame_map.width,
            frame_map.height,
        )

        # Draw the current movement in blue
        draw_line(draw, start_pos, end_pos, MAP_LINE_COLOR, 10)

        # Store this line as historical for future frames
        historical_lines.append({'start': start_pos, 'end': end_pos, 'width': 10})

    person_last_department[person_id] = {
        "department": current_department,
        "date": start_date,
    }

    # Re-plot all department locations (orange nodes) after drawing lines
    plot_data_points(draw, department_locations, frame_map.width, frame_map.height)

    # Save the current frame
    frame_file_path = f"data/frame_{i}.png"
    frame_map.save(frame_file_path)
    frame_file_paths.append(frame_file_path)

    frame_map.close()


frames = [Image.open(frame) for frame in frame_file_paths]
frames[0].save(
    "../data/movement_animation.gif",
    format="GIF",
    append_images=frames[1:],
    save_all=True,
    duration=300,
    loop=0,
)


for frame_path in frame_file_paths:
    if os.path.exists(frame_path):
        os.remove(frame_path)
    else:
        print(f"Warning: The file {frame_path} does not exist and cannot be removed.")

animated_gif_path = "../data/movement_animation.gif"
