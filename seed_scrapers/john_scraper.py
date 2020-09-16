from bs4 import BeautifulSoup
import requests
import json
import os
from datetime import datetime

def change_last_line(file_name):
	MYFILE = file_name
	# read the file into a list of lines
	lines = open(MYFILE, 'r').readlines()
	# now edit the last line of the list of lines
	new_last_line = ('}')
	lines[-1] = new_last_line
	# now write the modified list back out to the file
	open(MYFILE, 'w').writelines(lines)

urls = ["https://www.johnnyseeds.com/vegetables/" , "https://www.johnnyseeds.com/fruits/", "https://www.johnnyseeds.com/flowers/"]
#retreive url to search
# https://www.johnnyseeds.com
# https://www.johnnyseeds.com/fruits/blackberry/
# url = "https://www.johnnyseeds.com/flowers/"


# print(category)

#cycle types
cycle_type = ["Annual", "Perennial", "Tender Perennial", "Biennial"]
hybrid_types = ["Open Pollinated", "Hybrid (F1)"]

#converting English to math
unit_years = {
				"first": 1,
				"second": 2,
				"third" : 3,
				"thrid": 3,
				"fourth": 4,
				"fifth": 5
			}

# file to write data too
f = open("john_seeds_" + str(datetime.now().month) + "-" + str(datetime.now().day) + "-" + str(datetime.now().year) +".json", "a")
# f.write('[' + '\n')
# iterates though selected urls to scrape from
for url in urls:
	category = url.split('/')
	category = category[-2]
	#requests page through User Agent Mozilla
	page_response = requests.get(url,  headers={'User-Agent': 'Mozilla/5.0'})
	soup = BeautifulSoup(page_response.content, "html.parser")
	x = 1
	my_pages = [url]

	# finds number of pages and grabs link
	for page in soup.find_all("a", attrs={"class":"c-pagination__link"}):
		print(page['href'])
		if page['href'] not in my_pages:
			my_pages.append(page['href'])
	
	# iterates though all pages
	for page in my_pages:
		print(page)
		page_response = requests.get(page,  headers={'User-Agent': 'Mozilla/5.0'})
		soup = BeautifulSoup(page_response.content, "html.parser")

		#parses name (ex. blueberry)
		for type in soup.find_all("div", attrs={"class": "o-layout__col-50 o-layout__col-33@xs-up js-grid-tile grid-tile"}):
			
			# finds category name
			category_url = type.find("a", href=True).get('href')
			name = category_url.split('/')
			name = name[-2]

			# requests/opens variety page
			category_url_response = requests.get(category_url,  headers={'User-Agent': 'Mozilla/5.0'})
			soup = BeautifulSoup(category_url_response.content, "html.parser")

			# finds all pages for 1 category
			category_pages = [category_url]
			for cat_page in soup.find_all("a", attrs={"class":"c-pagination__link"}):
				print("category url - ", cat_page['href'])
				if cat_page['href'] not in category_pages:
					category_pages.append(cat_page['href'])
			# iterates through all category pages
			for cat_url in category_pages:
				category_url_response = requests.get(cat_url,  headers={'User-Agent': 'Mozilla/5.0'})
				soup = BeautifulSoup(category_url_response.content, "html.parser")
				x+=1
				i = 1
				#parses variety (ex. Fruit)
				for seed in soup.find_all("div", attrs={"class":"c-tile js-product-tile is-grid product-tile"}):
					# print(soup.find_all)
					variety_url = seed.find("a", attrs={"class": "thumb-link"}, href=True).get('href')
					variety_url = "https://www.johnnyseeds.com" + variety_url;
					# print(variety_url)
					variety = seed.find("div", attrs={"class":"c-tile__name product-name"}).text
					variety = variety.split('\n')[-2]
					try:
						# finds second variety name
						sec_variety = seed.find("div", attrs={"class":"c-tile__secondary-name"}).text
						sec_variety = sec_variety.split('\n')[-2]
						sec_variety = sec_variety.lower()
						print(sec_variety)
						# finds if organic or not
						if (sec_variety.find('organic') == 0):
							organic = True
						else:
							organic = False
						# requests/opens variety page
						variety_url_response = requests.get(variety_url,  headers={'User-Agent': 'Mozilla/5.0'})
						soup = BeautifulSoup(variety_url_response.content, "html.parser")
						# grab maturity, lifecycle, and hybrid status
						try:
							maturity = ""
							life_cycle = ""
							hybrid_status = ""
							for facts in soup.find_all("dt", attrs={"class": "c-facts__term js-facts-dialog"}):
								# print(facts.h3.text)
								if (facts.h3.text == "Days To Maturity"):
									# print(facts.next_sibling.next_sibling.text)
									maturity = facts.next_sibling.next_sibling.text.split('\n')[1]
									mat_min = None
									mat_max = None
									parse = maturity.split()
									print("maturity string - " + maturity)
									print(sum(c.isdigit() for c in maturity))
									# if there is a number
									# and sum(c.isdigit() for c in maturity) < 7
									if (sum(c.isdigit() for c in maturity) > 0):
										print(parse)
										maturity = ""
										last_int = ""
										for word in parse:
											try:
												word = int(word)
												print(word)
												if (maturity == ""):
													maturity = str(word) + "-"
												else:
													last_int = str(word)
											except:
												print(word , "is not an int")
										if (last_int != ""):
											mat_min = int(maturity[0:-1])
											maturity = maturity + last_int
											mat_max = int(last_int)
											print(mat_min, mat_max)
										else:
											maturity = maturity[0:-1]
											mat_min = int(maturity)
											mat_max = int(maturity)
									# if there are no numbers finds number of years till maturity
									elif (sum(c.isdigit() for c in maturity) == 0):
										string_to_nums = []
										for l in parse:
											if l in unit_years:
												print("found unit year " + str(unit_years[l]) + " <- unit year")
												maturity = str(365 * unit_years[l])
												mat_min = int(maturity)
												mat_max = int(maturity)
								# grabs life cycle
								elif (facts.h3.text == "Life Cycle"):
									life_cycle = facts.next_sibling.next_sibling.text.split('\n')[1]
								# grabs hybrid status
								elif (facts.h3.text == "Hybrid Status"):
									hybrid_status = facts.next_sibling.next_sibling.text.split('\n')[1]
						except Exception as e:
							print("exception", e)
							maturity = ""
							life_cycle = ""
							hybrid_status = ""
						# catches prices
						prices = {}
						price_index = 1
						try:
							x = 0
							for price in soup.find_all("span", attrs={"class": "c-attribute-table__val c-attribute-table__val--m-bold"}):
								price = price.text
								unit = soup.find_all("h3", attrs={"class": "c-attribute-table__val c-attribute-table__val--m-heading"})[x].text
								price_per_unit = price + "/" + unit
								key = "price_" + str(price_index)
								prices[key] = price_per_unit
								price_index += 1
								x+=1
								print(price_per_unit)
						except Exception as e:
							print("exception", e)
							err_file = open("error.txt", "a")
							err_file.write(variety_url + '\n')
							err_file.close()
							pass
						# if there is a sale on the prices
						if bool(prices) == False:
							try:
								x = 0
								for price in soup.find_all("span", attrs={"class": "c-attribute-table__val c-attribute-table__val--m-bold c-attribute-table__val--highlight"}):
									price = price.text
									unit = soup.find_all("h3", attrs={"class": "c-attribute-table__val c-attribute-table__val--m-heading"})[x].text
									price_per_unit = price + "/" + unit
									key = "price_" + str(price_index)
									prices[key] = price_per_unit
									price_index += 1
									x+=1
									print(price_per_unit)
							except:
								err_file = open("error.txt", "a")
								err_file.write(variety_url + '\n')
								err_file.close()
								pass
						name = name.replace("-", " ")
						name = name.title()
						category = category.capitalize()
						print(category + " " + name + " " + variety + " " + maturity + " " + life_cycle + " " + price)
						i+=1

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

						# grab image url
						img_url = soup.find("img", attrs={"class": "c-image-gallery__main-image js-image-gallery__main-image"})['src']
						# timestamp
						now = datetime.now()
						timestamp = datetime.timestamp(now)
						dt_object = datetime.fromtimestamp(timestamp)
						#schema for data
						data = {			
								'variety': variety,
								'name' : name,
								'category': category,
								'manufacturer': "Johnny's",
								'maturity': maturity,
								'mat_min': mat_min,
								'mat_max': mat_max,
								'life_cycle' : life_cycle,
								'hybrid_status' : hybrid_status,
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
					except Exception as e:
						print("exception", e)
						err_file = open("error.txt", "a")
						err_file.write(variety_url + '\n')
						err_file.close()
						pass

# f.close()
# change_last_line("john_data.json")
# f = open("john_data.json", "a")
# f.write(']')
f.close()
