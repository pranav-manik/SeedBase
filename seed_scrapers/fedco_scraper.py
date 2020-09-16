from bs4 import BeautifulSoup
import requests
import time
import json
from datetime import datetime


hybrid_types = ["open-pollinated", "f-1 hybrid"]

#retreive url to search
#page_url = input("Enter URL: ")
url = "https://www.fedcoseeds.com/seeds/"
page_response = requests.get(url,  headers={'User-Agent': 'Mozilla/5.0'})
soup = BeautifulSoup(page_response.content, "html.parser")

blacklisted_urls = ["https://www.fedcoseeds.com/seeds/list-web-sale", "https://www.fedcoseeds.com/seeds/list-new-for-2019", "https://www.fedcoseeds.com/seeds/list-just-added", "https://www.fedcoseeds.com/seeds/list-seed-racks", "https://www.fedcoseeds.com/seeds/supplies", "https://www.fedcoseeds.com/seeds/collections", "https://www.fedcoseeds.com/seeds/list-other-vegetables", "https://www.fedcoseeds.com/seeds/list-organic", "https://www.fedcoseeds.com/seeds/list-ossi", "https://www.fedcoseeds.com/seeds/list-heirlooms"]
blacklisted_names = ["Web Sale!", "New For 2019!", "Just Added!", "OSSI", "Seed Racks", "Supplies", "Other Vegetables", "Colllections", "Organic", "Heirlooms", "Collections"]
soup = soup.find("div", attrs={"class": "grid"})
# print(soup)

vegetables_cat = ['Asian Greens', 'Beans', 'Beets', 'Broccoli', 'Cabbages', 'Carrots', 'Cauliflowers', 'Celery', 'Cucumbers', 'Eggplants', 'Gourds', 'Greens', 'Herbs', 'Hot Peppers', 'Kale and Collards', 'Lettuce', 'Onions and Leeks', 'Other Roots', 'Peas', 'Peppers', 'Pumpkins', 'Radishes', 'Spinach', 'Squash - Summer', 'Squash - Winter', 'Zucchini']
fruits_cat = ['Melons', 'Tomatoes', 'Watermelons']
other_cat = ['Corn', 'Grains', 'Herbs']

names_dict = {}
name_urls = []

x = 0
# grabs all urls from site
for name in soup.find_all(href=True):
	name_url = name['href']
	# checks if not blacklisted url
	if name_url not in blacklisted_urls:
		name_urls.append(name_url)
		print(x, name_url)
		x+=1

# grabs all category names
i = 0
for name in soup.find_all(href=True):
	name = name.h4.text
	# name = name.split('\n')[3]
	# name = name.split(' - ')[0]
	if name not in blacklisted_names:
		names_dict[name] = name_urls[i]
		print(i, name)
		i+=1
# print(names)
print(names_dict)
# open file
f = open("fedco_seeds_" + str(datetime.now().month) + "-" + str(datetime.now().day) + "-" + str(datetime.now().year) +".json", "a")
# loop through name Dictionary
for name in names_dict:
	print(names_dict.get(name))
	page_response = requests.get(names_dict.get(name),  headers={'User-Agent': 'Mozilla/5.0'})
	soup = BeautifulSoup(page_response.content, "html.parser")

	# get the category type
	if name in vegetables_cat:
		category = "vegetables"
	elif i in fruits_cat:
		category = "fruits"
	else:
		category = "other"


	# loop throguh all varieties
	for variety in soup.find_all("div", attrs={"class": "search-results-text"}):
		# find out if organic or not
		organic = False
		try:
			if variety.find("span", attrs={"class": "og-eco"}).string.strip() == "OG":
				organic = True
		except:
			organic = False

		# maturity = variety.find("span", attrs={"class": "description"}).text
		# maturity = maturity[maturity.find("(")+1:maturity.find(")")]
		# print(maturity)

		# grab variety url and name
		variety_url = variety.find("a", href=True).get('href')
		variety = variety.a.string
		# print(variety_url, variety)

		# request variety page
		page_response = requests.get(variety_url,  headers={'User-Agent': 'Mozilla/5.0'})
		soup = BeautifulSoup(page_response.content, "html.parser")


		# grabs maturity
		try:
			maturity = soup.find("span", attrs={"class": "catalog-desc"}).text
			maturity = maturity[maturity.find("(")+1:maturity.find(")")]
			maturity = maturity.replace('-',' ')
			# print(maturity)
			mat_min = None
			mat_max = None
			parse = maturity.split()
			# finds out maturity if there are numbers 
			if (sum(c.isdigit() for c in maturity) > 0):
				# print(parse)
				maturity = ""
				last_int = ""
				for word in parse:
					try:
						word = int(word)
						# print(word)
						if (maturity == ""):
							maturity = str(word) + "-"
						else:
							last_int = str(word)
					except:
						# print(word , "is not an int")
						pass
				if (last_int != ""):
					mat_min = int(maturity[0:-1])
					maturity = maturity + last_int
					mat_max = int(last_int)
				else:
					maturity = maturity[0:-1]
					mat_min = int(maturity)
					mat_max = int(maturity)
			# print("mat_min ", mat_min, " mat_max ", mat_max)
		except Exception as e:
			maturity = ""
			mat_max = None
			mat_min = None
			print("exception", e)
			err_file = open("fedco_error.txt", "a")
			err_file.write(variety_url + '\n')
			err_file.close()
		# grabs hybrid hybrid_status
		hybrid_status = soup.find("span", attrs={"class": "catalog-desc"}).text
		hybrid_status = hybrid_status[hybrid_status.find(")")+1:hybrid_status.find(".")]
		hybrid_status = hybrid_status.strip().lower().split()
		if "f-1" in hybrid_status:
			hybrid_status = "F-1 Hybrid"
		elif "open-pollinated" in hybrid_status or "pollinated" in hybrid_status:
			hybrid_status = "Open-Pollinated"
		else:
			hybrid_status = ""
		# print(hybrid_status)

		# grab prices
		prices = {}
		price_index = 1
		x = 0
		for price_per_unit in soup.find_all("td", attrs= {"class": "pricecell"}):
			price_per_unit = price_per_unit.text.strip()
			print(price_per_unit)
			parse_price = price_per_unit.split(' ')
			print(price_index, parse_price)
			if (x % 2 == 0):
				unit = parse_price[1]
				print(unit)
				price = parse_price[3]
				print(price)
				price_per_unit = price + "/" + unit
				key = "price_" + str(price_index)
				prices[key] = price_per_unit
				price_index += 1
			x+=1
			# print(price_per_unit)
		# print(prices)
		if (variety == None):
			variety = variety_url.split('/')[4]
			variety = variety.split('-')
			variety = variety[:-1]
			variety = " ".join(str(x) for x in variety)
			# variety = soup.find("h1", attrs={"class": "product-name"}).text
			print("variety not found")
			print(variety)

		# grab min and max prices
		try:
			min_price = int(prices["price_1"].replace('$','').replace('.','').split('/')[0])
		except Exception as e:
			print(e, "min price not found")
			min_price = None
		try:
			last_key = list(prices.keys())[-1]
			max_price = int(prices[last_key].replace('$','').replace('.','').replace(',','').split('/')[0])
		except Exception as e:
			print(e, "max price not found")
			max_price = None

		# image url
		img_url = ""
		try:
			img_url = soup.find("img", attrs={"class": "w3-image w3-hover-opacity"})['src']
			img_url = "https://www.fedcoseeds.com"+ img_url
		except Exception as e:
			img_url = ""

		# Capitalizes data
		variety = variety.title();
		name = name.title();
		category = category.title();

		# timestamp
		now = datetime.now()
		timestamp = datetime.timestamp(now)
		dt_object = datetime.fromtimestamp(timestamp)
		#schema for data
		data = {			
			'variety': variety,
			'name' : name,
			'category': category,
			'manufacturer': "Fedco",
			'maturity': maturity,
			'mat_min': mat_min,
			'mat_max': mat_max,
			'life_cycle': "",
			'hybrid_status': hybrid_status,
			'prices': prices,
			'min_price': min_price,
			'max_price': max_price,
			'organic': organic,
			'url': variety_url,
			'img_url': img_url,
			'timestamp': str(dt_object)
			}
		json_data = json.dumps(data, indent=4)
		print(json.dumps(data, indent=4))		
		f.write(json_data + ',\n')
f.close()




