export interface ZespSettings {
  Wifi: ZespWifiSettings,
  ZIGBEE: ZespZigbeeSettings,
  MQTT: ZespMqttSettings,
  Telegram_Bot: ZespTelegramSettings,
  ZIGBEE2MQTT: ZespZigbeeToMqttSettings
}

export interface ZespWifiSettings {
  ssid: string,
  pass: string,
  ip: string,
  mask: string,
  gw: string
}

export interface ZespZigbeeSettings {
  modelRouter: string,
  PanID: string,
  ExtPanID: string,
  Key: string,
  Chanel: string
}

export interface ZespMqttSettings {
  mqttup: string,
  mqtt: string,
  mqttPort: string,
  mqttLogin: string,
  mqttPassw: string,
  mqttEnable: string,
  Home_Assistant: string
}

export interface ZespTelegramSettings {
  Enable: boolean,
  bot_token: string
}

export interface ZespZigbeeToMqttSettings {
  z2m_Enable: boolean,
  internal: number,
  z2m_ip: string,
  z2m_port: number
}