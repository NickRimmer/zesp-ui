export type TemplateGroupName = null | "root" | "light" | "sensor" | "switch";

export type TemplateInfo = {
  modelIds: string[],
  image: string,
  groups?: TemplateGroupName[],
  template?: string | null
}