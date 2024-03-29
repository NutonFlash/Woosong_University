package util;

import java.lang.Math;
import java.lang.Thread;

public class Producer extends Thread {

    private CircularBuffer circularBuffer;
    private final int MIN_NUM = 21;
    private final int MAX_NUM = 30;
    private final int NUM_OF_ITER = 20;

    public Producer(CircularBuffer buffer) {
        super("producer");
        this.circularBuffer = buffer;
    }

    @Override
    public void run() {
        for (int i = 0; i < NUM_OF_ITER; i++) {
            int value = (int) (Math.random() * (this.MAX_NUM - this.MIN_NUM) + this.MIN_NUM);
            try {
                Thread.sleep((int) (Math.random() * 3001));
                this.circularBuffer.set(value);
            } catch (InterruptedException exc) {
                exc.printStackTrace();
            }
        }
    }
}
