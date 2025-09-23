import time
import requests
import os
from dotenv import load_dotenv
import pymongo

DB_NAME = 'test'
COLLECTION_NAME = 'sleeper'
TEMP_COLLECTION ='temp_sleeper_players'

def init_db():
    load_dotenv()
    URI = os.getenv("DB_URI")
    client = pymongo.MongoClient(URI)
    response = requests.get('https://api.sleeper.app/v1/players/nba')
    db = client[DB_NAME]
    new_players_colleciton = db[TEMP_COLLECTION]
    players = response.json()
    # timestamp = int(time.time())
    insert_list = [{'id':player['player_id'], 
                            'first_name':player['first_name'], 
                            'last_name':player['last_name'],
                            'team':player['team'],
                            'height': player.get('height', None),
                            'weight':player.get('weight', None),
                            'position':player['position'],
                            'fantasy_positions':player['fantasy_positions'],
                            'number':player.get('number', None),
                            'birth_date':player.get('birth_date', None),
                            # 'ts':timestamp
                            }
                            for player in players.values()]
    new_players_colleciton.insert_many(insert_list)
    new_players_colleciton.rename(COLLECTION_NAME, dropTarget=True)

    

if __name__ =='__main__':
    init_db()