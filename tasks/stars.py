import socket
import numpy as np
import matplotlib.pyplot as plt
from math import sqrt


host = "84.237.21.36"
port = 5152


def recvall(sock, n):
    data = bytearray()
    while len(data) < n:
        packet = sock.recv(n - len(data))
        if not packet:
            return None
        data.extend(packet)
    return data


def checkSquare(col, row, diff, img):
    pos2 = (row - diff, col - diff)
    while diff > 0:
        for i in range(diff):
            if img[row - diff][col - diff + i] == img[row + diff][col + diff - i] == img[row - diff + i][col + diff] == img[row + diff - i][col - diff]:
                continue
            else:
                temp1, temp2 = (row + diff, col + diff - i), (row + diff - i, col - diff)
                if img[row - diff][col - diff + i] >= img[temp1]:
                    temp1 = (row - diff, col - diff + i)
                if img[row - diff + i][col + diff] >= img[temp2]:
                    temp2 = (row - diff + i, col + diff)

                applicant = temp2
                if img[temp1] > img[temp2]:
                    applicant = temp1

                if img[applicant] > img[pos2]:
                    pos2 = applicant
        diff -= 1
    return pos2
    
                 


#plt.ion()
#plt.figure()
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
    sock.connect((host, port))

    beat = b"yep";
    while beat == b"yep":
        sock.send(b"get")

        bts = recvall(sock, 40002)
   
        img = np.frombuffer(bts[2: 40002], dtype="uint8").reshape(bts[0], bts[1])

        np.set_printoptions(threshold=40000)        
        
        x1, y1 = np.unravel_index(np.argmax(img), img.shape)

        applicant = None
        i = 1
        while True:
            if (x1 - i) == 0 or (y1 - i) == 0 or (y1 + i) == 199 or (x1 + i) == 199 or (img[x1-i, y1] == 0 or img[x1, y1-i] == 0 or img[x1, y1+i] == 0 or img[x1+i, y1] == 0):
                applicant = checkSquare(x1, y1, i, img)
                if applicant == (x1, y1): applicant = (x1 - i, y1 - i)
                break
            else:
                i += 1


        d_test = 0
        d = round(sqrt((x1 - applicant[0])*(x1 - applicant[0]) + (y1 - applicant[1])*(y1 - applicant[1])), 1)

        def distance():
            global applicant
            d_test = round(sqrt((x1 - applicant_pos2[0])*(x1 - applicant_pos2[0]) + (y1 - applicant_pos2[1])*(y1 - applicant_pos2[1])), 1)
            if img[applicant_pos2] > img[applicant]:
                applicant = applicant_pos2
                return d_test
            return 0
        
        
        if (x1 - i) != 0:
            applicant_pos2 = np.unravel_index(np.argmax(img[:x1 - i, :]), img[:x1 - i, :].shape)
            if applicant_pos2 != (0, 0):
                d_test = distance()
                if d_test: d = d_test
                

        if (y1 - i) != 0:
            applicant_pos2 = np.unravel_index(np.argmax(img[x1 - i:x1 + i, :y1 - i]), img[x1 - i:x1 + i, :y1 - i].shape)
            applicant_pos2 = (applicant_pos2[0]+x1-i, applicant_pos2[1])            
            if applicant_pos2 != (0, 0):
                d_test = distance()
                if d_test: d = d_test
                

        applicant_pos2 = np.unravel_index(np.argmax(img[x1 - i:x1 + i, y1+i:]), img[x1 - i:x1 + i, y1+i:].shape)
        applicant_pos2 = (applicant_pos2[0]+x1-i, applicant_pos2[1] + y1 + i)
        if applicant_pos2 != (0, 0):
                d_test = distance()
                if d_test: d = d_test
                

        applicant_pos2 = np.unravel_index(np.argmax(img[x1 + i:, :]), img.shape)
        applicant_pos2 = (applicant_pos2[0]+x1+i, applicant_pos2[1])        
        if applicant_pos2 != (0, 0):
                d_test = distance()
                if d_test: d = d_test

        
        d = bytes(str(d), 'utf-8')
        sock.send(d)
        beat = sock.recv(20)
        print(beat)
        
        if beat == b'nope':
            plt.imshow(img)
            plt.show()
            break
    
print("Done")
