### Tailorsoft Service Monitor 

add data folder with service monitor specifications

example
-

```xml
<moqui.service.job.ServiceJob jobId="poll_temperature" jobName="poll_temperature"
                                  description="get temperature salt lake city"
                                  serviceName="tailorsoft.demo.TemperatureServices.get#Temperature"
                                  cronExpression="* 0/5 * ? * * *"
                                  paused="N">
</moqui.service.job.ServiceJob>
```

then add monitor
```xml
<tailorsoft.timeseries.Monitor jobName="poll_temperature" title="Temperature"
                                   valuePath="value.temp" indexName="temperature"/>
```

params
-

- `jobName`  : job to monitor
- `valuePath`: value path from the results
-  `indexName`: Elasticsearch index name



