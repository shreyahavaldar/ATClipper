import ATClipper
import time
ATClipperObj = ATClipper.ATClipper('credentials.json')

#ATClipperObj.upload("../AttorneyObjects.json")

importer = ATClipperObj.Import('today','tomorrow')

#importer.load_mbox('myInbox.mbox')
importer.load_pst("sample2.pst")
print(importer.identifiers)
start = time.time()

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

num_workers = 15
matches2 = ATClipperObj.parallel_query(importer,num_workers)
print("Parallel query with " + str(num_workers)+" workers took: " + str(time.time()- start))
print("Parallel matches" + str(matches2))
start = time.time()
print("====================")

num_workers = 30
matches2 = ATClipperObj.parallel_query(importer,num_workers)
print("Parallel query with " + str(num_workers)+" workers took: " + str(time.time()- start))
print("Parallel matches " + str(matches2))
start = time.time()
print("====================")



#ATClipperObj.resetdb()