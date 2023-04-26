###########
# scrape_conferences/app.py
# Written by: Bailey Wimer
# Last Updated: 4/25/2023
#
# Flask wrapper for scraper.py to get a list of conferences by category
#

from flask import Flask, request
import scraper

app = Flask(__name__)

# Defines the 'conferences' API endpoint which accepts GET requests
#
# Expects: a category as a request argument
@app.route('/conferences', methods=['GET'])
def conferences():
    category = request.args.get('category')                         # Parses the category from the arguments
    conference_list = scraper.get_conferences(category=category)    # calls scraper.py to find conferences
    return {'conferences': conference_list}                         # returns the list of conferences

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8082)                              # Sets host to 0.0.0.0 for docker binding