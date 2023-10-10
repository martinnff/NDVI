import json
import os
import webbrowser

import requests

text_search = 'Monforte de Lemos'

def use_requests(text_search):
    api_url = 'http://192.168.0.5:8080/search?q={}'.format(text_search)
    response = requests.get(api_url)
    json_response = json.loads(response.text)
    return((json_response[0]["lat"],json_response[0]["lon"]))

out = use_requests(text_search)

print(out)