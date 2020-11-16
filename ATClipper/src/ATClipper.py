import mariadb
import json
from collections import Counter
import mailbox
import re
from pathlib import Path
from libratom.lib.pff import PffArchive
import threading
import queue
from datetime import datetime
import pandas as pd
import copy


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
        self.numthreads = 0

    def resetdb(self):
        self.cursor.callproc("resetdb")
        self.cursor.callproc("createtable")

    def upload_mapping(self,state,year,mapping):
        sql = "replace into mapping values (?,?,?)"
        try:
            self.cursor.execute(sql,(state,year,json.dumps(mapping)))
            self.connector.commit()
        except mariadb.Error as e:
            print(f"Error: {e}")

    def get_existing_mappings(self):
        sql = "select * from mapping"
        try:
            self.cursor.execute(sql)
        except mariadb.Error as e:
            print(f"Error: {e}")
        result = []
        for each in self.cursor:
            result += each[0:2]
        if(result != []):
            return result
        return -1

    def get_mapping(self,state,year):
        sql = "select * from mapping where state = ? and year = ?"
        try:
            self.cursor.execute(sql,(state,year))
            #self.connector.commit()
        except mariadb.Error as e:
            print(f"Error: {e}")
        result = 0
        for each in self.cursor:
            result = each
        if(result != 0):
            return result[2]
        return -1


    def upload_attorneys(self,attorney_obj):
        sql = "Insert into attorney values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
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
        try:
            self.cursor.executemany(sql,insert)

        except mariadb.Error as e:
            print(f"Error: {e}")

    class upload_worker(threading.Thread):
        def __init__(self, conn, cur,sql,my_queue,data):
            threading.Thread.__init__(self)
            self.conn = conn
            self.cur = cur
            self.q = my_queue
            self.data = data
            self.sql = sql

        def run(self):
            self.cur.executemany(self.sql, self.data)
            self.conn.close()

    def parallel_upload(self,attorney_obj,Num_Of_threads):
        sql = "replace into attorney values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
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
                 str(each['SecondaryInfo']))]

        def divide_chunks(l, n):
            # looping till length l
            for i in range(0, len(l), n):
                yield l[i:i + n]
        data_list = list(divide_chunks(list(insert),max(int(len(insert)/Num_Of_threads),1)))
        my_queue = []
        threads = []
        for chunk in data_list:
            conn = mariadb.connect(
                user=self.credentials['user'],
                password=self.credentials['password'],
                host=self.credentials['host'],
                database=self.credentials['database']
            )
            cur = conn.cursor()
            threads.append(self.upload_worker(conn, cur,sql,my_queue,chunk))
        for each in threads:
            each.start()
        for each in threads:
            each.join()
        return len(insert)

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

    class Result:
        def __init__(self,queried_identifiers,scope_start,scope_end,matches):
            self.queried_identifiers = queried_identifiers
            self.scope_start = scope_start
            self.scope_end = scope_end
            self.matches = matches

        def export(self,exclude = None,columns = None):
            headers = ["bar_number_index"
                    ,"bar_number"
                    ,"name"
                    ,"doa"
                    ,"phone1"
                    ,"phone2"
                    ,"email1"
                    ,"email2"
                    ,"address1"
                    ,"address2"
                    ,"firm"
                    ,"fax"
                    ,"license"
                    ,"status"
                    ,"state"
                    ,"secondary_info","time_inserted","time_superseded"]

            cols_to_export = copy.copy(headers)
            if exclude != None:
                for each in exclude:
                    cols_to_export.remove(each)

            print(cols_to_export)
            print(pd.DataFrame(self.matches,columns=headers)[cols_to_export])



    class Import:
        def __init__(self):
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

        def load_pst(self,filename):

            mailbox_path = Path()


            report = {'Files': 0, 'Messages': 0, 'Attachments': 0, 'Size': 0, 'Errors': 0}

            # Start displaying results
            files = sorted(mailbox_path.glob(filename))
            identifier_set = Counter()
            # Iterate over files
            for pst_file in files:
                try:
                    # Iterate over messages
                    with PffArchive(pst_file) as archive:

                        for message in archive.messages():
                            try:

                                identifiers = re.findall("<[^<>]*@{1}[^<>]*>",message.transport_headers)
                                for each in identifiers:
                                    identifier_set[each[1:-1]] += 1
                                # Update report
                                report['Messages'] += 1
                                report['Attachments'] += message.number_of_attachments

                            except Exception as exc:
                                # Log error and move on to the next message
                                report['Errors'] += 1

                except Exception as exc:
                    # Log error and move on to the next file
                    report['Errors'] += 1

                # Update report
                report['Files'] += 1
                report['Size'] += pst_file.stat().st_size

            self.identifiers = set(identifier_set.keys())
            self.identifiers.add("daroncase@aol.com")
            return report


    Num_Of_threads = 5





    class query_worker(threading.Thread):
        def __init__(self, conn, cur, my_queue,data,sql):
            threading.Thread.__init__(self)
            self.conn = conn
            self.cur = cur
            self.q = my_queue
            self.data = data
            self.sql = sql

        def run(self):


            for each in self.data:
                self.cur.execute(self.sql, tuple([each, each]))
                for all in self.cur:
                    self.q.put(all)
            self.conn.close()




    def parallel_query(self,Import_Obj,time_start, time_end,num_threads=50,query_type = "email"):
        num_threads = min(len(Import_Obj.identifiers),num_threads)
        time_start = datetime.strptime(time_start, '%d/%m/%y')
        time_end = datetime.strptime(time_end, '%d/%m/%y')
        print(time_start,time_end)

        if (query_type == "email"):
            sql = "SELECT *,Row_Start,Row_end from dev.attorney FOR SYSTEM_TIME BETWEEN '" + str(time_start) + "' and '" + str(time_end) + "' where dev.attorney.email1 = ? OR dev.attorney.email1 = ?"
        else:
            sql = "SELECT * from dev.attorney where phone1 = ? OR phone1 = ?"# between = " #+ time_start+ "and" + time_end"

        print(sql)
        def divide_chunks(l, n):
            # looping till length l
            for i in range(0, len(l), n):
                yield l[i:i + n]
        data_list = list(divide_chunks(list(Import_Obj.identifiers),max(int(len(Import_Obj.identifiers)/num_threads),1)))
        my_queue = queue.Queue()
        threads = []
        for i in range(num_threads):
            conn = mariadb.connect(
                user=self.credentials['user'],
                password=self.credentials['password'],
                host=self.credentials['host'],
                database=self.credentials['database']
            )
            cur = conn.cursor()
            thread = self.query_worker(conn, cur,my_queue,data_list[i],sql)
            thread.deamon = True
            threads.append(thread)
        for each in threads:
            each.start()
        for each in threads:
            each.join()
        return self.Result(Import_Obj.identifiers,str(time_start),str(time_end),list(my_queue.queue))
