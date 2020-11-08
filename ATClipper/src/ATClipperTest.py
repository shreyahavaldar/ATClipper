import ATClipper
import time
ATClipperObj = ATClipper.ATClipper('credentials.json')
ATClipperObj.resetdb()
ATClipperObj.parallel_upload("AttorneyObjects_small.json",50)
mapping = {
  "barNum": 1,
  "dateOfAdmission" : 2,
  "name" : [5, 4],
  "phone1" : 15,
  "phone2" : -1,
  "email1" : 17,
  "email2" : -1,
  "address1" : [7,8,9,10,11,12],
  "address2" : -1,
  "firm" : 18,
  "fax" : 16,
  "license" : -1,
  "status" : 6
}

#ATClipperObj.upload_mapping("CA",2020,mapping)
#print(ATClipperObj.get_mapping("CA","2020"))
#print(ATClipperObj.get_existing_mappings())

importer = ATClipperObj.Import('today','tomorrow')

#importer.load_mbox('myInbox.mbox')
importer.load_pst("sample2.pst")
print(importer.identifiers)
start = time.time()
'''
start = time.time()
matches = ATClipperObj.query(importer)
print("Single worker query took: " + str(time.time()- start))

print("Single worker query matches" + str(matches))
start = time.time()
print("====================")

num_workers = 5
matches2 = ATClipperObj.parallel_query(importer,num_workers)
print("Parallel query with " + str(num_workers)+" workers took: " + str(time.time()- start))
print("Parallel matches" + str(matches2))
start = time.time()
print("====================")

num_workers = 10
matches2 = ATClipperObj.parallel_query(importer,num_workers)
print("Parallel query with " + str(num_workers)+" workers took: " + str(time.time()- start))
print("Parallel matches" + str(matches2))
start = time.time()
print("====================")

num_workers = 10
matches2 = ATClipperObj.parallel_query(importer,num_workers)
print("Parallel query with " + str(num_workers)+" workers took: " + str(time.time()- start))
print("Parallel matches" + str(matches2))
start = time.time()
print("====================")

#num_workers = 30
matches2 = ATClipperObj.parallel_query(importer,num_workers)
print("Parallel query with " + str(num_workers)+" workers took: " + str(time.time()- start))
print("Parallel matches " + str(matches2))
start = time.time()
print("====================")


'''
#ATClipperObj.resetdb()