package util;

public class CircularBuffer {

    private int buffers[] = { -1, -1, -1 };

    private int occupiedBuffers = 0;

    private int readLocation = 0;
    private int writeLocation = 0;

    public synchronized void set(int value) {

        String name = Thread.currentThread().getName();

        while (occupiedBuffers == buffers.length) {
            try {
                System.out.println("\nAll buffers full. " + name + " waits.");
                wait();
            } catch (InterruptedException exc) {
                exc.printStackTrace();
            }
        }

        buffers[writeLocation] = value;

        System.out.println("\n" + name + " writes " + value + " ");

        ++occupiedBuffers;

        writeLocation = (writeLocation + 1) % buffers.length;

        System.out.println(createStateOutput());

        notify();
    }

    public synchronized int get() {

        String name = Thread.currentThread().getName();

        while (occupiedBuffers == 0) {
            try {
                System.out.println("\nAll buffers empty. " + name + " waits.");
                wait();
            } catch (InterruptedException exc) {
                exc.printStackTrace();
            }
        }

        int readValue = buffers[readLocation];

        System.out.println("\n" + name + " reads " + readValue + " ");

        --occupiedBuffers;

        readLocation = (readLocation + 1) % buffers.length;

        System.out.println(createStateOutput());

        notify();

        return readValue;
    }

    public String createStateOutput() {
        String output = "(buffers occupied: " + occupiedBuffers + ")\nbuffers: ";

        for (int i = 0; i < buffers.length; i++) {
            output += " " + buffers[i] + " ";
        }

        output += "\n\t";

        for (int i = 0; i < buffers.length; i++) {
            output += "---- ";
        }

        output += "\n\t";

        for (int i = 0; i < buffers.length; i++) {
            if (i == writeLocation && writeLocation == readLocation) {
                output += " WR  ";
            } else if (i == writeLocation) {
                output += " W  ";
            } else if (i == readLocation) {
                output += " R  ";
            } else {
                output += "    ";
            }
        }

        return output;
    }
}