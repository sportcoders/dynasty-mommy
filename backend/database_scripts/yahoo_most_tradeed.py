import pymongo
import requests
from bs4 import BeautifulSoup

def main():
    """
    Created 6/19/25
    Used to scrape yahoo for players with the most trades
    Currently doesn't add to db
    """
    site = requests.get('https://football.fantasysports.yahoo.com/f1/buzzindex?sort=BI_T')
    soup = BeautifulSoup(site.content, "html.parser")
    div = soup.find("div", id='yspmaincontent')
    thead = div.find("thead")
    tbody = div.find("tbody")
    rows = tbody.find_all("tr")
    for row in rows:
        cells = row.find_all("td")
        player = cells[0]
        tag = player.find(attrs={"title":True})
        player_name = tag.get_text()
        trades = cells[5]
        num_times_traded = trades.find("div").get_text()

        print(player_name, num_times_traded)
 
if __name__ == '__main__':
    main()