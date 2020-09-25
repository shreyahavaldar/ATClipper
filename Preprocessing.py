# ASK DON:
# will all attorneys be from the state we get the data from?
# what specific attributes are we uploading? (must be persistent across all states)
# how much error checking

import pandas as pd
import tkinter as tk
from tkinter import filedialog
import json

def getExcel():
    global dataframe
    import_file_path = filedialog.askopenfilename()
    dataframe = pd.read_excel(import_file_path)

def retrieve_input():
    # global barNum
    # global fName
    # global lName
    # global phone
    # global email
    global stateName

    # barNum = BarNumber_Input.get("1.0","end-1c")
    # print(barNum)
    # fName = FirstName_Input.get("1.0","end-1c")
    # print(fName)
    # lName = LastName_Input.get("1.0","end-1c")
    # print(lName)
    # phone = PhoneNumber_Input.get("1.0","end-1c")
    # print(phone)
    # email = Email_Input.get("1.0","end-1c")
    # print(email)
    stateName = StateName_Input.get("1.0","end-1c")
    root.destroy()


root= tk.Tk()
canvas = tk.Canvas(root, width = 400, height = 400, bg = 'lightsteelblue')
canvas.pack()
#Create Excel File Upload
browseButton_Excel = tk.Button(text='Import Excel File', command=getExcel, bg='green', fg='white', font=('helvetica', 12, 'bold'))
canvas.create_text(200, 20, fill="darkblue", text="Please Upload the Attorney Data File")
canvas.create_window(200, 50, window=browseButton_Excel)
# #Create Bar Number Input
# BarNumber_Input = tk.Text(root, height=1, width=5)
# canvas.create_text(150, 100, fill="darkblue", text="What Column Contains the Bar Number?")
# canvas.create_window(300, 100, window=BarNumber_Input)
# #Create First Name Input
# FirstName_Input = tk.Text(root, height=1, width=5)
# canvas.create_text(150, 130, fill="darkblue", text="What Column Contains the First Name?")
# canvas.create_window(300, 130, window=FirstName_Input)
# #Create Last Name Input
# LastName_Input = tk.Text(root, height=1, width=5)
# canvas.create_text(150, 160, fill="darkblue", text="What Column Contains the Last Name?")
# canvas.create_window(300, 160, window=LastName_Input)
# #Create Phone Input
# PhoneNumber_Input = tk.Text(root, height=1, width=5)
# canvas.create_text(150, 190, fill="darkblue", text="What Column Contains the Phone Number?")
# canvas.create_window(300, 190, window=PhoneNumber_Input)
# #Create Email Input
# Email_Input = tk.Text(root, height=1, width=5)
# canvas.create_text(150, 220, fill="darkblue", text="What Column Contains the Email?")
# canvas.create_window(300, 220, window=Email_Input)

#Create Statename Input
StateName_Input = tk.Text(root, height=1, width=5)
canvas.create_text(175, 250, fill="darkblue", text="Which State's Data is being Uploaded? (2 Letter Abbreviation)")
canvas.create_window(365, 250, window=StateName_Input)

processFileButton = tk.Button(text='Process File', command=retrieve_input, bg='green', fg='white', font=('helvetica', 12, 'bold'))
canvas.create_window(200, 290, window=processFileButton)

root.mainloop()

#---------DataFrame Creation-----------
mapping = {
  "barNum": 1,
  "dateOfAdmission" : 2,
  "name" : 3,
  "fName": 4,
  "lName": 5,
  "status" : 6,
  "address1" : 7,
  "address2" : 8,
  "city" : 9,
  "state" : 10,
  "zipCode" : 11,
  "zipCode4" : 12,
  "district" : 13,
  "county" : 14,
  "phone" : 15,
  "fax" : 16,
  "email" : 17,
  "lawFirm" : 18,
  "lawSchool" : 19
}

try:
    barNumberIndexes = []
    for barNum in (dataframe.iloc[:, mapping["barNum"] - 1]):
        barNumberIndexes.append(stateName + "_" + str(barNum))

    firstNames = []
    for x in (dataframe.iloc[:, mapping["fName"] - 1]):
        firstNames.append(x.strip())

    lastNames = []
    for x in (dataframe.iloc[:, mapping["lName"] - 1]):
        lastNames.append(x.strip())

    phoneNumbers = []
    for x in (dataframe.iloc[:, mapping["phone"] - 1]):
        phoneNumbers.append(str(x))

    emails = []
    for x in (dataframe.iloc[:, mapping["email"] - 1]):
        emails.append(str(x).strip())
except(Exception e):
    print("Error while pulling data from excel file")

secondaryInfo = []
for x in range(len(dataframe)):
    list = dataframe.iloc[x].values.flatten().tolist()
    list_formatted = []
    for l in list:
        list_formatted.append(str(l).strip())
    secondaryInfo.append(str(list_formatted))

#-------------JSON Creation-------------
class Attorney:
    def __init__(self, BarNumberIndex, FirstName, LastName, Phone, Email, SecondaryInfo):
        self.BarNumberIndex = BarNumberIndex
        self.FirstName = FirstName
        self.LastName = LastName
        self.Phone = Phone
        self.Email = Email
        self.SecondaryInfo = SecondaryInfo

def obj_dict(obj):
    return obj.__dict__

Attorneys = []
for i in range(len(barNumberIndexes)):
    temp = Attorney(barNumberIndexes[i], firstNames[i], lastNames[i], phoneNumbers[i], emails[i], secondaryInfo[i])
    Attorneys.append(temp)

json_string = json.dumps(Attorneys, default=obj_dict)

with open('AttorneyObjects.json', 'w', encoding="utf8") as outfile:
    outfile.write(json_string)
temp = open('AttorneyObjects.json')
data = json.load(temp)
with open("AttorneyObjects.json", 'w') as outfile:
    json.dump(data, outfile, indent = 4)
