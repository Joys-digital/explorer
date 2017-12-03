FROM debian:latest
COPY deploy.sh /tmp
RUN chmod +x /tmp/deploy.sh && /bin/bash /tmp/deploy.sh
RUN rm /tmp/deploy.sh
COPY start.sh /opt/start.sh
RUN chmod +x /opt/start.sh
CMD /bin/bash /opt/start.sh ; tail -f /dev/null
