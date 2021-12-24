import socket
import time
import json
from hashlib import md5

salt = 'dettimrepsignihtyrevednaeurtsignihton'
info: list

def decode(s: str) -> list:
    s = [s[i * 2 : i * 2 + 2] for i in range(len(s) // 2)][7:]
    res: list = []
    f: bool = False
    for i in s:
        i = int(i, 16)
        if f == 0:
            f = True
            num: int = 0
            cnt: int = 0
        else:
            if i >> 7:
                f = True
                num = num | (i & 127) << cnt
                cnt = cnt + 7
            else:
                f = False
                num = num | (i & 127) << cnt
                cnt = cnt + 7
                res.append(num)
    res = [res[i * 5 + 1 : i * 5 + 4 : 2] for i in range(len(res) // 5)]
    return res[:32]

def connect() -> None:
    print("connecting...")

    data: bytes = b'\x00\x0a\x00\x2a\x30\x00\x00\x08\x2f\x12\x01\x30'
    s1.send(data)
    s1.recv(1024)
    time.sleep(1)
    s1.send(data)
    s1.recv(1024)
    time.sleep(1)

    # copy your token to here
    data: bytes = b''
    
    s2.send(data)
    token = s2.recv(2048)[-44:-2]
    time.sleep(1)

    check = md5(token + salt.encode("utf8")).hexdigest().encode("utf8")

    # copy your uid(hex) to here 
    data: bytes = b'\x00\x5f\x00\x27\x26\x00\x00\x08' + uid + '\x12\x2a' + token + b'\x1a\x01\x30\x20\x0e\x2a\x20' + check + b'\x32\x00'
    s3.send(data)
    s3.recv(1024)
    time.sleep(1)

    print("connected.")

def pull(id: int) -> str:
    idx = bytes([id // 256, id % 256])
        
    data: bytes = b'\x00\x07\x00\x43\x33' + idx + b'\x08\x1b'
    s3.send(data)
    res = s3.recv(2048).hex()
    if res[6:10] == "4334":
        return res
    else:
        return pull(id)

if __name__ == "__main__":
    with open("./data/vote.json", "r", encoding="utf-8") as f:
        voteJson = json.load(f)

    s1 = socket.socket()
    s1.connect(("203.107.54.123", 80))
    s2 = socket.socket()
    s2.connect(("118.178.152.242", 80))
    s3 = socket.socket()
    # modify port to yours
    s3.connect(("203.107.54.123", 8013))
    
    connect()

    while True:
        for id in range(1, 65536):
            infos = pull(id)
            infos = decode(infos)
            with open("./data/info.json", "w", encoding="utf8") as f:
                json.dump(infos, f, separators=(",", ":"))

            current = time.localtime()
            # save per hour
            if current.tm_min == 0:
                current = time.strftime("%Y-%m-%d %H:%M:%S", current)
                for info in infos:
                    info.append(current)
                    voteJson.append(info)
                with open("./data/vote.json", "w", encoding="utf-8") as f:
                    json.dump(voteJson, f, separators=(",", ":"))
                print("save:", id, current)

            # pull per minute
            time.sleep(60)