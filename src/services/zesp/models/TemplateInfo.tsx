export type TemplateInfo = {
  modelIds: string[],
  image: string,
  group?: null | "root" | "light" | "sensor" | "switch",
  template: string
}