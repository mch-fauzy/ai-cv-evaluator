export const API_RESPONSE_MESSAGE = {
  SUCCESS_GET_DATA: (label: string) => `Retrieved ${label} data successfully`,
  SUCCESS_CREATE_DATA: (label: string) => `Created ${label} successfully`,
  SUCCESS_UPDATE_DATA: (label: string) => `Updated ${label} successfully`,
  SUCCESS_DELETE_DATA: (label: string) => `Deleted ${label} successfully`,
  SUCCESS_UPLOAD_DATA: (label: string) => `Uploaded ${label} successfully`,
} as const;
