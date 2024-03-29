from keras.datasets import fashion_mnist

import numpy as np
import matplotlib.pyplot as plt

#change the below values to the dimensions of your image. The channels number refers to the number of colors
img_rows, img_cols, channels = 28, 28, 1

(x_train, y_train), (x_tet, y_test) = fashion_mnist.load_data()   #Load the data

x_train = (x_train.astype(np.float32) - 127.5) / 127.5       #Normalize the images again so that the pixel value is from -1 to 1

x_train = x_train.reshape(-1, img_rows, img_cols, channels)  #Reshaping the data into a more NN friendly format

for i in range(100):
    image = x_train[i*500]
    plt.imshow(image.reshape((img_rows, img_cols)), cmap='gray')
    plt.show()