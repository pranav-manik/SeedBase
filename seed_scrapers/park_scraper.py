from bs4 import BeautifulSoup
import requests
import json
import time
from datetime import datetime
import re

blacklisted_urls =['https://parkseed.com/vegetables/c/vegetables/']


def park_seed_vegetable():

	url = "https://parkseed.com/vegetables/gc/vegetables/"
	seed_category = "vegetables"
	seed_manufacturer = "Park Seeds"

	#request agents through Mozilla
	page_response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
	soup = BeautifulSoup(page_response.content, "html.parser")
	x = 1

	# print(soup.prettify())

	seed_var = soup.find("ul", attrs={"id": "subnav"})
	seed_var_list = seed_var.find_all("li")

	for l in seed_var_list:
		cat_url = seed_url = l.find("a", href=True).get('href')
		cat_url = cat_url.strip()

		if cat_url[0] != 'h':
			cat_url = "https://parkseed.com/" + cat_url

		seed_name = l.find("a").text
		seed_name = seed_name.split("Seeds")[0].strip()

		if "Plants" in seed_name:
			print("Plants")
			seed_name = seed_name.split("Plants")[0].strip()

		if "Growing" in seed_name:
			print("Growing")
			seed_name = seed_name.split("Growing")[0].strip()

		if cat_url not in blacklisted_urls:
			#Clicking into category
			cat_response = requests.get(cat_url, headers={'User-Agent': 'Mozilla/5.0'})
			soup1 = BeautifulSoup(cat_response.content, "html.parser")

			for seed in soup1.find_all("li", attrs={"class": "grid-prod-wrap col-xs-6 col-sm-4 col-md-3 col-lg-3"}):

				#name and url
				seed_url = seed.find("a", href=True).get('href')
				seed_full_name = seed.find("div", attrs={"class": "name"}).find("a").string


				seed_url = seed_url.rstrip()
				print(seed_url)

				#click in
				seed_url_response = requests.get(seed_url, headers={'User-Agent': 'Mozilla/5.0'})

				#catch 400 error
				try:
					seed_url_response.raise_for_status()
				except requests.exceptions.HTTPError as e:
					print("Error", str(e), "on", seed_full_name)
					continue
				
				soup2 = BeautifulSoup(seed_url_response.content, "html.parser")

				#maturity
				seed_details = soup2.find("div", attrs={"class": "product_grid_details"})

				if seed_details == None:
					print("Couldn't find product_grid_details")
					continue

				#variety	
				try:
					seed_variety = seed_details.find('b', string = "Variety:")
					seed_variety = seed_variety.parent.text
					seed_variety = seed_variety[9:]
					seed_variety = seed_variety.strip()
				except:
					try:
						list_name = seed_full_name.split(" ")
						if list_name[-1] == "Seeds":
							seed_variety = " ".join(list_name[0:-2]).strip()
						else:
							seed_variety = " ".join(list_name).strip()

					except:
						seed_variety = ""



				hybrid_status = ""
				if "hybrid" in seed_full_name or "Hybrid" in seed_full_name or "Hybrid" in seed_variety:
					hybrid_status = "hybrid"

				try:
					seed_maturity = seed_details.find('b', string = "Days to Maturity:")

					#case for when 'To' is capitalized
					if seed_maturity == None:
						seed_maturity = seed_details.find('b', string = "Days To Maturity:")
					seed_maturity = seed_maturity.parent.text
					seed_maturity = seed_maturity.strip()
					seed_maturity = int(seed_maturity[18:])
				except:
					seed_maturity = 0

				#life cycle
				seed_life_cycle = ""

				#organic
				if "organic" in seed_variety.lower():
					seed_organic = True
				else:
					seed_organic = False

				#seed quantity
				try:
					seed_quantity = seed_details.find('b', string = "Seeds Per Pack:")
					seed_quantity = seed_quantity.parent.text
					seed_quantity = seed_quantity.strip()
					seed_quantity = int(seed_quantity[15:])
				except:
					seed_quantity = 0

				if seed_quantity == 0 and seed_maturity != 0:
					q= soup2.find("div", attrs={"class": "name"}).text
					if re.findall("\d+", q):
						seed_quantity = int(re.findall("\d+", q)[0])

				#seed price
				try:
					seed_details = soup2.find("div", attrs={"class": "price-wrap"})
					seed_dict = {}

					#Case for sale
					if (seed_details.find("span", attrs={"class": "was"})):
						index = 1
						price_list = seed_details.find_all("span", attrs={"class": "now"})
						price_quan = seed_details.find_all("div", attrs={"class": "break"})
						for price in price_list:
							key = "price_" + str(index)
							price_text = price.text

							quan_text = ""
							if index != 1:
								quan_text = price_quan[index-2].text

							#case for double digits
							nu = int(quan_text[4:8].strip().replace("+", ""))

							if index == 1:
								pt = price_text[5:11].strip() + "/" + (("Pkt of " + str(seed_quantity*nu) + " seeds") if seed_quantity != 0 else ("Pkt of seeds"))
							else:
								total_price = float(price_text[5:11].strip().replace('$','')) * nu
								pt = str('${:,.2f}'.format(total_price)) + "/" + quan_text[4:8].strip() + ((str(seed_quantity * nu) + " seeds") if seed_quantity != 0 else ("Pkt of seeds"))

							seed_dict[key] = pt
							index += 1


					#Case for non sale
					else:
						index = 1
						#main price

						price = str(seed_details.find("div", attrs={"class": "first-break"}).text).strip() + "/" + ((str(seed_quantity) + " seeds") if seed_quantity != 0 else ("Pkt of seeds"))


						key = "price_" + str(index)
						seed_dict[key] = price
						index += 1

						#rest of prices
						price_list = seed_details.find_all("div", attrs={"class": "break"})
						for price in price_list:
							key = "price_" + str(index)
							price_text = price.text

							#case for double digits
							nu = int(price_text[5:8].strip().replace("+", ""))
							total_price = float(price_text[11:17].strip().replace('$','')) * nu
							pt = str('${:,.2f}'.format(total_price)) + "/" + ((str(seed_quantity*nu) + " seeds") if seed_quantity != 0 else ("Pkt of seeds"))

							seed_dict[key] = pt
							index += 1

						if len(soup2.find_all("div", attrs={"info-wrap_WRAPPER col-xs-12"})) > 1:
							rest_price = soup2.find_all("div", attrs={"info-wrap_WRAPPER col-xs-12"})[1:]

							for r in rest_price:
								q= r.find("div", attrs={"class": "name"}).text
								if re.findall("\d+/*\d*", q):
									seed_quantity = re.findall("\d+/*\d*", q)[0]
								
								if "lb" in q:
									price = str(r.find("div", attrs={"class": "first-break"}).text).strip() + "/"  + str(seed_quantity) + " lbs" 
								elif "seeds" in q:
									price = str(r.find("div", attrs={"class": "first-break"}).text).strip() + "/" + str(seed_quantity) + " seeds"
								elif "oz" in q:
									price = str(r.find("div", attrs={"class": "first-break"}).text).strip() + "/" + str(seed_quantity) + " oz"

								key = "price_" + str(index)
								seed_dict[key] = price
								index += 1

				except:
					price = 0

				#Price for whack layout


				# grab min and max prices
				try:
					min_price = int(seed_dict["price_1"].replace('$','').replace('.','').split('/')[0])
				except Exception as e:
					print(e, "min price not found")
					min_price = None
				try:
					last_key = list(seed_dict.keys())[-1]
					max_price = int(seed_dict[last_key].replace('$','').replace('.','').replace(',','').split('/')[0])
				except Exception as e:
					print(e, "max price not found")
					max_price = None

				# image url
				try:
					img_url = soup2.find("a", attrs={"id": "full_image_link"})['href']
				except:
					img_url = ""

				#Capitalizing
				seed_variety = seed_variety.title();
				seed_name = seed_name.title();
				seed_category = seed_category.title();


				# timestamp
				now = datetime.now()
				timestamp = datetime.timestamp(now)
				dt_object = datetime.fromtimestamp(timestamp)



				# print(seed_full_name)
				# print(seed_dict)
				# 
				# print(soup2.prettify())
				# print(x)
				# print(seed_name)
				# print(seed_variety)

				data = {
		        	"variety": seed_variety,
		        	"name": seed_name,
		        	"category": seed_category,
		        	"manufacturer": seed_manufacturer,
		        	"maturity": str(seed_maturity),
					"mat_min": seed_maturity,
					"mat_max": seed_maturity,
		        	"life_cycle": seed_life_cycle,
		        	"hybrid_status" : hybrid_status,
		        	"prices": seed_dict,
		        	"min_price": min_price,
		        	"max_price": max_price,
		        	"organic": seed_organic,
		        	"url": seed_url,
		        	"img_url": img_url,
		        	"timestamp": str(dt_object)
				}

				#only write if seed
				try:
					if seed_maturity != 0:
						json_data = json.dumps(data, indent=4)
						print(json.dumps(data, indent=4))
						f = open("park_seeds_" + str(datetime.now().month) + "-" + str(datetime.now().day) + "-" + str(datetime.now().year) +".json", "a")
						f.write(json_data + ',\n')
				except:
					i = 0

				x+=1

	f.close()


park_seed_vegetable()