import ast
import pandas as pd
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError


def process_cooking_directions(raw_directions: str) -> list:
    """Process cooking_directions into a list with the required format."""
    try:
        # Remove 'directions' prefix and trailing quotes/braces
        cleaned_directions = raw_directions.replace("{'directions': u'", "").rstrip('"}')

        # Check if the string is empty or whitespace
        if not cleaned_directions or cleaned_directions.isspace():
            return ["Invalid cooking directions"]

        # Split into lines
        directions_list = cleaned_directions.split("\\n")

        # Process first 5 lines: combine Prep, Cook, Ready In
        processed_directions = []
        if len(directions_list) >= 6:
            processed_directions.append(f"{directions_list[0]} {directions_list[1]}")  # Prep X m
            processed_directions.append(f"{directions_list[2]} {directions_list[3]}")  # Cook X m
            processed_directions.append(f"{directions_list[4]} {directions_list[5]}")  # Ready In X h
            processed_directions.extend(directions_list[6:])
        else:
            processed_directions = directions_list

        # Remove empty lines
        return [direction for direction in processed_directions if direction.strip()]
    except Exception as e:
        return [f"Error processing directions: {str(e)}"]


def process_reviews(reviews: dict) -> dict:
    """Convert numeric keys in reviews dictionary to strings."""
    return {str(key): value for key, value in reviews.items()}


def process_recipe_row(row: pd.Series) -> dict:
    """Convert a DataFrame row into a JSON dictionary."""
    try:
        # Parse reviews and convert numeric keys to strings
        reviews = ast.literal_eval(row["reviews"])
        reviews = process_reviews(reviews) if isinstance(reviews, dict) else {}

        return {
            "recipe_id": int(row["recipe_id"]),
            "recipe_name": str(row["recipe_name"]),
            "average_rating": float(row["aver_rate"]),
            "image_url": str(row["image_url"]),
            "review_count": int(row["review_nums"]),
            "ingredients": [str(ingredient) for ingredient in row["ingredients"].split("^")],
            "cooking_directions": process_cooking_directions(str(row["cooking_directions"])),
            "nutritions": ast.literal_eval(row["nutritions"]),
            "reviews": reviews,
        }
    except (ValueError, SyntaxError, KeyError) as e:
        raise ValueError(f"Invalid data in row: {str(e)}")


def check_csv_duplicates(df: pd.DataFrame) -> list:
    """Check for duplicate recipe_id values in the CSV."""
    duplicates = df[df["recipe_id"].duplicated(keep=False)]
    if not duplicates.empty:
        return duplicates["recipe_id"].tolist()
    return []


def main():
    """Read CSV, process data, and insert each recipe into MongoDB."""
    # Read CSV file
    try:
        recipe_df = pd.read_csv("data/raw-data_recipe.csv")
    except FileNotFoundError:
        print("Error: File 'data/raw-data_recipe.csv' not found.")
        return

    # Verify required columns
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
    #     print("Error: Missing required columns in CSV.")
    #     return

    # # Check for duplicate recipe_id in CSV
    # duplicate_ids = check_csv_duplicates(recipe_df)
    # if duplicate_ids:
    #     print(f"Warning: Found duplicate recipe_id values in CSV: {duplicate_ids}")

    # Connect to MongoDB
    try:
        client = MongoClient("mongodb://localhost:27017/")  # Update URI if needed
        db = client["recipe_database"]
        collection = db["recipes"]

        # Drop the collection to ensure it's empty
        collection.drop()
        print("Dropped existing 'recipes' collection to start fresh.")

        # Create unique index on recipe_id
        collection.create_index("recipe_id", unique=True)
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return

    # Counters for inserted and skipped recipes
    inserted_count = 0
    skipped_count = 0

    # Process and insert each row
    for index, row in recipe_df.iterrows():
        try:
            json_recipe = process_recipe_row(row)
            collection.insert_one(json_recipe)
            inserted_count += 1
            # Optional: Print progress every 500 rows
            if (index + 1) % 500 == 0:
                print(f"Processed {index + 1} rows, inserted {inserted_count}, skipped {skipped_count}")
        except DuplicateKeyError:
            print(f"Skipped row {index}: Duplicate recipe_id {row['recipe_id']}")
            skipped_count += 1
        except ValueError as e:
            print(f"Skipped row {index}: {str(e)}")
            skipped_count += 1
        except Exception as e:
            print(f"Skipped row {index}: Unexpected error: {str(e)}")
            skipped_count += 1

    # Print final results
    print(f"Inserted {inserted_count} recipes into MongoDB.")
    if skipped_count > 0:
        print(f"Skipped {skipped_count} recipes due to errors or duplicates.")

    # Verify collection contents
    total_documents = collection.count_documents({})
    print(f"Total documents in 'recipes' collection: {total_documents}")

    # Close connection
    client.close()


if __name__ == "__main__":
    main()