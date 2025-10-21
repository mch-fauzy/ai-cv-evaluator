export const API_RESPONSE_MESSAGE = {
  successGetData: (label: string) => `Retrieved ${label} data successfully`,
  successCreateData: (label: string) => `Created ${label} successfully`,
  successUpdateData: (label: string) => `Updated ${label} successfully`,
  successDeleteData: (label: string) => `Deleted ${label} successfully`,
  successUploadData: (label: string) => `Uploaded ${label} successfully`,
} as const;
