export interface FormDatumInterface {
  id: number;
  formData: JSON;
  stage: number;
  status: string;
  logs: object;
  createdAt: Date;
  updatedAt: Date;
}
