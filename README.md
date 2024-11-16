<img src="./src/assets/img/icon-128.png" width="25">

# Finfriend - notes feature demo 

Originally forked from : https://github.com/teziapp/clipboard-extension

**Working Features as of now :**
- All previous features
- A new notes icon appears on navbar below
- A page for listing all notes date-wise and a page to show notes taken for a particular symbol
- A confirmation dialogue appears as you click on plus button for a new symbol and you can either..
  -  to update existing symbol variant or 
  - add new ones into database
- Exact match finding for already stored symbol 


\
\
**To run the extension on your local**.. go to folder where you want to save the project and follow steps as given below

### Step-1 : Cloning
To clone the project on your local, open git bash and run the following command

``` console
git clone https://github.com/Hamzaisongit/clipboard-extension-f2
```

### Step-2 : Installing packages & modules
After cloning, go to the project root and run the command,
``` console
npm i
```

### Step-3 : Generating build folder (for development env.)
In project root, run the following...

```console
npm run start
```
After running the above command, a build folder should be generated in project's root directory.

### Step-4 : Unpacking the extension on chrome
1. Open chrome and got to extension settings
2. Turn on developer mode (upper right)
3. Click on load unpacked (upper left) 
4. Browse to the build folder we generated in project root and select it

### Step-5 : Testing the extension
To test the extension on a pre-included dummy HTML page with stock symbols listed on it.. 

Simply go to http://lcoalhost:3000 & turn on the extension from toolbar

