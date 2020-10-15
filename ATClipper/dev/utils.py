credentials = {'user':"atclipper@atclipperdev",
    'password':"Capstone90007",
    'host':"atclipperdev.mariadb.database.azure.com",
    'database':"dev"}


with open('../src/credentials.json', 'w') as fp:
    json.dump(credentials, fp)