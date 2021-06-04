# Fashionego Smartmirror

### System Requirements
#### Software

- Node.js v12 or higher: https://nodejs.org/en/
- Python 3.9: https://www.python.org/downloads/
  - pip 21 (comes installed with Python3 by default)





#### Hardware
<br/>Option of choosing between:
- 2 webcams
- 1 webcam but split virtually.
   - linux: v4l2loopback (https://github.com/umlaeute/v4l2loopback)
   - windows: Software to split the webcam, for example https://splitcamera.com/

### Installation

Open a terminal in the root folder of the project

#### Install node dependencies:

```console
~$ npm install pywin32
```

#### Install python libraries:
```console
~$ pip install mediapipe
~$ pip install opencv-python
~$ pip install pywin32
```

If the python script throws errors try uncommenting the following lines (3-5) in the ./Fenego/python/media/main.py file
<br/>These lines will attempt to install the necessary libraries on running the script.

```python
os.system('python -m pip install {}'.format(sys.argv[1]))
os.system('python -m pip install {}'.format(sys.argv[2]))
os.system('python -m pip install {}'.format(sys.argv[3]))
```


### Run the application

```console
~$ node index.js
```
