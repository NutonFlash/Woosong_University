import util.CircularBuffer;
import util.Consumer;
import util.Producer;

public class Main {
    public static void main(String args[]) {
        CircularBuffer circularBuffer = new CircularBuffer();

        System.out.println(circularBuffer.createStateOutput());

        Producer producer = new Producer(circularBuffer);
        Consumer consumer = new Consumer(circularBuffer);

        producer.start();
        consumer.start();
    }
}
