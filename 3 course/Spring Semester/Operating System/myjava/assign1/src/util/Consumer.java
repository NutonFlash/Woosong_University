package util;

import java.lang.Thread;

public class Consumer extends Thread {

    private CircularBuffer circularBuffer;
    private final int NUM_OF_ITER = 20;

    public Consumer(CircularBuffer buffer) {
        super("consumer");
        this.circularBuffer = buffer;
    }

    @Override
    public void run() {
        for (int i = 0; i < this.NUM_OF_ITER; i++) {
            try {
                Thread.sleep((int) (Math.random() * 3001));
                this.circularBuffer.get();
            } catch (InterruptedException exc) {
                exc.printStackTrace();
            }
        }
        System.exit(0);
    }
}
