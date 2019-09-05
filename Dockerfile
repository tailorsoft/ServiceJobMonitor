FROM gradle

WORKDIR /data

RUN git clone https://github.com/moqui/moqui-framework.git /data/moqui

WORKDIR /data/moqui
RUN gradle getRuntime
RUN gradle getComponent -Pcomponent=PopCommerce
RUN gradle getComponent -Pcomponent=moqui-sftp
RUN gradle getDepends

WORKDIR /data/moqui/runtime/component/tailorsoft-timeseries
COPY .  .

EXPOSE 8080

WORKDIR /data/moqui
RUN gradle load
CMD [ "gradle", "run" ]