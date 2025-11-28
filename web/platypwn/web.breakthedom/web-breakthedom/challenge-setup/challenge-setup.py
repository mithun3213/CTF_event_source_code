import requests
import datetime
import zipfile
from bs4 import BeautifulSoup
from os import environ
from time import sleep

BASE_URL = "http://domserver:80"
JURY_BASE_URL = f"{BASE_URL}/jury"
API_BASE_URL = f"{BASE_URL}/api"

ADMIN_AUTH = ("admin", environ["ADMIN_PASSWORD"])

PROBLEM_STATEMENT = f"""Hope this problem statement is only published once the competition has started!
{environ['FLAG']}
"""

PROBLEM_YAML = """type: pass-fail
name:
  en: highly-secret-problem
uuid: 8ee7605a-5f3f-8557-0ba0-caefe9ca74ad
credits: jogius
source:
  name: Platypwn
  url: https://platypwnies.de
license: cc by-sa
rights_owner: Platypwnies

validation: default
"""


def login():
    session = requests.Session()

    # Get the login page to obtain the CSRF token
    login_url = f"{BASE_URL}/login"
    response = session.get(login_url)
    response.raise_for_status()

    # Parse the HTML to find the CSRF token
    soup = BeautifulSoup(response.text, 'html.parser')
    csrf_input = soup.find('input', {'name': '_csrf_token'})
    if not csrf_input or 'value' not in csrf_input.attrs:
        raise ValueError("CSRF token not found on the login page.")
    csrf_token = csrf_input['value']

    # Prepare the data for the POST request
    login_data = {
        '_csrf_token': csrf_token,
        '_username': ADMIN_AUTH[0],
        '_password': ADMIN_AUTH[1]
    }

    # Send the POST request to log in
    login_response = session.post(
        login_url, data=login_data)
    login_response.raise_for_status()

    session_cookies = session.cookies.get_dict()
    session_id = session_cookies.get('PHPSESSID')

    if not session_id:
        raise ValueError("Login failed: could not retrieve session ID.")

    return session


def create_problem_zip():
    with zipfile.ZipFile('problem.zip', 'w') as zipf:
        zipf.writestr('problem.txt', PROBLEM_STATEMENT)
        zipf.writestr('problem.yaml', PROBLEM_YAML)


def get_contest_yaml(name):
    activate_time = datetime.datetime.now(datetime.timezone.utc).replace(
        microsecond=0) - datetime.timedelta(hours=1)
    start_time = datetime.datetime.now(datetime.timezone.utc).replace(
        microsecond=0) + datetime.timedelta(days=3)
    end_time = start_time + datetime.timedelta(hours=5)

    return f"""id: {name}
formal_name: {name}
name: {name}
start_time: '{start_time.isoformat()}'
end_time: '{end_time.isoformat()}'
duration: '5:00:00.000'
activate_time: '{activate_time.isoformat()}'
"""


def create_contest():
    contest_name = "Competitive Competition"
    with requests.Session() as session:
        session.auth = ADMIN_AUTH
        res = session.post(f"{API_BASE_URL}/contests", files=dict(
            yaml=(f"{contest_name}.yaml", get_contest_yaml(contest_name))))
        res.raise_for_status()
        return res.json()


def add_problem(cid, problem_name, problem_zip):
    with requests.Session() as session:
        session.auth = ADMIN_AUTH
        res = session.post(f"{API_BASE_URL}/contests/{cid}/problems",
                           files=dict(zip=(f"{problem_name}.zip", open(problem_zip, "rb"))))
        res.raise_for_status()
        return res.json()


def add_self_registration_category(session):
    data = {
        "team_category[name]": "Platypwn User",
        "team_category[sortorder]": "0",
        "team_category[color]": "",
        "team_category[visible]": "1",
        "team_category[allow_self_registration]": "1",
        "team_category[save]": ""
    }

    res = session.post(
        f"{JURY_BASE_URL}/categories/add",
        data=data
    )
    res.raise_for_status()


def wait_for_domjudge():
    sleep(5)
    with requests.Session() as session:
        session.auth = ADMIN_AUTH
        while True:
            try:
                res = session.get(f"{API_BASE_URL}/status")
                if res.status_code == 200:
                    break
                else:
                    raise ConnectionError
            except:
                print("Waiting for domserver startup ...", flush=True)
                sleep(1)


wait_for_domjudge()
cid = create_contest()
create_problem_zip()
add_problem(cid, "Highly secret problem", "problem.zip")

session = login()
add_self_registration_category(session)
print("Setup done!", flush=True)
