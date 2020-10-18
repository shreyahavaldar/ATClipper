import mariadb
import json
from collections import Counter
import mailbox

class ATClipper():
    def __init__(self, db_credentials):
        self.data = []
        with open(db_credentials) as creds:
            self.credentials = json.load(creds)
        self.connector = mariadb.connect(
            user=self.credentials['user'],
            password=self.credentials['password'],
            host=self.credentials['host'],
            database=self.credentials['database']
        )
        self.cursor = self.connector.cursor()
    def upload(self,attorney_obj):
        sql = "Insert into attorney values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
        data = []
        insert = []
        with open(attorney_obj) as data:
           attorneys = json.load(data)
        for each in attorneys:
            insert += [
                (each['BarNumberIndex'].lstrip().rstrip().replace("'", ""),
                each['BarNumberIndex'].lstrip().rstrip().replace("'", "")[3:],
                each['Name'].lstrip().rstrip().replace("'", ""),
                each['DateOfAdmission'].lstrip().rstrip().replace("'", ""),
                each['Phone1'].lstrip().rstrip().replace("'", ""),
                each['Phone2'].lstrip().rstrip().replace("'", ""),
                each['Email1'].lstrip().rstrip().replace("'", ""),
                each['Email2'].lstrip().rstrip().replace("'", ""),
                each['Address1'].lstrip().rstrip().replace("'", ""),
                each['Address2'].lstrip().rstrip().replace("'", ""),
                each['Firm'].lstrip().rstrip().replace("'", ""),
                each['Fax'].lstrip().rstrip().replace("'", ""),
                each['License'].lstrip().rstrip().replace("'", ""),
                each['Status'].lstrip().rstrip().replace("'", ""),
                each['BarNumberIndex'][0:2].lstrip().rstrip().replace("'", ""),
                each['SecondaryInfo'])]
        print(insert)
        try:
            self.cursor.executemany(sql,insert)

        #self.connector.commit()
        except mariadb.Error as e:
            print(f"Error: {e}")

    def query(self,Import_Obj):
        sql = "SELECT * from attorney where email1 = ? OR email2 = ?"
        query_ids = []
        matches = []
        for each in Import_Obj.identifiers:
            #print(each)
            self.cursor.execute(sql, tuple([each,each]))
            for all in self.cursor:
                matches += [all]

        return matches

    class Import:
        def __init__(self, scope_start,scope_end):
           self.scope_start = scope_start
           self.scope_end = scope_end
           self.identifiers = []
           self.corpus = []

        def load_mbox(self,mbox_filepath):
            box = mailbox.mbox(mbox_filepath)

            set_from = Counter()
            set_to = Counter()

            for message in box:
                if (message['from']):
                    email_from = message['from'][message['from'].find("<") + 1:message['from'].find(">")]
                    set_from[email_from] += 1
                if (message['to']):
                    email_to = message['to'][message['to'].find("<") + 1:message['to'].find(">")]
                    set_to[email_to] += 1

            set_from = set(set_from.keys())
            set_to = set(set_to.keys())
            self.identifiers = set_from.union(set_to)
            self.corpus = box
            #return set_from.union(set_to), box
