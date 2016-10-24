#!/bin/bash

# pngcrush 설치 방법
# (brew install pngcrush 로 설치할 수도 있지만, 최신 버젼이 아님. 그래서 소스 다운 받아 컴파일 해서 사용)

# https://sourceforge.net/projects/pmt/files/pngcrush/1.8.2/pngcrush-1.8.2.tar.gz/download 에서 최신 소스 다운로드

# > cd ~/Downloads/
# > tar -xvzf pngcrush-1.8.2.tar.gz
# > cd pngcrush-1.8.2
# > make
# > sudo mv pngcrush /usr/local/bin/

# 설치 버젼 확인
# > pngcrush -version

find ./app -name '*.png' -exec pngcrush -ow {} \;
