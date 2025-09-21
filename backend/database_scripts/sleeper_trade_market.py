import argparse
from collections import defaultdict, deque
import time
from time import sleep
from dotenv import load_dotenv
import pymongo
import pymongo.typings
import requests
import os
import redis

load_dotenv()
DB_NAME = 'test'
COLLECTION_NAME = 'sleeper'
state = requests.get("https://api.sleeper.app/v1/state/nba").json()
current_season = state['season']
round = state['week']
seconds_in_one_week = 7 * 24 * 60 * 60
transaction_offseason_filter_oldest= time.time() - (seconds_in_one_week *2)

r = redis.Redis(
    host=os.getenv("REDIS_HOST"),
    port=os.getenv("REDIS_PORT"),
    decode_responses=True,
    username=os.getenv("REDIS_USER"),
    password=os.getenv("REDIS_PASSWORD"),
)
leagues_queue = "leagues_queue_sleeper"
def leagues_enque(item:str):
    r.rpush(leagues_queue, item)

def leagues_pop():
    return r.lpop(leagues_queue)

def is_queue_empty() -> bool:
    return r.llen(leagues_queue) == 0

def visited_league(league_id: str, ttl_seconds: int = 604800):  # 7 days
    key = f"visited_league:{league_id}"
    r.set(key, 1, ex=ttl_seconds)

def is_visited_league(league_id: str) -> bool:
    key = f"visited_league:{league_id}"
    return r.exists(key) == 1

users_queue = "users_queue_sleeper"
def users_enque(item:str):
    r.rpush(users_queue, item)

def users_pop():
    return r.lpop(users_queue)

def is_users_queue_empty() -> bool:
    return r.llen(users_queue) == 0

def visited_user(user: str, ttl_seconds: int = 604800):  # 7 days
    key = f"visited_user:{user}"
    r.set(key, 1, ex=ttl_seconds)

def is_visited_user(user: str) -> bool:
    key = f"visited_user:{user}"
    return r.exists(key) == 1



def main(minutes =60): 
    URI = os.getenv("DB_URI")
    client = pymongo.MongoClient(URI)
    db = client[DB_NAME]
    trade_market = db['sleeper_trade_market']
    db = db[COLLECTION_NAME]
    end_time = time.time() + (minutes * 60)

    def transaction_in_db(transaction_id:str):
        return trade_market.count_documents({"_id": transaction_id}, limit=1) > 0
    def time_left():
        return time.time() < end_time
    
    def handleLeagueUsers(league_id):
        league_users = requests.get(f"https://api.sleeper.app/v1/league/{league_id}/users").json()
        for i in league_users:
            current_user = i['user_id']
            if is_visited_user(current_user):
                continue
            users_enque(current_user)

    def getLeagueTransactions(league_id):
        league_transactions = requests.get(f"https://api.sleeper.app/v1/league/{league_id}/transactions/{round}").json()
        transactions_for_league = []
        for i in league_transactions:
            transaction_id = i['transaction_id']
            if transaction_in_db(transaction_id) or transaction_in_db(transaction_id): continue
            if i['type']=='trade' and  not i['draft_picks'] and i['status'] =='complete' and i['adds']:
                #not getting trades in which players are traded for draft picks
                if(state['season'] == 'pre'):
                    if i['status_updated'] < transaction_offseason_filter_oldest:##will only get transactions completed after this time
                        continue
                result = defaultdict(list)
                for player, team in i['adds'].items():
                    player_info = db.find_one({"id":player})
                    result[team].append({"first_name":player_info['first_name'], "last_name": player_info['last_name'], "_id":player_info['id']})
                trades = list(result.values())
                if len(trades)< 2:
                    #not saving trades where players are getting traded for waiver budget
                    # print(f"league_id: {league_id}, transaction_id: {transaction_id}")
                    continue
                transactions_for_league.append({"_id":transaction_id, "status_updated":i['status_updated'], 'trades':trades})
        if transactions_for_league:
            trade_market.insert_many(transactions_for_league, ordered=False)

    while time_left():
        while not is_queue_empty() and time_left():
            current_league = leagues_pop()
            visited_league(current_league)
            getLeagueTransactions(current_league)
            sleep(.002)
            handleLeagueUsers(current_league)
        while not is_users_queue_empty() and time_left():
            current_user = users_pop()
            visited_user(current_user)
            user_leagues = requests.get(f'https://api.sleeper.app/v1/user/{current_user}/leagues/nba/{current_season}').json()
            for league in user_leagues:
                league_id = league['league_id']
                if is_visited_league(league_id):
                    continue
                leagues_enque(league_id) 
            sleep(.00015)

# if __name__ == '__main__':
#     parser = argparse.ArgumentParser()
#     parser.add_argument('--minutes', type=int, default=5, help='How many minutes to run the worker')
#     args = parser.parse_args()

#     main(args.minutes)
main()