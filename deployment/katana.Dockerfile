FROM debian

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
    jq \
    git-all \
    build-essential \
    curl

# Get Rust
RUN curl https://sh.rustup.rs -sSf | bash -s -- -y
RUN echo 'source $HOME/.cargo/env' >> $HOME/.bashrc


# Install dojo
SHELL ["/bin/bash", "-c"]
RUN curl -L https://install.dojoengine.org | bash
RUN source ~/.bashrc
ENV PATH="/root/.dojo/bin:${PATH}"
RUN dojoup

CMD ["katana", "--allow-zero-max-fee"]
