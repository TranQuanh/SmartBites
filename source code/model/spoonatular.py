import requests
import json
api_key = "d1ce15c0ac594ee3a9c959316a3d06a5"

recipe_id = 716429
url = f'https://api.spoonacular.com/recipes/{recipe_id}/information'

params = {'apiKey': api_key}
response = requests.get(url, params=params)
detail = response.json()

# print(detail['title'])
# print(detail['instructions'])

# Ghi vào file JSON
with open(f'rtest.json', 'w', encoding='utf-8') as f:
    json.dump(detail, f, indent=4, ensure_ascii=False)
