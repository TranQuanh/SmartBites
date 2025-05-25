import ast
import pandas as pd
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
import re


def convert_time_to_minutes(time_str: str) -> int:
    """Chuyển đổi thời gian từ định dạng giờ/phút sang số phút."""
    try:
        hours = 0
        minutes = 0
        hour_match = re.search(r'(\d+)\s*h', time_str, re.IGNORECASE)
        minute_match = re.search(r'(\d+)\s*m', time_str, re.IGNORECASE)
        
        if hour_match:
            hours = int(hour_match.group(1))
        if minute_match:
            minutes = int(minute_match.group(1))
            
        return hours * 60 + minutes
    except Exception:
        return 0  # Trả về 0 nếu không thể chuyển đổi


def extract_calories(nutritions: dict) -> int:
    """Trích xuất số calo từ dictionary nutritions."""
    try:
        calories = nutritions.get("calories", "0")
        # Loại bỏ đơn vị như "kcal" và chuyển thành số
        calorie_value = re.search(r'(\d+)', str(calories))
        return int(calorie_value.group(1)) if calorie_value else 0
    except Exception:
        return 0  # Trả về 0 nếu không thể trích xuất


def process_cooking_directions(raw_directions: str) -> tuple:
    """Xử lý cooking_directions thành danh sách và dictionary thời gian (phút)."""
    try:
        # Loại bỏ tiền tố và hậu tố phổ biến
        cleaned_directions = raw_directions.replace("{'directions': u'", "").replace("{'directions': u\"", "").rstrip('"}')

        # Kiểm tra nếu chuỗi rỗng hoặc chỉ chứa khoảng trắng
        if not cleaned_directions or cleaned_directions.isspace():
            return (["Hướng dẫn nấu ăn không hợp lệ"], {"prep": 0, "cook": 0})

        # Tách thành các dòng
        directions_list = cleaned_directions.split("\\n")

        # Xử lý các dòng để kết hợp thông tin thời gian
        processed_directions = []
        time_info = {"prep": 0, "cook": 0}  # Khởi tạo thời gian prep và cook
        i = 0
        while i < len(directions_list):
            line = directions_list[i].strip()
            if not line:
                i += 1
                continue

            # Xử lý trường hợp thời gian bị tách (ví dụ: "Cook" và "5 m" trên dòng riêng)
            if line.lower() in ["prep", "cook", "ready in"] and i + 1 < len(directions_list):
                next_line = directions_list[i + 1].strip()
                if next_line:  # Đảm bảo dòng tiếp theo không rỗng
                    combined_line = f"{line} {next_line}"
                    processed_directions.append(combined_line)
                    # Lưu thời gian vào time_info
                    if line.lower() == "prep":
                        time_info["prep"] = convert_time_to_minutes(next_line)
                    elif line.lower() == "cook":
                        time_info["cook"] = convert_time_to_minutes(next_line)
                    i += 2  # Bỏ qua dòng tiếp theo vì đã kết hợp
                else:
                    processed_directions.append(line)
                    i += 1
            else:
                processed_directions.append(line)
                i += 1

        # Loại bỏ các dòng trống
        final_directions = [direction for direction in processed_directions if direction.strip()]
        return (final_directions, time_info)
    except Exception as e:
        return ([f"Lỗi khi xử lý hướng dẫn: {str(e)}"], {"prep": 0, "cook": 0})


def process_reviews(reviews: dict) -> dict:
    """Chuyển đổi các khóa số trong từ điển reviews thành chuỗi."""
    return {str(key): value for key, value in reviews.items()}


def process_recipe_row(row: pd.Series) -> dict:
    """Chuyển đổi một hàng DataFrame thành từ điển JSON, thêm trường filter."""
    try:
        # Phân tích reviews và chuyển đổi khóa số thành chuỗi
        reviews = ast.literal_eval(row["reviews"])
        reviews = process_reviews(reviews) if isinstance(reviews, dict) else {}

        # Xử lý cooking_directions để lấy danh sách và thời gian
        directions, time_info = process_cooking_directions(str(row["cooking_directions"]))

        # Phân tích nutritions
        nutritions = ast.literal_eval(row["nutritions"])

        # Đếm số lượng ingredients
        ingredients = row["ingredients"].split("^")
        ingredient_count = len([ing for ing in ingredients if ing.strip()])

        return {
            "recipe_id": int(row["recipe_id"]),
            "recipe_name": str(row["recipe_name"]),
            "average_rating": float(row["aver_rate"]),
            "image_url": str(row["image_url"]),
            "review_count": int(row["review_nums"]),
            "ingredients": [str(ingredient) for ingredient in ingredients],
            "cooking_directions": directions,
            "nutritions": nutritions,
            "reviews": reviews,
            "filter": {
                "prep": time_info["prep"],
                "cook": time_info["cook"],
                "calories": extract_calories(nutritions),
                "ingredients": ingredient_count
            }
        }
    except (ValueError, SyntaxError, KeyError) as e:
        raise ValueError(f"Dữ liệu không hợp lệ trong hàng: {str(e)}")


def check_csv_duplicates(df: pd.DataFrame) -> list:
    """Kiểm tra các giá trị recipe_id trùng lặp trong CSV."""
    duplicates = df[df["recipe_id"].duplicated(keep=False)]
    if not duplicates.empty:
        return duplicates["recipe_id"].tolist()
    return []


def main():
    """Đọc CSV, xử lý dữ liệu và chèn mỗi công thức vào MongoDB."""
    # Đọc tệp CSV
    try:
        recipe_df = pd.read_csv("data/raw-data_recipe.csv")
    except FileNotFoundError:
        print("Lỗi: Không tìm thấy tệp 'data/raw-data_recipe.csv'.")
        return

    # Xác minh các cột bắt buộc
    required_columns = [
        "recipe_id",
        "recipe_name",
        "aver_rate",
        "image_url",
        "review_nums",
        "ingredients",
        "cooking_directions",
        "nutritions",
        "reviews",
    ]
    # if not all(col in recipe_df.columns for col in required_columns):
    #     print("Lỗi: Thiếu các cột bắt buộc trong CSV.")
    #     return

    # Kiểm tra recipe_id trùng lặp trong CSV
    # duplicate_ids = check_csv_duplicates(recipe_df)
    # if duplicate_ids:
    #     print(f"Cảnh báo: Tìm thấy các giá trị recipe_id trùng lặp trong CSV: {duplicate_ids}")

    # Kết nối với MongoDB
    try:
        client = MongoClient("mongodb://localhost:27017/")  # Cập nhật URI nếu cần
        db = client["recipe_database"]
        collection = db["recipes"]

        # Xóa bộ sưu tập để đảm bảo bắt đầu mới
        collection.drop()
        print("Đã xóa bộ sưu tập 'recipes' hiện có để bắt đầu mới.")

        # Tạo chỉ mục duy nhất trên recipe_id
        collection.create_index("recipe_id", unique=True)
    except Exception as e:
        print(f"Lỗi khi kết nối với MongoDB: {e}")
        return

    # Bộ đếm cho các công thức đã chèn và bị bỏ qua
    inserted_count = 0
    skipped_count = 0

    # Xử lý và chèn từng hàng
    for index, row in recipe_df.iterrows():
        try:
            json_recipe = process_recipe_row(row)
            collection.insert_one(json_recipe)
            inserted_count += 1
            # Tùy chọn: In tiến độ sau mỗi 500 hàng
            if (index + 1) % 500 == 0:
                print(f"Đã xử lý {index + 1} hàng, chèn {inserted_count}, bỏ qua {skipped_count}")
        except DuplicateKeyError:
            print(f"Bỏ qua hàng {index}: recipe_id trùng lặp {row['recipe_id']}")
            skipped_count += 1
        except ValueError as e:
            print(f"Bỏ qua hàng {index}: {str(e)}")
            skipped_count += 1
        except Exception as e:
            print(f"Bỏ qua hàng {index}: Lỗi bất ngờ: {str(e)}")
            skipped_count += 1

    # In kết quả cuối cùng
    print(f"Đã chèn {inserted_count} công thức vào MongoDB.")
    if skipped_count > 0:
        print(f"Đã bỏ qua {skipped_count} công thức do lỗi hoặc trùng lặp.")

    # Xác minh nội dung bộ sưu tập
    total_documents = collection.count_documents({})
    print(f"Tổng số tài liệu trong bộ sưu tập 'recipes': {total_documents}")

    # Đóng kết nối
    client.close()


if __name__ == "__main__":
    main()