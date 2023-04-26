###########
# scrape_conferences/scraper.py
# Written by: Bailey Wimer
# Last Updated: 4/25/2023
#
# Derived from the previous (monolithic) version of this application 
# Scrapes http://www.wikicfp.com for conferences of a specific category
# Filters out conferences whose call for papers (CFPs) are expired or past 
#

import requests
from bs4 import BeautifulSoup
import json

def get_conferences(category):
    conferenceList = []
    for i in range(1, 21):
        # Fetches the first page of the list of conferences
        r = requests.get(f'http://www.wikicfp.com/cfp/call?conference={category}&page={i}')

        # Parses the previously fetched html
        soup = BeautifulSoup(r.content, 'html.parser')

        # find the div containing the page contents
        div = soup.find('div', class_ = 'contsec')

        # Find a list of all rows containing conference information
        ## Note: Each conference is spread across 2 rows
        table = div.findChild("table").findChildren('tr', recursive=False)[2]
        conference_html = table.findChild("table").findChildren('tr', recursive=False)

        filtered_conference_html = []

        # filters out any non-conference items, as well as expired CFPs
        for x in range(len(conference_html)):
            bgcolor = conference_html[x].attrs.get('bgcolor')
            if bgcolor == '#e6e6e6' or bgcolor == '#f6f6f6':
                filtered_conference_html.append(conference_html[x])
                continue
            if conference_html[x].findChild('td').text == "Expired CFPs":
                break


        # parses every other row of the table
        for conf in range(0, len(filtered_conference_html), 2):
            row1_columns = filtered_conference_html[conf].findChildren('td')
            row2_columns = filtered_conference_html[conf + 1].findChildren('td')
            currentConference = {'name': row1_columns[0].text, 
                                'link': 'http://www.wikicfp.com' + row1_columns[0].findChild('a').get('href'),
                                'location': row2_columns[1].text,
                                'deadline': row2_columns[2].text,
                                'category': category}
            conferenceList.append(currentConference)
    return conferenceList

if __name__ == '__main__':
    conferences = get_conferences('AI')
    for conference in conferences:
        print(conference)