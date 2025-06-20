import os
import pymongo
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth
from dotenv import load_dotenv

DB_NAME = 'test'
CAT_ROTO_RANKING_COLLECTION = 'fantasy_pro_ranking_cat_roto'
YAHOO_PTS_RANKING_COLLECTION = 'fantasy_pro_ranking_yahoo_pts'
ESPN_PTS_RANKING_COLLECTION = 'fantasy_pro_ranking_espn_pts'
def getRankingsFromTable(page, db):
    table = page.locator('table')
    rows = table.locator('tr').all()
    insert_list = []
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
            positions = positions.split(',')
            print(rank, name, team, positions)
            insert_list.append({"rank":rank, 
                                "name":name,
                                "team":team,
                                "position":positions
                                })
    # print(insert_list)
    db.insert_many(insert_list)

def main():
    load_dotenv()
    URI = os.getenv("DB_URI")
    client = pymongo.MongoClient(URI)
    db = client[DB_NAME]
    for collection in [YAHOO_PTS_RANKING_COLLECTION, ESPN_PTS_RANKING_COLLECTION, CAT_ROTO_RANKING_COLLECTION]:
        if collection in db.list_collection_names():
            drop = db[collection]
            drop.drop()
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
        page.wait_for_selector('table', timeout=5000)

        getRankingsFromTable(page, db[CAT_ROTO_RANKING_COLLECTION])
        button = page.locator('.select-advanced__button').nth(1)
        button.wait_for(state='visible')
        button.click()
        page.click('text=Points (Yahoo)')
        page.wait_for_selector('table', timeout=5000)
        getRankingsFromTable(page, db[YAHOO_PTS_RANKING_COLLECTION])
        button.click()
        page.click('text=Points (ESPN)')
        page.wait_for_selector('table', timeout=5000)
        getRankingsFromTable(page, db[ESPN_PTS_RANKING_COLLECTION])

    
if __name__ =='__main__':
    main()