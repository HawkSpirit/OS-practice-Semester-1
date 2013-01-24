#include <stdio.h>
#include <ucontext.h>
#include <sys/time.h>

#define MAX_THREADS 10
#define STACK_SIZE 0xFFFFF

int my_thread_create(void(*)());
void my_thread_exit();
void my_thread_wait(int);
void my_thread_sleep(int);

void thread_1();
void thread_2();
void thread_3();
void thread_4();

void scheduler(int);

struct my_thread {
	int t_ID;
	int t_STATE; 	// 0 - EMPTY
					// 1 - READY OR ACTIVE
					// 2 - SLEEPING
	int t_TIME_TO_SLEEP;
	char stack[STACK_SIZE];
	char exit_stack[STACK_SIZE];
	ucontext_t context;
	ucontext_t exit_context;
} my_threads[MAX_THREADS];

ucontext_t main_context;
int cur_context_ID = 0;

int main() {
	int i;
	for (i = 1; i < MAX_THREADS; ++i) {
		my_threads[i].t_STATE = 0;
	}

	struct itimerval alarm_interval;

	alarm_interval.it_interval.tv_sec = 0;
	alarm_interval.it_interval.tv_usec = 100000;
	alarm_interval.it_value.tv_sec = 0;
	alarm_interval.it_value.tv_usec = 100000;
	setitimer(ITIMER_REAL, &alarm_interval, 0);

	signal(SIGALRM, scheduler); 

	int tid0 = my_thread_create(thread_1);
	printf("\n                   THREAD %d CREATED                  \n\n", tid0);
	int tid1 = my_thread_create(thread_2);
	printf("\n                   THREAD %d CREATED                  \n\n", tid1);
	int tid2 = my_thread_create(thread_3);
	printf("\n                   THREAD %d CREATED                  \n\n", tid2);
	int tid3 = my_thread_create(thread_4);
	printf("\n                   THREAD %d CREATED                  \n\n", tid3);

	my_thread_wait(tid0);
	printf("\n                  THREAD %d FINISHED                  \n\n", tid0);
	my_thread_wait(tid1);
	printf("\n                  THREAD %d FINISHED                  \n\n", tid1);
	my_thread_wait(tid2);
	printf("\n                  THREAD %d FINISHED                  \n\n", tid2);
	my_thread_wait(tid3);
	printf("\n                  THREAD %d FINISHED                  \n\n", tid3);

	return 0;
}


int my_thread_create(void(*f)()) {
	int thread_id;
	for(thread_id = 1; thread_id < MAX_THREADS; ++thread_id) {
		if (my_threads[thread_id].t_STATE == 0) {
			my_threads[thread_id].t_ID = thread_id;
			my_threads[thread_id].t_STATE = 1;
			my_threads[thread_id].t_TIME_TO_SLEEP = 0;
			break;
		}
	}

	getcontext(&my_threads[thread_id].exit_context);
	my_threads[thread_id].exit_context.uc_stack.ss_sp = my_threads[thread_id].exit_stack;
	my_threads[thread_id].exit_context.uc_stack.ss_size = sizeof(my_threads[thread_id].exit_stack);
	my_threads[thread_id].exit_context.uc_link = &main_context;
	makecontext(&my_threads[thread_id].exit_context, my_thread_exit, 0);


	getcontext(&my_threads[thread_id].context);
	my_threads[thread_id].context.uc_stack.ss_sp = my_threads[thread_id].stack;
	my_threads[thread_id].context.uc_stack.ss_size = sizeof(my_threads[thread_id].stack);
	my_threads[thread_id].context.uc_link = &my_threads[thread_id].exit_context;
	makecontext(&my_threads[thread_id].context, f, 0);

	return thread_id;
}


void my_thread_wait(int thread_id) {
	struct timespec tim;
	tim.tv_sec = 0;
	tim.tv_nsec = 10000000;
	while (my_threads[thread_id].t_STATE != 0) {
		nanosleep(&tim, 0);
	}
}

void my_thread_exit() {
	my_threads[cur_context_ID].t_STATE = 0;
}

void my_thread_sleep(int ticks) {
	my_threads[cur_context_ID].t_STATE = 2;
	my_threads[cur_context_ID].t_TIME_TO_SLEEP = ticks;
	int temp_v = cur_context_ID;
	cur_context_ID = 0;
	swapcontext(&my_threads[temp_v].context, &main_context);
}

void thread_1() {
	int i;
	for (i = 0; i < 10; ++i) {
		printf("|   THREAD 1 |            |            |            |\n");
		my_thread_sleep(4);
	}
}

void thread_2() {
	int i;
	for (i = 0; i < 10; ++i) {
		printf("|            |   THREAD 2 |            |            |\n");
		my_thread_sleep(5);
	}
}

void thread_3() {
	int i;
	for (i = 0; i < 10; ++i) {
		printf("|            |            |   THREAD 3 |            |\n");
		my_thread_sleep(6);
	}
}

void thread_4() {
	int i;
	for (i = 0; i < 10; ++i) {
		printf("|            |            |            |   THREAD 4 |\n");
		my_thread_sleep(7);
	}
}

void scheduler(int signal) {
	int thread_id, next_thread_id = 0;

	for (thread_id = 1; thread_id < MAX_THREADS; ++thread_id) {
		if (my_threads[thread_id].t_STATE == 2) {
			my_threads[thread_id].t_TIME_TO_SLEEP -= 1;
			if (my_threads[thread_id].t_TIME_TO_SLEEP == 0) {
				my_threads[thread_id].t_STATE = 1;
			}
		}
	}

	for (thread_id = 1; thread_id < MAX_THREADS; ++thread_id) {
		if (my_threads[thread_id].t_STATE == 1 && cur_context_ID != thread_id) {
			next_thread_id = thread_id;
			break;
		}
	}

	if (next_thread_id != 0) {
		cur_context_ID = next_thread_id;
		swapcontext(&main_context, &my_threads[cur_context_ID].context);
	}
}