# tensormsa_gui
tensormsa_gui

View Layer on TensorMSA
TensorMSA : Tensorflow Micro Service Architecture

1.TensorMSA

  Tensor Micro Service Architecture is a project started to make TensorFlow more accessable 
  from Java legacy systems with out modifying too much source codes.


2. Function

    REST APIs corresponding to Tensorflow
    JAVA API component interface with python REST APIS
    Easy to use UI component provide NN configuration, train remotly, save & load NN models, handling train data sets
    Train NN models via Spark cluster supported
    Android mobile SDK are also part of the plan (gather data and predict)


3. Schedule

    We just started this projects (2016.8)
    We are still on research process now
    Expected to release first trial version on December 2016


4. Stack

    FE : React(ES6), SVG, D3, Pure CSS
    BE : Django F/W, Tensorflow, PostgreSQL, Spark


5. Methodology

    Agile (CI, TDD, Pair programming and Cloud)



Install

http://webdir.tistory.com/396

1. SubLime Install

sudo add-apt-repository ppa:webupd8team/sublime-text-3

sudo apt-get update

sudo apt-get install sublime-text-installer

subl &


2. SubLime Console Install

import urllib.request,os,hashlib; h = '6f4c264a24d933ce70df5dedcf1dcaee' + 'ebe013ee18cced0ef93d5f746d80ef60'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by) 


3. SubLime package Install

Tools -> Command Pallette


4. npm install

if node error

curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs

cd /home/dev/tensormsa_gui/static

apt-get install npm

npm install

node server.js

npm run build




