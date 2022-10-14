export interface FormDatumInterface {
  id: number;
  formData: JSON;
  stage: number;
  status: string;
  logs: object;
  emails: string[];
  createdAt: Date;
  updatedAt: Date;
}
