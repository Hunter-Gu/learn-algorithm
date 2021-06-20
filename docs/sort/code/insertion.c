#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "example.c"

void sort(char* s) {
	for (int i = 1; i < strlen(s); i++) {
		for (int j = i; j > 0; j--) {
			if (less(s[j], s[j - 1])) {
				exch(s, j, j - 1);
			} else {
				break;
			}
		}
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
