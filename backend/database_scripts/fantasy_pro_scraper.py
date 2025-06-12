import os
import pymongo
from playwright.sync_api import sync_playwright
from dotenv import load_dotenv

def main():
    load_dotenv()
    URI = os.getenv("DB_URI")
    client = pymongo.MongoClient(URI)
    db = client['test']
    if 'fantasy_pro_ranking_yahoo_pts' in db.list_collection_names():
        drop = db['fantasy_pro_ranking_yahoo_pts']
        drop.drop()
    db = db['fantasy_pro_ranking_yahoo_pts']
    insert_list = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto('https://www.fantasypros.com/nba/rankings/dynasty-overall-points-yahoo.php')
        table = page.locator('table')
        table.wait_for(timeout=5000)
        rows = table.locator('tr').all()
        for row in rows:
            cells = row.locator('td').all()
            if len(cells) >2:
                rank = cells[0].inner_text() #fantasy pro ranking
                player_info = cells[2].inner_text() #player info
                name, teaminfo = player_info.split("(")
                print(rank, player_info)
                print(name, teaminfo)
                teaminfo = teaminfo[:len(teaminfo)-1]
                team, positions = teaminfo.split('-')
                print(team)
                for i in positions.split(','):
                    print(i.strip())
                insert_list.append({"rank":rank, 
                                    "name":name,
                                    "team":team,
                                    })
    db.insert_many(insert_list)
if __name__ =='__main__':
    main()