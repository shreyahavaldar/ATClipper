import mariadb
import json
from collections import Counter
import mailbox
import re
from pathlib import Path

from tqdm import tqdm
from libratom.lib.pff import PffArchive
import threading
import time
import queue
import multiprocessing.pool
from threading import Thread, Lock

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
        sql = "Insert into mapping values (?,?,?)"
        try:
            self.cursor.execute(sql,(state,year,json.dumps(mapping)))
            self.connector.commit()
        except mariadb.Error as e:
            print(f"Error: {e}")

    def get_existing_mappings(self):
        sql = "select * from mapping"
        try:
            self.cursor.execute(sql)
            #self.connector.commit()
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

    class upload_worker(threading.Thread):
        def __init__(self, conn, cur,sql,my_queue,data):
            threading.Thread.__init__(self)
            self.conn = conn
            self.cur = cur
            self.q = my_queue
            self.data = data
            self.sql = sql

        def run(self):
            query_ids = []
            matches = []
            #print(len(self.data))
            #for each in self.data:
            #    print(each)
            self.cur.executemany(self.sql, self.data)
            #     for all in self.cur:
            #        matches += [all]
            #print(matches)
            #self.join()
            #self.q += matches

            self.conn.close()
            #return matches

    def parallel_upload(self,attorney_obj,Num_Of_threads):
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
                 "each['SecondaryInfo']")]

        def divide_chunks(l, n):
            # looping till length l
            for i in range(0, len(l), n):
                yield l[i:i + n]
        #print(len(Import_Obj.identifiers))
        data_list = list(divide_chunks(list(insert),int(len(insert)/Num_Of_threads)))
        my_queue = []
        threads = []
        for i in range(Num_Of_threads):
            conn = mariadb.connect(
                user=self.credentials['user'],
                password=self.credentials['password'],
                host=self.credentials['host'],
                database=self.credentials['database']
            )
            cur = conn.cursor()
            threads.append(self.upload_worker(conn, cur,sql,my_queue,data_list[i]))
        for each in threads:
            each.start()
        for each in threads:
            each.join()

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

        def load_pst(self,filename):

            mailbox_path = Path()
            print(mailbox_path.absolute())


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
            self.identifiers.add("clairemcconway@gmail.com")
            return report


    Num_Of_threads = 5





    class query_worker(threading.Thread):
        def __init__(self, conn, cur, my_queue,data,query_type = "email"):

            threading.Thread.__init__(self)
            self.conn = conn
            self.cur = cur
            self.q = my_queue
            self.data = data
            self.query_type = query_type

        def run(self):
            if(self.query_type == "email"):
                sql = "SELECT * from attorney where email1 = ? OR email2 = ?"
            else:
                sql = "SELECT * from attorney where phone1 = ? OR phone1 = ?"

            query_ids = []
            matches = []
            # print(len(self.data))

            for each in self.data:
                self.cur.execute(sql, tuple([each, each]))
                for all in self.cur:
                    matches += [all]
            # print(matches)
            # self.join()
            self.q += (matches)


            self.conn.close()
            # return matches





    def parallel_query(self,Import_Obj,num_threads):
        sql = "SELECT * from attorney where email1 = ? and email2 = ?"
        num_threads = min(len(Import_Obj.identifiers),num_threads)

        def divide_chunks(l, n):
            # looping till length l
            for i in range(0, len(l), n):
                yield l[i:i + n]
        print(len(Import_Obj.identifiers))
        data_list = list(divide_chunks(list(Import_Obj.identifiers),max(int(len(Import_Obj.identifiers)/num_threads),1)))
        my_queue = []
        threads = []
        for i in range(num_threads):

            conn = mariadb.connect(
                user=self.credentials['user'],
                password=self.credentials['password'],
                host=self.credentials['host'],
                database=self.credentials['database']
            )
            cur = conn.cursor()
            thread = self.query_worker(conn, cur,my_queue,data_list[i])
            thread.deamon = True
            threads.append(thread)

        for each in threads:
            each.start()
        for each in threads:
            each.join()



        return my_queue

