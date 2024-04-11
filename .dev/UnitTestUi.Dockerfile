ARG NODE_IMAGE

FROM ${NODE_IMAGE}

RUN apt update && apt install -y xdg-utils

# @vitest/ui needs xdg-utils to be able to spawn UI server