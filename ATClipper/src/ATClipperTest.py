import ATClipper
import time
ATClipperObj = ATClipper.ATClipper('credentials.json')
#ATClipperObj.resetdb()
start = time.time()

#ATClipperObj.parallel_upload("AttorneyObjects.json",1)
print("Parallel Upload with " + str(50)+" workers took: " + str(time.time()- start))

# mapping = {
#   "barNum": 1,
#   "dateOfAdmission" : 2,
#   "name" : [5, 4],
#   "phone1" : 15,
#   "phone2" : -1,
#   "email1" : 17,
#   "email2" : -1,
#   "address1" : [7,8,9,10,11,12],
#   "address2" : -1,
#   "firm" : 18,
#   "fax" : 16,
#   "license" : -1,
#   "status" : 6
# }

#ATClipperObj.upload_mapping("CA",2020,mapping)
#print(ATClipperObj.get_mapping("CA","2020"))
#print(ATClipperObj.get_existing_mappings())

importer = ATClipperObj.Import()

importer.load_mbox('/home/jcfdz/PycharmProjects/ATClipper-Fix/Sample_files/myInbox.mbox')

start = time.time()
#
# start = time.time()
# matches = ATClipperObj.query(importer)
# print("Single worker query took: " + str(time.time()- start))
#
# print("Single worker query matches" + str(matches))
# start = time.time()
# print("====================")
times = []

# for num_workers in range(50,100,10):
start = time.time()
matches2 = ATClipperObj.parallel_query(importer,"11/11/20","11/12/20",state="CA",num_threads=50)
print(matches2.matches)
times += [time.time() - start]
print("Parallel query with " + str(50)+" workers took: " + str(time.time()- start))
print("Parallel matches" + str(matches2))
matches2.export(exclude = ['state'])
'''
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
#
# start = time.time()
# matches = ATClipperObj.query(importer)
# print("Single worker query took: " + str(time.time()- start))
#
# print("Single worker query matches" + str(matches))
# start = time.time()
# print("====================")
#
# num_workers = 5
# matches2 = ATClipperObj.parallel_query(importer,num_workers)
# print("Parallel query with " + str(num_workers)+" workers took: " + str(time.time()- start))
# print("Parallel matches" + str(matches2))
# start = time.time()
# print("====================")
#
# num_workers = 10
# matches2 = ATClipperObj.parallel_query(importer,num_workers)
# print("Parallel query with " + str(num_workers)+" workers took: " + str(time.time()- start))
# print("Parallel matches" + str(matches2))
# start = time.time()
# print("====================")
#
# num_workers = 15
# matches2 = ATClipperObj.parallel_query(importer,num_workers)
# print("Parallel query with " + str(num_workers)+" workers took: " + str(time.time()- start))
# print("Parallel matches" + str(matches2))
# start = time.time()
# print("====================")
#
# num_workers = 30
# matches2 = ATClipperObj.parallel_query(importer,num_workers)
# print("Parallel query with " + str(num_workers)+" workers took: " + str(time.time()- start))
# print("Parallel matches " + str(matches2))
# start = time.time()
# print("====================")



#ATClipperObj.resetdb()