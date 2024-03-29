from tensorflow.keras.optimizers.legacy import Adam
from keras.datasets import fashion_mnist
from keras.initializers import RandomNormal
from keras.layers import Dense, Conv2D, Conv2DTranspose, Flatten, Reshape, Dropout, LeakyReLU, Input
from keras.models import Sequential, Model, load_model

import numpy as np
import matplotlib.pyplot as plt

np.random.seed(10)  #for consistency of random numbers and our images

noise_dim = 100  # input dimension of random vector - the vector that goes into the generator

batch_size = 16   #How many images do we want to include in each batch
steps_per_epoch = 500  #How many steps do we want to take per iteration of our training set (number of batches)
epochs = 10      #How many iterations of our training set do we want to do.

#change the below values to the dimensions of your image. The channels number refers to the number of colors
img_rows, img_cols, channels = 28, 28, 1

#These are the recommended values for the optimizer
optimizer = Adam(0.0002, 0.5)

(x_train, y_train), (x_tet, y_test) = fashion_mnist.load_data()   #Load the data

x_train = (x_train.astype(np.float32) - 127.5) / 127.5       #Normalize the images again so that the pixel value is from -1 to 1

x_train = x_train.reshape(-1, img_rows, img_cols, channels)  #Reshaping the data into a more NN friendly format

#Starting to create FCGAN (fully connected GAN)

#creating generator portion of the GAN
def create_generator_cgan():
    generator = Sequential()
    
    d = 7

    generator.add(Dense(d*d*256, kernel_initializer=RandomNormal(0, 0.02), input_dim=noise_dim))
    generator.add(LeakyReLU(0.2))     #We are going to use the same leaky relu activation function as the FCGAN.
    
    generator.add(Reshape((d, d, 256)))
    
    generator.add(Conv2DTranspose(128, (4, 4), strides=2, padding='same', kernel_initializer=RandomNormal(0, 0.02)))
    generator.add(LeakyReLU(0.2))

    generator.add(Conv2DTranspose(128, (4, 4), strides=2, padding='same', kernel_initializer=RandomNormal(0, 0.02)))
    generator.add(LeakyReLU(0.2))
    
    generator.add(Conv2D(channels, (3, 3), padding='same', activation='tanh', kernel_initializer=RandomNormal(0, 0.02)))  #Remember that the final activation has to be tanh, since pixel values go from -1 to 1
    
    generator.compile(loss='binary_crossentropy', optimizer=optimizer)    #The loss doesn't change when you use convolutional layers
    return generator


#creating the discriminator for the GAN

def create_discriminator_cgan():
    discriminator = Sequential()
    
    discriminator.add(Conv2D(64, (3, 3), padding='same', kernel_initializer=RandomNormal(0, 0.02), input_shape=(img_cols, img_rows, channels)))
    discriminator.add(LeakyReLU(0.2))
    
    discriminator.add(Conv2D(128, (3, 3), strides=2, padding='same', kernel_initializer=RandomNormal(0, 0.02)))
    discriminator.add(LeakyReLU(0.2))
    
    discriminator.add(Conv2D(128, (3, 3), strides=2, padding='same', kernel_initializer=RandomNormal(0, 0.02)))
    discriminator.add(LeakyReLU(0.2))
    
    discriminator.add(Conv2D(256, (3, 3), strides=2, padding='same', kernel_initializer=RandomNormal(0, 0.02)))
    discriminator.add(LeakyReLU(0.2))
    
    discriminator.add(Flatten())
    discriminator.add(Dropout(0.4))
    discriminator.add(Dense(1, activation='sigmoid', input_shape=(img_cols, img_rows, channels)))
    
    discriminator.compile(loss='binary_crossentropy', optimizer=optimizer)  #Again, the loss doesn't change when creating a DCGAN.
    
    return discriminator


#Code for plotting results
def save_image(noise, epoch_num):
    size_fig = (5, 5)
    generated_images = generator.predict(noise)   #Create the images from the GAN.

    plt.figure(figsize=size_fig)
    
    for i, image in enumerate(generated_images):
        plt.subplot(size_fig[0], size_fig[1], i+1)
        if channels == 1:
            plt.imshow(image.reshape((img_rows, img_cols)), cmap='gray')    #If the image is grayscale, as in our case, then we will reshape the output in the following way.
                                                               #Also, we set the coloring to grayscale so that it doesn't look like it came out of an infrared camera :)
        else:
            plt.imshow(image.reshape((img_rows, img_cols, channels)))
        plt.axis('off')
    
    plt.tight_layout()   #Tight layout so that all of the generated images form a nice grid
    plt.savefig(fname=f'img/epoch{epoch_num}.png', format='png')
    # plt.show()

#combining the generator and discriminator to make a single large gan (loss and derivatives have to flow from discriminator to generator)

discriminator = create_discriminator_cgan()
generator = create_generator_cgan()

discriminator.trainable = False

gan_input = Input(shape=(noise_dim,))
fake_image = generator(gan_input)

gan_output = discriminator(fake_image)

gan = Model(gan_input, gan_output)
gan.compile(loss='binary_crossentropy', optimizer=optimizer)

train_info = open('train_info.txt', 'w')

for epoch in range(epochs):         #iterate the dataset for the number of epochs
    for batch in range(steps_per_epoch):    #for the number of batches we wanted to create
        noise = np.random.normal(0, 1, size=(batch_size, noise_dim))   #We generate a new noise vector to feed the generator before every training iteration
    
        fake_x = generator.predict(noise)        #The image the generator develops for the noise vector we created above
        real_x = x_train[np.random.randint(0, x_train.shape[0], size=batch_size)]  #We won't use all real images from our dataset at once, we will only select a random sample of images
        
        x = np.concatenate((real_x, fake_x))    #making the x dataset for the discriminator. This includes a mix of real and fake examples for the discriminator to correctly classify

        disc_y = np.zeros(2*batch_size)
        disc_y[:batch_size] = 0.9

        d_loss = discriminator.train_on_batch(x, disc_y)   #We are training the discriminator separately. Remember, we set trainable = false when adding it to the GAN, so that when we train the GAN, we only train the generator. Hence this extra step

        y_gen = np.ones(batch_size)
        g_loss = gan.train_on_batch(noise, y_gen)       #Now we train the entire GAN. But since the discriminator can't be trained, only the generator is trained in this step.

    train_info.write(f'Epoch: {epoch + 1}  Discriminator Loss: {d_loss}\tGenerator Loss: {g_loss}\n')

    noise = np.random.normal(0, 1, size=(25, noise_dim))
    
    save_image(noise, epoch + 1)

    generator.save('generator', save_format='h5')    
    discriminator.save('discriminator', save_format='h5')
    gan.save('gan', save_format='h5')

