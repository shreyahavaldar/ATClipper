import pandas as pd
import tkinter as tk
from tkinter import filedialog
import json

# ------------ Temporary Frontend --------------
def getExcel():
    global dataframe
    import_file_path = filedialog.askopenfilename()
    dataframe = pd.read_excel(import_file_path)

def retrieve_input():
    global stateName
    stateName = StateName_Input.get("1.0","end-1c")
    root.destroy()

root= tk.Tk()
canvas = tk.Canvas(root, width = 400, height = 400, bg = 'lightsteelblue')
canvas.pack()

#Create Excel File Upload
browseButton_Excel = tk.Button(text='Import Excel File', command=getExcel, bg='green', fg='white', font=('helvetica', 12, 'bold'))
canvas.create_text(200, 20, fill="darkblue", text="Please Upload the Attorney Data File")
canvas.create_window(200, 50, window=browseButton_Excel)

#Create Statename Input
StateName_Input = tk.Text(root, height=1, width=5)
canvas.create_text(175, 250, fill="darkblue", text="Which State's Data is being Uploaded? (2 Letter Abbreviation)")
canvas.create_window(365, 250, window=StateName_Input)

processFileButton = tk.Button(text='Process File', command=retrieve_input, bg='green', fg='white', font=('helvetica', 12, 'bold'))
canvas.create_window(200, 290, window=processFileButton)

root.mainloop()


# ------------ Merging Functions --------------
def processAddress(columns, df):
    if(isinstance(columns, int)):
        return (dataframe.iloc[:, columns-1])
    else:
        addresses = []
        for x in range(len(dataframe)):
            address_temp = ""
            for c in columns:
                address_temp += str(dataframe.loc[x][c-1]).strip() + " "
            addresses.append(address_temp.strip())
        return addresses

def processName(columns, df):
    if(isinstance(columns, int)):
        return (dataframe.iloc[:, columns-1])
    else:
        names = []
        for x in range(len(dataframe)):
            name_temp = ""
            for c in columns:
                name_temp += str(dataframe.loc[x][c-1]).strip() + " "
            names.append(name_temp)
        return names

def secondaryInfoColumns(mapping, dataframe):
    length = len(dataframe.iloc[0])
    secInfo = []
    for i in range(1, length+1):
        contains = False
        for m in mapping.values():
            if(isinstance(m, int)):
                if(m == i):
                    contains = True
            else:
                if(i in m):
                    contains = True
        if(not contains):
                secInfo.append(i)
    return secInfo


#--------- DataFrame Creation -----------
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

barNumberIndexes = []
if(mapping["barNum"] != -1):
    for barNum in (dataframe.iloc[:, mapping["barNum"] - 1]):
        barNumberIndexes.append(stateName + "_" + str(barNum))
else:
    for i in range(len(dataframe)):
        barNumberIndexes.append("NA")

datesOfAdmission = []
if(mapping["dateOfAdmission"] != -1):
    for x in (dataframe.iloc[:, mapping["dateOfAdmission"] - 1]):
        datesOfAdmission.append(str(x).strip())
else:
    for i in range(len(dataframe)):
        datesOfAdmission.append("NA")

names = []
if(mapping["name"] != -1):
    names = processName(mapping["name"], dataframe)
else:
    for i in range(len(dataframe)):
        names.append("NA")

phones1 = []
if(mapping["phone1"] != -1):
    for x in (dataframe.iloc[:, mapping["phone1"] - 1]):
        phones1.append(str(x).strip())
else:
    for i in range(len(dataframe)):
        phones1.append("NA")

phones2 = []
if(mapping["phone2"] != -1):
    for x in (dataframe.iloc[:, mapping["phone2"] - 1]):
        phones2.append(str(x).strip())
else:
    for i in range(len(dataframe)):
        phones2.append("NA")

emails1 = []
if(mapping["email1"] != -1):
    for x in (dataframe.iloc[:, mapping["email1"] - 1]):
        emails1.append(str(x).strip())
else:
    for i in range(len(dataframe)):
        emails1.append("NA")

emails2 = []
if(mapping["email2"] != -1):
    for x in (dataframe.iloc[:, mapping["email2"] - 1]):
        emails2.append(str(x).strip())
else:
    for i in range(len(dataframe)):
        emails2.append("NA")

addresses1 = []
if(mapping["address1"] != -1):
    addresses1 = processAddress(mapping["address1"], dataframe)
else:
    for i in range(len(dataframe)):
        addresses1.append("NA")

addresses2 = []
if(mapping["address2"] != -1):
    addresses2 = processAddress(mapping["address2"], dataframe)
else:
    for i in range(len(dataframe)):
        addresses2.append("NA")

firms = []
if(mapping["firm"] != -1):
    for x in (dataframe.iloc[:, mapping["firm"] - 1]):
        firms.append(str(x).strip())
else:
    for i in range(len(dataframe)):
        firms.append("NA")

faxes = []
if(mapping["fax"] != -1):
    for x in (dataframe.iloc[:, mapping["fax"] - 1]):
        faxes.append(str(x).strip())
else:
    for i in range(len(dataframe)):
        faxes.append("NA")

licenses = []
if(mapping["license"] != -1):
    for x in (dataframe.iloc[:, mapping["license"] - 1]):
        licenses.append(str(x).strip())
else:
    for i in range(len(dataframe)):
        licenses.append("NA")

statuses = []
if(mapping["status"] != -1):
    for x in (dataframe.iloc[:, mapping["status"] - 1]):
        statuses.append(str(x).strip())
else:
    for i in range(len(dataframe)):
        statuses.append("NA")


secInfoColumns = secondaryInfoColumns(mapping, dataframe)
secondaryInfo = []
if(len(secInfoColumns) != 0):
    for x in range(len(dataframe)):
        secinfo_temp = ""
        for c in secInfoColumns:
            secinfo_temp += dataframe.columns[c-1] + ": " + str(dataframe.loc[x][c-1]).strip() + ", "
        secondaryInfo.append(secinfo_temp[:-2])
else:
    for i in range(len(dataframe)):
        secondaryInfo.append("NA")


#-------------JSON Creation-------------
class Attorney:
    def __init__(self, BarNumberIndex, DateOfAdmission, Name, Phone1, Phone2, Email1, Email2, Address1, Address2, Firm, Fax, License, Status, SecondaryInfo):
        self.BarNumberIndex = BarNumberIndex
        self.DateOfAdmission = DateOfAdmission
        self.Name = Name
        self.Phone1 = Phone1
        self.Phone2 = Phone2
        self.Email1 = Email1
        self.Email2 = Email2
        self.Address1 = Address1
        self.Address2 = Address2
        self.Firm = Firm
        self.Fax = Fax
        self.License = License
        self.Status = Status
        self.SecondaryInfo = SecondaryInfo

def obj_dict(obj):
    return obj.__dict__

Attorneys = []
for i in range(len(dataframe)):
    temp = Attorney(barNumberIndexes[i], datesOfAdmission[i], names[i], phones1[i], phones2[i], emails1[i], emails2[i], addresses1[i], addresses2[i], firms[i], faxes[i], licenses[i], statuses[i], secondaryInfo[i])
    Attorneys.append(temp)

json_string = json.dumps(Attorneys, default=obj_dict)

with open('AttorneyObjects.json', 'w', encoding="utf8") as outfile:
    outfile.write(json_string)
temp = open('AttorneyObjects.json')
data = json.load(temp)
with open("AttorneyObjects.json", 'w') as outfile:
    json.dump(data, outfile, indent = 4)
