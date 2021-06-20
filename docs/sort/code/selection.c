#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "example.c"

void sort(char* s) {
	int len = strlen(s);
	for (int i = 0; i < len; i++) {
		int min = i;

		for (int j = i + 1; j < len; j++)
			if (less(s[j], s[min]))
				min = j;
		exch(s, i, min);
	}
}

int main() {
	char* c;

	printf("pls input array:\n");
	scanf("%s", c);

	printf("---Before---\n");
	show(c);

	sort(c);

	printf("---After---\n");
	show(c);

	return EXIT_SUCCESS;
}
