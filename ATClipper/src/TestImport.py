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
import libratom

import pypff

import re

import logging
from pathlib import Path

import humanfriendly
import ipywidgets as widgets
import pandas as pd
from IPython.display import display
from tqdm import tqdm

from libratom.lib.pff import PffArchive



import ATClipper

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

def load_pst(filename):

    mailbox_path = Path("..")
    print(mailbox_path.absolute())


    report = {'Files': 0, 'Messages': 0, 'Attachments': 0, 'Size': 0, 'Errors': 0}

    # Start displaying results
    print(sorted(mailbox_path.glob("*")))
    files = sorted(mailbox_path.glob('**/' + filename))
    print(files)
    identifier_set = Counter()
    # Iterate over files
    with tqdm(total=len(files), desc="Files read", unit="files", leave=True) as file_bar:
        for pst_file in files:
            try:
                # Iterate over messages

                with PffArchive(pst_file) as archive:
                    print(archive)
                    for message in archive.messages():
                        try:
                            # Do something with the message...

                            emails = re.findall("<[^<>]*@{1}[^<>]*>",message.transport_headers)
                            for each in emails:
                                identifier_set[each[1:-1]] += 1
                            print()
                            # Update report
                            report['Messages'] += 1
                            report['Attachments'] += message.number_of_attachments

                            # Refresh report widget every 100 messages


                        except Exception as exc:
                            # Log error and move on to the next message
                            report['Errors'] += 1

            except Exception as exc:
                # Log error and move on to the next file
                print(exc)
                print("except")
                report['Errors'] += 1

            # Update report
            report['Files'] += 1
            report['Size'] += pst_file.stat().st_size
    return report
            # Refresh report widget


print(load_pst('sample2.pst'))