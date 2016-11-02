#!/bin/bash

# INSTALL pngcrush
# You can download compressed file from https://sourceforge.net/projects/pmt/files/pngcrush/1.8.2/pngcrush-1.8.2.tar.gz/download

# > cd ~/Downloads/
# > tar -xvzf pngcrush-1.8.2.tar.gz
# > cd pngcrush-1.8.2
# > make
# > sudo mv pngcrush /usr/local/bin/

# Check !
# > pngcrush -version

find ../app -name '*.png' -exec pngcrush -ow {} \;
