#!/bin/sh
sudo apt-get -y install ejabberd
sudo service ejabberd start
sleep 5
sudo ejabberdctl register admin localhost foobarbaz
sudo ejabberdctl register foo localhost bar
sudo cp /home/vagrant/ejabberd.cfg /etc/ejabberd/ejabberd.cfg
sudo /etc/init.d/ejabberd restart
