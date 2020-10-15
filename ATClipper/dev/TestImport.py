import mailbox
from functools import reduce
from collections import Counter
import pypff
import subprocess
#dependency: pst-utils
#sudo apt install pst-utils

import os
import sys
import argparse
import logging
import jinja2

import pypff


import ATClipperTest

from collections import Counter

def load_mbox(filename):
    box = mailbox.mbox(filename)

    set_from = Counter()
    set_to = Counter()

    for message in box:
        if(message['from']):
            email_from = message['from'][message['from'].find("<")+1:message['from'].find(">")]
            set_from[email_from] += 1
        if (message['to']):
            email_to = message['to'][message['to'].find("<")+1:message['to'].find(">")]
            set_to[email_to] += 1

    print(len(set_to))
    print(len(set_from))
    #print(set(reduce(lambda a,b: a+b,set_to)))
    print(set_from)

    return set_from,set_to,box

#"All mail Including Spam and Trash.mbox"

#(set_from,set_to),box = load_mbox()

def load_pst():

    subprocess.call(['readpst','-D','-b','sample.pst'])

    load_mbox('../../Sample_files/myInbox.mbox')



print(load_pst())