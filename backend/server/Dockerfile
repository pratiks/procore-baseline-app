FROM node:11.15.0
ENV WORK_DIR=/app
WORKDIR ${WORK_DIR}
RUN mkdir -p ${WORK_DIR}
COPY package.json ${WORK_DIR}
RUN npm install
COPY . ${WORK_DIR}
EXPOSE 8080
CMD ["npm","start"]
