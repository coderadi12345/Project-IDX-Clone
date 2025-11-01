FROM ubuntu:20.04

RUN useradd -ms /bin/bash sandbox

WORKDIR /home/sandbox/app

RUN apt update && apt upgrade -y
RUN apt install -y curl nano

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
RUN apt install -y nodejs

RUN echo "PS1='\\w$ '" >> /home/sandbox/.bashrc

COPY . .

RUN npm install

CMD ["bash"]
