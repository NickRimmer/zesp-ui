export const ZespDataEventType = "zesp-data-received";

export class ZespDataEvent extends Event {
  readonly dataType: string;
  readonly response: string;
  readonly dataParts: string[];

  constructor(dataType: string, dataParts: string[], response: string) {
    super(ZespDataEventType);

    this.dataType = dataType;
    this.dataParts = dataParts;
    this.response = response;
  }
}