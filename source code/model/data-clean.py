import pandas as pd
import ast
import re
import os

def avg_rate(val):
    try:
        return round(float(val), 2)
    except Exception:
        return 0.0

def parse_ingredients(ing_str):
    if pd.isna(ing_str):
        return []
    return [s.strip() for s in ing_str.split('^') if s.strip()]

def get_nutrition_value(nutrition_str, key):
    try:
        nut = ast.literal_eval(nutrition_str)
        val = nut.get(key, {}).get('percentDailyValue', None)
        if isinstance(val, str) and '< 1' in val:
            return 1
        return float(val) if val is not None else 0
    except Exception:
        return 0

def process_cooking_directions(raw_directions: str) -> list:
    # Loại bỏ phần 'directions' ở đầu và dấu ngoặc kép ở cuối
    cleaned_directions = raw_directions.replace("{'directions': u\"", "").rstrip('"}')
    # Tách các dòng
    directions_list = cleaned_directions.split("\\n")
    # Xử lý 5 dòng đầu tiên: gộp Prep, Cook, Ready In
    processed_directions = []
    if len(directions_list) >= 6:
        processed_directions.append(f"{directions_list[0]} {directions_list[1]}")
        processed_directions.append(f"{directions_list[2]} {directions_list[3]}")
        processed_directions.append(f"{directions_list[4]} {directions_list[5]}")
        processed_directions.extend(directions_list[6:])
    else:
        processed_directions = directions_list
    # Loại bỏ dòng rỗng
    return [direction for direction in processed_directions if direction.strip()]

def extract_cooking_time_from_directions(raw_directions: str) -> int:
    """Lấy số phút từ dòng 'Ready In ...' trong cooking_directions."""
    directions = process_cooking_directions(str(raw_directions))
    for line in directions:
        if "Ready In" in line:
            # Tìm số giờ và phút
            hour_match = re.search(r'(\d+)\s*h', line)
            min_match = re.search(r'(\d+)\s*m', line)
            total_min = 0
            if hour_match:
                total_min += int(hour_match.group(1)) * 60
            if min_match:
                total_min += int(min_match.group(1))
            if total_min > 0:
                return total_min
    return 0

def main():
    df = pd.read_csv('data/raw-data_recipe.csv')
    num_rows = len(df)
    batch = []
    batch_size = 1000
    output_file = 'output.csv'
    columns = [
        'recipe_id', 'aver_rate', 'recipe_name', 'average_rating', 'calories', 'fat',
        'carbohydrates', 'protein', 'cholesterol', 'sodium', 'fiber', 'ingredients'
    ]
    # Nếu file đã tồn tại thì xóa để ghi mới
    if os.path.exists(output_file):
        os.remove(output_file)
    for idx, row in df.iterrows():
        recipe_id = row['recipe_id']
        aver_rate = avg_rate(row['aver_rate']) if 'aver_rate' in row else avg_rate(row['aver_rate'])
        recipe_name = row['recipe_name']
        average_rating = aver_rate
        calories = get_nutrition_value(row['nutritions'], 'calories')
        fat = get_nutrition_value(row['nutritions'], 'fat')
        carbohydrates = get_nutrition_value(row['nutritions'], 'carbohydrates')
        protein = get_nutrition_value(row['nutritions'], 'protein')
        cholesterol = get_nutrition_value(row['nutritions'], 'cholesterol')
        sodium = get_nutrition_value(row['nutritions'], 'sodium')
        fiber = get_nutrition_value(row['nutritions'], 'fiber')
        ingredients = parse_ingredients(row['ingredients'])
        batch.append([
            recipe_id, aver_rate, recipe_name, average_rating, calories, fat, carbohydrates,
            protein, cholesterol, sodium, fiber, str(ingredients)
        ])
        # Ghi mỗi 1000 bản ghi
        if (idx + 1) % batch_size == 0 or idx == num_rows - 1:
            print(f"Processed {idx + 1}/{num_rows} records...")
            out_df = pd.DataFrame(batch, columns=columns)
            # Lần đầu ghi header, các lần sau append không header
            write_header = not os.path.exists(output_file) or (idx + 1 - len(batch) == 0)
            out_df.to_csv(output_file, mode='a', index=False, header=write_header)
            batch = []
    print("Saved output.csv")

if __name__ == "__main__":
    main()
