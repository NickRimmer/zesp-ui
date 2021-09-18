const Result = {
  // delay before connection start
  ConnectionStartTimeout: 100,

  // connection verify interval
  RestartConnectionTimeout: 5000,

  // default timeout for requests in seconds 
  DefaultRequestTimeoutSeconds: 5,

  // connection checker interval, should be greater then 'DefaultRequestTimeoutSeconds' 
  WatcherIntervalSeconds: 15,
}

export default Result;