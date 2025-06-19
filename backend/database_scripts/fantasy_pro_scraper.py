import os
from httpx import head
import pymongo
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth
from dotenv import load_dotenv

DB_NAME = 'test'


def main():
    load_dotenv()
    URI = os.getenv("DB_URI")
    client = pymongo.MongoClient(URI)
    db = client[DB_NAME]
    print(db.list_collection_names())
    if 'fantasy_pro_ranking_yahoo_pts' in db.list_collection_names():
        drop = db['fantasy_pro_ranking_yahoo_pts']
        drop.drop()
    db = db['fantasy_pro_ranking_cat_roto']
    insert_list = []
    with  Stealth().use_sync(sync_playwright()) as p:
        browser = p.chromium.launch(headless=False)
        # context = browser.new_context(
        # viewport={'width': 1920, 'height': 1080},
        # user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        # java_script_enabled=True,
        # locale='en-US'
        # )
        page = browser.new_page()
        page.goto('https://www.fantasypros.com/nba/rankings/dynasty-overall.php')
        page.wait_for_selector('table', timeout=10000)
        table = page.locator('table')
        rows = table.locator('tr').all()
        for row in rows:
            cells = row.locator('td').all()
            if len(cells) >2:
                rank = cells[0].inner_text() #fantasy pro ranking
                player_info = cells[2].inner_text() #player info
                name, teaminfo = player_info.split("(")
                teaminfo = teaminfo.split(")")[0]
                team, positions = teaminfo.split('-')
                team.strip()
                positions.strip()
                # print(rank, name, team, positions)
                positions = positions.split(',')
                insert_list.append({"rank":rank, 
                                    "name":name,
                                    "team":team,
                                    "position":positions
                                    })
    db.insert_many(insert_list)
    
if __name__ =='__main__':
    main()