export default () => {
  const onAddZigbeeClockedHandler = () => {
    console.log("add zigbee");
  }

  const onAddBleClockedHandler = () => {
    console.log("add ble");
  }

  return {
    onAddZigbeeClockedHandler,
    onAddBleClockedHandler
  }
}