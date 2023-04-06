#include <stdlib.h>
#include <iostream>
#include <math.h>
#include <ctime>
#include <numeric>


// source: https://en.wikipedia.org/wiki/Primality_test
bool isPrime(int n) {
	if (n == 2 || n == 3) return true;
	if (n % 2 == 0 || n % 3 == 0) return false;
	
	for (int i = 5; i * i < n+1; i+=6) {
		if (n % i == 0 || n % (i+2) == 0) return false;
	}

	return true;
}

int findNextPrime(int n) {
	int addl = 0;
	while (true) {
		if (isPrime(n+addl)) return n+addl;
		addl++;
	}
}

int* rsa() {
	srand((unsigned)time(NULL));
	// returns p, q, e, d in that order
	static int vals[4];
	unsigned int p = findNextPrime((unsigned)(rand()*rand())%100);
	unsigned int q = findNextPrime((unsigned)(rand()*rand())%100);

	int N = p * q;	
	// calculate z
	int z = (p-1) * (q-1);

	int e;
	bool sufficient = false;
	while (!sufficient) {
		// generate a number e, where 1 < e < z
		e = (rand()*rand())%z;
		// if e == 0 (extremely rare but possible), then add 1 + a random number
		if (e < 1) e += rand()%z + 1;
		if (std::__gcd(z, e) == 1) sufficient = true;
	}

	int d = (e-1) % z;
	vals[0] = p;
	vals[1] = q;
	vals[2] = e;
	vals[3] = d;
	return vals;

}

void encryptDecrypt(int m, int* vals) {
	// choose random prime numbers
	// note: rand() generates a random number between 0 and n, where n > 32,767
	// modulus guarantees it's below 1 million
	int p = vals[0];
	int q = vals[1];
	int e = vals[2];
	int d = vals[3];
	int enc = m*e % (p*q);
	std::cout << "Encrypted message: " << enc << std::endl;
	int dec = enc*d % (p*q);
	std::cout << "Decrypted message: " << dec << std::endl;



}

int main() {
	int *vals = rsa();
	std::cout << "p = " << vals[0] << std::endl;
	std::cout << "q = " << vals[1] << std::endl;
	std::cout << "e = " << vals[2] << std::endl;
	std::cout << "d = " << vals[3] << std::endl;

	return 0;
}