# Dockerfile for Adding Pluggin inside fluentd image
FROM fluent/fluentd:v1.16-debian

USER root

# Install required build dependencies
RUN apt-get update && \
    apt-get install -y build-essential ruby-dev && \
    gem install elasticsearch -v 7.13.0 --no-document && \
    gem install fluent-plugin-elasticsearch -v 5.1.5 --no-document && \
    apt-get remove -y build-essential ruby-dev && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# injecting fluentd config file inside fluentd container file
COPY fluentd.conf /fluentd/etc/fluent.conf

# Expose the necessary port
EXPOSE 24224

# Set the entrypoint to run fluentd with the specified configuration file
ENTRYPOINT ["fluentd", "-c", "/fluentd/etc/fluent.conf", "-v"]