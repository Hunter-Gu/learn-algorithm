#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

int compareTo(char v, char w) {

	if (v == NULL || w == NULL) {
		puts("Uncomparable for NULL");
		exit(EXIT_FAILURE);
	}

	if (v < w) {
		return -1;
	} else if (v > w) {
		return 1;
	} else if (v == w) {
		return 0;
	}

	puts("Uncomparable for NULL");
	exit(EXIT_FAILURE);
}

bool less(char v, char w) {
	return compareTo(v, w) < 0;
}

void exch(char* a, int i , int j) {
	char t = a[i];
	a[i] = a[j];
	a[j] = t;
}

void show(char* s) {
	for (int i = 0; i < strlen(s); i++)
		printf("%c ", s[i]);
	printf("\n");
}
