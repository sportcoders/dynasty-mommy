import requests
import os
from dotenv import load_dotenv
import pymongo

def init_db():
    load_dotenv()
    URI = os.getenv("DB_URI")
    client = pymongo.MongoClient(URI)
    response = requests.get('https://api.sleeper.app/v1/players/nba')
    db = client['test']
    if 'sleeper' in db.list_collection_names():
        drop = db['sleeper']
        drop.drop()
    db = db['sleeper']
    players = response.json()
    insert_list = [{'id':player['player_id'], 
                            'first_name':player['first_name'], 
                            'last_name':player['last_name'],
                            'team':player['team'],
                            'height': player.get('height', None),
                            'weight':player.get('weight', None),
                            'position':player['position'],
                            'fantasy_positions':player['fantasy_positions'],
                            'number':player.get('number', None),
                            'birth_date':player.get('birth_date', None)
                            }
                            for player in players.values()]
    db.insert_many(insert_list)
    

if __name__ =='__main__':
    init_db()