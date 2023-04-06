import math as m
import random
import time

def findNextPrime(n):
    addl = 0
    while True:
        if isPrime(n + addl):
            return n + addl
        addl += 1


# source: https://en.wikipedia.org/wiki/Primality_test
def isPrime(n):
    if n <= 3:
        return n > 1
    if n % 2 == 0 or n % 3 == 0:
        return False
    limit = round(m.sqrt(n))
    for i in range(5, limit + 1, 6):
        if n % i == 0 or n % (i + 2) == 0:
            return False
    return True

def rsa():
    random.seed(time.time())  # sets random seed
    MAX = 10000
    p = 0
    q = 0
    while (p == q):
        p = findNextPrime(random.randint(0, MAX))
        q = findNextPrime(random.randint(0, MAX))
    N = p * q;
    z = (p-1)*(q-1);

    e = 0;

    validE = False;
    while (not validE):
        # generate a number e, where 1 < e < z
        e = (random.randint(2, z-2))%z;
        if (m.gcd(z, e) == 1):
            validE = True;

    d = pow(e, -1, z) # modular multiplicative inverse
    

    return [p,q,e,d];

def encrypt(M, vals):
    p = vals[0];
    q = vals[1];
    e = vals[2];
    return pow(M,e,p*q);

def decrypt(C, vals):
    p = vals[0];
    q = vals[1];
    d = vals[3];
    return pow(C, d, p*q);

vals = rsa();
print("p =", vals[0])
print("q =", vals[1])
print("e =", vals[2])
print("d =", vals[3])
msg = input("Enter a message: ")
C = encrypt(msg, vals);
print("Encrypted message: " + str(C));
M = decrypt(C, vals);
print("Decrypted message: " + str(M));

