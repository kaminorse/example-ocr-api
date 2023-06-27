

export default interface ResponseModel<ResponsePayload> {
  type?: string | undefined;
  title?: string | undefined;
  status?: number | undefined;
  detail?: string | undefined;
  instance?: string | undefined;
  errors?: { [key: string]: string[] } | undefined;
  extensions?: { [key: string]: Object; } | undefined;
  payload?: ResponsePayload | undefined;
}
